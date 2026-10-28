export function normalizeDifficultySummary(difficultyBreakdown) {
    if (!Array.isArray(difficultyBreakdown)) return [];

    return difficultyBreakdown.map((entry) => {
        const key = String(entry?.key ?? '').trim().toLowerCase() || 'unspecified';
        const label = String(entry?.label ?? '').trim()
            || (key === 'unspecified' ? 'Unspecified' : key.charAt(0).toUpperCase() + key.slice(1));
        const solved = Number(entry?.solved) || 0;
        const total = Number(entry?.total) || 0;

        return {
            key,
            label,
            solved,
            total,
            percentage: total > 0 ? Math.round((solved / total) * 100) : 0
        };
    });
}

export function getSolvedTopics(problems, completedProblemIds) {
    const completedIds = new Set((completedProblemIds || []).map((id) => String(id)));
    const topics = new Set();

    (problems || []).forEach((problem) => {
        const topic = typeof problem?.topic === 'string' ? problem.topic.trim() : '';
        if (completedIds.has(String(problem?.id)) && topic) {
            topics.add(topic);
        }
    });

    return Array.from(topics).sort((a, b) => a.localeCompare(b));
}

export function buildDifficultyExportItems(difficultyBreakdown) {
    const difficulties = normalizeDifficultySummary(difficultyBreakdown);
    if (difficulties.length === 0) return [['Difficulty Data', 'Not available']];

    return [
        ...difficulties.map(({ label, solved, total }) => [
            `${label} Problems Solved`,
            `${solved} / ${total}`
        ]),
        ...difficulties.map(({ label, percentage }) => [
            `${label} Completion Rate`,
            `${percentage}%`
        ])
    ];
}
