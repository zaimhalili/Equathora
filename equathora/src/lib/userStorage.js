import { supabase } from './supabaseClient';

/**
 * Get the current user's ID for scoping localStorage data.
 * Returns the user ID if logged in, or 'guest' if not.
 */
export async function getUserStoragePrefix() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
            return `user_${session.user.id}`;
        }
        return 'guest';
    } catch (error) {
        console.error('Error getting user session:', error);
        return 'guest';
    }
}

/**
 * Get a storage key scoped to the current user.
 * @param {string} key - The base key name
 * @returns {Promise<string>} - User-scoped storage key
 */
export async function getScopedStorageKey(key) {
    const prefix = await getUserStoragePrefix();
    return `equathora_${prefix}_${key}`;
}

/**
 * Get item from localStorage scoped to current user.
 * @param {string} key - The base key name
 * @returns {Promise<string|null>} - The stored value or null
 */
export async function getUserScopedItem(key) {
    const scopedKey = await getScopedStorageKey(key);
    return localStorage.getItem(scopedKey);
}

/**
 * Set item in localStorage scoped to current user.
 * @param {string} key - The base key name
 * @param {string} value - The value to store
 */
export async function setUserScopedItem(key, value) {
    const scopedKey = await getScopedStorageKey(key);
    localStorage.setItem(scopedKey, value);
}

/**
 * Remove item from localStorage scoped to current user.
 * @param {string} key - The base key name
 */
export async function removeUserScopedItem(key) {
    const scopedKey = await getScopedStorageKey(key);
    localStorage.removeItem(scopedKey);
}

/**
 * Clear all data for the current user.
 * This should be called on logout.
 */
export async function clearUserData() {
    const prefix = await getUserStoragePrefix();
    const keysToRemove = [];

    // Find all keys for this user
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`equathora_${prefix}_`)) {
            keysToRemove.push(key);
        }
    }

    // Remove them
    keysToRemove.forEach(key => localStorage.removeItem(key));
}
