import { SectionCard, SectionTitle } from './SettingsUI';
import { THEME_OPTIONS } from './settingsSections';

const ThemeOptionIcon = ({ theme }) => {
    if (theme === 'light') {
        return (
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-current" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        );
    }

    if (theme === 'dark') {
        return (
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-current" fill="currentColor" aria-hidden="true">
                <path d="M20.7 15.3a8.5 8.5 0 01-11-11 1 1 0 00-1.3-1.3A10.5 10.5 0 1022 16.6a1 1 0 00-1.3-1.3z" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-current" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="4" width="18" height="12" rx="1.5" />
            <path d="M8 20h8M12 16v4" strokeLinecap="round" />
        </svg>
    );
};

const AppearanceSettings = ({ data }) => {
    const { settings, onSettingChange, resolvedTheme } = data;

    return (
        <SectionCard id="appearance">
            <SectionTitle sub="Control how Equathora looks on this device">Appearance</SectionTitle>

            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                    {THEME_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onSettingChange('theme', option.value)}
                            aria-pressed={settings.theme === option.value}
                            className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${settings.theme === option.value
                                ? 'border-(--accent-color) bg-(--accent-color) text-white'
                                : 'border-(--mid-main-secondary) text-(--secondary-color) hover:border-(--accent-color)'
                            }`}
                        >
                            <ThemeOptionIcon theme={option.value} />
                            {option.label}
                        </button>
                    ))}
                    <button type="button" className='bg-(secondary-color) rounded-2xl px-3 pt-3 h-30 w-35'>
                        <div className='w-full rounded-t-l-2xl border-(--french-gray)'>Aa</div>
                    </button>
                    
                </div>
                {settings.theme === 'system' && (
                    <p className="text-xs text-(--mid-main-secondary)">
                        Currently following your device preference:{' '}
                        <span className="font-semibold text-(--secondary-color)">
                            {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
                        </span>.
                    </p>
                )}
            </div>
        </SectionCard>
    );
};

export default AppearanceSettings;
