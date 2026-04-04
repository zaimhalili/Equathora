import { supabase } from './supabaseClient';

const SUBSCRIBE_ERROR_MESSAGE = 'Something went wrong on our side. Please try again in a little while.';

// Fix #6: compute API candidates once at module load since env vars and
// window.location never change at runtime.
const API_BASE_CANDIDATES = (() => {
    const normalizeBase = (value) => {
        if (!value || typeof value !== 'string') return '';
        return value.trim().replace(/\/$/, '');
    };

    const explicit = normalizeBase(
        import.meta.env.VITE_API_URL ||
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_API_BASE_URL
    );

    const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : '';
    const isLocalRuntime = runtimeHost === 'localhost' || runtimeHost === '127.0.0.1';

    const candidates = [];

    if (explicit) {
        const isLocalExplicit =
            explicit.includes('://localhost') || explicit.includes('://127.0.0.1');
        if (isLocalRuntime || !isLocalExplicit) {
            candidates.push(explicit);
        }
    }

    // For non-local runtimes, same-origin API calls allow reverse-proxy setups.
    // In local dev, avoid same-origin backend calls unless an explicit API URL is set.
    if (!isLocalRuntime) {
        candidates.push('');
    }

    // Only use an explicit backend URL. Avoid implicit localhost fallback,
    // which causes noisy ERR_CONNECTION_REFUSED logs when backend is not running.

    return [...new Set(candidates)];
})();

const isDuplicateEmailError = (error) => {
    const code = String(error?.code || '').trim();
    const message = String(error?.message || '').toLowerCase();
    return code === '23505' || message.includes('duplicate key');
};

const subscribeViaBackend = async (payload) => {
    const failures = [];

    if (API_BASE_CANDIDATES.length === 0) {
        return { ok: false, failures };
    }

    for (const apiBase of API_BASE_CANDIDATES) {
        const requestUrl = `${apiBase}/api/briefs/subscribe`;
        // Fix #7: use a human-readable label in failure messages for the same-origin candidate.
        const displayUrl = apiBase === '' ? `(same-origin)/api/briefs/subscribe` : requestUrl;

        try {
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                return { ok: true, failures };
            }

            let responseDetail = '';
            try {
                const text = await response.text();
                if (text) {
                    responseDetail = ` | ${text.slice(0, 300)}`;
                }
            } catch {
                // Ignore body-read errors and keep status-based failure output.
            }

            failures.push(`${displayUrl} -> ${response.status} ${response.statusText}${responseDetail}`);
        } catch (error) {
            failures.push(`${displayUrl} -> network error: ${error?.message || 'unknown error'}`);
        }
    }

    return { ok: false, failures };
};

const subscribeViaSupabase = async (payload) => {
    try {
        const { error } = await supabase
            .from('equathora_briefs_list')
            .insert([{ name: payload.fullName, email: payload.email }]);

        if (!error) {
            return { ok: true, isDuplicate: false, failure: null };
        }

        if (isDuplicateEmailError(error)) {
            // Fix #5: surface duplicate status so callers can make an informed decision.
            // We still treat this as "ok" (silent success) to avoid leaking whether an
            // email is already registered, but the flag lets callers log or act if needed.
            return { ok: true, isDuplicate: true, failure: null };
        }

        return {
            ok: false,
            isDuplicate: false,
            failure: `supabase insert failed: ${error?.code || 'unknown'} ${error?.message || ''}`.trim(),
        };
    } catch (error) {
        return {
            ok: false,
            isDuplicate: false,
            failure: `supabase network error: ${error?.message || 'unknown error'}`,
        };
    }
};

// Fix #8: validate fields individually so the error message identifies the
// specific missing/invalid field rather than grouping both together.
const validatePayload = (payload) => {
    if (!payload.fullName) {
        throw new Error('Please enter your full name.');
    }
    if (!payload.email) {
        throw new Error('Please enter your email address.');
    }
};

export async function subscribeToEquathoraBriefs(data) {
    const full_name = data.full_name || data.fullName || data.name;
    const email = data.email;

    const payload = {
        fullName: String(full_name || '').trim(),
        email: String(email || '').trim().toLowerCase(),
    };

    // Fix #8: separate validation with per-field error messages.
    validatePayload(payload);

    const backendResult = await subscribeViaBackend(payload);
    if (backendResult.ok) return;

    const supabaseResult = await subscribeViaSupabase(payload);
    if (supabaseResult.ok) {
        // Fix #5: log duplicates in non-production environments for observability
        // without exposing anything to the user.
        if (supabaseResult.isDuplicate && import.meta.env.DEV) {
            console.info('Equathora briefs: email already subscribed:', payload.email);
        }
        return;
    }

    console.error('Equathora briefs subscribe failed', {
        backendFailures: backendResult.failures,
        supabaseFailure: supabaseResult.failure,
    });

    throw new Error(SUBSCRIBE_ERROR_MESSAGE);
}