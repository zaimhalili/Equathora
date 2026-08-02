import React, { useEffect } from 'react';
import '../Sidebar.css';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';


const SidebarLanding = ({ isOpen, onClose }) => {

    useEffect(() => {
        if (!isOpen) return;

        const scrollY = window.scrollY;
        const originalBodyOverflow = document.body.style.overflow;
        const originalBodyPosition = document.body.style.position;
        const originalBodyTop = document.body.style.top;
        const originalBodyWidth = document.body.style.width;
        const originalBodyTouchAction = document.body.style.touchAction;
        const originalHtmlOverflow = document.documentElement.style.overflow;

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.touchAction = 'none';

        return () => {
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.overflow = originalBodyOverflow;
            document.body.style.position = originalBodyPosition;
            document.body.style.top = originalBodyTop;
            document.body.style.width = originalBodyWidth;
            document.body.style.touchAction = originalBodyTouchAction;
            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);

    const sidebarItems = [
        {
            to: '/login',
            text: 'Get Started',
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
    ];
    return (
        <>
            <svg className="sidebar-icon-defs" aria-hidden="true" focusable="false">
                <defs>
                    <linearGradient id="sidebar-icon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
            </svg>
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
                    <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="sidebar-content">
                    <nav className="sidebar-nav">
                        {sidebarItems.map((item, index) => {
                            return (
                                <Link
                                    key={index}
                                    to={item.to}
                                    className={`sidebar-item ${item.className || ''}`}
                                    onClick={onClose}
                                >
                                    <div className="sidebar-item-icon">
                                        {item.icon}
                                    </div>
                                    <div className="sidebar-item-text">
                                        <h4 style={item.customTextStyle}>{item.text}</h4>
                                        <p style={item.customTextStyle}>{item.description}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default SidebarLanding;