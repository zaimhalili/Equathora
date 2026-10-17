import { PrimaryButton, SectionCard, SectionTitle } from './SettingsUI';

const SubscriptionSettings = ({ data }) => {
    const { premium, onManagePlan } = data;

    return (
        <SectionCard id="subscription">
            <SectionTitle sub="Manage your Equathora plan">Subscription</SectionTitle>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 border-(--main-color) px-4 py-4">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-(--mid-main-secondary)">Current plan</span>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">{premium ? 'Premium' : 'Free'}</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onManagePlan}
                    className="rounded-xl px-4 py-2 text-center text-(--secondary-color)/70 hover:bg-(--main-color) hover:text-(--secondary-color) transition-all text-sm border-2 border-(--main-color)"
                >
                    {premium ? 'Manage plan' : 'View plans'}
                </button>
            </div>

            <p id="subscription-support" className="text-xs text-(--mid-main-secondary)">
                Premium unlocks AI step-by-step checking, detailed explanations, and solution verification.
            </p>
            <p className="text-xs text-(--mid-main-secondary)">
                For any issues contact us at:{' '}
                <a href="mailto:equathora@gmail.com" className="font-medium hover:underline">equathora@gmail.com</a>
            </p>
        </SectionCard>
    );
};

export default SubscriptionSettings;
