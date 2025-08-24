// Sidebar.jsx
import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import GuestAvatar from '../assets/images/guestAvatar.png';
import X from '../assets/images/x.svg';

const Sidebar = ({ isOpen, onClose }) => {
    function LogOut() {
        alert("Logged out successfully");
    }
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
                    <li onClick={onClose} className="sidebar-pages" id='close-sidebar'>
                        <img src={X} alt="Close icon X" id='x-icon'/>
                    </li>
                    <li>
                        <Link to="/dashboard" className="sidebar-pages">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/learn" className="sidebar-pages">
                            Learn
                        </Link>
                    </li>
                    <li>
                        <Link to="/discover" className="sidebar-pages">
                            Discover
                        </Link>
                    </li>
                    <li>
                        <Link to="/more" className="sidebar-pages">
                            More
                        </Link>
                    </li>
                    <li>
                        <Link to="/notifications" className="sidebar-pages">
                            Notifications
                        </Link>
                    </li>
                    <li>
                        <Link to="/achievements" className="sidebar-pages">
                            Achievements
                        </Link>
                    </li>
                    <li>
                        <button type="submit" onClick={LogOut} className="sidebar-pages" id='logout'>
                            Logout
                        </button>
                    </li>
                    <li>
                        <Link to="/profile" id='sidebar-avatar'>
                            <img src={GuestAvatar} alt="avatar" id="sidebar-avatarIMG" />
                        </Link>
                    </li>
                    
                </ul>
            </aside>
        </>
    );
};

export default Sidebar;