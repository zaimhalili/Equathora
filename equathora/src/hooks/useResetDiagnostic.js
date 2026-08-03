import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export function useResetDiagnostic() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const resetDiagnosticTest = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                throw new Error('User is not authenticated.');
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    diagnostic_score: null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            localStorage.removeItem('diagnostic_completed');

            // retake: true is required — OnboardingRoute redirects a
            // completed-onboarding user straight back to /dashboard
            // unless this is set, so without it the retake button
            // silently did nothing (score reset, but the user never
            // saw the GetStarted flow).
            navigate('/getStarted', { replace: true, state: { retake: true } });
        } catch (err) {
            console.error('[useResetDiagnostic] Failed to reset diagnostic:', err);
            setError(err.message || 'An unexpected error occurred.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { resetDiagnosticTest, loading, error };
}