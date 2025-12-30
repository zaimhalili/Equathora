import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Usage: const { user, profile, loading, error } = useUserProfile();
export function useUserProfile() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;
        async function fetchUserAndProfile() {
            setLoading(true);
            setError(null);
            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                setError(userError.message);
                setLoading(false);
                return;
            }
            setUser(user);
            if (!user) {
                setProfile(null);
                setLoading(false);
                return;
            }
            // Fetch profile from 'profiles' table (make sure you have this table in Supabase)
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (!ignore) {
                setProfile(profileData);
                setError(profileError ? profileError.message : null);
                setLoading(false);
            }
        }
        fetchUserAndProfile();
        return () => { ignore = true; };
    }, []);

    return { user, profile, loading, error };
}
