// Sidebar.jsx
import React from 'react';
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

const Sidebar = ({ isOpen, onClose }) => {
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