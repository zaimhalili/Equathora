import React from 'react';
import { Link } from 'react-router-dom';
import { FaCommentDots } from 'react-icons/fa';

const FeedbackBanner = () => {
    return (
        <div className="w-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] text-white py-2 px-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-[Sansation] shadow-md sticky top-0 z-40">
            <FaCommentDots className="text-sm sm:text-base" />
            <span className="font-medium">
                Help us improve Equathora!{' '}
                <Link
                    to="/feedback"
                    className="!underline decoration-2 underline-offset-2 !text-yellow-300 font-semibold hover:!text-yellow-400 transition-colors duration-200"
                    title='Click to share your feedback! It is really helpful to us!'
                >
                    Click here to share your feedback!
                </Link>
            </span>
        </div>
    );
};

export default FeedbackBanner;
