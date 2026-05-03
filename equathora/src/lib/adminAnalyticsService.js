import { getAdminApiHeaders } from './adminAuth';

const DEFAULT_LOCAL_BACKEND = 'http://localhost:5104';

const emptyAnalyticsPayload = {
    rangeLabel: 'Analytics temporarily unavailable',
    trends: [],
    overview: {
        avgDau: 0,
        totalSignups: 0,
        totalSolved: 0,
        totalReports: 0,
        reportsPerThousand: 0
    },
    kpis: {
        dailyActiveUsers: 0,
        weeklyActiveUsers: 0,
        newSignups: 0,
        retentionD7: 0,
        solvedProblems: 0,
        reportCount: 0
    },
    retention: [],
    issueDistribution: [],
    systemHealth: [
        {
            label: 'Backend analytics',
            value: 'Unavailable',
            status: 'Watch'
        }
    ],
    moderationAlerts: [],
    topTopics: []
};

const normalizeBase = (value) => {
    if (!value || typeof value !== 'string') return '';
    return value.trim().replace(/\/$/, '');
};

const isJsonContentType = (contentType) => {
    const normalized = String(contentType || '').toLowerCase();
    return normalized.includes('application/json') || normalized.includes('+json');
};

const buildApiBaseCandidates = () => {
    const explicit = normalizeBase(
        import.meta.env.VITE_API_URL ||
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_API_BASE_URL
    );
    const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : '';
    const isLocalRuntime = runtimeHost === 'localhost' || runtimeHost === '127.0.0.1';

    const candidates = [];

    if (explicit) {
        candidates.push(explicit);
    }

    if (!explicit || isLocalRuntime) {
        candidates.push('');
    }

    if (isLocalRuntime && !explicit) {
        candidates.push(DEFAULT_LOCAL_BACKEND);
    }

    return [...new Set(candidates)];
};

export async function getAdminAnalytics({ range = 'week', weekOffset = 0 } = {}) {
    const params = new URLSearchParams({
        range,
        weekOffset: String(Math.max(0, Number(weekOffset) || 0))
    });
    const endpoint = `/api/admin/analytics?${params.toString()}`;
    const baseCandidates = buildApiBaseCandidates();
    const failures = [];

    for (const apiBase of baseCandidates) {
        const requestUrl = `${apiBase}${endpoint}`;

        try {
            const adminHeaders = await getAdminApiHeaders();
            const response = await fetch(requestUrl, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    ...(adminHeaders || {})
                }
            });

            const contentType = response.headers.get('content-type') || '';

            if (!response.ok) {
                let details = '';

                if (isJsonContentType(contentType)) {
                    try {
                        const errBody = await response.json();
                        details = errBody?.error || errBody?.message || '';
                    } catch {
                        // Ignore malformed JSON errors and continue with status details.
                    }
                } else {
                    try {
                        const textBody = await response.text();
                        details = (textBody || '').slice(0, 160).trim();
                    } catch {
                        // Ignore body read failures.
                    }
                }

                failures.push(
                    details
                        ? `${requestUrl} -> ${response.status} ${response.statusText}: ${details}`
                        : `${requestUrl} -> ${response.status} ${response.statusText}`
                );
                continue;
            }

            if (!isJsonContentType(contentType)) {
                let snippet = '';
                try {
                    snippet = (await response.text()).slice(0, 160).trim();
                } catch {
                    // Ignore body read failures.
                }

                failures.push(
                    snippet
                        ? `${requestUrl} -> non-JSON (${contentType || 'unknown'}): ${snippet}`
                        : `${requestUrl} -> non-JSON (${contentType || 'unknown'})`
                );
                continue;
            }

            return await response.json();
        } catch (error) {
            failures.push(`${requestUrl} -> network error: ${error?.message || 'unknown error'}`);
        }
    }

    return {
        ...emptyAnalyticsPayload,
        range,
        weekOffset: Math.max(0, Number(weekOffset) || 0),
        __fetchError: [
            'Failed to fetch admin analytics from all configured endpoints.',
            'If backend is on another domain, set one of: VITE_API_URL, VITE_BACKEND_URL, or VITE_API_BASE_URL.',
            ...failures
        ].join(' ')
    };
}
