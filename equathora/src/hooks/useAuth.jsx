import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Helper to check local cache safely
const getCachedOnboarding = (userId) => {
    try {
        const val = localStorage.getItem(`equathora_onboarding_${userId}`);
        return val ? JSON.parse(val) : null;
    } catch {
        return null;
    }
};

const setCachedOnboarding = (userId, completed) => {
    try {
        if (userId) {
            localStorage.setItem(`equathora_onboarding_${userId}`, JSON.stringify(completed));
        }
    } catch (e) {
        console.warn('Failed to save onboarding cache:', e);
    }
};

export async function getOnboardingStatus(userId) {
    if (!userId) return { success: false, onboardingCompleted: false, role: null };

    try {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .maybeSingle();

        if (profileError) throw profileError;

        const role = profile?.role ?? null;
        if (!role) {
            return { success: true, onboardingCompleted: false, role: null };
        }
        if (role !== 'student') {
            return { success: true, onboardingCompleted: true, role };
        }

        const { data: studentProfile, error: studentProfileError } = await supabase
            .from('student_profile')
            .select('onboarding_completed')
            .eq('id', userId)
            .maybeSingle();

        if (studentProfileError) throw studentProfileError;

        return {
            success: true,
            onboardingCompleted: Boolean(studentProfile?.onboarding_completed),
            role
        };
    } catch (error) {
        console.error('Error fetching onboarding status:', error);
        // Indicate success: false so callers know this was a network/DB failure
        return { success: false, onboardingCompleted: false, role: null };
    }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);

    useEffect(() => {
        let isDisposed = false;
        // Bumped on every sync call; only the most recently dispatched call
        // is allowed to commit state. This guards against onAuthStateChange
        // firing again (e.g. TOKEN_REFRESHED) while an earlier sync is
        // still in flight.
        let requestToken = 0;

        async function syncAuthAndOnboarding(session, initial = false) {
            if (isDisposed) return;

            const myToken = ++requestToken;

            if (initial) {
                setLoading(true);
            }
            setIsAuth(!!session);
            setUser(session?.user ?? null);

            if (!session) {
                if (!isDisposed && myToken === requestToken) {
                    setOnboardingCompleted(false);
                    setLoading(false);
                }
                return;
            }

            const res = await getOnboardingStatus(session.user.id);

            if (isDisposed || myToken !== requestToken) return;

            if (res.success) {
                // Successful DB query: update state and cache
                setOnboardingCompleted(res.onboardingCompleted);
                setCachedOnboarding(session.user.id, res.onboardingCompleted);
            } else {
                // Network / DB Error: check local cache first before modifying state
                const cached = getCachedOnboarding(session.user.id);
                if (cached !== null) {
                    setOnboardingCompleted(cached);
                }
                // If no cache exists, leave onboardingCompleted untouched rather than forcing false
            }
            setLoading(false);
        }

        // onAuthStateChange fires immediately on subscribe with an
        // INITIAL_SESSION event carrying the current session, so a
        // separate getSession().then(...) call is redundant — keeping
        // both created two concurrent syncAuthAndOnboarding calls racing
        // to set state, which could leave onboardingCompleted stale
        // right after loading flips to false. One listener, one sync.
        let hasSyncedOnce = false;
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            void syncAuthAndOnboarding(session, !hasSyncedOnce);
            hasSyncedOnce = true;
        });

        return () => {
            isDisposed = true;
            subscription.unsubscribe();
        };
    }, []);

    const refreshOnboardingStatus = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const res = await getOnboardingStatus(session.user.id);
        if (res.success) {
            setOnboardingCompleted(res.onboardingCompleted);
            setCachedOnboarding(session.user.id, res.onboardingCompleted);
            return res.onboardingCompleted;
        }

        // Return current state or cache if refresh fails due to network error
        const cached = getCachedOnboarding(session.user.id);
        return cached ?? onboardingCompleted;
    }, [onboardingCompleted]);

    const value = { loading, isAuth, user, onboardingCompleted, refreshOnboardingStatus };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside an <AuthProvider>.');
    return ctx;
}