const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

export const WEEKLY_CHALLENGE_ROUTE = '/challenge/weekly';

// Existing, active Algebra exercises verified in the production problem catalog.
export const WEEKLY_CHALLENGE_PROBLEMS = Object.freeze([
    Object.freeze({
        problemId: 211,
        problemSlug: 'evaluate-211',
        subject: 'Algebra',
        topic: 'Expression evaluation',
        difficulty: 'Beginner',
        title: 'Evaluate an algebraic expression',
        previewLead: 'Evaluate the expression for x = 2.',
        previewExpression: '$8(x+3)-64$',
        estimatedMinutes: 8,
    }),
    Object.freeze({
        problemId: 212,
        problemSlug: 'evaluate-212',
        subject: 'Algebra',
        topic: 'Expression evaluation',
        difficulty: 'Beginner',
        title: 'Evaluate an algebraic expression',
        previewLead: 'Evaluate the expression for y = 3.',
        previewExpression: '$4y+8-2y$',
        estimatedMinutes: 8,
    }),
    Object.freeze({
        problemId: 213,
        problemSlug: 'evaluate-213',
        subject: 'Algebra',
        topic: 'Expression evaluation',
        difficulty: 'Beginner',
        title: 'Evaluate an algebraic expression',
        previewLead: 'Evaluate the expression for a = -2.',
        previewExpression: '$(11a+3)-18a+4$',
        estimatedMinutes: 8,
    }),
    Object.freeze({
        problemId: 217,
        problemSlug: 'evaluate-217',
        subject: 'Algebra',
        topic: 'Expression evaluation',
        difficulty: 'Easy',
        title: 'Evaluate an algebraic expression',
        previewLead: 'Evaluate the expression for b = -3.',
        previewExpression: '$8(2+4)-15b+b$',
        estimatedMinutes: 8,
    }),
]);

const toUtcDate = (value = new Date()) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) throw new TypeError('A valid date is required.');
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

export const getIsoWeek = (value = new Date()) => {
    const date = toUtcDate(value);
    const weekday = date.getUTCDay() || 7;
    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() - weekday + 1);

    const thursday = new Date(monday);
    thursday.setUTCDate(monday.getUTCDate() + 3);
    const weekYear = thursday.getUTCFullYear();

    const firstThursday = new Date(Date.UTC(weekYear, 0, 4));
    firstThursday.setUTCDate(firstThursday.getUTCDate() + 3 - (firstThursday.getUTCDay() || 7));
    const weekNumber = 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / WEEK_MS);

    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);

    return Object.freeze({
        weekYear,
        weekNumber,
        weekKey: `${weekYear}-W${String(weekNumber).padStart(2, '0')}`,
        monday,
        sunday,
    });
};

const getDateFromIsoWeekKey = (weekKey) => {
    const match = /^(\d{4})-W(\d{2})$/.exec(weekKey || '');
    if (!match) return null;

    const weekYear = Number(match[1]);
    const weekNumber = Number(match[2]);
    if (weekNumber < 1 || weekNumber > 53) return null;

    const januaryFourth = new Date(Date.UTC(weekYear, 0, 4));
    const januaryFourthWeekday = januaryFourth.getUTCDay() || 7;
    const monday = new Date(januaryFourth);
    monday.setUTCDate(januaryFourth.getUTCDate() - januaryFourthWeekday + 1 + ((weekNumber - 1) * 7));

    return getIsoWeek(monday).weekKey === weekKey ? monday : null;
};

const formatDateRange = (monday, sunday) => {
    const monthDay = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    return `${monthDay.format(monday)}–${monthDay.format(sunday)}`;
};

export const getWeeklyChallenge = (value = new Date()) => {
    const isoWeek = getIsoWeek(value);
    const absoluteWeek = Math.floor(isoWeek.monday.getTime() / WEEK_MS);
    const problem = WEEKLY_CHALLENGE_PROBLEMS[
        ((absoluteWeek % WEEKLY_CHALLENGE_PROBLEMS.length) + WEEKLY_CHALLENGE_PROBLEMS.length)
        % WEEKLY_CHALLENGE_PROBLEMS.length
    ];

    return Object.freeze({
        ...problem,
        id: `weekly-algebra-${isoWeek.weekKey}`,
        route: WEEKLY_CHALLENGE_ROUTE,
        weekKey: isoWeek.weekKey,
        weekYear: isoWeek.weekYear,
        weekNumber: isoWeek.weekNumber,
        weekLabel: `Week ${isoWeek.weekNumber} of ${isoWeek.weekYear}`,
        dateRangeLabel: formatDateRange(isoWeek.monday, isoWeek.sunday),
    });
};

export const getWeeklyChallengeByKey = (weekKey) => {
    const monday = getDateFromIsoWeekKey(weekKey);
    return monday ? getWeeklyChallenge(monday) : null;
};

export const getWeeklyChallengeProblemPath = (challenge = getWeeklyChallenge()) =>
    `/problems/${challenge.problemSlug}?challenge=weekly&week=${challenge.weekKey}`;

export const getWeeklyChallengeSummaryPath = (challenge, completed = false) => {
    const params = new URLSearchParams({ week: challenge.weekKey });
    if (completed) params.set('completed', '1');
    return `${WEEKLY_CHALLENGE_ROUTE}?${params.toString()}`;
};

export const getWeeklyChallengeFromProblemParams = (slug, searchParams) => {
    if (searchParams.get('challenge') !== 'weekly') return null;
    const weekKey = searchParams.get('week');
    const challenge = weekKey ? getWeeklyChallengeByKey(weekKey) : getWeeklyChallenge();
    return challenge?.problemSlug === slug ? challenge : null;
};

// Backwards-compatible current challenge export for existing imports.
export const WEEKLY_CHALLENGE = getWeeklyChallenge();
