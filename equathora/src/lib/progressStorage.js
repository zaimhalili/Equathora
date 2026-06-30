import { supabase } from './supabaseClient';

// Clear all data (for testing)
export const clearAllProgress = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    localStorage.removeItem(ACHIEVEMENTS_KEY);
};

// Reset all user progress (localStorage + database)
export const resetAllUserProgress = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            console.error('No session found, cannot reset database progress');
            return { success: false, message: 'Not logged in' };
        }

        const userId = session.user.id;

        // Clear localStorage first
        clearAllProgress();

        const isMissingResetFunctionError = (errorObj) => {
            const message = String(errorObj?.message || '').toLowerCase();
            const code = String(errorObj?.code || '').toUpperCase();
            return code === 'PGRST202'
                || code === '42883'
                || (message.includes('reset_my_progress') && (
                    message.includes('not found')
                    || message.includes('does not exist')
                    || message.includes('could not find')
                ));
        };

        let rpcResetError = null;

        // Prefer a DB-level reset RPC if available; this is the most reliable path across RLS differences.
        try {
            const { data: rpcData, error: rpcError } = await supabase.rpc('reset_my_progress');
            if (!rpcError) {
                try {
                    await supabase.rpc('refresh_leaderboard_view');
                } catch (err) {
                    console.warn('Could not refresh leaderboard view:', err.message);
                }

                const message = typeof rpcData?.message === 'string'
                    ? rpcData.message
                    : 'All progress reset successfully';

                console.log('✅ All user progress reset successfully via reset_my_progress RPC');
                return { success: true, message };
            }

            if (!isMissingResetFunctionError(rpcError)) {
                rpcResetError = rpcError;
                console.warn('reset_my_progress RPC failed, falling back to legacy reset path:', rpcError.message);
            }
        } catch (err) {
            if (!isMissingResetFunctionError(err)) {
                rpcResetError = err;
                console.warn('reset_my_progress RPC call threw error, falling back to legacy reset path:', err.message);
            }
        }

        // Clear database tables for this user
        const tables = [
            'user_progress',
            'user_completed_problems',
            'user_streak_data',
            'user_submissions',
            'user_favorites',
            'user_difficulty_breakdown',
            'user_weekly_progress',
            'user_topic_frequency'
        ];

        const resetErrors = [];
        if (rpcResetError) {
            resetErrors.push(`reset_my_progress RPC: ${rpcResetError.message || String(rpcResetError)}`);
        }

        for (const table of tables) {
            try {
                const { error } = await supabase.from(table).delete().eq('user_id', userId);
                if (error) {
                    // Some policies may block delete on user_progress; try zeroing out instead.
                    if (table === 'user_progress') {
                        const { error: fallbackError } = await supabase
                            .from('user_progress')
                            .upsert({
                                user_id: userId,
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
                                updated_at: new Date().toISOString()
                            }, { onConflict: 'user_id' });

                        if (fallbackError) {
                            resetErrors.push(`${table}: delete failed (${error.message}); fallback failed (${fallbackError.message})`);
                        }
                    } else {
                        resetErrors.push(`${table}: ${error.message}`);
                    }
                }
            } catch (err) {
                resetErrors.push(`${table}: ${err.message}`);
            }
        }

        // Always enforce zeroed progress/streak rows to avoid stale counters when delete is silently ignored.
        try {
            const todayIso = new Date().toISOString().split('T')[0];

            const { error: progressUpsertError } = await supabase
                .from('user_progress')
                .upsert({
                    user_id: userId,
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
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

            if (progressUpsertError) {
                resetErrors.push(`user_progress upsert: ${progressUpsertError.message}`);
            }

            const { error: streakUpsertError } = await supabase
                .from('user_streak_data')
                .upsert({
                    user_id: userId,
                    current_streak: 0,
                    longest_streak: 0,
                    last_activity_date: todayIso,
                    streak_start_date: todayIso,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

            if (streakUpsertError) {
                resetErrors.push(`user_streak_data upsert: ${streakUpsertError.message}`);
            }
        } catch (err) {
            resetErrors.push(`reset fallback upsert: ${err.message}`);
        }

        if (resetErrors.length > 0) {
            const message = `Could not fully reset progress. ${resetErrors.join(' | ')}`;
            console.error(message);
            return { success: false, message };
        }

        // Refresh leaderboard view (best-effort)
        try {
            await supabase.rpc('refresh_leaderboard_view');
        } catch (err) {
            console.warn('Could not refresh leaderboard view:', err.message);
        }

        console.log('✅ All user progress reset successfully');
        return { success: true, message: 'All progress reset successfully' };
    } catch (error) {
        console.error('Failed to reset user progress:', error);
        return { success: false, message: error.message };
    }
};
