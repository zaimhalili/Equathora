import React from 'react';
import { FaBell } from 'react-icons/fa';
import useNotifications from '@/hooks/useNotifications';

const NotificationsBell = () => {
    const {unreadCount} = useNotifications();

    return (
        <div className="relative flex items-center">
            <button
                aria-label="Notifications"
                className="p-2 text-gray-300 hover:text-white transition"
            >
                <FaBell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default NotificationsBell;