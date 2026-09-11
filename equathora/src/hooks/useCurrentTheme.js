import { useState, useEffect } from 'react';

export function useCurrentTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            return root.classList.contains('dark') || root.dataset.theme === 'dark' ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const updateTheme = () => {
            const root = document.documentElement;
            const isDark = root.classList.contains('dark') || root.dataset.theme === 'dark';
            setTheme(isDark ? 'dark' : 'light');
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-theme'],
        });

        return () => observer.disconnect();
    }, []);

    return theme;
}