// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import GuestAvatar from '../assets/images/guestAvatar.png';
import X from '../assets/images/x.svg';
import { supabase } from '../lib/supabaseClient';
import { clearUserData } from '../lib/userStorage';
import { getDailyProblemSlug } from '../lib/utils';
import { getStreakData } from '../lib/databaseService';

const Sidebar = ({ isOpen, onClose }) => {
    const [moreExpanded, setMoreExpanded] = useState(false);
    const [dailyProblemSlug, setDailyProblemSlug] = useState('');
    const [currentStreak, setCurrentStreak] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const loadDailyProblem = async () => {
            try {
                const slug = await getDailyProblemSlug();
                setDailyProblemSlug(slug);
            } catch (error) {
                console.error('Failed to load daily problem:', error);
            }
        };
        loadDailyProblem();
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const fetchStreak = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;
                
                const streakData = await getStreakData();
                setCurrentStreak(streakData?.current_streak || 0);
            } catch (error) {
                console.error('Failed to fetch streak:', error);
            }
        };
        fetchStreak();
    }, [isOpen]);

    async function LogOut() {
        await clearUserData();
        await supabase.auth.signOut();
        onClose();
        navigate('/login');
    }

    const sidebarItems = [
        {
            to: `/problems/${dailyProblemSlug}`,
            text: 'Daily Challenge',
            description: 'Solve today\'s problem',
            icon: <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                <defs>
                    <linearGradient id="icon-gradient-calendar" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-calendar)" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
            </svg>
        },
        {
            to: '/learn',
            text: 'Learn',
            description: 'Practice problems',
            icon: <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                <defs>
                    <linearGradient id="icon-gradient-book" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-book)" d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
            </svg>
        },
        {
            to: '/leaderboards/global',
            text: 'Leaderboards',
            description: 'View rankings',
            icon: <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                <defs>
                    <linearGradient id="icon-gradient-chartbar" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-chartbar)" d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm128-64V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64-32c17.7 0 32 14.3 32 32V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32zM480 96V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32z" />
            </svg>
        },
        {
            to: '/achievements/recent',
            text: 'Achievements',
            description: 'Track your progress',
            icon: <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                <defs>
                    <linearGradient id="icon-gradient-trophy" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-trophy)" d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H358.0c-20.9 0-37.9-17-37.9-37.9c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z" />
            </svg>
        }
    ];

    const moreItems = [
        {
            to: '/applymentor',
            text: 'Become a Mentor',
            description: 'Guide students',
            icon: <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                <defs>
                    <linearGradient id="icon-gradient-graduate" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-graduate)" d="M219.3 .5c3.1-.6 6.3-.6 9.4 0l200 40C439.9 42.7 448 52.6 448 64s-8.1 21.3-19.3 23.5L352 102.9V160c0 70.7-57.3 128-128 128s-128-57.3-128-128V102.9L48 93.3v65.1l15.7 78.4c.9 4.7-.3 9.6-3.3 13.3s-7.6 5.9-12.4 5.9H16c-4.8 0-9.3-2.1-12.4-5.9s-4.3-8.6-3.3-13.3L16 158.4V86.6C6.5 83.3 0 74.3 0 64C0 52.6 8.1 42.7 19.3 40.5l200-40zM111.9 327.7c10.5-3.4 21.8 .4 29.4 8.5l71 75.5c6.3 6.7 17 6.7 23.3 0l71-75.5c7.6-8.1 18.9-11.9 29.4-8.5C401 348.6 448 409.4 448 481.3c0 17-13.8 30.7-30.7 30.7H30.7C13.8 512 0 498.2 0 481.3c0-71.9 47-132.7 111.9-153.6z" />
            </svg>
        },
        {
            to: '/helpCenter',
            text: 'Help Center',
            description: 'FAQs and support',
            icon: <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                <defs>
                    <linearGradient id="icon-gradient-question" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-question)" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
            </svg>
        },
        {
            to: '/systemupdates',
            text: 'System Updates',
            description: 'Latest features',
            icon: <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                <defs>
                    <linearGradient id="icon-gradient-bullhorn" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-bullhorn)" d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32zm-64 76.7V240 371.3C357.2 317.8 280.5 288 200.7 288H192V192h8.7c79.8 0 156.5-29.8 215.3-83.3z" />
            </svg>
        },
        {
            to: '/about',
            text: 'About Equathora',
            description: 'Our mission',
            icon: <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                <defs>
                    <linearGradient id="icon-gradient-info" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-info)" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
        }
    ];

    return (
        <>
            {/* Overlay click closes sidebar */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside
                id="sidebar"
                style={{ right: isOpen ? '0' : '-320px' }}
            >
                <div className="sidebar-header">
                    <div className="sidebar-close" onClick={onClose}>
                        <img src={X} alt="Close" className="x-icon" />
                    </div>
                </div>

                <div className="sidebar-content">
                    <div className="sidebar-profile">
                        <Link to="/profile/myprofile" className="sidebar-profile-link" onClick={onClose}>
                            <img src={GuestAvatar} alt="avatar" className="sidebar-avatar" />
                            <div className="sidebar-profile-info">
                                <h4>Your Profile</h4>
                                <p>View & edit</p>
                            </div>
                        </Link>
                    </div>

                    {/* Streak Display */}
                    <Link to="/achievements/stats" className="sidebar-streak" onClick={onClose}>
                        <div className="sidebar-streak-icon">
                            <svg className="w-6 h-6" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="icon-gradient-fire-sidebar" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                        <stop offset="100%" stopColor="var(--accent-color)" />
                                    </linearGradient>
                                </defs>
                                <path fill="url(#icon-gradient-fire-sidebar)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
                            </svg>
                        </div>
                        <div className="sidebar-streak-text">
                            <h4>{currentStreak} Day Streak</h4>
                            <p>Keep solving daily!</p>
                        </div>
                    </Link>

                    <nav className="sidebar-nav">
                        {sidebarItems.map((item, index) => {
                            return (
                                <Link
                                    key={index}
                                    to={item.to}
                                    className="sidebar-item"
                                    onClick={onClose}
                                >
                                    <div className="sidebar-item-icon">
                                        {item.icon}
                                    </div>
                                    <div className="sidebar-item-text">
                                        <h4>{item.text}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                </Link>
                            );
                        })}

                        {/* More Section - Expandable */}
                        <div className="sidebar-more-section">
                            <button
                                className={`sidebar-more-toggle ${moreExpanded ? 'expanded' : ''}`}
                                onClick={() => setMoreExpanded(!moreExpanded)}
                            >
                                <div className="sidebar-more-header">
                                    <div className="sidebar-item-text">
                                        <h4>More</h4>
                                        <p>Additional options</p>
                                    </div>
                                    <svg
                                        className="sidebar-arrow"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                    >
                                        <path
                                            d="M5 7.5L10 12.5L15 7.5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </button>

                            <div className={`sidebar-more-content ${moreExpanded ? 'expanded' : ''}`}>
                                {moreItems.map((item, index) => {
                                    return (
                                        <Link
                                            key={index}
                                            to={item.to}
                                            className="sidebar-item sidebar-sub-item"
                                            onClick={onClose}
                                        >
                                            <div className="sidebar-item-icon">
                                                {item.icon}
                                            </div>
                                            <div className="sidebar-item-text">
                                                <h4>{item.text}</h4>
                                                <p>{item.description}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </nav>

                    <div className="sidebar-footer">
                        <button
                            onClick={() => {
                                LogOut();
                            }}
                            className="sidebar-logout"
                        >
                            <div className="sidebar-item-icon">
                                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                                    <defs>
                                        <linearGradient id="icon-gradient-logout" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                            <stop offset="100%" stopColor="var(--accent-color)" />
                                        </linearGradient>
                                    </defs>
                                    <path fill="url(#icon-gradient-logout)" d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                                </svg>
                            </div>
                            <div className="sidebar-item-text">
                                <h4>Sign Out</h4>
                                <p>Securely log out</p>
                            </div>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;