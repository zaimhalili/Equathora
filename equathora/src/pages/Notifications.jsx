import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import achievements from '../assets/images/achievements.svg';
import mentoring from '../assets/images/mentoring.svg';
import pDemo from '../assets/images/pDemo.svg';
import leaderboards from '../assets/images/leaderboards.svg';
import progress from '../assets/images/Progress.svg';
import smily from '../assets/images/smily.svg';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Achievement Unlocked!', message: 'You solved 10 problems in a row. Keep it up!', read: false, time: '2 hours ago', image: achievements },
    { id: 2, title: 'Mentor replied to your question', message: 'Sarah Johnson has answered your question about calculus derivatives.', read: false, time: '5 hours ago', image: mentoring },
    { id: 3, title: 'New problem available', message: 'A new advanced algebra problem has been added to your track.', read: true, time: '1 day ago', image: pDemo },
    { id: 4, title: 'You climbed the leaderboard!', message: 'You are now #15 on the global leaderboard. Amazing progress!', read: true, time: '2 days ago', image: leaderboards },
    { id: 5, title: 'Streak milestone reached', message: 'You have maintained a 7-day solving streak. Don\'t break it!', read: false, time: '3 days ago', image: progress },
    { id: 6, title: 'Friend request accepted', message: 'Alex Chen accepted your friend request and wants to compete!', read: true, time: '4 days ago', image: smily },
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
      <div className="min-h-screen bg-[var(--main-color)]">

        {/* Header + Filters on same line (md+) */}
        <div className="px-6 md:px-16 lg:px-24 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-bold text-[var(--secondary-color)] font-['Public_Sans']">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-[var(--accent-color)] text-white text-sm font-semibold px-3 py-1 rounded-full">{unreadCount}</span>
              )}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-5 h-5 accent-[var(--accent-color)] cursor-pointer"
                />
                <span className="text-[var(--secondary-color)] font-medium font-['Inter']">Select all</span>
              </label>
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={markAsRead}
                    className="px-4 py-2 bg-white text-[var(--secondary-color)] rounded-lg border-2 border-[var(--french-gray)] font-['Inter'] font-medium"
                  >
                    Mark as read
                  </button>
                  <button
                    onClick={markAsUnread}
                    className="px-4 py-2 bg-white text-[var(--secondary-color)] rounded-lg border-2 border-[var(--french-gray)] font-['Inter'] font-medium"
                  >
                    Mark as unread
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-[var(--mid-main-secondary)] font-['Inter'] mt-2">Stay updated with your progress</p>
        </div>

        {/* Notifications List - Full Width with Side Spacing */}
        <div className="px-6 md:px-16 lg:px-24 py-8">
          <div className="space-y-8">
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
                  className={`bg-white rounded-xl p-6 flex items-center gap-6 transition-all ${!notification.read ? 'border-l-4 border-[var(--accent-color)]' : ''
                    } ${selectedIds.includes(notification.id) ? 'bg-gray-50' : ''
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="w-5 h-5 accent-[var(--accent-color)] cursor-pointer flex-shrink-0"
                  />

                  <img
                    src={notification.image}
                    alt={notification.title}
                    className="w-16 h-16 flex-shrink-0 object-contain"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="font-bold text-[var(--secondary-color)] font-['Public_Sans'] text-lg">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2.5 h-2.5 bg-[var(--accent-color)] rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[var(--mid-main-secondary)] font-['Inter'] mb-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <span className="text-sm text-[var(--french-gray)] font-['Inter']">
                      {notification.time}
                    </span>
                  </div>
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