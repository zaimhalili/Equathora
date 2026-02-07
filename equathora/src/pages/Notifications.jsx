import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    getNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    markNotificationsReadByIds,
    markNotificationsUnreadByIds,
    deleteNotification,
    deleteAllNotifications,
    NOTIFICATION_TYPES,
} from '../lib/notificationService';

// ============================================================================
// NOTIFICATION TYPE CONFIG
// ============================================================================

const typeConfig = {
    achievement: {
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 576 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="notif-grad-achievement" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="var(--dark-accent-color)" /><stop offset="100%" stopColor="var(--accent-color)" /></linearGradient></defs>
                <path fill="url(#notif-grad-achievement)" d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0z" />
            </svg>
        ),
        label: 'Achievement',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-400',
        badgeColor: 'bg-amber-100 text-amber-700',
    },
    streak: {
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="notif-grad-streak" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="var(--dark-accent-color)" /><stop offset="100%" stopColor="var(--accent-color)" /></linearGradient></defs>
                <path fill="url(#notif-grad-streak)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
            </svg>
        ),
        label: 'Streak',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-400',
        badgeColor: 'bg-orange-100 text-orange-700',
    },
    system: {
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="notif-grad-system" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="var(--dark-accent-color)" /><stop offset="100%" stopColor="var(--accent-color)" /></linearGradient></defs>
                <path fill="url(#notif-grad-system)" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
        ),
        label: 'System',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-400',
        badgeColor: 'bg-blue-100 text-blue-700',
    },
    friend: {
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 640 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="notif-grad-friend" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="var(--dark-accent-color)" /><stop offset="100%" stopColor="var(--accent-color)" /></linearGradient></defs>
                <path fill="url(#notif-grad-friend)" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
            </svg>
        ),
        label: 'Friends',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-400',
        badgeColor: 'bg-purple-100 text-purple-700',
    },
    problem: {
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="notif-grad-problem" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="var(--dark-accent-color)" /><stop offset="100%" stopColor="var(--accent-color)" /></linearGradient></defs>
                <path fill="url(#notif-grad-problem)" d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
            </svg>
        ),
        label: 'Problem',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-400',
        badgeColor: 'bg-green-100 text-green-700',
    },
    leaderboard: {
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="notif-grad-leaderboard" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="var(--dark-accent-color)" /><stop offset="100%" stopColor="var(--accent-color)" /></linearGradient></defs>
                <path fill="url(#notif-grad-leaderboard)" d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm128-64V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32zM480 96V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32z" />
            </svg>
        ),
        label: 'Leaderboard',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-400',
        badgeColor: 'bg-indigo-100 text-indigo-700',
    },
};

// ============================================================================
// HELPERS
// ============================================================================

const formatTimeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
};

// ============================================================================
// NOTIFICATIONS PAGE
// ============================================================================

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', or a type
    const [actionLoading, setActionLoading] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const loadNotifications = useCallback(async () => {
        try {
            const data = await getNotifications({ limit: 100 });
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    // ========================================================================
    // SELECTION
    // ========================================================================
    const selectAll = selectedIds.length === filteredNotifications().length && filteredNotifications().length > 0;

    function filteredNotifications() {
        let result = notifications;
        if (filter === 'unread') result = result.filter(n => !n.read);
        else if (filter !== 'all') result = result.filter(n => n.type === filter);
        return result;
    }

    const handleSelectAll = () => {
        const filtered = filteredNotifications();
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filtered.map(n => n.id));
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    // ========================================================================
    // ACTIONS
    // ========================================================================
    const handleMarkSelectedRead = async () => {
        if (selectedIds.length === 0) return;
        setActionLoading(true);
        await markNotificationsReadByIds(selectedIds);
        setNotifications(prev => prev.map(n => selectedIds.includes(n.id) ? { ...n, read: true } : n));
        setSelectedIds([]);
        setActionLoading(false);
    };

    const handleMarkSelectedUnread = async () => {
        if (selectedIds.length === 0) return;
        setActionLoading(true);
        await markNotificationsUnreadByIds(selectedIds);
        setNotifications(prev => prev.map(n => selectedIds.includes(n.id) ? { ...n, read: false } : n));
        setSelectedIds([]);
        setActionLoading(false);
    };

    const handleMarkAllRead = async () => {
        setActionLoading(true);
        await markAllNotificationsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setActionLoading(false);
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Delete ${selectedIds.length} notification(s)?`)) return;
        setActionLoading(true);
        for (const id of selectedIds) {
            await deleteNotification(id);
        }
        setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)));
        setSelectedIds([]);
        setActionLoading(false);
    };

    const handleClearAll = async () => {
        if (!window.confirm('Delete all notifications? This cannot be undone.')) return;
        setActionLoading(true);
        await deleteAllNotifications();
        setNotifications([]);
        setActionLoading(false);
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await markNotificationRead(notification.id);
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    // ========================================================================
    // FILTERS
    // ========================================================================
    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'unread', label: `Unread (${unreadCount})` },
        { value: NOTIFICATION_TYPES.ACHIEVEMENT, label: 'Achievements' },
        { value: NOTIFICATION_TYPES.STREAK, label: 'Streak' },
        { value: NOTIFICATION_TYPES.SYSTEM, label: 'System' },
        { value: NOTIFICATION_TYPES.FRIEND, label: 'Friends' },
        { value: NOTIFICATION_TYPES.LEADERBOARD, label: 'Leaderboard' },
    ];

    const filtered = filteredNotifications();

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <>
            <Navbar />
            <main className="min-h-screen flex flex-col bg-[var(--main-color)] font-[Sansation,sans-serif] text-[var(--secondary-color)]">
                {/* Header */}
                <div className="w-full flex flex-col items-center gap-2 pt-8 pb-2 px-4">
                    <div className="flex items-center gap-3">
                        <h1 className="font-bold text-3xl lg:text-4xl">Notifications</h1>
                        {unreadCount > 0 && (
                            <span className="bg-[var(--accent-color)] text-white text-sm font-bold px-3 py-1 rounded-md">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-[var(--french-gray)]">Stay updated with your progress and activity</p>
                </div>

                {/* Content */}
                <div className="w-full flex flex-col gap-4 px-4 sm:px-8 lg:px-24 xl:px-36 pb-12 max-w-[1000px] self-center flex-1">

                    {/* Filter tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {filterOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => { setFilter(opt.value); setSelectedIds([]); }}
                                className={`px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${filter === opt.value
                                    ? 'bg-[var(--accent-color)] text-white'
                                    : 'bg-white text-[var(--secondary-color)] border border-[var(--french-gray)] hover:bg-gray-50'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="w-4 h-4 accent-[var(--accent-color)] cursor-pointer"
                            />
                            <span className="text-xs font-semibold">Select all</span>
                        </label>

                        <div className="flex items-center gap-2 flex-wrap">
                            {selectedIds.length > 0 && (
                                <>
                                    <button
                                        onClick={handleMarkSelectedRead}
                                        disabled={actionLoading}
                                        className="px-3 py-1.5 bg-white text-[var(--secondary-color)] rounded-md border border-[var(--french-gray)] text-xs font-semibold hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        Mark read
                                    </button>
                                    <button
                                        onClick={handleMarkSelectedUnread}
                                        disabled={actionLoading}
                                        className="px-3 py-1.5 bg-white text-[var(--secondary-color)] rounded-md border border-[var(--french-gray)] text-xs font-semibold hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        Mark unread
                                    </button>
                                    <button
                                        onClick={handleDeleteSelected}
                                        disabled={actionLoading}
                                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md border border-red-200 text-xs font-semibold hover:bg-red-100 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        Delete ({selectedIds.length})
                                    </button>
                                </>
                            )}
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    disabled={actionLoading}
                                    className="px-3 py-1.5 bg-[var(--accent-color)] text-white rounded-md text-xs font-semibold hover:bg-[var(--dark-accent-color)] transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    disabled={actionLoading}
                                    className="px-3 py-1.5 bg-white text-[var(--french-gray)] rounded-md border border-[var(--french-gray)] text-xs font-semibold hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notification list */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <svg className="animate-spin h-8 w-8 text-[var(--accent-color)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                <svg className="w-8 h-8 text-[var(--french-gray)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold">No notifications</h3>
                            <p className="text-sm text-[var(--french-gray)]">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <AnimatePresence>
                                {filtered.map(notification => {
                                    const config = typeConfig[notification.type] || typeConfig.system;
                                    return (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={`flex items-start gap-3 rounded-md p-4 transition-all cursor-pointer border-l-4 ${!notification.read
                                                ? `bg-white shadow-md ${config.borderColor}`
                                                : 'bg-gray-50/80 border-gray-200 shadow-sm'
                                                } hover:shadow-md`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(notification.id)}
                                                onChange={() => handleToggleSelect(notification.id)}
                                                onClick={e => e.stopPropagation()}
                                                className="w-4 h-4 accent-[var(--accent-color)] cursor-pointer shrink-0 translate-y-1"
                                            />

                                            <div className={`flex items-center justify-center w-10 h-10 rounded-md shrink-0 ${config.bgColor}`}>
                                                {config.icon}
                                            </div>

                                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${config.badgeColor}`}>
                                                        {config.label}
                                                    </span>
                                                    {!notification.read && (
                                                        <span className="w-2 h-2 bg-[var(--accent-color)] rounded-md shrink-0" />
                                                    )}
                                                </div>
                                                <p className={`text-sm leading-snug ${!notification.read ? 'font-semibold' : ''}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-[var(--french-gray)] leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <span className="text-[10px] text-[var(--french-gray)]">
                                                    {formatTimeAgo(notification.created_at)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Link to settings */}
                    <div className="flex justify-center pt-4">
                        <Link
                            to="/settings"
                            className="text-sm text-[var(--accent-color)] hover:underline font-semibold"
                        >
                            Manage notification preferences →
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Notifications;
