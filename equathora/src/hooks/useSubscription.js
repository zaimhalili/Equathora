import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useSubscriptionStatus() {
    const [status, setStatus] = useState({
        loading: true,
        tier: 'free',
        trialMessagesUsed: 0,
        monthlyTokensUsed: 0,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchStatus = async () => {
            // Get current logged-in user to ensure session exists
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                if (isMounted) {
                    setStatus({
                        loading: false,
                        tier: 'free',
                        trialMessagesUsed: 0,
                        monthlyTokensUsed: 0,
                        error: null,
                    });
                }
                return;
            }

            const { data, error } = await supabase
                .from('user_ai_usage')
                .select('tier, trial_messages_used, monthly_tokens_used')
                .eq('user_id', user.id)
                .maybeSingle();

            if (isMounted) {
                if (error) {
                    console.error('Error fetching subscription status:', error);
                    setStatus((prev) => ({ ...prev, loading: false, error }));
                } else {
                    setStatus({
                        loading: false,
                        tier: data?.tier ?? 'free',
                        trialMessagesUsed: data?.trial_messages_used ?? 0,
                        monthlyTokensUsed: data?.monthly_tokens_used ?? 0,
                        error: null,
                    });
                }
            }
        };

        fetchStatus();

        // Subscribe to realtime database changes on user_ai_usage
        const channel = supabase
            .channel('user_ai_usage_changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'user_ai_usage',
                },
                () => {
                    fetchStatus();
                }
            )
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    return status;
}