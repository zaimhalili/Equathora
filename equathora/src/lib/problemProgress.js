/**
 * Shared problem-state logic, used by TopicCard (per-topic circles) and
 * Journey/DailyTrack (finding the single overall "next problem" to show).
 * Keeping this in one place means the "next problem" DailyTrack shows is
 * always the exact same one TopicCard marks as "current".
 *
 * Expects `problems` to already be sorted by difficulty (buildJourney in
 * Journey.jsx does this) since order determines which untouched problem
 * counts as "current" vs "locked".
 */
export function annotateProblemStates(problems, completedSet, attemptedSet) {
    let foundCurrent = false;

    return problems.map(problem => {
        const solved = completedSet.has(String(problem.id));
        const attempted = attemptedSet.has(String(problem.id));

        let state;

        if (solved) {
            state = "solved";
        }
        else if (attempted) {
            // Any attempted-but-unsolved problem is "in progress", regardless
            // of where it falls in the list.
            state = "progress";
        }
        else if (!foundCurrent) {
            // The first untouched problem is the one the student should do next.
            state = "current";
            foundCurrent = true;
        }
        else {
            state = "locked";
        }

        return {
            ...problem,
            state
        };
    });
}

/**
 * Fallback time estimate by difficulty, used only when a problem doesn't
 * carry its own `estimated_time` from the backend. Harder problems take
 * longer — a flat "5–10 min" for every difficulty was misleading.
 */
const DIFFICULTY_TIME_ESTIMATES = {
    Beginner: "5–8 min",
    Easy: "8–12 min",
    Standard: "10–15 min",
    Intermediate: "12–18 min",
    Medium: "15–20 min",
    Challenging: "20–30 min",
    Hard: "25–35 min",
    Advanced: "30–45 min"
};

export function getEstimatedTime(difficulty) {
    return DIFFICULTY_TIME_ESTIMATES[difficulty] ?? "10–15 min";
}

/**
 * Fallback XP reward by difficulty, used only when a problem doesn't carry
 * its own `xp` from the backend. A flat "25 XP" for every difficulty made
 * harder problems feel not worth doing relative to easy ones.
 */
const DIFFICULTY_XP_ESTIMATES = {
    Beginner: 10,
    Easy: 15,
    Standard: 20,
    Intermediate: 25,
    Medium: 35,
    Challenging: 45,
    Hard: 60,
    Advanced: 80
};

export function getEstimatedXp(difficulty) {
    return DIFFICULTY_XP_ESTIMATES[difficulty] ?? 25;
}

/**
 * Fallback daily goal (in minutes), derived from the student's own
 * weekly_commitment answer from onboarding, rather than a flat number
 * for every student. Only used when the backend doesn't already supply
 * a daily_goal_minutes value via getUserProgress().
 *
 * Rough basis: weekly hours / 7 days, rounded to a friendly number.
 */
const WEEKLY_COMMITMENT_TO_DAILY_MINUTES = {
    "under-1": 10,
    "1-3": 20,
    "3-6": 40,
    "6+": 60
};

export function estimateDailyGoalMinutes(weeklyCommitment) {
    return WEEKLY_COMMITMENT_TO_DAILY_MINUTES[weeklyCommitment] ?? 20;
}