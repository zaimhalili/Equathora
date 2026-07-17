export const WEEKLY_CHALLENGE = Object.freeze({
    id: 'weekly-algebra-1',
    route: '/challenge/weekly',
    problemId: 211,
    problemSlug: 'evaluate-211',
    subject: 'Algebra',
    topic: 'Expression evaluation',
    difficulty: 'Beginner',
    title: 'Evaluate an algebraic expression',
    prompt: '$\\text{Evaluate }8(x+3)-64\\text{ for }x=2\\text{.}$',
    previewLead: 'Evaluate the expression for x = 2.',
    previewExpression: '$8(x+3)-64$',
    estimatedMinutes: 8,
});

export const getWeeklyChallengeProblemPath = () =>
    `/problems/${WEEKLY_CHALLENGE.problemSlug}?challenge=weekly`;
