import { PrimaryButton, SectionCard, SectionTitle } from './SettingsUI';

const SessionsSettings = ({ data }) => {
    const { currentSession, onSignOutOtherSessions, sessionLoading } = data;

    return (
        <SectionCard id="sessions">
            <SectionTitle sub="View and manage your active sessions">Active Sessions</SectionTitle>

            {currentSession ? (
                <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-4 rounded-xl bg-(--main-color) px-4 py-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Current Session</span>
                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Active</span>
                            </div>
                            <span className="truncate text-xs text-(--mid-main-secondary)">
                                {currentSession.user_agent?.substring(0, 80)}...
                            </span>
                            <span className="text-xs text-(--mid-main-secondary)">
                                Last active: {new Date(currentSession.last_active).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-(--mid-main-secondary)">Unable to load session information.</p>
            )}

            <div className="flex items-center gap-3 rounded">
                <PrimaryButton onClick={onSignOutOtherSessions} loading={sessionLoading}>
                    Sign out of all sessions
                </PrimaryButton>
            </div>

            <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                <h3 className="text-base font-medium">Security Tips</h3>
                <ul className="flex flex-col gap-1.5 text-xs text-(--mid-main-secondary)">
                    <li className="flex items-start gap-2"><span className="shrink-0 font-medium text-(--accent-color)">•</span>Use a strong, unique password for your Equathora account</li>
                    <li className="flex items-start gap-2"><span className="shrink-0 font-medium text-(--accent-color)">•</span>Sign out from shared or public devices after each session</li>
                    <li className="flex items-start gap-2"><span className="shrink-0 font-medium text-(--accent-color)">•</span>Regularly review your active sessions and revoke unknown ones</li>
                    <li className="flex items-start gap-2"><span className="shrink-0 font-medium text-(--accent-color)">•</span>Never share your password with anyone, including mentors</li>
                    <li className="flex items-start gap-2"><span className="shrink-0 font-medium text-(--accent-color)">•</span>If you suspect unauthorized access, change your password immediately</li>
                </ul>
            </div>
        </SectionCard>
    );
};

export default SessionsSettings;
