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

            // 1. Reset diagnostic_score in profiles
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    diagnostic_score: null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // 2. Clear client storage flags
            localStorage.removeItem('diagnostic_completed');

            // 3. Force navigate to getStarted
            navigate('/getStarted', { replace: true });
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