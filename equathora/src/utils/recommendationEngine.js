const ONBOARDING_STEP_KEYS = {
    goal: [1, '1', 'goal'],
    topics: [2, '2', 'topics'],
    currentLevel: [3, '3', 'currentLevel', 'level'],
    learningApproach: [4, '4', 'learningApproach'],
    dailyTimeBand: [5, '5', 'dailyTimeBand'],
    motivation: [6, '6', 'motivation'],
    preferredStudyTime: [7, '7', 'preferredStudyTime'],
    guidancePreference: [8, '8', 'guidancePreference'],
};

const DAILY_MINUTES_BY_BAND = {
    '5-10': 10,
    '15-30': 25,
    '30-60': 45,
    '60+': 75,
};

const DIFFICULTY_MINUTES = {
    easy: 8,
    medium: 14,
    hard: 22,
};

const BAND_CONFIG = {
    weak: {
        label: 'Foundation Builder',
        availableSlots: 3,
        difficultyWeights: { easy: 45, medium: 22, hard: 6 },
    },
    intermediate: {
        label: 'Momentum Learner',
        availableSlots: 4,
        difficultyWeights: { easy: 24, medium: 34, hard: 20 },
    },
    strong: {
        label: 'Challenge Mode',
        availableSlots: 5,
        difficultyWeights: { easy: 10, medium: 30, hard: 42 },
    },
};

export const PROBLEM_NODE_STATUS = {
    LOCKED: 'locked',
    AVAILABLE: 'available',
    IN_PROGRESS: 'in-progress',
    SOLVED: 'solved',
};

const safeNumber = (value, fallback = 0) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
};

const normalizeTopicKey = (topic) => String(topic || 'General Concepts').trim().toLowerCase();

const getNestedValue = (source, keys) => {
    for (const key of keys) {
        if (source?.[key] !== undefined) {
            return source[key];
        }
    }

    return undefined;
};

export function normalizeDifficulty(difficulty) {
    const normalized = String(difficulty || '').trim().toLowerCase();

    if (['beginner', 'easy'].includes(normalized)) return 'easy';
    if (['standard', 'intermediate', 'medium'].includes(normalized)) return 'medium';
    if (['challenging', 'hard', 'advanced', 'expert'].includes(normalized)) return 'hard';

    return 'medium';
}

export function normalizeQuestionnaireAnswers(rawAnswers = {}) {
    const topicsValue = getNestedValue(rawAnswers, ONBOARDING_STEP_KEYS.topics);

    return {
        goal: String(getNestedValue(rawAnswers, ONBOARDING_STEP_KEYS.goal) || 'problem-solving'),
        topics: Array.isArray(topicsValue)
            ? topicsValue.map((topic) => String(topic).trim()).filter(Boolean)
            : [],
        currentLevel: String(getNestedValue(rawAnswers, ONBOARDING_STEP_KEYS.currentLevel) || 'intermediate').toLowerCase(),
        learningApproach: String(getNestedValue(rawAnswers, ONBOARDING_STEP_KEYS.learningApproach) || 'self-paced'),
        dailyTimeBand: String(getNestedValue(rawAnswers, ONBOARDING_STEP_KEYS.dailyTimeBand) || '15-30'),
        motivation: String(getNestedValue(rawAnswers, ONBOARDING_STEP_KEYS.motivation) || 'mastery'),
        preferredStudyTime: String(getNestedValue(rawAnswers, ONBOARDING_STEP_KEYS.preferredStudyTime) || 'evening'),
        guidancePreference: String(getNestedValue(rawAnswers, ONBOARDING_STEP_KEYS.guidancePreference) || 'some-help'),
        completedAt: rawAnswers?.completedAt || new Date().toISOString(),
    };
}

export function getDailyMinutesFromBand(dailyTimeBand) {
    return DAILY_MINUTES_BY_BAND[dailyTimeBand] || 25;
}

export function inferLearnerBand({ onboardingLevel, overallAccuracy = 0, solvedCount = 0 }) {
    const normalizedLevel = String(onboardingLevel || '').toLowerCase();

    let band = 'intermediate';
    if (['beginner'].includes(normalizedLevel)) {
        band = 'weak';
    } else if (['advanced', 'expert'].includes(normalizedLevel)) {
        band = 'strong';
    }

    if (overallAccuracy < 50 || solvedCount < 8) {
        return 'weak';
    }

    if (overallAccuracy >= 82 && solvedCount >= 20) {
        return 'strong';
    }

    return band;
}

export function calculateWeeklyGoal({ dailyMinutes, learnerBand }) {
    const minutes = Math.max(5, safeNumber(dailyMinutes, 25));
    const avgProblemMinutes = learnerBand === 'strong' ? 15 : learnerBand === 'weak' ? 11 : 13;
    const weeklyProblems = Math.max(7, Math.round((minutes * 7) / avgProblemMinutes));

    return {
        weeklyProblems,
        weeklyMinutes: minutes * 7,
    };
}

function normalizeSubmission(submission) {
    return {
        problem_id: String(submission?.problem_id || submission?.problemId || ''),
        is_correct: Boolean(submission?.is_correct),
        time_spent_seconds: safeNumber(submission?.time_spent_seconds, 0),
        submitted_at: submission?.submitted_at || submission?.timestamp || new Date().toISOString(),
    };
}

function sortSubmissionsChronologically(submissions) {
    return [...submissions].sort((a, b) => {
        const left = new Date(a.submitted_at).getTime();
        const right = new Date(b.submitted_at).getTime();
        return left - right;
    });
}

export function deriveInProgressProblemIds({ submissions, solvedProblemIds }) {
    const solvedSet = new Set((solvedProblemIds || []).map((id) => String(id)));
    const attemptedSet = new Set();
    const correctedSet = new Set();

    for (const rawSubmission of submissions || []) {
        const submission = normalizeSubmission(rawSubmission);
        if (!submission.problem_id) continue;

        attemptedSet.add(submission.problem_id);
        if (submission.is_correct) {
            correctedSet.add(submission.problem_id);
        }
    }

    const inProgress = [];
    for (const attemptedId of attemptedSet) {
        if (!solvedSet.has(attemptedId) && !correctedSet.has(attemptedId)) {
            inProgress.push(attemptedId);
        }
    }

    return inProgress;
}

export function calculateFirstTrySuccessRate(submissions = []) {
    const normalized = sortSubmissionsChronologically(submissions.map(normalizeSubmission));
    const seen = new Set();

    let firstAttempts = 0;
    let firstTryCorrect = 0;

    for (const submission of normalized) {
        if (!submission.problem_id || seen.has(submission.problem_id)) {
            continue;
        }

        seen.add(submission.problem_id);
        firstAttempts += 1;
        if (submission.is_correct) {
            firstTryCorrect += 1;
        }
    }

    if (firstAttempts === 0) return 0;
    return Math.round((firstTryCorrect / firstAttempts) * 100);
}

export function calculateTopicInsights({ submissions = [], problemsById = {} }) {
    const topicMap = new Map();
    const firstAttemptByProblem = new Map();
    const normalized = sortSubmissionsChronologically(submissions.map(normalizeSubmission));

    for (const submission of normalized) {
        const problem = problemsById?.[submission.problem_id];
        const topic = problem?.topic || 'General Concepts';
        const topicKey = normalizeTopicKey(topic);

        if (!topicMap.has(topicKey)) {
            topicMap.set(topicKey, {
                topic,
                attempts: 0,
                correct: 0,
                totalTimeSeconds: 0,
                wrong: 0,
                firstAttempts: 0,
                firstTryCorrect: 0,
                uniqueProblems: new Set(),
            });
        }

        const bucket = topicMap.get(topicKey);
        bucket.attempts += 1;
        bucket.totalTimeSeconds += submission.time_spent_seconds;
        bucket.uniqueProblems.add(submission.problem_id);

        if (submission.is_correct) {
            bucket.correct += 1;
        } else {
            bucket.wrong += 1;
        }

        if (!firstAttemptByProblem.has(submission.problem_id)) {
            firstAttemptByProblem.set(submission.problem_id, submission.is_correct);
            bucket.firstAttempts += 1;
            if (submission.is_correct) {
                bucket.firstTryCorrect += 1;
            }
        }
    }

    return [...topicMap.values()].map((bucket) => {
        const accuracy = bucket.attempts > 0 ? Math.round((bucket.correct / bucket.attempts) * 100) : 0;
        const avgSolveSeconds = bucket.attempts > 0 ? Math.round(bucket.totalTimeSeconds / bucket.attempts) : 0;
        const firstTryRate = bucket.firstAttempts > 0
            ? Math.round((bucket.firstTryCorrect / bucket.firstAttempts) * 100)
            : 0;

        const speedScore = Math.max(0, Math.min(100, 100 - Math.round((avgSolveSeconds - 120) / 4)));
        const confidenceScore = Math.round((accuracy * 0.6) + (firstTryRate * 0.25) + (speedScore * 0.15));

        return {
            topic: bucket.topic,
            attempts: bucket.attempts,
            correct: bucket.correct,
            wrong: bucket.wrong,
            accuracy,
            avgSolveSeconds,
            firstTryRate,
            confidenceScore,
            uniqueProblemsCount: bucket.uniqueProblems.size,
        };
    }).sort((a, b) => a.confidenceScore - b.confidenceScore);
}

export function calculateProblemAttemptStats(submissions = []) {
    const statsMap = new Map();

    for (const rawSubmission of submissions) {
        const submission = normalizeSubmission(rawSubmission);
        if (!submission.problem_id) {
            continue;
        }

        if (!statsMap.has(submission.problem_id)) {
            statsMap.set(submission.problem_id, {
                attempts: 0,
                totalTimeSeconds: 0,
                correctAttempts: 0,
                wrongAttempts: 0,
            });
        }

        const current = statsMap.get(submission.problem_id);
        current.attempts += 1;
        current.totalTimeSeconds += submission.time_spent_seconds;
        if (submission.is_correct) {
            current.correctAttempts += 1;
        } else {
            current.wrongAttempts += 1;
        }
    }

    return statsMap;
}

export function detectRevisionTopics(topicInsights = []) {
    const flagged = [];

    for (const insight of topicInsights) {
        const reasons = [];

        if (insight.accuracy < 65 && insight.attempts >= 3) {
            reasons.push('low accuracy');
        }

        if (insight.avgSolveSeconds > 420 && insight.attempts >= 2) {
            reasons.push('high solve time');
        }

        if (insight.wrong >= 4 && insight.firstTryRate < 50) {
            reasons.push('repeated mistakes');
        }

        if (reasons.length === 0) {
            continue;
        }

        const priorityScore =
            (100 - insight.accuracy) +
            Math.max(0, Math.round((insight.avgSolveSeconds - 240) / 12)) +
            Math.max(0, insight.wrong * 2);

        flagged.push({
            topic: insight.topic,
            reasons,
            accuracy: insight.accuracy,
            avgSolveSeconds: insight.avgSolveSeconds,
            wrong: insight.wrong,
            priorityScore,
        });
    }

    return flagged.sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 4);
}

export function detectRecoveryMode(submissions = []) {
    if (!Array.isArray(submissions) || submissions.length === 0) {
        return {
            enabled: false,
            failedInRow: 0,
            windowAccuracy: 100,
            reason: '',
        };
    }

    const normalized = [...submissions.map(normalizeSubmission)].sort((a, b) => {
        const left = new Date(b.submitted_at).getTime();
        const right = new Date(a.submitted_at).getTime();
        return left - right;
    });

    let failedInRow = 0;
    for (const submission of normalized) {
        if (submission.is_correct) {
            break;
        }

        failedInRow += 1;
    }

    const recentWindow = normalized.slice(0, 5);
    const correctInWindow = recentWindow.filter((submission) => submission.is_correct).length;
    const windowAccuracy = recentWindow.length > 0
        ? Math.round((correctInWindow / recentWindow.length) * 100)
        : 100;

    const enabled = failedInRow >= 3 || (recentWindow.length >= 5 && windowAccuracy <= 40);

    return {
        enabled,
        failedInRow,
        windowAccuracy,
        reason: enabled
            ? failedInRow >= 3
                ? `${failedInRow} incorrect submissions in a row`
                : `Recent accuracy dropped to ${windowAccuracy}%`
            : '',
    };
}

export function scoreProblemForPlan(problem, {
    learnerBand,
    preferredTopics = new Set(),
    revisionTopics = new Set(),
    inProgressProblemIds = new Set(),
    recoveryMode,
}) {
    const config = BAND_CONFIG[learnerBand] || BAND_CONFIG.intermediate;
    const difficultyBucket = normalizeDifficulty(problem?.difficulty);
    const topicKey = normalizeTopicKey(problem?.topic);
    const problemId = String(problem?.id || '');

    let score = config.difficultyWeights[difficultyBucket] || 0;

    if (preferredTopics.has(topicKey)) {
        score += 14;
    }

    if (revisionTopics.has(topicKey)) {
        score += 18;
    }

    if (inProgressProblemIds.has(problemId)) {
        score += 16;
    }

    if (recoveryMode?.enabled) {
        if (difficultyBucket === 'hard') score -= 20;
        if (difficultyBucket === 'easy') score += 10;
    }

    const stableTieBreaker = safeNumber(problem?.id, 0) % 10;
    score += stableTieBreaker * 0.1;

    return score;
}

function estimateProblemMinutes(problem, topicInsightMap) {
    const difficultyBucket = normalizeDifficulty(problem?.difficulty);
    const defaultMinutes = DIFFICULTY_MINUTES[difficultyBucket] || 12;
    const topicKey = normalizeTopicKey(problem?.topic);
    const topicInsight = topicInsightMap.get(topicKey);

    if (!topicInsight) {
        return defaultMinutes;
    }

    const byTopic = Math.max(4, Math.round(topicInsight.avgSolveSeconds / 60));
    return Math.max(defaultMinutes, byTopic);
}

export function determineProblemNodeStatus({ isSolved, isInProgress, index, availableSlots }) {
    if (isSolved) {
        return PROBLEM_NODE_STATUS.SOLVED;
    }

    if (isInProgress) {
        return PROBLEM_NODE_STATUS.IN_PROGRESS;
    }

    return index < availableSlots
        ? PROBLEM_NODE_STATUS.AVAILABLE
        : PROBLEM_NODE_STATUS.LOCKED;
}

export function applyProgressStateTransition(nodes = [], solvedProblemId, availableSlots = 3) {
    const targetId = String(solvedProblemId || '');

    const solvedSet = new Set(
        nodes
            .filter((node) => node.status === PROBLEM_NODE_STATUS.SOLVED)
            .map((node) => String(node.id))
    );

    if (targetId) {
        solvedSet.add(targetId);
    }

    let unlockedCounter = 0;

    return nodes.map((node) => {
        const nodeId = String(node.id || '');
        if (solvedSet.has(nodeId)) {
            return {
                ...node,
                status: PROBLEM_NODE_STATUS.SOLVED,
            };
        }

        if (node.status === PROBLEM_NODE_STATUS.IN_PROGRESS) {
            unlockedCounter += 1;
            return {
                ...node,
                status: PROBLEM_NODE_STATUS.IN_PROGRESS,
            };
        }

        const nextStatus = unlockedCounter < availableSlots
            ? PROBLEM_NODE_STATUS.AVAILABLE
            : PROBLEM_NODE_STATUS.LOCKED;

        unlockedCounter += 1;

        return {
            ...node,
            status: nextStatus,
        };
    });
}

export function buildRankedProblems({
    problems = [],
    solvedProblemIds = [],
    inProgressProblemIds = [],
    learnerBand = 'intermediate',
    preferredTopics = [],
    revisionTopics = [],
    recoveryMode = { enabled: false },
    problemAttemptStats = new Map(),
    maxCount = 18,
    topicInsightMap = new Map(),
}) {
    const solvedSet = new Set((solvedProblemIds || []).map((id) => String(id)));
    const inProgressSet = new Set((inProgressProblemIds || []).map((id) => String(id)));
    const preferredTopicSet = new Set((preferredTopics || []).map(normalizeTopicKey));
    const revisionTopicSet = new Set((revisionTopics || []).map(normalizeTopicKey));

    const ranked = [];

    for (const problem of problems) {
        const problemId = String(problem?.id || '');
        const attemptStats = problemAttemptStats.get(problemId) || {
            attempts: 0,
            totalTimeSeconds: 0,
            correctAttempts: 0,
            wrongAttempts: 0,
        };

        const score = scoreProblemForPlan(problem, {
            learnerBand,
            preferredTopics: preferredTopicSet,
            revisionTopics: revisionTopicSet,
            inProgressProblemIds: inProgressSet,
            recoveryMode,
        });

        ranked.push({
            ...problem,
            planScore: score,
            estimatedMinutes: estimateProblemMinutes(problem, topicInsightMap),
            timeSpentSeconds: attemptStats.totalTimeSeconds,
            avgAttemptSeconds: attemptStats.attempts > 0
                ? Math.round(attemptStats.totalTimeSeconds / attemptStats.attempts)
                : 0,
            attempts: attemptStats.attempts,
            isSolved: solvedSet.has(problemId),
            isInProgress: inProgressSet.has(problemId),
            difficultyBucket: normalizeDifficulty(problem?.difficulty),
        });
    }

    const solvedFirst = ranked
        .filter((item) => item.isSolved)
        .sort((a, b) => b.planScore - a.planScore)
        .slice(0, 4);

    const unsolvedRanked = ranked
        .filter((item) => !item.isSolved)
        .sort((a, b) => b.planScore - a.planScore);

    const combined = [...solvedFirst, ...unsolvedRanked].slice(0, maxCount);

    const availableSlots = BAND_CONFIG[learnerBand]?.availableSlots || 4;
    let unlockedCounter = 0;

    return combined.map((problem) => {
        const status = determineProblemNodeStatus({
            isSolved: problem.isSolved,
            isInProgress: problem.isInProgress,
            index: unlockedCounter,
            availableSlots,
        });

        if (!problem.isSolved) {
            unlockedCounter += 1;
        }

        return {
            ...problem,
            status,
        };
    });
}

export function buildTodayAction({ pathNodes = [], dailyMinutes = 25 }) {
    const candidates = pathNodes.filter((node) =>
        node.status === PROBLEM_NODE_STATUS.AVAILABLE || node.status === PROBLEM_NODE_STATUS.IN_PROGRESS
    );

    const selected = candidates.slice(0, 3);
    const estimatedMinutes = selected.reduce((total, node) => total + safeNumber(node.estimatedMinutes, 12), 0);

    return {
        nextProblems: selected,
        estimatedMinutes,
        recommendedDailyMinutes: Math.max(dailyMinutes, estimatedMinutes),
    };
}

export function buildQuickSessionPlan({ pathNodes = [], minutes = 30 }) {
    const candidates = pathNodes.filter((node) =>
        node.status === PROBLEM_NODE_STATUS.AVAILABLE || node.status === PROBLEM_NODE_STATUS.IN_PROGRESS
    );

    const selected = [];
    let used = 0;

    for (const node of candidates) {
        const estimate = safeNumber(node.estimatedMinutes, 12);
        if (selected.length > 0 && used + estimate > minutes) {
            break;
        }

        selected.push(node);
        used += estimate;
    }

    return {
        minutes,
        problems: selected,
        totalEstimatedMinutes: used,
    };
}

function buildWeeklySummary({
    topicInsights,
    revisionFocus,
    streakDays,
    solvedCount,
    firstTryRate,
}) {
    const strongestTopic = topicInsights
        .slice()
        .sort((a, b) => b.confidenceScore - a.confidenceScore)[0];

    const weakestTopic = revisionFocus[0];

    return {
        improved: strongestTopic
            ? `${strongestTopic.topic} is your strongest topic this week (${strongestTopic.accuracy}% accuracy).`
            : 'You are building consistency. Keep your daily sessions steady.',
        needsWork: weakestTopic
            ? `${weakestTopic.topic} needs revision due to ${weakestTopic.reasons.join(', ')}.`
            : 'No urgent revision topic detected. Keep advancing in your path.',
        nextWeekFocus: `Maintain a ${Math.max(3, Math.min(10, streakDays + 1))}-day streak, solve ${Math.max(8, Math.round(solvedCount * 0.25))} focused problems, and push first-try success above ${Math.min(90, firstTryRate + 5)}%.`,
    };
}

function buildMilestones({ streakDays, solvedCount, firstTryRate }) {
    const milestones = [];

    if (streakDays >= 3) {
        milestones.push({
            id: 'streak-builder',
            title: `${streakDays}-Day Streak`,
            description: 'Consistency milestone unlocked.',
        });
    }

    if (solvedCount >= 10) {
        milestones.push({
            id: 'solver',
            title: `${solvedCount} Problems Solved`,
            description: 'Strong momentum in your learning path.',
        });
    }

    if (firstTryRate >= 70) {
        milestones.push({
            id: 'precision',
            title: 'First-Try Precision',
            description: `${firstTryRate}% first-try success rate.`,
        });
    }

    return milestones.slice(0, 3);
}

function buildGuide({ learnerBand, dailyMinutes }) {
    const coreSteps = [
        'Start with your Today Action card and solve problems in the listed order.',
        'Use hints only after an honest attempt to protect first-try learning quality.',
        'Review flagged revision topics before starting advanced problems.',
        'End each session with one reflection note to improve future recommendations.',
        'Use 15/30/60 min smart sessions to stay consistent on busy days.',
    ];

    const routine = learnerBand === 'weak'
        ? [
            `Day 1-2: ${Math.min(20, dailyMinutes)} minutes fundamentals + one revision topic.`,
            'Day 3-4: Mix easy and medium problems with guided hints only when blocked.',
            'Day 5-7: Reattempt one previous weak topic and then unlock one new node.',
        ]
        : learnerBand === 'strong'
            ? [
                `Day 1-2: ${dailyMinutes} minutes challenge-focused mixed set.`,
                'Day 3-4: One hard topic sprint + one revision checkpoint.',
                'Day 5-7: Advanced sequence with weekly reflection and speed focus.',
            ]
            : [
                `Day 1-2: ${dailyMinutes} minutes balanced warm-up (easy + medium).`,
                'Day 3-4: Push one topic in depth, then revise a weak area.',
                'Day 5-7: Mixed set with one challenge problem each day.',
            ];

    return {
        coreSteps,
        firstWeekRoutine: routine,
    };
}

export function buildRecommendedStudyPlan({
    problems = [],
    submissions = [],
    progress = {},
    streak = {},
    onboardingAnswers = {},
    userDisplayName = 'Learner',
}) {
    const onboarding = normalizeQuestionnaireAnswers(onboardingAnswers);
    const solvedProblemIds = (progress?.solved_problems || []).map((id) => String(id));

    const normalizedSubmissions = submissions.map(normalizeSubmission);
    const inProgressProblemIds = deriveInProgressProblemIds({
        submissions: normalizedSubmissions,
        solvedProblemIds,
    });

    const problemsById = Object.fromEntries(
        (problems || []).map((problem) => [String(problem.id), problem])
    );

    const topicInsights = calculateTopicInsights({
        submissions: normalizedSubmissions,
        problemsById,
    });

    const problemAttemptStats = calculateProblemAttemptStats(normalizedSubmissions);

    const topicInsightMap = new Map(
        topicInsights.map((insight) => [normalizeTopicKey(insight.topic), insight])
    );

    const revisionFocus = detectRevisionTopics(topicInsights);

    const totalAttemptsFromProgress = safeNumber(progress?.total_attempts, 0);
    const wrongFromProgress = safeNumber(progress?.wrong_submissions, 0);

    const overallAccuracy = totalAttemptsFromProgress > 0
        ? Math.round(((totalAttemptsFromProgress - wrongFromProgress) / totalAttemptsFromProgress) * 100)
        : safeNumber(progress?.accuracy_rate, 0);

    const solvedCount = solvedProblemIds.length;
    const learnerBand = inferLearnerBand({
        onboardingLevel: onboarding.currentLevel,
        overallAccuracy,
        solvedCount,
    });

    const dailyMinutes = getDailyMinutesFromBand(onboarding.dailyTimeBand);
    const weeklyGoal = calculateWeeklyGoal({ dailyMinutes, learnerBand });
    const recoveryMode = detectRecoveryMode(normalizedSubmissions);

    const rankedPath = buildRankedProblems({
        problems,
        solvedProblemIds,
        inProgressProblemIds,
        learnerBand,
        preferredTopics: onboarding.topics,
        revisionTopics: revisionFocus.map((item) => item.topic),
        recoveryMode,
        problemAttemptStats,
        maxCount: 18,
        topicInsightMap,
    });

    const todayAction = buildTodayAction({
        pathNodes: rankedPath,
        dailyMinutes,
    });

    const quickSessions = [15, 30, 60].map((minutes) =>
        buildQuickSessionPlan({ pathNodes: rankedPath, minutes })
    );

    const firstTryRate = calculateFirstTrySuccessRate(normalizedSubmissions);
    const streakDays = safeNumber(streak?.current_streak, safeNumber(progress?.streak_days, 0));

    const milestones = buildMilestones({
        streakDays,
        solvedCount,
        firstTryRate,
    });

    const weeklySummary = buildWeeklySummary({
        topicInsights,
        revisionFocus,
        streakDays,
        solvedCount,
        firstTryRate,
    });

    const guide = buildGuide({ learnerBand, dailyMinutes });

    return {
        onboarding,
        learnerBand,
        learnerBandLabel: BAND_CONFIG[learnerBand]?.label || BAND_CONFIG.intermediate.label,
        dailyMinutes,
        weeklyGoal,
        pathNodes: rankedPath,
        todayAction,
        quickSessions,
        recoveryMode,
        topicInsights,
        revisionFocus,
        firstTryRate,
        milestones,
        weeklySummary,
        guide,
        overallStats: {
            solvedCount,
            totalAttempts: totalAttemptsFromProgress,
            overallAccuracy,
            streakDays,
            averageSolveSeconds: topicInsights.length > 0
                ? Math.round(topicInsights.reduce((sum, item) => sum + item.avgSolveSeconds, 0) / topicInsights.length)
                : 0,
            totalTimeMinutes: safeNumber(progress?.total_time_minutes, 0),
        },
        personalizedHeader: {
            greeting: `Welcome back, ${userDisplayName}`,
            levelLabel: onboarding.currentLevel,
            weeklyGoal: `${weeklyGoal.weeklyProblems} problems`,
            dailyTime: `${dailyMinutes} min/day`,
        },
    };
}
