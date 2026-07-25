import React, { createContext, useContext } from 'react';
import { useSubscriptionStatus } from './useSubscription';

const SubscriptionContext = createContext({
    isPremium: false,
    tier: 'free',
    loading: true,
    trialMessagesUsed: 0,
});

export function SubscriptionProvider({ children }) {
    const { tier, loading, trialMessagesUsed, monthlyTokensUsed, error } = useSubscriptionStatus();

    const isPremium = tier === 'premium';

    return (
        <SubscriptionContext.Provider value={{ isPremium, tier, loading, trialMessagesUsed, monthlyTokensUsed, error }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

// Custom hook to read subscription state anywhere in 1 line
export const useSubscription = () => useContext(SubscriptionContext);