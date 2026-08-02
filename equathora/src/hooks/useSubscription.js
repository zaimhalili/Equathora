import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

const CACHE_KEY = 'eq_subscription_cache';

export function useSubscriptionStatus() {
    // 1. Initialize state immediately from sessionStorage (0ms render, no flicker)
    const [status, setStatus] = useState(() => {
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                return { ...parsed, loading: false, error: null };
            }
        } catch {
            /* ignore cache read errors */
        }
        return {
            loading: true,
            tier: 'free',
            premium: false,
            trialMessagesUsed: 0,
            monthlyTokensUsed: 0,
            cancelAtPeriodEnd: false,
            cancelAt: null,
            error: null,
        };
    });

    const fetchStatus = useCallback(async (isMounted = true) => {
        try {
            // 2. Fast local session lookup instead of network getUser()
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;

            if (!user) {
                if (isMounted) {
                    const defaultState = {
                        loading: false,
                        tier: 'free',
                        premium: false,
                        trialMessagesUsed: 0,
                        monthlyTokensUsed: 0,
                        cancelAtPeriodEnd: false,
                        cancelAt: null,
                        error: null,
                    };
                    setStatus(defaultState);
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(defaultState));
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
                    const freshStatus = {
                        loading: false,
                        tier: data?.tier ?? 'free',
                        premium: (data?.tier ?? 'free') === 'premium',
                        trialMessagesUsed: data?.trial_messages_used ?? 0,
                        monthlyTokensUsed: data?.monthly_tokens_used ?? 0,
                        cancelAtPeriodEnd: data?.cancel_at_period_end ?? false,
                        cancelAt: data?.cancel_at ?? null,
                        error: null,
                    };

                    // 3. Update state and keep cache synced
                    setStatus(freshStatus);
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(freshStatus));
                }
            }
        } catch (err) {
            if (isMounted) {
                setStatus((prev) => ({ ...prev, loading: false, error: err }));
            }
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        void fetchStatus(isMounted);

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
                    void fetchStatus(isMounted);
                }
            )
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [fetchStatus]);

    return {
        ...status,
        refetch: fetchStatus,
    };
}