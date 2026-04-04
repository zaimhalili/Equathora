import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const EquathoraBriefsSuccessModal = ({ onClose }) => {
    return (
        <div className="p-8 sm:p-10 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-white flex items-center justify-center shadow-lg shadow-[var(--dark-accent-color)]/30">
                <FaCheckCircle className="text-5xl" />
            </div>

            <h3 className="pt-6 text-3xl font-bold font-[Sansation] text-[var(--secondary-color)]">
                You Are In
            </h3>
            <p className="pt-3 text-[var(--secondary-color)]/70 leading-relaxed max-w-lg mx-auto">
                You are now subscribed to Equathora Briefs. Watch your inbox for curated updates, new challenge drops, and launch news.
            </p>

            <button
                type="button"
                onClick={onClose}
                className="mt-8 px-10 py-3 !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-white font-semibold rounded-md hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] transition-all cursor-pointer active:scale-95"
            >
                Done
            </button>
        </div>
    );
};

export default EquathoraBriefsSuccessModal;
