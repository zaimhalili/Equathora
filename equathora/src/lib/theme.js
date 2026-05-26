const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';
const THEME_PREFERENCE_STORAGE_KEY = 'equathora:theme-preference';

const VALID_THEME_PREFERENCES = new Set(['light', 'dark', 'system']);

export function normalizeThemePreference(theme) {
    if (typeof theme !== 'string') return 'system';

    const normalized = theme.toLowerCase();
    return VALID_THEME_PREFERENCES.has(normalized) ? normalized : 'system';
}

export function getSystemTheme() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return 'light';
    }

    return window.matchMedia(SYSTEM_THEME_QUERY).matches ? 'dark' : 'light';  // change dark to light for default theme
}

export function resolveThemePreference(themePreference) {
    const normalized = normalizeThemePreference(themePreference);
    return normalized === 'system' ? getSystemTheme() : normalized;
}

export function getStoredThemePreference() {
    if (typeof document === 'undefined') {
        return 'system';
    }

    if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);
        if (stored) {
            return normalizeThemePreference(stored);
        }
    }

    const storedTheme = document.documentElement?.dataset?.themePreference || 'system';
    return normalizeThemePreference(storedTheme);
}

export function applyThemePreference(themePreference, { persist = true } = {}) {
    if (typeof document === 'undefined') {
        return 'light';
    }

    const normalizedPreference = normalizeThemePreference(themePreference);
    const resolvedTheme = resolveThemePreference(normalizedPreference);
    const root = document.documentElement;

    root.dataset.theme = resolvedTheme;
    root.dataset.themePreference = normalizedPreference;
    root.style.colorScheme = resolvedTheme;

    if (persist && typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, normalizedPreference);
    }

    return resolvedTheme;
}

export function setThemePreference(themePreference, { persist = true } = {}) {
    const normalizedPreference = normalizeThemePreference(themePreference);
    return applyThemePreference(normalizedPreference, { persist });
}

export function initializeTheme() {
    const stored = getStoredThemePreference();
    return applyThemePreference(stored, { persist: false });
}

export function syncThemeWithSystemPreference() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return () => { };
    }

    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);

    const updateThemeIfSystem = () => {
        const currentPreference = getStoredThemePreference();
        if (currentPreference === 'system') {
            applyThemePreference('system');
        }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', updateThemeIfSystem);
        return () => mediaQuery.removeEventListener('change', updateThemeIfSystem);
    }

    mediaQuery.addListener(updateThemeIfSystem);
    return () => mediaQuery.removeListener(updateThemeIfSystem);
}
