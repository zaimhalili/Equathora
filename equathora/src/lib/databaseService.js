import { supabase } from './supabaseClient';

/**
 * Database service for user progress using Supabase
 * Replaces localStorage-based progressStorage
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

        // PostgREST returns 406 when no rows with single(); maybeSingle avoids that
        if (error) throw error;

        // Return default if no data
        if (!data) {
            return createDefaultProgress();
        }

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

        // Clean corrupted data: extract IDs from both simple strings and JSON objects
        const cleanedIds = data.map(item => {
            const pid = item.problem_id;
            // If it's a JSON string, parse it and extract problemId
            if (typeof pid === 'string' && pid.startsWith('{')) {
                try {
                    const parsed = JSON.parse(pid);
                    return String(parsed.problemId ?? parsed.id ?? '');
                } catch (e) {
                    console.error('Failed to parse problem_id JSON:', pid);
                    return null;
                }
            }
            // Otherwise use as is
            return String(pid);
        }).filter(id => id !== null && id !== '');

        // Ensure we only return UNIQUE problem IDs to prevent duplicate counts
        const uniqueProblemIds = [...new Set(cleanedIds)];
        return uniqueProblemIds;
    } catch (error) {
        console.error('Error getting completed problems:', error);
        return [];
    }
}

export async function recordSubmission(problemId, submittedAnswer, isCorrect, timeSpentSeconds) {
    // Best-effort: persist the submission and increment progress counters.
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const normalizedProblemId = String(problemId);

        await saveSubmission(
            normalizedProblemId,
            submittedAnswer,
            Boolean(isCorrect),
            Number.isFinite(timeSpentSeconds) ? timeSpentSeconds : 0
        );

        const current = await getUserProgress();

        const nextTotalAttempts = (current?.total_attempts || 0) + 1;
        const nextCorrect = (current?.correct_answers || 0) + (isCorrect ? 1 : 0);
        const nextWrong = (current?.wrong_submissions || 0) + (isCorrect ? 0 : 1);
        const nextAccuracyRate = nextTotalAttempts > 0
            ? Math.round((nextCorrect / nextTotalAttempts) * 100)
            : 0;

        await saveUserProgress({
            total_attempts: nextTotalAttempts,
            correct_answers: nextCorrect,
            wrong_submissions: nextWrong,
            accuracy_rate: nextAccuracyRate
        });
    } catch (error) {
        console.error('Error recording submission:', error);
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

// Alias for consistency
export const getFavoriteProblems = getFavorites;

export async function toggleFavorite(problemId) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        // Check if already favorited
        const { data: existing } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('problem_id', problemId)
            .single();

        if (existing) {
            // Remove from favorites
            const { error } = await supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', session.user.id)
                .eq('problem_id', problemId);

            if (error) throw error;
            return false; // now unfavorited
        } else {
            // Add to favorites
            const { error } = await supabase
                .from('user_favorites')
                .insert({
                    user_id: session.user.id,
                    problem_id: problemId
                });

            if (error) throw error;
            return true; // now favorited
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return false;
    }
}

// ============================================================================
// STREAK DATA
// ============================================================================

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

        return data || createDefaultStreak();
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

export async function saveSubmission(problemId, submittedAnswer, isCorrect, timeSpentSeconds) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase
            .from('user_submissions')
            .insert({
                user_id: session.user.id,
                problem_id: problemId,
                submitted_answer: submittedAnswer,
                is_correct: isCorrect,
                time_spent_seconds: timeSpentSeconds,
                submitted_at: new Date().toISOString()
            });

        if (error) throw error;
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

        // Check if topic exists
        const { data: existing } = await supabase
            .from('user_topic_frequency')
            .select('count')
            .eq('user_id', session.user.id)
            .eq('topic', topic)
            .single();

        if (existing) {
            // Increment
            const { error } = await supabase
                .from('user_topic_frequency')
                .update({
                    count: existing.count + 1,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', session.user.id)
                .eq('topic', topic);

            if (error) throw error;
        } else {
            // Insert new
            const { error } = await supabase
                .from('user_topic_frequency')
                .insert({
                    user_id: session.user.id,
                    topic,
                    count: 1
                });

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

        // Check if entry exists
        const { data: existing } = await supabase
            .from('user_weekly_progress')
            .select('count')
            .eq('user_id', session.user.id)
            .eq('day_index', dayIndex)
            .eq('week_start_date', weekStart)
            .single();

        if (existing) {
            // Increment
            const { error } = await supabase
                .from('user_weekly_progress')
                .update({
                    count: existing.count + 1,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', session.user.id)
                .eq('day_index', dayIndex)
                .eq('week_start_date', weekStart);

            if (error) throw error;
        } else {
            // Insert new
            const { error } = await supabase
                .from('user_weekly_progress')
                .insert({
                    user_id: session.user.id,
                    day_index: dayIndex,
                    count: 1,
                    week_start_date: weekStart
                });

            if (error) throw error;
        }
    } catch (error) {
        console.error('Error incrementing weekly progress:', error);
    }
}

function getWeekStartDate() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek;
    const weekStart = new Date(now.setDate(diff));
    return weekStart.toISOString().split('T')[0];
}

// ============================================================================
// DIFFICULTY BREAKDOWN
// ============================================================================

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

        // Check if entry exists
        const { data: existing } = await supabase
            .from('user_difficulty_breakdown')
            .select('count')
            .eq('user_id', session.user.id)
            .eq('difficulty', difficulty)
            .single();

        if (existing) {
            // Increment
            const { error } = await supabase
                .from('user_difficulty_breakdown')
                .update({
                    count: existing.count + 1,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', session.user.id)
                .eq('difficulty', difficulty);

            if (error) throw error;
        } else {
            // Insert new
            const { error } = await supabase
                .from('user_difficulty_breakdown')
                .insert({
                    user_id: session.user.id,
                    difficulty,
                    count: 1
                });

            if (error) throw error;
        }
    } catch (error) {
        console.error('Error incrementing difficulty breakdown:', error);
    }
}

// ============================================================================
// HELPER: Get full achievement progress snapshot
// ============================================================================

export async function getAchievementProgress() {
    try {
        const [progress, topicFreq, weekly, difficulty, streak] = await Promise.all([
            getUserProgress(),
            getTopicFrequency(),
            getWeeklyProgress(),
            getDifficultyBreakdown(),
            getStreakData()
        ]);

        return {
            ...progress,
            topicFrequency: topicFreq,
            weeklyProgress: weekly,
            difficultyBreakdown: difficulty,
            currentStreak: streak.current_streak,
            longestStreak: streak.longest_streak
        };
    } catch (error) {
        console.error('Error getting achievement progress:', error);
        return createDefaultProgress();
    }
}
