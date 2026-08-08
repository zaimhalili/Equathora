const DEFAULT_AUTH_DESTINATION = '/dashboard';
const AUTH_ROUTES = new Set(['/login', '/signup', '/verify', '/resend', '/auth/callback']);

export function getSafeAuthDestination(value, fallback = DEFAULT_AUTH_DESTINATION) {
    if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
        return fallback;
    }

    try {
        const url = new URL(value, 'https://equathora.local');

        if (url.origin !== 'https://equathora.local' || AUTH_ROUTES.has(url.pathname)) {
            return fallback;
        }

        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return fallback;
    }
}

export function getAuthDestination(search = '', stateFrom, fallback = DEFAULT_AUTH_DESTINATION) {
    const searchParams = new URLSearchParams(search);
    const requestedDestination = stateFrom || searchParams.get('next');

    return getSafeAuthDestination(requestedDestination, fallback);
}

export function buildAuthPath(path, destination) {
    const safeDestination = getSafeAuthDestination(destination);
    const searchParams = new URLSearchParams({ next: safeDestination });

    return `${path}?${searchParams.toString()}`;
}

export function buildAuthCallbackUrl(origin, destination) {
    return `${origin}${buildAuthPath('/auth/callback', destination)}`;
}
