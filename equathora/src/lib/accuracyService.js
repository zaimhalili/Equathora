export const computeAccuracyFromSubmissions = ({ submissions = [], validProblemIds = null, solvedCount = 0 } = {}) => {
    const filtered = Array.isArray(submissions)
        ? submissions.filter((row) => {
            if (!validProblemIds) return true;
            return validProblemIds.has(String(row?.problem_id ?? ''));
        })
        : [];

    const total = filtered.length;
    const wrong = filtered.filter((row) => row?.is_correct === false).length;
    const correct = Math.max(total - wrong, 0);

    if (total > 0) {
        return {
            accuracy: Math.max(0, Math.min(100, Math.round((correct / total) * 100))),
            correct,
            wrong,
            total
        };
    }

    if (solvedCount > 0) {
        return { accuracy: null, correct: 0, wrong: 0, total: 0 };
    }

    return { accuracy: 0, correct: 0, wrong: 0, total: 0 };
};
