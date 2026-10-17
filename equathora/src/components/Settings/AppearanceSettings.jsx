import { SectionCard, SectionTitle } from './SettingsUI';
import { FaCheck } from 'react-icons/fa';

const SelectedOption = () => {
    return (
        <div className="absolute right-2 bottom-2 flex h-5 w-5 items-center justify-center rounded-full bg-(--accent-color) text-xs text-white">
            <FaCheck />
        </div>
    );
};

const AppearanceSettings = ({ data }) => {
    const { settings, onSettingChange, resolvedTheme } = data;

    return (
        <SectionCard id="appearance" showShadow={false}>
            <SectionTitle sub="Choose how Equathora looks on this device">Appearance</SectionTitle>

            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                    <button
                        id="theme-light"
                        type="button"
                        onClick={() => onSettingChange('theme', 'light')}
                        aria-label="Use light theme"
                        aria-pressed={settings.theme === 'light'}
                        className='bg-white rounded-2xl pl-4 pt-4 h-22 w-30 min-h-22 min-w-30 border-(--secondary-color) border overflow-hidden theme-lock hover:brightness-95 transition-all'
                    >
                        <div className='w-full rounded-tl-xl border-(--secondary-color) border-t border-l h-full font-medium flex pl-2 pt-0.5 text-2xl text-(--secondary-color) relative'>
                            Aa
                            {settings.theme === 'light' && <SelectedOption />}
                        </div>
                    </button>
                    <button
                        id="theme-dark"
                        type="button"
                        onClick={() => onSettingChange('theme', 'dark')}
                        aria-label="Use dark theme"
                        aria-pressed={settings.theme === 'dark'}
                        className='bg-(--secondary-color) rounded-2xl pl-4 pt-4 h-22 w-30 min-h-22 min-w-30 border-(--white) border overflow-hidden hover:brightness-120 theme-lock'
                    >
                        <div className='w-full rounded-tl-xl border-(--white) border-t border-l h-full font-medium flex pl-2 pt-0.5 text-2xl text-(--white) relative'>Aa
                            {settings.theme === 'dark' && <SelectedOption />}
                        </div>
                    </button>
                    <button
                        id="theme-system"
                        type="button"
                        onClick={() => onSettingChange('theme', 'system')}
                        aria-label="Use system theme"
                        aria-pressed={settings.theme === 'system'}
                        className='bg-white rounded-2xl pl-4 pt-4 h-22 w-30 min-h-22 min-w-30 border-(--secondary-color) overflow-hidden theme-lock hover:brightness-95 transition-all border'
                    >
                        <div className='w-full rounded-tl-xl border-(--secondary-color) border-t border-l h-full font-medium text-2xl text-(--secondary-color) flex overflow-hidden relative'>
                            <div className="flex items-center max-w-1/2 flex-1 pt-0.5 pl-2">Aa</div>
                            <div className="flex items-center max-w-1/2 flex-1 bg-(--secondary-color) text-(--white) pt-0.5 pl-2">Aa</div>
                            {settings.theme === 'system' && <SelectedOption />}
                        </div>
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
