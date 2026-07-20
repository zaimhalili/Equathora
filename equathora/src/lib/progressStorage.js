import { supabase } from './supabaseClient';

// Clear all data (for testing)
export const clearAllProgress = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    localStorage.removeItem(ACHIEVEMENTS_KEY);
};
