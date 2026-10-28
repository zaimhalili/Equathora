import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useUser() {
    const [username, setUsername] = useState(() => {
        return localStorage.getItem('equathora_username') || "Friend";
    });

    useEffect(() => {
        const handleUserSession = (user) => {
            if (user) {
                const displayName =
                    user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.email?.split('@')[0] ||
                    "Friend";

                setUsername(displayName);
                localStorage.setItem('equathora_username', displayName);
            } else {
                setUsername("Friend");
                localStorage.removeItem('equathora_username');
            }
        };

        // Fetch initial session
        const getInitialSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                handleUserSession(session?.user ?? null);
            } catch (error) {
                console.error("Failed to fetch session:", error);
            }
        };

        getInitialSession();

        // Listen for real-time auth changes (sign-in, sign-out, token updates)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                handleUserSession(session?.user ?? null);
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return { username };
}