import { useState, useEffect, useCallback } from 'react';
import { getUnreadCount, NOTIFICATION_EVENTS } from '../lib/notificationService';

export function useNotifications() {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnread = useCallback(async () => {
        try {
            const count = await getUnreadCount();
            setUnreadCount(count);
        } catch (err) {
            console.error('Failed to fetch unread notifications:', err);
        }
    }, []);

    useEffect(() => {
        fetchUnread();

        const handleFocus = () => fetchUnread();
        window.addEventListener('focus', handleFocus);
        window.addEventListener(NOTIFICATION_EVENTS.CREATED, fetchUnread);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener(NOTIFICATION_EVENTS.CREATED, fetchUnread);
        };
    }, [fetchUnread]);

    return { unreadCount, refetchNotifications: fetchUnread };
}