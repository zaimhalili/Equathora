// Sidebar.jsx
import React, { useState } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import GuestAvatar from '../assets/images/guestAvatar.png';
import X from '../assets/images/x.svg';
// Import icons for sidebar items
import Dashboard from '../assets/images/logo.png';
import Journey from '../assets/images/journey.svg';
import Choice from '../assets/images/choice.svg';
import Leaderboards from '../assets/images/leaderboards.svg';
import Notifications from '../assets/images/notificationsDD.svg';
import Achievements from '../assets/images/achievementsDD.svg';
import LogoutIMG from '../assets/images/logout.svg';
import Mentoring from '../assets/images/mentoring.svg';
import Faq from '../assets/images/faq.svg';
import AboutUs from '../assets/images/about.svg';
import Premium from '../assets/images/Premium.svg';
import Settings from '../assets/images/settings.svg';

const Sidebar = ({ isOpen, onClose }) => {
    const [moreExpanded, setMoreExpanded] = useState(false);

    function LogOut() {
        alert("Logged out successfully");
    }

    const sidebarItems = [
        {
            to: '/dashboard',
            text: 'Dashboard',
            description: 'Your learning hub',
            image: Dashboard
        },
        {
            to: '/learn',
            text: 'Learn',
            description: 'Practice problems',
            image: Journey
        },
        {
            to: '/discover',
            text: 'Discover',
            description: 'Explore new topics',
            image: Choice
        },
        {
            to: '/leaderboards/global',
            text: 'Leaderboards',
            description: 'View rankings',
            image: Leaderboards
        },
        {
            to: '/notifications',
            text: 'Notifications',
            description: 'Stay updated',
            image: Notifications
        },
        {
            to: '/achievements',
            text: 'Achievements',
            description: 'Track your progress',
            image: Achievements
        }
    ];

    const moreItems = [
        {
            to: '/applymentor',
            text: 'Become a Mentor',
            description: 'Guide students',
            image: Mentoring
        },
        {
            to: '/settings',
            text: 'Settings',
            description: 'Manage preferences',
            image: Settings
        },
        {
            to: '/premium',
            text: 'Upgrade to Premium',
            description: 'Unlock all features',
            image: Premium
        },
        {
            to: '/help',
            text: 'Help Center',
            description: 'FAQs and support',
            image: Faq
        },
        {
            to: '/about',
            text: 'About Equathora',
            description: 'Our mission',
            image: AboutUs
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
                        <Link to="/profile" className="sidebar-profile-link" onClick={onClose}>
                            <img src={GuestAvatar} alt="avatar" className="sidebar-avatar" />
                            <div className="sidebar-profile-info">
                                <h4>Your Profile</h4>
                                <p>View & edit</p>
                            </div>
                        </Link>
                    </div>

                    <nav className="sidebar-nav">
                        {sidebarItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.to}
                                className="sidebar-item"
                                onClick={onClose}
                            >
                                <img src={item.image} alt={item.text} className="sidebar-item-icon" />
                                <div className="sidebar-item-text">
                                    <h4>{item.text}</h4>
                                    <p>{item.description}</p>
                                </div>
                            </Link>
                        ))}

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
                                {moreItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.to}
                                        className="sidebar-item sidebar-sub-item"
                                        onClick={onClose}
                                    >
                                        <img src={item.image} alt={item.text} className="sidebar-item-icon" />
                                        <div className="sidebar-item-text">
                                            <h4>{item.text}</h4>
                                            <p>{item.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </nav>

                    <div className="sidebar-footer">
                        <button
                            onClick={() => {
                                LogOut();
                                onClose();
                            }}
                            className="sidebar-logout"
                        >
                            <img src={LogoutIMG} alt="Logout" className="sidebar-item-icon" />
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