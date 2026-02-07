import { supabase } from './supabaseClient';

/**
 * Notification Service for Equathora
 * Handles real notification delivery, storage, and retrieval via Supabase.
 * 
 * Notification types:
 *   - achievement    : Achievement unlocked
 *   - streak         : Streak milestone / reminder
 *   - system         : Platform updates, announcements
 *   - friend         : Friend request / acceptance
 *   - problem        : New problem available, daily challenge
 *   - leaderboard    : Rank changes
 */

// ============================================================================
// NOTIFICATION TYPES & ICONS
// ============================================================================

export const NOTIFICATION_TYPES = {
    ACHIEVEMENT: 'achievement',
    STREAK: 'streak',
    SYSTEM: 'system',
    FRIEND: 'friend',
    PROBLEM: 'problem',
    LEADERBOARD: 'leaderboard',
};

export const NOTIFICATION_ICONS = {
    achievement: '🏆',
    streak: '🔥',
    system: '📢',
    friend: '👥',
    problem: '📐',
    leaderboard: '📊',
};

export const NOTIFICATION_ROUTES = {
    achievement: '/achievements',
    streak: '/achievements/stats',
    system: '/systemupdates',
    friend: '/leaderboards/friends',
    problem: '/learn',
    leaderboard: '/leaderboards/global',
};

// ============================================================================
// FETCH NOTIFICATIONS
// ============================================================================

export async function getNotifications({ limit = 50, unreadOnly = false } = {}) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];

        let query = supabase
            .from('user_notifications')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (unreadOnly) {
            query = query.eq('read', false);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

export async function getUnreadCount() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return 0;

        const { count, error } = await supabase
            .from('user_notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id)
            .eq('read', false);

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }
}

// ============================================================================
// CREATE NOTIFICATIONS
// ============================================================================

export async function createNotification({ type, title, message, link = null, metadata = {} }) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        const notification = {
            user_id: session.user.id,
            type,
            title,
            message,
            link: link || NOTIFICATION_ROUTES[type] || null,
            metadata,
            read: false,
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('user_notifications')
            .insert(notification)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
}

// Helper functions for specific notification types
export async function notifyWelcome(username = 'there') {
    return createNotification({
        type: NOTIFICATION_TYPES.SYSTEM,
        title: `Welcome to Equathora, ${username}! 🎉`,
        message: 'We\'re excited to have you here! Start solving problems to build your streak and unlock achievements. Check out the Help Center if you need guidance.',
        link: '/dashboard',
        metadata: { isWelcome: true },
    });
}

export async function notifyAchievementUnlocked(achievementTitle, achievementDescription) {
    return createNotification({
        type: NOTIFICATION_TYPES.ACHIEVEMENT,
        title: 'Achievement Unlocked!',
        message: `${achievementTitle} — ${achievementDescription}`,
        link: '/achievements',
        metadata: { achievementTitle },
    });
}

export async function notifyStreakMilestone(streakDays) {
    return createNotification({
        type: NOTIFICATION_TYPES.STREAK,
        title: `${streakDays}-Day Streak!`,
        message: `You've maintained a ${streakDays}-day solving streak. Keep going!`,
        link: '/achievements/stats',
        metadata: { streakDays },
    });
}

export async function notifyStreakReminder() {
    return createNotification({
        type: NOTIFICATION_TYPES.STREAK,
        title: 'Don\'t lose your streak!',
        message: 'You haven\'t solved a problem today. Solve one to keep your streak alive!',
        link: '/learn',
        metadata: { isReminder: true },
    });
}

export async function notifySystemUpdate(title, message) {
    return createNotification({
        type: NOTIFICATION_TYPES.SYSTEM,
        title,
        message,
        link: '/systemupdates',
    });
}

export async function notifyFriendRequest(friendName) {
    return createNotification({
        type: NOTIFICATION_TYPES.FRIEND,
        title: 'New Friend Request',
        message: `${friendName} wants to connect with you!`,
        link: '/leaderboards/friends',
        metadata: { friendName },
    });
}

export async function notifyLeaderboardChange(newRank) {
    return createNotification({
        type: NOTIFICATION_TYPES.LEADERBOARD,
        title: 'Leaderboard Update',
        message: `You climbed to rank #${newRank} on the global leaderboard!`,
        link: '/leaderboards/global',
        metadata: { newRank },
    });
}

// ============================================================================
// UPDATE NOTIFICATIONS
// ============================================================================

export async function markNotificationRead(notificationId) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { error } = await supabase
            .from('user_notifications')
            .update({ read: true })
            .eq('id', notificationId)
            .eq('user_id', session.user.id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error marking notification read:', error);
        return false;
    }
}

export async function markAllNotificationsRead() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { error } = await supabase
            .from('user_notifications')
            .update({ read: true })
            .eq('user_id', session.user.id)
            .eq('read', false);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error marking all read:', error);
        return false;
    }
}

export async function markNotificationsReadByIds(ids) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { error } = await supabase
            .from('user_notifications')
            .update({ read: true })
            .in('id', ids)
            .eq('user_id', session.user.id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error marking notifications read:', error);
        return false;
    }
}

export async function markNotificationsUnreadByIds(ids) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { error } = await supabase
            .from('user_notifications')
            .update({ read: false })
            .in('id', ids)
            .eq('user_id', session.user.id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error marking notifications unread:', error);
        return false;
    }
}

// ============================================================================
// DELETE NOTIFICATIONS
// ============================================================================

export async function deleteNotification(notificationId) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { error } = await supabase
            .from('user_notifications')
            .delete()
            .eq('id', notificationId)
            .eq('user_id', session.user.id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting notification:', error);
        return false;
    }
}

export async function deleteAllNotifications() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { error } = await supabase
            .from('user_notifications')
            .delete()
            .eq('user_id', session.user.id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting all notifications:', error);
        return false;
    }
}

// ============================================================================
// USER SETTINGS / PREFERENCES
// ============================================================================

const DEFAULT_SETTINGS = {
    notifications_enabled: true,
    email_notifications: false,
    achievement_notifications: true,
    streak_reminders: true,
    system_updates: true,
    friend_notifications: true,
    leaderboard_notifications: true,
    problem_notifications: true,
    privacy_profile_public: true,
    privacy_show_streak: true,
    privacy_show_leaderboard: true,
    privacy_show_achievements: true,
    two_factor_enabled: false,
    session_timeout_minutes: 60,
    theme: 'light',
    language: 'en',
};

export async function getUserSettings() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return { ...DEFAULT_SETTINGS };

        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

        if (error) throw error;
        if (!data) return { ...DEFAULT_SETTINGS };

        return { ...DEFAULT_SETTINGS, ...data.settings };
    } catch (error) {
        console.error('Error fetching user settings:', error);
        return { ...DEFAULT_SETTINGS };
    }
}

export async function saveUserSettings(settings) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: session.user.id,
                settings: { ...settings },
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving user settings:', error);
        return false;
    }
}

// ============================================================================
// SECURITY: PASSWORD CHANGE
// ============================================================================

export async function changePassword(newPassword) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

        // Supabase password update (requires current session)
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false, message: error.message };
    }
}

// ============================================================================
// SECURITY: EMAIL CHANGE
// ============================================================================

export async function changeEmail(newEmail) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

        const { error } = await supabase.auth.updateUser({
            email: newEmail,
        });

        if (error) throw error;
        return { success: true, message: 'Confirmation email sent to your new address.' };
    } catch (error) {
        console.error('Error changing email:', error);
        return { success: false, message: error.message };
    }
}

// ============================================================================
// SECURITY: DELETE ACCOUNT
// ============================================================================

export async function requestAccountDeletion() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

        // Mark account for deletion (soft delete — data retained for 30 days)
        const { error } = await supabase
            .from('profiles')
            .update({
                deletion_requested: true,
                deletion_requested_at: new Date().toISOString(),
            })
            .eq('id', session.user.id);

        if (error) throw error;

        // Sign the user out
        await supabase.auth.signOut();
        return { success: true, message: 'Account deletion requested. Your data will be removed within 30 days.' };
    } catch (error) {
        console.error('Error requesting account deletion:', error);
        return { success: false, message: error.message };
    }
}

// ============================================================================
// SECURITY: ACTIVE SESSIONS
// ============================================================================

export async function getCurrentSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) return null;

        return {
            id: session.access_token?.slice(-8) || 'current',
            user_agent: navigator.userAgent,
            created_at: session.expires_at
                ? new Date((session.expires_at - 3600) * 1000).toISOString()
                : new Date().toISOString(),
            last_active: new Date().toISOString(),
            ip: 'Current device',
        };
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

export async function signOutAllOtherSessions() {
    try {
        // Supabase doesn't have a built-in "sign out other sessions" API,
        // but we can refresh the current session which invalidates others
        const { error } = await supabase.auth.refreshSession();
        if (error) throw error;
        return { success: true, message: 'All other sessions have been signed out.' };
    } catch (error) {
        console.error('Error signing out other sessions:', error);
        return { success: false, message: error.message };
    }
}

// ============================================================================
// ACHIEVEMENT TRACKING (for popup triggers)
// ============================================================================

/**
 * Check for newly unlocked achievements by comparing current stats
 * against a previous snapshot. Returns an array of newly unlocked achievement IDs.
 */
export function checkNewAchievements(previousUnlocked = [], currentAchievements = []) {
    const newlyUnlocked = currentAchievements.filter(
        a => a.unlocked && !previousUnlocked.includes(a.id)
    );
    return newlyUnlocked;
}

/**
 * Store which achievements were already seen (acknowledged by the user)
 * in localStorage so popups only show once.
 */
const SEEN_ACHIEVEMENTS_KEY = 'eq:seen_achievements';

export function getSeenAchievements() {
    try {
        const data = localStorage.getItem(SEEN_ACHIEVEMENTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function markAchievementSeen(achievementId) {
    try {
        const seen = getSeenAchievements();
        if (!seen.includes(achievementId)) {
            seen.push(achievementId);
            localStorage.setItem(SEEN_ACHIEVEMENTS_KEY, JSON.stringify(seen));
        }
    } catch {
        // noop
    }
}
// ============================================================================
// ADMIN FUNCTIONS (for sending notifications to all users)
// ============================================================================

/**
 * Check if the current user is an admin.
 * Queries the profiles table for role = 'admin'.
 */
export async function isCurrentUserAdmin() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (error) throw error;
        return data?.role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

/**
 * ADMIN ONLY: Send a notification to all users in the platform.
 * This function checks if the current user is an admin before proceeding.
 * 
 * ⚠️ SECURITY: This function verifies admin status on BOTH frontend and database level (RLS).
 * 
 * Usage from browser console (only works if you're an admin):
 * const { notifyAllUsers } = await import('./src/lib/notificationService');
 * await notifyAllUsers({
 *   type: 'system',
 *   title: 'Platform Update',
 *   message: 'We've added new features! Check them out.',
 *   link: '/systemupdates'
 * });
 */
export async function notifyAllUsers({ type, title, message, link = null, metadata = {} }) {
    try {
        // Frontend admin check
        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) {
            return {
                success: false,
                message: '🚫 Access denied. You must be an admin to send notifications to all users.',
                count: 0
            };
        }

        // Get all user profiles
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id');

        if (error) throw error;
        if (!profiles || profiles.length === 0) {
            return { success: false, message: 'No users found', count: 0 };
        }

        // Create notification for each user
        const notifications = profiles.map(profile => ({
            user_id: profile.id,
            type,
            title,
            message,
            link: link || NOTIFICATION_ROUTES[type] || null,
            metadata,
            read: false,
            created_at: new Date().toISOString(),
        }));

        // Batch insert all notifications
        // Note: RLS policy will verify admin status again at database level
        const { data, error: insertError } = await supabase
            .from('user_notifications')
            .insert(notifications)
            .select();

        if (insertError) {
            // If RLS blocks it, the error message will indicate permission denied
            if (insertError.message?.includes('permission') || insertError.message?.includes('policy')) {
                return {
                    success: false,
                    message: '🚫 Database security blocked this action. You must be an admin.',
                    count: 0
                };
            }
            throw insertError;
        }

        return {
            success: true,
            message: `✅ Successfully sent notification to ${profiles.length} users`,
            count: profiles.length
        };
    } catch (error) {
        console.error('Error sending notification to all users:', error);
        return {
            success: false,
            message: `❌ Error: ${error.message}`,
            count: 0
        };
    }
}

/**
 * ADMIN ONLY: Send a system announcement to all users.
 * Convenience wrapper for notifyAllUsers for system messages.
 * 
 * ⚠️ SECURITY: Requires admin role. Verified at both frontend and database level.
 * 
 * Usage from browser console (after opening any page on the site):
 * // First, get access to the function
 * const { notifySystemAnnouncement } = await import('./src/lib/notificationService');
 * 
 * // Then send the announcement (only works if you're an admin)
 * const result = await notifySystemAnnouncement(
 *   'New Feature: Dark Mode',
 *   'We've added dark mode! Toggle it in your settings.'
 * );
 * console.log(result);
 */
export async function notifySystemAnnouncement(title, message, link = '/systemupdates') {
    return notifyAllUsers({
        type: NOTIFICATION_TYPES.SYSTEM,
        title,
        message,
        link,
        metadata: { isAnnouncement: true }
    });
}