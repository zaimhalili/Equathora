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
        console.warn('profiles lookup failed, falling back to auth metadata only:', error.message);
    }

    const profileMap = (data || []).reduce((acc, profile) => {
        acc[profile.id] = {
            name: profile.full_name || profile.username || 'Student',
            avatarUrl: profile.avatar_url || ''
        };
        return acc;
    }, {});

    // Ensure the current user shows their saved name even if the profiles table is empty
    try {
        const { data: sessionData } = await supabase.auth.getSession();
        const sessionUser = sessionData?.session?.user;
        if (sessionUser && userIds.includes(sessionUser.id)) {
            const displayName = sessionUser.user_metadata?.preferred_username
                || sessionUser.user_metadata?.username
                || sessionUser.user_metadata?.full_name
                || sessionUser.user_metadata?.name
                || sessionUser.email?.split('@')[0]
                || 'Student';

            profileMap[sessionUser.id] = {
                name: profileMap[sessionUser.id]?.name || displayName,
                avatarUrl: profileMap[sessionUser.id]?.avatarUrl
                    || sessionUser.user_metadata?.avatar_url
                    || ''
            };
        }
    } catch (sessionError) {
        console.warn('session lookup failed while building profile map:', sessionError.message);
    }

    return profileMap;
}

// Fallback: build leaderboard directly from user_progress and streak data
async function computeLeaderboardFromTables(limit = 100) {
    try {
        // Get ALL users from auth.users first, so we can show everyone even with 0 progress
        const { data: allUsers, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) {
            console.warn('Could not fetch all users, falling back to users with progress only:', usersError.message);
            // Fall back to old behavior if admin access not available
            return await computeLeaderboardFromProgressOnly(limit);
        }

        const allUserIds = (allUsers?.users || []).map(u => u.id);

        // Get progress data for all users
        const { data: progressData } = await supabase
            .from('user_progress')
            .select('user_id, solved_problems, correct_answers, wrong_submissions, total_attempts, reputation, perfect_streak, total_xp')
            .in('user_id', allUserIds);

        const { data: streakData } = await supabase
            .from('user_streak_data')
            .select('user_id, current_streak, longest_streak');

        // Create maps for quick lookup
        const progressMap = {};
        (progressData || []).forEach(p => {
            progressMap[p.user_id] = p;
        });

        const streakMap = {};
        (streakData || []).forEach(s => {
            streakMap[s.user_id] = s.current_streak || 0;
        });

        const profileMap = await getProfileMap(allUserIds);

        // Build leaderboard entry for EVERY user
        const leaderboardData = allUserIds.map((userId) => {
            const progress = progressMap[userId] || {
                solved_problems: [],
                correct_answers: 0,
                wrong_submissions: 0,
                total_attempts: 0,
                reputation: 0,
                perfect_streak: 0,
                total_xp: 0
            };

            const xpData = calculateUserXP(progress, { current_streak: streakMap[userId] || 0 });
            const profile = profileMap[userId] || {};
            const solvedCount = Array.isArray(progress.solved_problems)
                ? progress.solved_problems.length
                : 0;

            return {
                userId: userId,
                name: profile.name || `Student-${String(userId).slice(0, 6)}`,
                avatarUrl: profile.avatarUrl || '',
                xp: progress.total_xp || xpData.totalXP || 0,
                problemsSolved: solvedCount,
                accuracy: progress.total_attempts > 0
                    ? Math.round((progress.correct_answers / progress.total_attempts) * 100)
                    : 0,
                reputation: progress.reputation || 0,
                currentStreak: streakMap[userId] || 0,
                rank: 0
            };
        });

        // Sort by XP (descending), then by problems solved as tiebreaker
        leaderboardData.sort((a, b) => {
            if (b.xp !== a.xp) return b.xp - a.xp;
            return b.problemsSolved - a.problemsSolved;
        });

        // Assign ranks
        return leaderboardData.map((entry, index) => ({
            ...entry,
            rank: index + 1
        })).slice(0, limit);
    } catch (error) {
        console.error('Fallback leaderboard computation failed:', error);
        return await computeLeaderboardFromProgressOnly(limit);
    }
}

// Helper: compute leaderboard from only users who have progress data (old behavior)
async function computeLeaderboardFromProgressOnly(limit = 100) {
    try {
        const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('user_id, solved_problems, correct_answers, wrong_submissions, total_attempts, reputation, perfect_streak, total_xp')
            .limit(limit);

        if (progressError) {
            console.error('Fallback progress fetch failed:', progressError);
            return [];
        }

        const { data: streakData } = await supabase
            .from('user_streak_data')
            .select('user_id, current_streak, longest_streak');

        const streakMap = {};
        (streakData || []).forEach(s => {
            streakMap[s.user_id] = s.current_streak || 0;
        });

        const userIds = progressData.map(p => p.user_id);
        const profileMap = await getProfileMap(userIds);

        const leaderboardData = progressData.map((progress) => {
            const xpData = calculateUserXP(progress, { current_streak: streakMap[progress.user_id] });
            const profile = profileMap[progress.user_id] || {};
            const solvedCount = Array.isArray(progress.solved_problems)
                ? progress.solved_problems.length
                : 0;

            return {
                userId: progress.user_id,
                name: profile.name || `Student-${String(progress.user_id).slice(0, 6)}`,
                avatarUrl: profile.avatarUrl || '',
                xp: progress.total_xp || xpData.totalXP || 0,
                problemsSolved: solvedCount,
                accuracy: progress.total_attempts > 0
                    ? Math.round((progress.correct_answers / progress.total_attempts) * 100)
                    : 0,
                reputation: progress.reputation || 0,
                currentStreak: streakMap[progress.user_id] || 0,
                rank: 0
            };
        });

        leaderboardData.sort((a, b) => b.xp - a.xp);

        return leaderboardData.map((entry, index) => ({
            ...entry,
            rank: index + 1
        }));
    } catch (error) {
        console.error('Fallback leaderboard computation failed:', error);
        return [];
    }
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
        }

        const rows = data || [];
        // If the view is empty (not refreshed yet), compute directly so multiple accounts still show up
        if (!rows.length) {
            return computeLeaderboardFromTables(limit);
        }
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
 * Get recent top solvers based on completions in the last N days.
 */
export async function getRecentTopSolvers(days = 7, limit = 50) {
    try {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const { data, error } = await supabase
            .from('user_completed_problems')
            .select('user_id, completed_at')
            .gte('completed_at', since.toISOString());

        if (error) {
            console.error('Error fetching recent completions:', error);
            return [];
        }

        const counts = {};
        (data || []).forEach(row => {
            const uid = row.user_id;
            counts[uid] = (counts[uid] || 0) + 1;
        });

        const userIds = Object.keys(counts);
        if (!userIds.length) return [];

        // Pull base leaderboard info to attach streak/xp/accuracy
        const baseLeaderboard = await getGlobalLeaderboard(limit);
        const baseMap = baseLeaderboard.reduce((acc, item) => {
            acc[item.userId] = item;
            return acc;
        }, {});

        const profileMap = await getProfileMap(userIds);

        const result = userIds.map(uid => {
            const base = baseMap[uid] || {};
            return {
                userId: uid,
                name: profileMap[uid]?.name || base.name || `Student-${String(uid).slice(0, 6)}`,
                avatarUrl: profileMap[uid]?.avatarUrl || base.avatarUrl || '',
                problemsSolved: counts[uid],
                recentSolved: counts[uid],
                xp: base.xp || 0,
                accuracy: base.accuracy || 0,
                reputation: base.reputation || 0,
                currentStreak: base.currentStreak || 0,
            };
        });

        result.sort((a, b) => b.recentSolved - a.recentSolved || b.xp - a.xp);

        return result.slice(0, limit).map((item, idx) => ({ ...item, rank: idx + 1 }));
    } catch (error) {
        console.error('Error getting recent top solvers:', error);
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
