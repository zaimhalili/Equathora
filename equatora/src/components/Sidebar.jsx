// Sidebar.jsx
import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import GuestAvatar from '../assets/images/guestAvatar.png';
import X from '../assets/images/x.svg';

const Sidebar = ({ isOpen, onClose }) => {
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
                style={{ right: isOpen ? '0' : '-300px' }}
            >
                <ul>
                    <li onClick={onClose} className="navbar-pages" id='close-sidebar'>
                        <img src={X} alt="Close icon X" id='x-icon'/>
                    </li>
                    <li>
                        <Link to="/dashboard" className="navbar-pages">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/learn" className="navbar-pages">
                            Learn
                        </Link>
                    </li>
                    <li>
                        <Link to="/discover" className="navbar-pages">
                            Discover
                        </Link>
                    </li>
                    <li>
                        <Link to="/more" className="navbar-pages">
                            More
                        </Link>
                    </li>
                    <li>
                        <Link to="/notifications" className="navbar-pages">
                            Notifications
                        </Link>
                    </li>
                    <li>
                        <Link to="/achievements" className="navbar-pages">
                            Achievements
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" id='sidebar-avatar'>
                            <img src={GuestAvatar} alt="avatar" id="avatarIMG" />
                        </Link>
                    </li>

                    {/* Close button */}
                    
                </ul>
            </aside>
        </>
    );
};

export default Sidebar;