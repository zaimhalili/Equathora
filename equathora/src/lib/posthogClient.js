import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let isInitialized = false;

const canUsePostHog = () =>
    typeof window !== 'undefined' && typeof POSTHOG_KEY === 'string' && POSTHOG_KEY.trim().length > 0;

export function initPostHog() {
    if (isInitialized || !canUsePostHog()) {
        return false;
    }

    posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: true,
        capture_pageview: false,
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
