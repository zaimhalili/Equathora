import { supabase } from './supabaseClient';
import { calculateProblemXP } from './leaderboardService';
import { FaArrowAltCircleDown } from 'react-icons/fa';

/**
 * Database service for user progress using Supabase
 * Fully replaces localStorage-based progressStorage — no localStorage calls anywhere in this file.
 */

// ============================================================================
// USER PROGRESS
// ============================================================================

export async function getUserProgress() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

        if (error) throw error;
        if (!data) return createDefaultProgress();
        return data;
    } catch (error) {
        console.error('Error getting user progress:', error);
        return createDefaultProgress();
    }
}

export async function saveUserProgress(progress) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: session.user.id,
                ...progress,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) throw error;
    } catch (error) {
        console.error('Error saving user progress:', error);
    }
}

function createDefaultProgress() {
    return {
        total_problems: 0,
        solved_problems: [],
        correct_answers: 0,
        wrong_submissions: 0,
        total_attempts: 0,
        streak_days: 0,
        total_time_minutes: 0,
        concepts_learned: 0,
        perfect_streak: 0,
        reputation: 0,
        accuracy_rate: 0,
        last_reputation_streak: 0,
        total_xp: 0,
        account_created: Date.now()
    };
}

// ============================================================================
// COMPLETED PROBLEMS
// ============================================================================

export async function getCompletedProblems() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];

        const { data, error } = await supabase
            .from('user_completed_problems')
            .select('problem_id')
            .eq('user_id', session.user.id);

        if (error) throw error;

        const cleanedIds = (data || []).map(item => {
            const pid = item.problem_id;
            if (typeof pid === 'string' && pid.startsWith('{')) {
                try {
                    const parsed = JSON.parse(pid);
                    return String(parsed.problemId ?? parsed.id ?? '');
                } catch {
                    console.error('Failed to parse problem_id JSON:', pid);
                    return null;
                }
            }
            return String(pid);
        }).filter(id => id !== null && id !== '');

        let uniqueProblemIds = [...new Set(cleanedIds)];

        if (cleanedIds.length > uniqueProblemIds.length) {
            console.log(`Found ${cleanedIds.length - uniqueProblemIds.length} duplicate problem entries, cleaning up...`);
            await supabase
                .from('user_completed_problems')
                .delete()
                .eq('user_id', session.user.id);

            if (uniqueProblemIds.length > 0) {
                const uniqueEntries = uniqueProblemIds.map(pid => ({
                    user_id: session.user.id,
                    problem_id: pid,
                    completed_at: new Date().toISOString()
                }));

                await supabase
                    .from('user_completed_problems')
                    .insert(uniqueEntries);
            }
        }

        if (uniqueProblemIds.length === 0) {
            const { data: progressRow } = await supabase
                .from('user_progress')
                .select('solved_problems')
                .eq('user_id', session.user.id)
                .maybeSingle();

            if (progressRow && Array.isArray(progressRow.solved_problems) && progressRow.solved_problems.length > 0) {
                uniqueProblemIds = progressRow.solved_problems.map(id => String(id));
                console.log(`Loaded ${uniqueProblemIds.length} solved problems from user_progress fallback`);

                const entries = uniqueProblemIds.map(pid => ({
                    user_id: session.user.id,
                    problem_id: pid,
                    completed_at: new Date().toISOString()
                }));

                await supabase
                    .from('user_completed_problems')
                    .upsert(entries, { onConflict: 'user_id,problem_id' });
            }
        }

        return uniqueProblemIds;
    } catch (error) {
        console.error('Error getting completed problems:', error);
        return [];
    }
}

export async function markProblemComplete(problemId, timeSpentSeconds, difficulty, topic) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase
            .from('user_completed_problems')
            .upsert({
                user_id: session.user.id,
                problem_id: problemId,
                time_spent_seconds: timeSpentSeconds,
                difficulty,
                topic,
                completed_at: new Date().toISOString()
            }, { onConflict: 'user_id,problem_id' });

        if (error) throw error;
    } catch (error) {
        console.error('Error marking problem complete:', error);
    }
}

// ============================================================================
// FAVORITES
// ============================================================================

export async function getFavorites() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];

        const { data, error } = await supabase
            .from('user_favorites')
            .select('problem_id')
            .eq('user_id', session.user.id);

        if (error) throw error;
        return data.map(item => item.problem_id);
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
}

export const getFavoriteProblems = getFavorites;

export async function toggleFavorite(problemId) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { data: existing } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('problem_id', problemId)
            .single();

        if (existing) {
            const { error } = await supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', session.user.id)
                .eq('problem_id', problemId);

            if (error) throw error;
            return false;
        } else {
            const { error } = await supabase
                .from('user_favorites')
                .insert({
                    user_id: session.user.id,
                    problem_id: problemId
                });

            if (error) throw error;
            return true;
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return false;
    }
}

// ============================================================================
// STREAK DATA
// ============================================================================

const getEffectiveStreak = (currentStreak = 0, lastActivityDate = null) => {
    if (!currentStreak || currentStreak <= 0) return 0;
    if (!lastActivityDate) return currentStreak;

    const todayUtc = new Date();
    todayUtc.setUTCHours(0, 0, 0, 0);

    const lastUtc = new Date(lastActivityDate);
    if (Number.isNaN(lastUtc.getTime())) return currentStreak;
    lastUtc.setUTCHours(0, 0, 0, 0);

    const diffDays = Math.floor((todayUtc.getTime() - lastUtc.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? currentStreak : 0;
};

const toUtcDateKey = (dateValue = new Date()) => {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
};

const normalizeStreakDateKey = (rawValue) => {
    if (!rawValue) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) return rawValue;
    return toUtcDateKey(rawValue);
};

const getUtcDayDiff = (fromDateKey, toDateKey) => {
    if (!fromDateKey || !toDateKey) return null;

    const from = new Date(`${fromDateKey}T00:00:00.000Z`);
    const to = new Date(`${toDateKey}T00:00:00.000Z`);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;

    return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
};

export async function getStreakData() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return createDefaultStreak();

        const { data, error } = await supabase
            .from('user_streak_data')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

        if (error) throw error;

        const streak = data || createDefaultStreak();
        return {
            ...streak,
            current_streak: getEffectiveStreak(streak.current_streak || 0, streak.last_activity_date || null)
        };
    } catch (error) {
        console.error('Error getting streak data:', error);
        return createDefaultStreak();
    }
}

export async function updateStreakData(streakData) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase
            .from('user_streak_data')
            .upsert({
                user_id: session.user.id,
                ...streakData,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) throw error;
    } catch (error) {
        console.error('Error updating streak data:', error);
    }
}

export async function updateStreakForCorrectSolve() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return { ...createDefaultStreak(), previous_streak: 0, incremented: false };
        }

        const todayKey = toUtcDateKey(new Date());

        const { data: existing, error } = await supabase
            .from('user_streak_data')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

        if (error) throw error;

        const row = existing || createDefaultStreak();
        const previousCurrentRaw = Math.max(0, Number(row.current_streak || 0));
        const previousLongestRaw = Math.max(0, Number(row.longest_streak || 0));
        const previousLastDate = normalizeStreakDateKey(row.last_activity_date);
        const previousEffective = getEffectiveStreak(previousCurrentRaw, previousLastDate);

        let nextCurrent = previousCurrentRaw;
        let nextLongest = previousLongestRaw;
        let nextLastDate = previousLastDate;
        let nextStartDate = normalizeStreakDateKey(row.streak_start_date) || todayKey;
        let incremented = false;

        const dayDiff = previousLastDate ? getUtcDayDiff(previousLastDate, todayKey) : null;

        if (previousCurrentRaw <= 0 || !previousLastDate) {
            nextCurrent = 1;
            nextLastDate = todayKey;
            nextStartDate = todayKey;
            incremented = true;
        } else if (dayDiff === 1) {
            nextCurrent = previousCurrentRaw + 1;
            nextLastDate = todayKey;
            incremented = true;
        } else if (dayDiff === null || dayDiff > 1) {
            nextCurrent = 1;
            nextLastDate = todayKey;
            nextStartDate = todayKey;
            incremented = true;
        }

        nextLongest = Math.max(nextLongest, nextCurrent);

        const hasChanges =
            !existing ||
            incremented ||
            normalizeStreakDateKey(row.last_activity_date) !== nextLastDate ||
            Math.max(0, Number(row.current_streak || 0)) !== nextCurrent ||
            Math.max(0, Number(row.longest_streak || 0)) !== nextLongest ||
            normalizeStreakDateKey(row.streak_start_date) !== nextStartDate;

        if (hasChanges) {
            const { error: persistError } = await supabase
                .from('user_streak_data')
                .upsert({
                    user_id: session.user.id,
                    current_streak: nextCurrent,
                    longest_streak: nextLongest,
                    last_activity_date: nextLastDate,
                    streak_start_date: nextStartDate,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

            if (persistError) throw persistError;
        }

        return {
            current_streak: nextCurrent,
            longest_streak: nextLongest,
            last_activity_date: nextLastDate,
            streak_start_date: nextStartDate,
            previous_streak: previousEffective,
            incremented
        };
    } catch (error) {
        console.error('Error updating streak for correct solve:', error);
        return { ...createDefaultStreak(), previous_streak: 0, incremented: false };
    }
}

function createDefaultStreak() {
    return {
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: new Date().toISOString().split('T')[0],
        streak_start_date: new Date().toISOString().split('T')[0]
    };
}

// ============================================================================
// SUBMISSIONS
// ============================================================================

export async function saveSubmission(problemId, submittedAnswer, isCorrect, timeSpentSeconds, metadata = {}, steps = []) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const basePayload = {
            user_id: session.user.id,
            problem_id: problemId,
            submitted_answer: submittedAnswer,
            is_correct: isCorrect,
            time_spent_seconds: timeSpentSeconds,
            submitted_at: new Date().toISOString(),
            steps: steps
        };

        const normalizedTopic = typeof metadata.topic === 'string' ? metadata.topic.trim() : '';
        const normalizedDifficulty = typeof metadata.difficulty === 'string' ? metadata.difficulty.trim() : '';

        const hasAnalyticsMetadata = Boolean(normalizedTopic || normalizedDifficulty);
        const payloadCandidates = hasAnalyticsMetadata
            ? [
                {
                    ...basePayload,
                    ...(normalizedTopic ? { topic: normalizedTopic, problem_topic: normalizedTopic } : {}),
                    ...(normalizedDifficulty ? { difficulty: normalizedDifficulty, problem_difficulty: normalizedDifficulty } : {})
                },
                {
                    ...basePayload,
                    ...(normalizedTopic ? { topic: normalizedTopic } : {}),
                    ...(normalizedDifficulty ? { difficulty: normalizedDifficulty } : {})
                },
                {
                    ...basePayload,
                    ...(normalizedTopic ? { problem_topic: normalizedTopic } : {}),
                    ...(normalizedDifficulty ? { problem_difficulty: normalizedDifficulty } : {})
                },
                basePayload
            ]
            : [basePayload];

        let lastError = null;
        for (const candidate of payloadCandidates) {
            const { error } = await supabase
                .from('user_submissions')
                .insert(candidate);

            if (!error) return;
            lastError = error;
        }

        if (lastError) throw lastError;
    } catch (error) {
        console.error('Error saving submission:', error);
    }
}

export async function getUserSubmissions(problemId = null) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];

        let query = supabase
            .from('user_submissions')
            .select('*')
            .eq('user_id', session.user.id)
            .order('submitted_at', { ascending: false });

        if (problemId) {
            query = query.eq('problem_id', problemId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error getting submissions:', error);
        return [];
    }
}

// ============================================================================
// TOPIC FREQUENCY
// ============================================================================

export async function getTopicFrequency() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];

        const { data, error } = await supabase
            .from('user_topic_frequency')
            .select('topic, count')
            .eq('user_id', session.user.id);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error getting topic frequency:', error);
        return [];
    }
}

export async function incrementTopicFrequency(topic) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: existing } = await supabase
            .from('user_topic_frequency')
            .select('count')
            .eq('user_id', session.user.id)
            .eq('topic', topic)
            .single();

        if (existing) {
            const { error } = await supabase
                .from('user_topic_frequency')
                .update({ count: existing.count + 1, updated_at: new Date().toISOString() })
                .eq('user_id', session.user.id)
                .eq('topic', topic);

            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('user_topic_frequency')
                .insert({ user_id: session.user.id, topic, count: 1 });

            if (error) throw error;
        }
    } catch (error) {
        console.error('Error incrementing topic frequency:', error);
    }
}

// ============================================================================
// WEEKLY PROGRESS
// ============================================================================

export async function getWeeklyProgress() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return Array(7).fill(0);

        const weekStart = getWeekStartDate();

        const { data, error } = await supabase
            .from('user_weekly_progress')
            .select('day_index, count')
            .eq('user_id', session.user.id)
            .eq('week_start_date', weekStart);

        if (error) throw error;

        const weekly = Array(7).fill(0);
        data.forEach(item => {
            if (item.day_index >= 0 && item.day_index <= 6) {
                weekly[item.day_index] = item.count;
            }
        });
        return weekly;
    } catch (error) {
        console.error('Error getting weekly progress:', error);
        return Array(7).fill(0);
    }
}

export async function incrementWeeklyProgress(dayIndex) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const weekStart = getWeekStartDate();

        const { data: existing } = await supabase
            .from('user_weekly_progress')
            .select('count')
            .eq('user_id', session.user.id)
            .eq('day_index', dayIndex)
            .eq('week_start_date', weekStart)
            .single();

        if (existing) {
            const { error } = await supabase
                .from('user_weekly_progress')
                .update({ count: existing.count + 1, updated_at: new Date().toISOString() })
                .eq('user_id', session.user.id)
                .eq('day_index', dayIndex)
                .eq('week_start_date', weekStart);

            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('user_weekly_progress')
                .insert({ user_id: session.user.id, day_index: dayIndex, count: 1, week_start_date: weekStart });

            if (error) throw error;
        }
    } catch (error) {
        console.error('Error incrementing weekly progress:', error);
    }
}

function getWeekStartDate() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
    return weekStart.toISOString().split('T')[0];
}

// ============================================================================
// DIFFICULTY BREAKDOWN
// ============================================================================

const normalizeDifficultyBucket = (difficulty) => {
    const normalized = String(difficulty || '').trim().toLowerCase();

    if (normalized === 'beginner' || normalized === 'easy') return 'easy';
    if (normalized === 'standard' || normalized === 'intermediate' || normalized === 'medium') return 'medium';
    if (normalized === 'challenging' || normalized === 'hard' || normalized === 'advanced' || normalized === 'expert') return 'hard';

    return 'medium';
};

export async function getDifficultyBreakdown() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return { easy: 0, medium: 0, hard: 0 };

        const { data, error } = await supabase
            .from('user_difficulty_breakdown')
            .select('difficulty, count')
            .eq('user_id', session.user.id);

        if (error) throw error;

        const breakdown = { easy: 0, medium: 0, hard: 0 };
        data.forEach(item => {
            if (item.difficulty in breakdown) {
                breakdown[item.difficulty] = item.count;
            }
        });
        return breakdown;
    } catch (error) {
        console.error('Error getting difficulty breakdown:', error);
        return { easy: 0, medium: 0, hard: 0 };
    }
}

export async function incrementDifficultyBreakdown(difficulty) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const difficultyBucket = normalizeDifficultyBucket(difficulty);

        const { data: existing } = await supabase
            .from('user_difficulty_breakdown')
            .select('count')
            .eq('user_id', session.user.id)
            .eq('difficulty', difficultyBucket)
            .single();

        if (existing) {
            const { error } = await supabase
                .from('user_difficulty_breakdown')
                .update({ count: existing.count + 1, updated_at: new Date().toISOString() })
                .eq('user_id', session.user.id)
                .eq('difficulty', difficultyBucket);

            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('user_difficulty_breakdown')
                .insert({ user_id: session.user.id, difficulty: difficultyBucket, count: 1 });

            if (error) throw error;
        }
    } catch (error) {
        console.error('Error incrementing difficulty breakdown:', error);
    }
}

// ============================================================================
// SOLUTION VIEWS / IN-PROGRESS
// ============================================================================

export async function hasViewedSolutionDb(problemId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    const { data } = await supabase
        .from('user_solution_views')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('problem_id', String(problemId))
        .maybeSingle();
    return !!data;
}

export async function markSolutionViewedDb(problemId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase
        .from('user_solution_views')
        .upsert({ user_id: session.user.id, problem_id: String(problemId) }, { onConflict: 'user_id,problem_id' });
}

export async function markProblemInProgressDb(problemId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase
        .from('user_in_progress_problems')
        .upsert({ user_id: session.user.id, problem_id: String(problemId) }, { onConflict: 'user_id,problem_id' });
}

export async function removeProblemFromInProgressDb(problemId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase
        .from('user_in_progress_problems')
        .delete()
        .eq('user_id', session.user.id)
        .eq('problem_id', String(problemId));
}

// ============================================================================
// ACHIEVEMENT PROGRESS SNAPSHOT
// ============================================================================

export async function getAchievementProgress() {
    try {
        const [progress, topicFreq, weekly, difficulty, streak, completedProblemIds] = await Promise.all([
            getUserProgress(),
            getTopicFrequency(),
            getWeeklyProgress(),
            getDifficultyBreakdown(),
            getStreakData(),
            getCompletedProblems()
        ]);

        const uniqueCompletedIds = Array.isArray(completedProblemIds)
            ? Array.from(new Set(completedProblemIds.map(id => String(id))))
            : [];

        return {
            ...progress,
            topicFrequency: topicFreq,
            weeklyProgress: weekly,
            difficultyBreakdown: difficulty,
            currentStreak: streak.current_streak,
            longestStreak: streak.longest_streak,
            solved_problems: uniqueCompletedIds,
            problemsSolved: uniqueCompletedIds.length
        };
    } catch (error) {
        console.error('Error getting achievement progress:', error);
        return createDefaultProgress();
    }
}

// ============================================================================
// PROBLEM STATS - This function is called after a problem submission to update all relevant stats in the database
// ============================================================================

const formatHoursMinutes = (totalMinutes) => {
    const minutes = Math.max(0, Math.round(totalMinutes));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
};

const getWeekdayIndex = (date) => {
    const day = new Date(date).getDay();
    return day === 0 ? 6 : day - 1; // Monday -> 0 ... Sunday -> 6
};

export async function recordProblemStats(
    problem,
    {
        isCorrect = false,
        timeSpentSeconds = 0,
        timestamp = new Date().toISOString(),
        attemptNumber = 1,
        streakData = null,
        hintsUsed = 0,
        solutionViewed = false
    } = {}
) {
    if (!problem) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    const userId = session.user.id;

    const completedIds = await getCompletedProblems();
    const alreadySolved = completedIds.includes(String(problem.id));
    if (alreadySolved && isCorrect) {
        console.log('Practice mode submission, skipping stats update for problem', problem.id);
        return null;
    }

    const { data: dbProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (fetchError) {
        console.error('Failed to fetch user_progress:', fetchError);
    }

    const currentTotalAttempts = Number(dbProgress?.total_attempts ?? 0);
    const currentCorrectAnswers = Number(dbProgress?.correct_answers ?? 0);
    const currentWrongSubmissions = Number(dbProgress?.wrong_submissions ?? 0);
    const currentPerfectStreak = Number(dbProgress?.perfect_streak ?? 0);
    const currentReputation = Number(dbProgress?.reputation ?? 0);
    const currentLastReputationStreak = Number(dbProgress?.last_reputation_streak ?? 0);
    const currentTotalXP = Number(dbProgress?.total_xp ?? 0);
    const currentTimeMinutes = Number(dbProgress?.total_time_minutes ?? 0);

    const totalAttempts = currentTotalAttempts + 1;
    let correctAnswers = currentCorrectAnswers;
    let wrongSubmissions = currentWrongSubmissions;
    let perfectStreak = currentPerfectStreak;
    let reputation = currentReputation;
    let lastReputationStreak = currentLastReputationStreak;

    if (isCorrect) {
        if (!alreadySolved) correctAnswers += 1;
        wrongSubmissions = currentWrongSubmissions;
    } else {
        wrongSubmissions += 1;
    }

    const correctSubmissions = totalAttempts - wrongSubmissions;
    const accuracyRate = totalAttempts > 0
        ? Math.round((correctSubmissions / totalAttempts) * 100)
        : 0;

    let problemXP = 0;
    if (isCorrect && !alreadySolved) {
        const xpResult = calculateProblemXP(
            problem.difficulty,
            timeSpentSeconds,
            attemptNumber === 1,
            hintsUsed,
            solutionViewed
        );
        problemXP = xpResult.totalXP;
    }
    const totalXP = currentTotalXP + problemXP;

    const minutesSpent = Math.max(1, Math.round(timeSpentSeconds / 60));
    const updatedTotalTimeMinutes = currentTimeMinutes + minutesSpent;

    if (isCorrect && !alreadySolved && attemptNumber === 1) {
        perfectStreak += 1;
    } else if (!isCorrect) {
        perfectStreak = 0;
    }

    if (isCorrect && !alreadySolved) {
        reputation += 20;
    }
    if (streakData && typeof streakData.current === 'number') {
        const previous = lastReputationStreak || 0;
        if (streakData.current > previous) {
            reputation += (streakData.current - previous) * 2;
            lastReputationStreak = streakData.current;
        }
    }

    const { error: upsertError } = await supabase
        .from('user_progress')
        .upsert({
            user_id: userId,
            total_attempts: totalAttempts,
            correct_answers: correctAnswers,
            wrong_submissions: wrongSubmissions,
            accuracy_rate: accuracyRate,
            reputation,
            perfect_streak: perfectStreak,
            last_reputation_streak: lastReputationStreak,
            total_xp: totalXP,
            total_time_minutes: updatedTotalTimeMinutes,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

    if (upsertError) {
        console.error('Failed to upsert user_progress:', upsertError);
    }

    const weekdayIndex = getWeekdayIndex(timestamp);
    if (isCorrect && !alreadySolved) {
        try { await incrementWeeklyProgress(weekdayIndex); }
        catch (e) { console.error('Failed to increment weekly progress:', e); }
    }

    const topicKey = problem.topic || 'General Concepts';
    if (isCorrect && !alreadySolved) {
        try { await incrementTopicFrequency(topicKey); }
        catch (e) { console.error('Failed to increment topic frequency:', e); }
    }

    if (isCorrect && !alreadySolved) {
        try { await incrementDifficultyBreakdown(problem.difficulty); }
        catch (e) { console.error('Failed to increment difficulty breakdown:', e); }
    }

    return {
        totalAttempts,
        correctAnswers,
        wrongSubmissions,
        accuracyRate,
        reputation,
        perfectStreak,
        totalXP,
        totalTimeMinutes: updatedTotalTimeMinutes,
        totalTimeSpent: formatHoursMinutes(updatedTotalTimeMinutes)
    };
}

// ============================================================================
// GET USER STATS — used by achievement checks, fully Supabase
// ============================================================================

export async function getUserStats() {
    return await getAchievementProgress();
}

export async function getInProgressProblemsDb() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];
    const { data } = await supabase
        .from('user_in_progress_problems')
        .select('problem_id')
        .eq('user_id', session.user.id);
    return (data || []).map(r => String(r.problem_id));
}

// Get started onboarding supabase calls

// Student Profile Methods
export async function getStudentProfile() {
    try {
        const {
            data: { user }
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('student_profile')
            .select(`
                onboarding_completed,
                goal,
                level,
                weekly_commitment,
                preferred_challenge,
                adaptive_learning_enabled
            `)
            .eq('id', user.id)
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error getting student profile:", error);
        return null;
    }
}

// Student Topics Methods
export async function getStudentTopics() {
    try {
        const {
            data: { user }
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('student_topics')
            .select('topic')
            .eq('student_id', user.id);

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error getting student topics:", error);
        return [];
    }
}

