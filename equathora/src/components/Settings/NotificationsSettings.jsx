import { SectionCard, SectionTitle, ToggleSwitch } from './SettingsUI';

const NotificationsSettings = ({ data }) => {
    const { settings, onSettingChange } = data;

    return (
        <SectionCard id="notifications">
            <SectionTitle sub="Choose which notifications you want to receive">Notification Preferences</SectionTitle>

            <div className="flex flex-col gap-1">
                <ToggleSwitch
                    label="Enable Notifications"
                    description="Master toggle for all in-app notifications"
                    checked={settings.notifications_enabled}
                    onChange={(value) => onSettingChange('notifications_enabled', value)}
                />

                <div className={`flex flex-col gap-1 transition-opacity ${!settings.notifications_enabled ? 'pointer-events-none opacity-40' : ''}`}>
                    <div className="border-t border-(--mid-main-secondary) pt-2">
                        <ToggleSwitch
                            label="Achievement Alerts"
                            description="Notified when you unlock a new achievement"
                            checked={settings.achievement_notifications}
                            onChange={(value) => onSettingChange('achievement_notifications', value)}
                            disabled={!settings.notifications_enabled}
                        />
                        <ToggleSwitch
                            label="Streak Reminders"
                            description="Reminded to solve a problem to keep your streak"
                            checked={settings.streak_reminders}
                            onChange={(value) => onSettingChange('streak_reminders', value)}
                            disabled={!settings.notifications_enabled}
                        />
                        <ToggleSwitch
                            label="Friend Activity"
                            description="Friend requests and social updates"
                            checked={settings.friend_notifications}
                            onChange={(value) => onSettingChange('friend_notifications', value)}
                            disabled={!settings.notifications_enabled}
                        />
                        <ToggleSwitch
                            label="Leaderboard Updates"
                            description="Get notified when your global rank changes"
                            checked={settings.leaderboard_notifications}
                            onChange={(value) => onSettingChange('leaderboard_notifications', value)}
                            disabled={!settings.notifications_enabled}
                        />
                        <ToggleSwitch
                            label="New Problems"
                            description="Get notified when new problems are added"
                            checked={settings.problem_notifications}
                            onChange={(value) => onSettingChange('problem_notifications', value)}
                            disabled={!settings.notifications_enabled}
                        />
                        <ToggleSwitch
                            label="System Updates"
                            description="Platform announcements and maintenance notices"
                            checked={settings.system_updates}
                            onChange={(value) => onSettingChange('system_updates', value)}
                            disabled={!settings.notifications_enabled}
                        />
                    </div>

                    <div className="border-t border-(--mid-main-secondary) pt-3 text-sm font-medium">
                        If you are subscribed and want to unsubscribe from <i>Equathora Briefs / Email Notifications</i>,
                        contact us at <strong><u>equathora@gmail.com</u></strong>.
                    </div>
                </div>
            </div>
        </SectionCard>
    );
};

export default NotificationsSettings;
