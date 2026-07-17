export function isZeroAttemptLearner({ progress, submissions, completedProblems }) {
    const totalAttempts = Number(progress?.total_attempts ?? 0);
    const submissionCount = Array.isArray(submissions) ? submissions.length : 0;
    const completedCount = Array.isArray(completedProblems) ? completedProblems.length : 0;

    return Number.isFinite(totalAttempts)
        && totalAttempts === 0
        && submissionCount === 0
        && completedCount === 0;
}
