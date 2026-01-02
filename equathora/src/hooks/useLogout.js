import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export function useLogout() {
    const navigate = useNavigate();

    const logout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return { logout };
}
