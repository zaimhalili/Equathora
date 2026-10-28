import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export function useLogout() {
    const navigate = useNavigate();

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        navigate('/login');
    };

    return { logout };
}
