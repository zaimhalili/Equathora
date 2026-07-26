import React, { createContext, useContext } from 'react';
import { useSubscriptionStatus } from './useSubscription';

const SubscriptionContext = createContext({
    tier: 'free',
    premium: false,
    trialMessagesUsed: 0,
    monthlyTokensUsed: 0,
    cancelAtPeriodEnd: false,
    cancelAt: null,
    loading: true,
    refetchSubscription: () => { },
});

export function SubscriptionProvider({ children }) {
    const status = useSubscriptionStatus();

    return (
        <SubscriptionContext.Provider value={{
            ...status,
            refetchSubscription: status.refetch
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    return useContext(SubscriptionContext);
}