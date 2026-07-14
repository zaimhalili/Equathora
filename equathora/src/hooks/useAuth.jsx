import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Teachers never get a student_profile row (GetStarted.jsx only sets
// profiles.role for them), so onboarding is complete when:
// role is set, AND (role !== 'student' OR student_profile.onboarding_completed)
export async function getOnboardingStatus(userId) {
    if (!userId) return { onboardingCompleted: false, role: null };

    try {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .maybeSingle();

        if (profileError) throw profileError;

        const role = profile?.role ?? null;
        if (!role) return { onboardingCompleted: false, role: null };
        if (role !== 'student') return { onboardingCompleted: true, role };

        const { data: studentProfile, error: studentProfileError } = await supabase
            .from('student_profile')
            .select('onboarding_completed')
            .eq('id', userId)
            .maybeSingle();

        if (studentProfileError) throw studentProfileError;

        return {
            onboardingCompleted: Boolean(studentProfile?.onboarding_completed),
            role
        };
    } catch (error) {
        console.error('Error fetching onboarding status:', error);
        return { onboardingCompleted: false, role: null };
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

        async function syncAuthAndOnboarding(session) {
            if (isDisposed) return;

            setLoading(true);
            setIsAuth(!!session);
            setUser(session?.user ?? null);

            if (!session) {
                if (!isDisposed) {
                    setOnboardingCompleted(false);
                    setLoading(false);
                }
                return;
            }

            const { onboardingCompleted: completed } = await getOnboardingStatus(session.user.id);

            if (!isDisposed) {
                setOnboardingCompleted(completed);
                setLoading(false);
            }
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            void syncAuthAndOnboarding(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            void syncAuthAndOnboarding(session);
        });

        return () => {
            isDisposed = true;
            subscription.unsubscribe();
        };
    }, []);

    // Lets GetStarted push the new status immediately after saving, instead
    // of waiting for the next auth event to refresh the cached value.
    const refreshOnboardingStatus = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { onboardingCompleted: completed } = await getOnboardingStatus(session.user.id);
        setOnboardingCompleted(completed);
        return completed;
    }, []);

    const value = { loading, isAuth, user, onboardingCompleted, refreshOnboardingStatus };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside an <AuthProvider>.');
    return ctx;
}