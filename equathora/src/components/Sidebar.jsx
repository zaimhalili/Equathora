// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import GuestAvatar from '../assets/images/guestAvatar.png';
import X from '../assets/images/x.svg';
import { supabase } from '../lib/supabaseClient';
import { clearUserData } from '../lib/userStorage';
// Import React Icons
import { FaCalendarDay, FaBook, FaTrophy, FaChartBar, FaUserGraduate, FaQuestionCircle, FaBullhorn, FaInfoCircle, FaCrown, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { getDailyProblemSlug } from '../lib/utils';

const Sidebar = ({ isOpen, onClose }) => {
    const [moreExpanded, setMoreExpanded] = useState(false);
    const [dailyProblemSlug, setDailyProblemSlug] = useState('');
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
            icon: FaCalendarDay
        },
        {
            to: '/learn',
            text: 'Learn',
            description: 'Practice problems',
            icon: FaBook
        },
        {
            to: '/leaderboards/global',
            text: 'Leaderboards',
            description: 'View rankings',
            icon: FaChartBar
        },
        {
            to: '/achievements/recent',
            text: 'Achievements',
            description: 'Track your progress',
            icon: FaTrophy
        }
    ];

    const moreItems = [
        {
            to: '/applymentor',
            text: 'Become a Mentor',
            description: 'Guide students',
            icon: FaUserGraduate
        },
        {
            to: '/helpCenter',
            text: 'Help Center',
            description: 'FAQs and support',
            icon: FaQuestionCircle
        },
        {
            to: '/systemupdates',
            text: 'System Updates',
            description: 'Latest features',
            icon: FaBullhorn
        },
        {
            to: '/about',
            text: 'About Equathora',
            description: 'Our mission',
            icon: FaInfoCircle
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

                    <nav className="sidebar-nav">
                        {sidebarItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={index}
                                    to={item.to}
                                    className="sidebar-item"
                                    onClick={onClose}
                                >
                                    <IconComponent className="sidebar-item-icon" style={{ fontSize: '24px' }} />
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
                                    const IconComponent = item.icon;
                                    return (
                                        <Link
                                            key={index}
                                            to={item.to}
                                            className="sidebar-item sidebar-sub-item"
                                            onClick={onClose}
                                        >
                                            <IconComponent className="sidebar-item-icon" style={{ fontSize: '24px' }} />
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
                            <FaSignOutAlt className="sidebar-item-icon" style={{ fontSize: '24px' }} />
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