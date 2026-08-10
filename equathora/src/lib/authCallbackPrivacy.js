const AUTH_CALLBACK_PATH = '/auth/callback';

export function hasSensitiveAuthCallbackLocation(location) {
    return location?.pathname === AUTH_CALLBACK_PATH && Boolean(location.search || location.hash);
}

export function sanitizeAuthCallbackLocation(windowObject) {
    if (!windowObject || !hasSensitiveAuthCallbackLocation(windowObject.location)) {
        return false;
    }

    windowObject.history.replaceState(windowObject.history.state, '', AUTH_CALLBACK_PATH);
    return true;
}

export function resumeAnalyticsAfterAuthCallback(windowObject, initializeAnalytics) {
    sanitizeAuthCallbackLocation(windowObject);
    return initializeAnalytics();
}
