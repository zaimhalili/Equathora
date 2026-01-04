import { supabase } from './supabaseClient';

/**
 * Leaderboard Service for Equathora
 * Handles XP calculation, ranking, and leaderboard data
 */

// ============================================================================
// XP CALCULATION SYSTEM
// ============================================================================

/**
 * Calculate total XP for a user based on their progress
 * XP Formula:
 * - Base XP: solved_problems * 50
 * - Accuracy Bonus: (correct_answers / total_attempts) * 500
 * - Streak Bonus: current_streak * 10
 * - Reputation: reputation points (earned through achievements)
 * - Perfect Streak Bonus: perfect_streak * 20
 */
export function calculateUserXP(userProgress, streakData) {
    if (!userProgress) return 0;

    const solvedProblems = Array.isArray(userProgress.solved_problems) 
        ? userProgress.solved_problems.length 
        : 0;
    
    const correctAnswers = userProgress.correct_answers || 0;
    const totalAttempts = userProgress.total_attempts || 0;
    const reputation = userProgress.reputation || 0;
    const perfectStreak = userProgress.perfect_streak || 0;
    
    const currentStreak = streakData?.current_streak || 0;

    // Calculate XP components
    const baseXP = solvedProblems * 50;
    const accuracyBonus = totalAttempts > 0 
        ? Math.round((correctAnswers / totalAttempts) * 500) 
        : 0;
    const streakBonus = currentStreak * 10;
    const reputationXP = reputation;
    const perfectStreakBonus = perfectStreak * 20;

    const totalXP = baseXP + accuracyBonus + streakBonus + reputationXP + perfectStreakBonus;

    return {
        totalXP,
        breakdown: {
            baseXP,
            accuracyBonus,
            streakBonus,
            reputationXP,
            perfectStreakBonus
        }
    };
}

/**
 * Calculate XP for a specific problem completion
 */
export function calculateProblemXP(difficulty, timeSpentSeconds, isFirstAttempt) {
    let baseXP = 0;
    
    // Base XP by difficulty
    switch (difficulty?.toLowerCase()) {
        case 'easy':
            baseXP = 50;
            break;
        case 'medium':
            baseXP = 100;
            break;
        case 'hard':
            baseXP = 200;
            break;
        default:
            baseXP = 50;
    }

    // First attempt bonus (50% extra)
    const firstAttemptBonus = isFirstAttempt ? Math.round(baseXP * 0.5) : 0;

    // Speed bonus (if completed quickly)
    let speedBonus = 0;
    if (timeSpentSeconds && timeSpentSeconds < 300) { // Under 5 minutes
        speedBonus = 25;
    }

    return {
        totalXP: baseXP + firstAttemptBonus + speedBonus,
        breakdown: {
            baseXP,
            firstAttemptBonus,
            speedBonus
        }
    };
}

// ============================================================================
// LEADERBOARD DATA FETCHING
// ============================================================================

/**
 * Build a lookup of user metadata from the `profiles` table when available.
 * Falls back to empty map if the table is missing or returns an error.
 */
async function getProfileMap(userIds = []) {
    if (!userIds.length) return {};

    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);

    if (error) {
        console.warn('profiles lookup failed, falling back to ids only:', error.message);
        return {};
    }

    return (data || []).reduce((acc, profile) => {
        acc[profile.id] = {
            name: profile.full_name || profile.username || 'Student',
            avatarUrl: profile.avatar_url || ''
        };
        return acc;
    }, {});
}

/**
 * Get global leaderboard using the backend `leaderboard_view` (materialized view)
 * to avoid client-side XP computation and hard-coded data.
 */
export async function getGlobalLeaderboard(limit = 100) {
    try {
        const { data, error } = await supabase
            .from('leaderboard_view')
            .select('*')
            .order('rank', { ascending: true })
            .limit(limit);

        if (error) {
            console.error('Error fetching leaderboard_view:', error);
            return [];
        }

        const rows = data || [];
        const userIds = rows.map(r => r.user_id).filter(Boolean);
        const profileMap = await getProfileMap(userIds);

        return rows.map((row, index) => {
            const profile = profileMap[row.user_id] || {};
            const problemsSolved = typeof row.problems_solved_count === 'number'
                ? row.problems_solved_count
                : Array.isArray(row.solved_problems)
                    ? row.solved_problems.length
                    : 0;

            return {
                userId: row.user_id,
                name: profile.name || `Student-${String(row.user_id).slice(0, 6)}`,
                avatarUrl: profile.avatarUrl || '',
                xp: row.total_xp || 0,
                xpBreakdown: {},
                problemsSolved,
                accuracy: row.accuracy_percentage || 0,
                reputation: row.reputation || 0,
                currentStreak: row.current_streak || 0,
                rank: row.rank || index + 1
            };
        });
    } catch (error) {
        console.error('Error getting global leaderboard:', error);
        return [];
    }
}

/**
 * Get current user's rank and stats
 */
export async function getCurrentUserRank() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;
        const { data, error } = await supabase
            .from('leaderboard_view')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

        if (error) {
            console.error('Error fetching current user rank:', error);
            return null;
        }

        if (!data) return null;

        const profileMap = await getProfileMap([session.user.id]);
        const profile = profileMap[session.user.id] || {};

        const problemsSolved = typeof data.problems_solved_count === 'number'
            ? data.problems_solved_count
            : Array.isArray(data.solved_problems)
                ? data.solved_problems.length
                : 0;

        return {
            userId: data.user_id,
            name: profile.name || `Student-${String(session.user.id).slice(0, 6)}`,
            avatarUrl: profile.avatarUrl || '',
            xp: data.total_xp || 0,
            problemsSolved,
            accuracy: data.accuracy_percentage || 0,
            reputation: data.reputation || 0,
            currentStreak: data.current_streak || 0,
            rank: data.rank || 0
        };
    } catch (error) {
        console.error('Error getting current user rank:', error);
        return null;
    }
}

/**
 * Get friends leaderboard (users who are friends with current user)
 * Note: Requires friends table to be implemented first
 */
export async function getFriendsLeaderboard() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];
        // Attempt to read a friendships table if it exists. If not, fall back to an empty list.
        const { data: friends, error: friendsError } = await supabase
            .from('friends')
            .select('friend_id')
            .eq('user_id', session.user.id);

        if (friendsError) {
            console.warn('Friends table not available, skipping friends leaderboard:', friendsError.message);
            return [];
        }

        const friendIds = (friends || []).map(f => f.friend_id).filter(Boolean);
        const targetIds = Array.from(new Set([session.user.id, ...friendIds]));

        if (!targetIds.length) return [];

        const { data, error } = await supabase
            .from('leaderboard_view')
            .select('*')
            .in('user_id', targetIds)
            .order('rank', { ascending: true });

        if (error) {
            console.error('Error fetching friends leaderboard:', error);
            return [];
        }

        const profileMap = await getProfileMap(targetIds);

        return (data || []).map((row, index) => ({
            userId: row.user_id,
            name: (profileMap[row.user_id]?.name) || `Student-${String(row.user_id).slice(0, 6)}`,
            avatarUrl: profileMap[row.user_id]?.avatarUrl || '',
            xp: row.total_xp || 0,
            problemsSolved: typeof row.problems_solved_count === 'number' ? row.problems_solved_count : 0,
            accuracy: row.accuracy_percentage || 0,
            reputation: row.reputation || 0,
            currentStreak: row.current_streak || 0,
            rank: row.rank || index + 1
        }));
    } catch (error) {
        console.error('Error getting friends leaderboard:', error);
        return [];
    }
}

/**
 * Get top solvers for specific categories
 */
export async function getTopSolvers(category = 'overall', limit = 50) {
    try {
        const leaderboard = await getGlobalLeaderboard(limit);

        switch (category.toLowerCase()) {
            case 'accuracy':
                return [...leaderboard].sort((a, b) => b.accuracy - a.accuracy);
            case 'streak':
                return [...leaderboard].sort((a, b) => b.currentStreak - a.currentStreak);
            case 'overall':
            default:
                return leaderboard; // Already ordered by XP/rank from the view
        }
    } catch (error) {
        console.error('Error getting top solvers:', error);
        return [];
    }
}

/**
 * Update leaderboard RLS policies helper
 * This should be run in Supabase SQL editor to allow public reading of leaderboard data
 */
export const getLeaderboardPoliciesSQL = () => {
    return `
-- Allow public read access to user_progress for leaderboard
CREATE POLICY "Public users can view leaderboard data" ON user_progress
FOR SELECT
USING (true);

-- Allow public read access to user_streak_data for leaderboard
CREATE POLICY "Public users can view streak leaderboard data" ON user_streak_data
FOR SELECT
USING (true);
`;
};

// ============================================================================
// LEADERBOARD CACHING (Optional - for performance)
// ============================================================================

let leaderboardCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 1 minute

/**
 * Get cached leaderboard or fetch new data
 */
export async function getCachedGlobalLeaderboard(forceRefresh = false) {
    const now = Date.now();
    
    if (!forceRefresh && leaderboardCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
        return leaderboardCache;
    }

    const leaderboard = await getGlobalLeaderboard();
    leaderboardCache = leaderboard;
    cacheTimestamp = now;

    return leaderboard;
}

/**
 * Clear leaderboard cache (call after user updates their progress)
 */
export function clearLeaderboardCache() {
    leaderboardCache = null;
    cacheTimestamp = null;
}
