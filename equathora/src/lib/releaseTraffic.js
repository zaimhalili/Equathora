const COMPARISON_ROUTES = Object.freeze({
    '/khan-academy-alternative': 'khan_academy',
    '/ixl-alternative': 'ixl',
    '/brilliant-alternative': 'brilliant',
});

const PENDING_HANDOFF_KEY = 'equathora_comparison_problem_handoff';
const HANDOFF_TTL_MS = 30 * 60 * 1000;
const PROBLEM_ROUTE_PATTERN = /^\/problems\/[a-z0-9]+(?:-[a-z0-9]+)*$/i;

const safeCurrentUrl = (origin, pathname) => {
    try {
        return `${new URL(origin).origin}${pathname}`;
    } catch {
        return pathname;
    }
};

export function getComparisonName(pathname) {
    return COMPARISON_ROUTES[pathname] || null;
}

export function getSafeProblemPath(target, origin) {
    if (typeof target !== 'string' || typeof origin !== 'string') {
        return null;
    }

    try {
        const targetUrl = new URL(target, origin);
        const trustedOrigin = new URL(origin).origin;

        if (targetUrl.origin !== trustedOrigin || !PROBLEM_ROUTE_PATTERN.test(targetUrl.pathname)) {
            return null;
        }

        return targetUrl.pathname;
    } catch {
        return null;
    }
}

export function getComparisonPageEvent(pathname, origin) {
    const comparison = getComparisonName(pathname);
    if (!comparison) return null;

    return {
        comparison,
        route: pathname,
        source: 'equathora_web',
        $current_url: safeCurrentUrl(origin, pathname),
    };
}

export function getComparisonProblemHandoff(sourcePathname, target, origin) {
    const comparison = getComparisonName(sourcePathname);
    const destinationRoute = getSafeProblemPath(target, origin);

    if (!comparison || !destinationRoute) {
        return null;
    }

    return {
        comparison,
        source_route: sourcePathname,
        destination_route: destinationRoute,
        source: 'equathora_web',
        $current_url: safeCurrentUrl(origin, sourcePathname),
    };
}

export function savePendingComparisonHandoff(storage, handoff, now = Date.now()) {
    if (!storage || !handoff) return false;

    try {
        storage.setItem(PENDING_HANDOFF_KEY, JSON.stringify({
            comparison: handoff.comparison,
            source_route: handoff.source_route,
            destination_route: handoff.destination_route,
            expires_at: now + HANDOFF_TTL_MS,
        }));
        return true;
    } catch {
        return false;
    }
}

export function takePendingComparisonHandoff(storage, pathname, origin, now = Date.now()) {
    if (!storage || !PROBLEM_ROUTE_PATTERN.test(pathname)) return null;

    try {
        const rawValue = storage.getItem(PENDING_HANDOFF_KEY);
        if (!rawValue) return null;

        storage.removeItem(PENDING_HANDOFF_KEY);
        const pending = JSON.parse(rawValue);
        const expectedComparison = getComparisonName(pending.source_route);

        if (
            !expectedComparison ||
            pending.comparison !== expectedComparison ||
            pending.destination_route !== pathname ||
            !Number.isFinite(pending.expires_at) ||
            pending.expires_at < now
        ) {
            return null;
        }

        return {
            comparison: expectedComparison,
            source_route: pending.source_route,
            destination_route: pathname,
            source: 'equathora_web',
            $current_url: safeCurrentUrl(origin, pathname),
        };
    } catch {
        try {
            storage.removeItem(PENDING_HANDOFF_KEY);
        } catch {
            // Analytics storage is best-effort and must not affect navigation.
        }
        return null;
    }
}

export function getProblemLinkFromClick(event) {
    const anchor = event?.target?.closest?.('a[href]');
    return anchor?.href || null;
}

export const releaseTrafficConstants = Object.freeze({
    comparisonRoutes: COMPARISON_ROUTES,
    pendingHandoffKey: PENDING_HANDOFF_KEY,
    handoffTtlMs: HANDOFF_TTL_MS,
});
