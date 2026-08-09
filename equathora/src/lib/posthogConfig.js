const EQUATHORA_PRODUCTION_HOSTNAMES = new Set([
    'equathora.com',
    'www.equathora.com'
]);

// PostHog project tokens are public client identifiers, not secret API keys.
// Keep this fallback scoped to Equathora's production domains so local and
// preview builds only send events when VITE_POSTHOG_KEY is explicitly set.
export const EQUATHORA_POSTHOG_PROJECT_TOKEN =
    'phc_rfCGgLSiEP4aMWck4BoKiaUqNvmJrxk53NnNtFyi4afG';

const normalize = (value) => typeof value === 'string' ? value.trim() : '';

export function resolvePostHogKey({
    configuredKey,
    hostname,
    isProduction
} = {}) {
    const normalizedConfiguredKey = normalize(configuredKey);
    if (normalizedConfiguredKey) {
        return normalizedConfiguredKey;
    }

    const normalizedHostname = normalize(hostname).toLowerCase();
    if (isProduction && EQUATHORA_PRODUCTION_HOSTNAMES.has(normalizedHostname)) {
        return EQUATHORA_POSTHOG_PROJECT_TOKEN;
    }

    return '';
}
