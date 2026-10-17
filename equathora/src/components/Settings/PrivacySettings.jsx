import { Link } from 'react-router-dom';
import { SectionCard, SectionTitle, ToggleSwitch } from './SettingsUI';

const PrivacySettings = ({ data }) => {
    const { settings, onSettingChange, cookieConsent, onCookieConsentChange } = data;

    return (
        <SectionCard id="privacy">
            <SectionTitle sub="Control what others can see about you">Privacy Controls</SectionTitle>

            <div className="flex flex-col gap-1">
                <div id="privacy-public-profile">
                    <ToggleSwitch
                        label="Public Profile"
                        description="Allow others to view your profile page"
                        checked={settings.privacy_profile_public}
                        onChange={(value) => onSettingChange('privacy_profile_public', value)}
                    />
                </div>
                <div id="privacy-show-streak">
                    <ToggleSwitch
                        label="Show Streak"
                        description="Display your current streak on your public profile"
                        checked={settings.privacy_show_streak}
                        onChange={(value) => onSettingChange('privacy_show_streak', value)}
                    />
                </div>
                <div id="privacy-leaderboard-rank">
                    <ToggleSwitch
                        label="Show Leaderboard Rank"
                        description="Include your profile in global and friends leaderboards"
                        checked={settings.privacy_show_leaderboard}
                        onChange={(value) => onSettingChange('privacy_show_leaderboard', value)}
                    />
                </div>
                <div id="privacy-show-achievements">
                    <ToggleSwitch
                        label="Show Achievements"
                        description="Let others see your earned badges and achievements"
                        checked={settings.privacy_show_achievements}
                        onChange={(value) => onSettingChange('privacy_show_achievements', value)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-(--mid-main-secondary) pt-4">
                <h3 className="text-base font-medium">Data & Cookies</h3>
                <p className="text-xs text-(--mid-main-secondary)">
                    We use essential cookies for authentication and localStorage for offline progress tracking.
                    Optional cookies are used for analytics and personalization. Read our full{' '}
                    <Link to="/privacy-policy" className="text-(--accent-color) hover:underline">Privacy Policy</Link>{' '}
                    and{' '}
                    <Link to="/cookie-policy" className="text-(--accent-color) hover:underline">Cookie Policy</Link>.
                </p>

                <div id="cookie-preference">
                    <ToggleSwitch
                        label="Allow Analytics & Personalization Cookies"
                        description={cookieConsent === 'accepted'
                            ? 'All cookies are enabled - analytics and personalization data is collected'
                            : 'Only essential cookies are active - no analytics or personalization data is collected'}
                        checked={cookieConsent === 'accepted'}
                        onChange={onCookieConsentChange}
                    />
                </div>

                <div className="flex items-center gap-2 pt-1">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cookieConsent === 'accepted'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cookieConsent === 'accepted' ? 'bg-green-500' : 'bg-amber-500'}`} />
                        {cookieConsent === 'accepted' ? 'All Cookies Accepted' : 'Essential Only'}
                    </span>
                    {cookieConsent !== 'none' && (
                        <span className="text-[10px] text-(--mid-main-secondary)">
                            Set on {settings.cookie_consent_date
                                ? new Date(settings.cookie_consent_date).toLocaleDateString()
                                : 'recently'}
                        </span>
                    )}
                </div>
            </div>
        </SectionCard>
    );
};

export default PrivacySettings;
