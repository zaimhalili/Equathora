import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getAuthDestination } from '../lib/authDestination';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const destination = getAuthDestination(location.search, location.state?.from);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate(destination, { replace: true });
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                navigate(destination, { replace: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [destination, navigate]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <p>Confirming your account...</p>
        </div>
    );
};

export default AuthCallback;
