import { supabase } from './supabaseClient';

const normalizeBase = (value) => {
    if (!value || typeof value !== 'string') return '';
    return value.trim().replace(/\/$/, '');
};

const buildApiBaseCandidates = () => {
    const explicit = normalizeBase(
        import.meta.env.VITE_API_URL ||
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_API_BASE_URL
    );

    const candidates = [];

    if (explicit) {
        candidates.push(explicit);
    }

    candidates.push('');

    return [...new Set(candidates)];
};

export async function getAdminAccessToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
}

export async function getAdminApiHeaders() {
    const accessToken = await getAdminAccessToken();
    if (!accessToken) {
        return null;
    }

    return {
        Authorization: `Bearer ${accessToken}`
    };
}

export { buildApiBaseCandidates };
