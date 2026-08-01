import React from 'react';
import { AuthProvider } from '../hooks/useAuth';
import { SubscriptionProvider } from '../hooks/SubscriptionContext';
import { UserStatsProvider } from '../context/UserStatsContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <UserStatsProvider>{children}</UserStatsProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
