import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useSubscriptionStatus() {
    const [status, setStatus] = useState({
        loading: true,
        tier: 'free',
        premium: false,
        trialMessagesUsed: 0,
        monthlyTokensUsed: 0,
        cancelAtPeriodEnd: false,
        cancelAt: null,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                if (isMounted) {
                    setStatus({
                        loading: false,
                        tier: 'free',
                        premium: false,
                        trialMessagesUsed: 0,
                        monthlyTokensUsed: 0,
                        cancelAtPeriodEnd: false,
                        cancelAt: null,
                        error: null,
                    });
                }
                return;
            }

            const { data, error } = await supabase
                .from('user_ai_usage')
                .select('tier, trial_messages_used, monthly_tokens_used, cancel_at_period_end, cancel_at')
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
                        premium: (data?.tier ?? 'free') === 'premium',
                        trialMessagesUsed: data?.trial_messages_used ?? 0,
                        monthlyTokensUsed: data?.monthly_tokens_used ?? 0,
                        cancelAtPeriodEnd: data?.cancel_at_period_end ?? false,
                        cancelAt: data?.cancel_at ?? null,
                        error: null,
                    });
                }
            }
        };

        fetchStatus();

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