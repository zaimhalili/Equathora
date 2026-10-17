import ProfileComponent from './ProfileComponent';

const AccountOverview = ({
    premium,
    subscriptionLoading,
    onManagePlan,
    onManageCookies,
    onLogout,
    onDeleteAccount,
    deletionRequested,
    deletionRequestedAt,
    onCancelDeletion,
    cancelingDeletion,
}) => (
    <section className="flex flex-col gap-8">
        <ProfileComponent />

        <section id="account-subscription" aria-labelledby="settings-plan-title" className="flex flex-col gap-3">
            <div>
                <h2 id="settings-plan-title" className="text-xl font-medium text-(--secondary-color)">Subscription</h2>
                <p className="pt-1 text-sm text-(--secondary-color)/70">Review your current plan and manage your subscription.</p>
            </div>
            <article className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-(--main-color) bg-(--white) p-5">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-(--secondary-color)">
                            {subscriptionLoading ? 'Loading plan…' : premium ? 'Premium plan' : 'Free plan'}
                        </h3>
                        {!subscriptionLoading && (
                            <span className="rounded-full bg-(--main-color) px-2 py-0.5 text-[10px] font-medium text-(--secondary-color)">
                                Current plan
                            </span>
                        )}
                    </div>
                    <p className="pt-1 text-sm text-(--secondary-color)/70">
                        {subscriptionLoading
                            ? 'Checking your subscription status.'
                            : premium
                                ? 'Your Premium benefits are active.'
                                : 'Upgrade to Premium for more features and unlimited access.'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onManagePlan}
                    className="rounded-xl px-4 py-2 text-center text-(--secondary-color)/70 hover:bg-(--main-color) hover:text-(--secondary-color) transition-all text-sm border-2 border-(--main-color)"
                >
                    {premium ? 'Manage plan' : 'View plans'}
                </button>
            </article>
        </section>

        <section aria-labelledby="settings-cookies-title" className="flex flex-col gap-3">
            <div>
                <h2 id="settings-cookies-title" className="text-xl font-medium text-(--secondary-color)">Cookie preferences</h2>
                <p className="pt-1 text-sm text-(--secondary-color)/70">
                    Choose which optional cookies Equathora can use in your browser.
                </p>
            </div>
            <button
                type="button"
                onClick={onManageCookies}
                className="w-fit rounded-xl border-2 border-(--main-color) px-4 py-2 text-sm text-(--secondary-color)/70 transition hover:bg-(--main-color) hover:text-(--secondary-color)"
            >
                Manage cookie preferences
            </button>
        </section>

        <section id="account-actions" aria-labelledby="settings-account-actions-title" className="flex flex-col gap-3">
            <div>
                <h2 id="settings-account-actions-title" className="text-xl font-medium text-(--secondary-color)">Account actions</h2>
                <p className="pt-1 text-sm text-(--secondary-color)/70">Sign out of this device or permanently delete your account.</p>
            </div>
            {deletionRequested && (
                <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                    Account deletion is scheduled
                    {deletionRequestedAt && ` for ${new Date(deletionRequestedAt).toLocaleDateString()}`}.
                </div>
            )}
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={onLogout}
                    className="rounded-xl bg-(--light-accent-color) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--accent-color)"
                >
                    Log out
                </button>

                
                {/* {deletionRequested ? (
                    <button
                        type="button"
                        onClick={onCancelDeletion}
                        disabled={cancelingDeletion}
                        className="rounded-xl border border-(--main-color) px-4 py-2 text-sm text-(--secondary-color) transition hover:bg-[#f7f8fc] disabled:opacity-50"
                    >
                        {cancelingDeletion ? 'Canceling…' : 'Cancel deletion'}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onDeleteAccount}
                        className="rounded-xl border border-(--main-color) px-4 py-2 text-sm text-(--secondary-color) transition hover:bg-[#f7f8fc]"
                    >
                        Delete account
                    </button>
                )} */}
            </div>
        </section>
    </section>
);

export default AccountOverview;
