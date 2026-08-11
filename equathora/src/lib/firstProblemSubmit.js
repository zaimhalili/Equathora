const ANSWER_LENGTH_BANDS = [
    { max: 24, label: '1-24' },
    { max: 74, label: '25-74' },
    { max: 149, label: '75-149' },
];

export const getAnswerLengthBand = (totalCharacters = 0) => {
    const safeLength = Math.max(0, Number(totalCharacters) || 0);
    return ANSWER_LENGTH_BANDS.find(({ max }) => safeLength <= max)?.label || '150+';
};

export const buildFirstProblemSubmitProperties = ({
    problem,
    stepCount = 0,
    totalCharacters = 0,
    timeSpentSeconds = 0,
} = {}) => ({
    source: 'equathora_web',
    surface: 'problem_workspace',
    problem_id: problem?.id,
    problem_topic: problem?.topic || 'Unknown',
    problem_difficulty: problem?.difficulty || 'Unknown',
    entered_step_count: Math.max(1, Number(stepCount) || 1),
    answer_length_band: getAnswerLengthBand(totalCharacters),
    time_spent_seconds: Math.max(0, Math.round(Number(timeSpentSeconds) || 0)),
});
