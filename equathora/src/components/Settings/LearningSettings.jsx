import { Chip, SectionCard, SectionTitle } from './SettingsUI';

const LearningSettings = ({ data }) => {
    const { learningChips, diagnosticResetting, onRetakeAssessment } = data;

    return (
        <SectionCard id="learning">
            <SectionTitle sub="Retake the onboarding quiz any time your goals or level change">Learning Preferences</SectionTitle>

            {learningChips.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {learningChips.map((chip) => <Chip key={chip}>{chip}</Chip>)}
                </div>
            ) : (
                <p className="text-sm text-(--mid-main-secondary)">You haven't completed the onboarding quiz yet.</p>
            )}

            <button
                type="button"
                disabled={diagnosticResetting}
                onClick={onRetakeAssessment}
                className="w-fit cursor-pointer rounded-xl bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] px-6 py-3 text-center font-medium text-white transition-all duration-300 hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {diagnosticResetting ? 'Resetting...' : 'Retake Skill Assessment'}
            </button>
        </SectionCard>
    );
};

export default LearningSettings;
