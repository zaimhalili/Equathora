import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo/TransparentFullLogo.png';

const NavigationBar = () => {
    return (
        <nav className="w-full border-b border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm">
            <div className="w-full flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
                <Link to="/" className="flex items-center gap-3 w-40">
                    <img src={Logo} alt="Equathora Logo" />
                </Link>
                <div className="flex items-center gap-3 md:gap-4 text-sm font-semibold">
                    <Link to="/about" className="hidden sm:inline-block hover:text-[var(--accent-color)] transition-colors">About</Link>
                    <Link to="/helpCenter" className="hidden sm:inline-block hover:text-[var(--accent-color)] transition-colors">Help</Link>
                    <Link
                        to="/dashboard"
                        className="rounded-md border-2 border-[var(--accent-color)] px-4 md:px-5 py-2 text-[var(--accent-color)] transition-all hover:bg-[var(--accent-color)] hover:text-white shadow-sm hover:shadow-md"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
