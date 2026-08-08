import posthog from 'posthog-js';
import { resolvePostHogKey } from './posthogConfig';

const POSTHOG_KEY = resolvePostHogKey({
    configuredKey: import.meta.env.VITE_POSTHOG_KEY,
    hostname: typeof window !== 'undefined' ? window.location.hostname : '',
    isProduction: import.meta.env.PROD
});
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let isInitialized = false;

const canUsePostHog = () =>
    typeof window !== 'undefined' && typeof POSTHOG_KEY === 'string' && POSTHOG_KEY.trim().length > 0;

export function isPostHogEnabled() {
    return canUsePostHog();
}

export function initPostHog() {
    if (isInitialized || !canUsePostHog()) {
        return false;
    }

    posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: true,
        // Track first load and route changes for SPA navigation.
        capture_pageview: 'history_change',
        capture_pageleave: true,
        person_profiles: 'identified_only'
    });

    isInitialized = true;
    return true;
}

function ensurePostHogReady() {
    if (isInitialized) return true;
    return initPostHog();
}

export function identifyPostHogUser(user) {
    if (!user?.id || !ensurePostHogReady()) {
        return;
    }

    const properties = {
        email: user.email || undefined,
        created_at: user.created_at || undefined
    };

    posthog.identify(user.id, properties);
}

export function resetPostHogUser() {
    if (!isInitialized) {
        return;
    }

    posthog.reset();
}

export function capturePostHogEvent(eventName, properties = {}) {
    if (!eventName || !ensurePostHogReady()) {
        return false;
    }

    posthog.capture(eventName, properties);
    return true;
}

export function capturePostHogPageView(pathname, properties = {}) {
    if (!ensurePostHogReady()) {
        return false;
    }

    posthog.capture('$pageview', {
        path: pathname || (typeof window !== 'undefined' ? window.location.pathname : '/'),
        source: 'equathora_web',
        ...properties
    });

    return true;
}
