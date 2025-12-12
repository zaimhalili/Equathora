import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaTimes } from 'react-icons/fa';

const WaitlistBanner = () => {
    const [isVisible, setIsVisible] = useState(!localStorage.getItem('waitlist_banner_dismissed'));

    const handleDismiss = () => {
        localStorage.setItem('waitlist_banner_dismissed', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="w-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] text-white py-3 px-4 flex items-center justify-center relative z-40">
            <div className="flex items-center gap-3 max-w-[1500px] w-full">
                <FaUsers className="text-xl flex-shrink-0" />
                <p className="text-sm md:text-base flex-1 text-center">
                    <strong>Join 500+ on our waitlist!</strong> Get early access to premium features.
                    <Link to="/waitlist" className="ml-2 underline font-semibold hover:text-yellow-300 transition-colors">Learn more →</Link>
                </p>
                <button
                    onClick={handleDismiss}
                    className="text-white hover:bg-white/20 rounded-full p-1 transition-colors flex-shrink-0"
                    aria-label="Dismiss banner"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default WaitlistBanner;
