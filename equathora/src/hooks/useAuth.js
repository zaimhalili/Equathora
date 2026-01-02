import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuth(!!session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuth(!!session);
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { loading, isAuth, user };
}
