import { InputField, PrimaryButton, SectionCard, SectionTitle } from './SettingsUI';

const SecuritySettings = ({ data }) => {
    const {
        currentEmail,
        authProvider,
        newEmail,
        setNewEmail,
        emailSaving,
        handleChangeEmail,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        passwordSaving,
        showPassword,
        setShowPassword,
        handleChangePassword,
    } = data;

    return (
        <SectionCard id="security">
            <SectionTitle sub="Manage your email, password, and security settings">Account & Security</SectionTitle>

            <div className="flex flex-col gap-1 rounded-xl bg-(--main-color) px-4 py-3">
                <span className="text-xs font-semibold text-(--mid-main-secondary)">Current email</span>
                <span className="text-sm font-medium">{currentEmail}</span>
                {authProvider !== 'email' && (
                    <span className="text-xs font-semibold text-(--mid-main-secondary)">
                        Signed in via {authProvider === 'google' ? 'Google' : authProvider}
                    </span>
                )}
            </div>

            {authProvider === 'email' ? (
                <>
                    <div className="flex flex-col gap-3 border-t border-(--mid-main-secondary) pt-4">
                        <h3 className="text-base font-medium">Change Email</h3>
                        <InputField
                            label="New Email Address"
                            type="email"
                            value={newEmail}
                            onChange={(event) => setNewEmail(event.target.value)}
                            placeholder="newemail@example.com"
                        />
                        <PrimaryButton onClick={handleChangeEmail} loading={emailSaving} className="self-start">
                            Update Email
                        </PrimaryButton>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-(--mid-main-secondary) pt-4">
                        <h3 className="text-base font-medium">Change Password</h3>
                        <p className="text-xs text-(--mid-main-secondary)">
                            Minimum 8 characters with uppercase, lowercase, and a number.
                        </p>
                        <InputField
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        <InputField
                            label="Confirm New Password"
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-(--mid-main-secondary)">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="accent-(--accent-color)"
                            />
                            Show passwords
                        </label>
                        <PrimaryButton onClick={handleChangePassword} loading={passwordSaving} className="self-start">
                            Change Password
                        </PrimaryButton>
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-2 border-t border-(--mid-main-secondary) pt-4">
                    <p className="text-sm text-(--mid-main-secondary)">
                        Your account is managed through {authProvider === 'google' ? 'Google' : authProvider}.
                        Email and password changes must be made through your provider.
                    </p>
                </div>
            )}
        </SectionCard>
    );
};

export default SecuritySettings;
