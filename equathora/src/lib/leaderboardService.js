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
 * Get global leaderboard with rankings
 * Returns top users sorted by XP with rank information
 */
export async function getGlobalLeaderboard(limit = 100) {
    try {
        // First, check if we can read all user_progress (need public read policy)
        const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('user_id, solved_problems, correct_answers, wrong_submissions, total_attempts, reputation, perfect_streak')
            .order('reputation', { ascending: false })
            .limit(limit);

        if (progressError) {
            console.error('Error fetching progress data:', progressError);
            return [];
        }

        // Get streak data for all users
        const { data: streakData, error: streakError } = await supabase
            .from('user_streak_data')
            .select('user_id, current_streak');

        if (streakError) {
            console.error('Error fetching streak data:', streakError);
        }

        // Create a map of user_id to streak
        const streakMap = {};
        if (streakData) {
            streakData.forEach(streak => {
                streakMap[streak.user_id] = streak.current_streak || 0;
            });
        }

        // Get user metadata (names, avatars) from auth.users
        const userIds = progressData.map(p => p.user_id);
        const { data: usersData, error: usersError } = await supabase
            .from('auth.users')
            .select('id, email, raw_user_meta_data')
            .in('id', userIds);

        // Fallback: try to get from session if auth.users query fails
        let usersMap = {};
        if (usersError || !usersData) {
            // We'll need to build a map from available data
            // For now, use generic names
            progressData.forEach(p => {
                usersMap[p.user_id] = {
                    name: 'Student',
                    email: 'user@example.com',
                    avatar_url: ''
                };
            });
        } else {
            usersData.forEach(user => {
                usersMap[user.id] = {
                    name: user.raw_user_meta_data?.full_name || 
                          user.raw_user_meta_data?.name || 
                          user.email?.split('@')[0] || 
                          'Student',
                    email: user.email,
                    avatar_url: user.raw_user_meta_data?.avatar_url || ''
                };
            });
        }

        // Calculate XP for each user
        const leaderboardData = progressData.map(progress => {
            const xpData = calculateUserXP(progress, { current_streak: streakMap[progress.user_id] });
            const userData = usersMap[progress.user_id] || { name: 'Student', email: '', avatar_url: '' };
            
            const solvedCount = Array.isArray(progress.solved_problems) 
                ? progress.solved_problems.length 
                : 0;

            return {
                userId: progress.user_id,
                name: userData.name,
                email: userData.email,
                avatarUrl: userData.avatar_url,
                xp: xpData.totalXP,
                xpBreakdown: xpData.breakdown,
                problemsSolved: solvedCount,
                accuracy: progress.total_attempts > 0 
                    ? Math.round((progress.correct_answers / progress.total_attempts) * 100) 
                    : 0,
                reputation: progress.reputation || 0,
                currentStreak: streakMap[progress.user_id] || 0
            };
        });

        // Sort by XP (descending)
        leaderboardData.sort((a, b) => b.xp - a.xp);

        // Add rank to each entry
        const rankedData = leaderboardData.map((entry, index) => ({
            ...entry,
            rank: index + 1
        }));

        return rankedData;
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

        const leaderboard = await getGlobalLeaderboard();
        const userEntry = leaderboard.find(entry => entry.userId === session.user.id);

        return userEntry || null;
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

        // TODO: Implement when friends table exists
        // For now, return empty array
        console.log('Friends leaderboard not yet implemented - awaiting friends table');
        return [];
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

        // Sort based on category
        switch (category.toLowerCase()) {
            case 'accuracy':
                return leaderboard.sort((a, b) => b.accuracy - a.accuracy);
            case 'speed':
                // Speed would require tracking average time per problem
                // For now, use problems solved as proxy
                return leaderboard.sort((a, b) => b.problemsSolved - a.problemsSolved);
            case 'streak':
                return leaderboard.sort((a, b) => b.currentStreak - a.currentStreak);
            case 'overall':
            default:
                return leaderboard; // Already sorted by XP
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
