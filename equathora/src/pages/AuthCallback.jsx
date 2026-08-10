import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAnalyticsAfterAuthCallback } from '../lib/authCallbackPrivacy';
import { initPostHog } from '../lib/posthogClient';
import { supabase } from '../lib/supabaseClient';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const finishAuthCallback = () => {
            resumeAnalyticsAfterAuthCallback(window, initPostHog);
            navigate('/dashboard', { replace: true });
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                finishAuthCallback();
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                finishAuthCallback();
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <p>Confirming your account...</p>
        </div>
    );
};

export default AuthCallback;
