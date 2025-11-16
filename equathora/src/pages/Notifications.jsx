import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Images removed per design update (compact, text-only notifications)

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Achievement Unlocked!', message: 'You solved 10 problems in a row. Keep it up!', read: false, time: '2 hours ago', to: '/achievements' },
    { id: 2, title: 'Mentor replied to your question', message: 'Sarah Johnson has answered your question about calculus derivatives.', read: false, time: '5 hours ago', to: '/helpCenter' },
    { id: 3, title: 'New problem available', message: 'A new advanced algebra problem has been added to your track.', read: true, time: '1 day ago', to: '/learn' },
    { id: 4, title: 'You climbed the leaderboard!', message: 'You are now #15 on the global leaderboard. Amazing progress!', read: true, time: '2 days ago', to: '/leaderboards/global' },
    { id: 5, title: 'Streak milestone reached', message: "You have maintained a 7-day solving streak. Don't break it!", read: false, time: '3 days ago', to: '/achievements/stats' },
    { id: 6, title: 'Friend request accepted', message: 'Alex Chen accepted your friend request and wants to compete!', read: true, time: '4 days ago', to: '/leaderboards/friends' },
  ]);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectNotification = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(nId => nId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const markAsRead = () => {
    setNotifications(notifications.map(n =>
      selectedIds.includes(n.id) ? { ...n, read: true } : n
    ));
    setSelectedIds([]);
    setSelectAll(false);
  };

  const markAsUnread = () => {
    setNotifications(notifications.map(n =>
      selectedIds.includes(n.id) ? { ...n, read: false } : n
    ));
    setSelectedIds([]);
    setSelectAll(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Navbar />
      <div className=" bg-[var(--main-color)] sm:px-10 lg:px-18 xl:px-36">

        {/* Header + Filters on same line (md+) */}
        <div className="px-6 md:px-16 lg:px-24 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl text-center lg:text-left lg:text-4xl xl:text-5xl font-bold text-[var(--secondary-color)] font-['Public_Sans']">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-[var(--accent-color)] text-white text-sm font-semibold px-3 py-1 rounded-full">{unreadCount}</span>
              )}
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap pb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-5 h-5 accent-[var(--accent-color)] cursor-pointer"
                />
                <span className="text-[var(--secondary-color)] font-medium font-['Inter'] text-sm">Select all</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAsRead}
                  className="px-3 py-1.5 bg-white text-[var(--secondary-color)] rounded-md border-2 border-[var(--french-gray)] font-['Inter'] font-semibold text-sm"
                >
                  Mark as read
                </button>
                <button
                  onClick={markAsUnread}
                  className="px-3 py-1.5 bg-white text-[var(--secondary-color)] rounded-md border-2 border-[var(--french-gray)] font-['Inter'] font-semibold text-sm"
                >
                  Mark as unread
                </button>
              </div>
            </div>
          </div>
          <p className="text-[var(--mid-main-secondary)] font-['Inter'] mt-2 text-sm">Stay updated with your progress</p>
        </div>

        {/* Notifications List - Full Width with Side Spacing */}
        <div className="px-6 md:px-16 lg:px-24 py-6">
          <div className="flex flex-col gap-5 md:gap-6">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-xl p-16 text-center gap-20">
                <h3 className="text-2xl font-bold text-[var(--secondary-color)] mb-2 font-['Public_Sans']">
                  No notifications
                </h3>
                <p className="text-[var(--mid-main-secondary)] font-['Inter']">
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`cursor-pointer rounded-lg p-4 md:p-5 flex items-start md:items-center gap-3 md:gap-5 transition-all border-l-4 ${!notification.read ? 'bg-blue-50 border-[var(--accent-color)] hover:bg-blue-100' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => handleSelectNotification(notification.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 md:w-5 md:h-5 accent-[var(--accent-color)] cursor-pointer flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="block">
                      <p className={`font-['Inter'] mb-1 leading-snug text-xs md:text-sm ${!notification.read ? 'text-[var(--secondary-color)] font-semibold' : 'text-[var(--secondary-color)]'}`}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-[var(--french-gray)] font-['Inter']">
                        {notification.time}
                      </span>
                    </div>
                  </div>

                  {!notification.read && (
                    <div className="w-2.5 h-2.5 bg-[var(--accent-color)] rounded-full flex-shrink-0"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Notifications;