import { supabase } from './supabaseClient';
import { saveUserProgress, markProblemComplete, toggleFavorite } from './databaseService';

/**
 * Migrate localStorage data to Supabase database
 * Call this once per user after they log in for the first time after the migration
 */

async function getDeviceId() {
    const DEVICE_ID_KEY = 'equathora_device_id';
    return sessionStorage.getItem(DEVICE_ID_KEY) || localStorage.getItem(DEVICE_ID_KEY);
}

export async function migrateLocalStorageToDatabase() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            console.log('No session - skipping migration');
            return { success: false, message: 'Not logged in' };
        }

        const deviceId = await getDeviceId();
        if (!deviceId) {
            console.log('No device ID - no local data to migrate');
            return { success: true, message: 'No local data found' };
        }

        // Check if already migrated
        const migrationKey = `equathora_migrated_${session.user.id}`;
        if (localStorage.getItem(migrationKey)) {
            console.log('Already migrated');
            return { success: true, message: 'Already migrated' };
        }

        const ACHIEVEMENTS_KEY = `equathoraProgress_${deviceId}`;
        const COMPLETED_KEY = `equathora_completed_problems_${deviceId}`;
        const FAVORITES_KEY = `equathora_favorites_${deviceId}`;

        let migratedCount = 0;

        // Migrate main progress
        const progressRaw = localStorage.getItem(ACHIEVEMENTS_KEY);
        if (progressRaw) {
            try {
                const progress = JSON.parse(progressRaw);
                await saveUserProgress({
                    total_problems: progress.totalProblems || 30,
                    solved_problems: progress.solvedProblems || [],
                    correct_answers: progress.correctAnswers || 0,
                    wrong_submissions: progress.wrongSubmissions || 0,
                    total_attempts: progress.totalAttempts || 0,
                    streak_days: progress.streakDays || 0,
                    total_time_minutes: progress.totalTimeMinutes || 0,
                    concepts_learned: progress.conceptsLearned || 0,
                    perfect_streak: progress.perfectStreak || 0,
                    reputation: progress.reputation || 0,
                    accuracy_rate: progress.accuracyRate || 0,
                    last_reputation_streak: progress.lastReputationStreak || 0
                });
                migratedCount++;
                console.log('Migrated main progress');
            } catch (err) {
                console.error('Error migrating progress:', err);
            }
        }

        // Migrate completed problems
        const completedRaw = localStorage.getItem(COMPLETED_KEY);
        if (completedRaw) {
            try {
                const completed = JSON.parse(completedRaw);
                if (Array.isArray(completed)) {
                    for (const problemId of completed) {
                        await markProblemComplete(problemId, 0, 'unknown', 'Unknown');
                    }
                    migratedCount += completed.length;
                    console.log(`Migrated ${completed.length} completed problems`);
                }
            } catch (err) {
                console.error('Error migrating completed problems:', err);
            }
        }

        // Migrate favorites
        const favoritesRaw = localStorage.getItem(FAVORITES_KEY);
        if (favoritesRaw) {
            try {
                const favorites = JSON.parse(favoritesRaw);
                if (Array.isArray(favorites)) {
                    for (const problemId of favorites) {
                        await toggleFavorite(problemId);
                    }
                    migratedCount += favorites.length;
                    console.log(`Migrated ${favorites.length} favorites`);
                }
            } catch (err) {
                console.error('Error migrating favorites:', err);
            }
        }

        // Mark as migrated
        localStorage.setItem(migrationKey, 'true');

        return { 
            success: true, 
            message: `Successfully migrated ${migratedCount} items`,
            count: migratedCount 
        };

    } catch (error) {
        console.error('Migration error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Check if user needs migration
 */
export async function needsMigration() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const migrationKey = `equathora_migrated_${session.user.id}`;
        return !localStorage.getItem(migrationKey);
    } catch (error) {
        return false;
    }
}
