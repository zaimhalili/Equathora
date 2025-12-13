import React, { useState } from 'react';
import { FaRocket, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BetaBanner = () => {
    const [isVisible, setIsVisible] = useState(!localStorage.getItem('beta_banner_dismissed'));

    const handleDismiss = () => {
        localStorage.setItem('beta_banner_dismissed', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 flex items-center justify-center relative z-50">
            <div className="flex items-center gap-3 max-w-[1500px] w-full">
                <FaRocket className="text-xl flex-shrink-0" />
                <p className="text-sm md:text-base flex-1 text-center">
                    <strong>🎉 Beta Launch!</strong> We're in MVP mode - your progress is saved locally.
                    <span className="hidden md:inline"> User accounts and cloud sync coming soon!</span>
                    <Link to="/waitlist" className="ml-2 underline font-semibold hover:text-yellow-300 transition-colors">{' '}Join Waitlist →</Link>
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

export default BetaBanner;
