const THEME_STORAGE_KEY = 'equathora_theme_preference';
const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';

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
    if (typeof window === 'undefined') {
        return 'system';
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return normalizeThemePreference(storedTheme);
}

export function applyThemePreference(themePreference) {
    if (typeof document === 'undefined') {
        return 'light';
    }

    const normalizedPreference = normalizeThemePreference(themePreference);
    const resolvedTheme = resolveThemePreference(normalizedPreference);
    const root = document.documentElement;

    root.dataset.theme = resolvedTheme;
    root.dataset.themePreference = normalizedPreference;
    root.style.colorScheme = resolvedTheme;

    return resolvedTheme;
}

export function setThemePreference(themePreference, { persist = true } = {}) {
    const normalizedPreference = normalizeThemePreference(themePreference);

    if (persist && typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_STORAGE_KEY, normalizedPreference);
    }

    return applyThemePreference(normalizedPreference);
}

export function initializeTheme() {
    const initialPreference = getStoredThemePreference();
    return applyThemePreference(initialPreference);
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
