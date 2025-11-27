import React from 'react';
import { Link } from 'react-router-dom';
import { FaCommentDots } from 'react-icons/fa';

const FeedbackBanner = () => {
    return (
        <div className="w-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] text-white py-2 px-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-[Inter] shadow-md">
            <FaCommentDots className="text-sm sm:text-base" />
            <span className="font-medium">
                Help us improve Equathora!{' '}
                <Link
                    to="/feedback"
                    className="underline font-semibold hover:text-yellow-400 transition-colors duration-200"
                >
                    Share your feedback
                </Link>
            </span>
        </div>
    );
};

export default FeedbackBanner;
