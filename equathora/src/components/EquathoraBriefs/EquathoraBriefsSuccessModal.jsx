import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import inbox_icon from '../../assets/images/inbox_icon.svg';

const EquathoraBriefsSuccessModal = ({ onClose }) => {
    return (
        <div className="flex items-center ">

            {/* Image */}
            <div className="hidden md:flex items-center justify-center w-full">
                <img
                    src={inbox_icon}
                    alt="Reading illustration"
                    className=" object-contain"
                />
            </div>

            <div className="p-8 sm:p-10 ">
                <div className="px-auto w-14 h-14 rounded-full bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-[var(--white)] flex items-center justify-center shadow-lg shadow-[var(--dark-accent-color)]/30">
                    <FaCheckCircle className="text-5xl" />
                </div>

                <h2 className="font-[Sansation] pt-5 uppercase tracking-wider">
                    <span className="block text-xl font-bold text-[var(--secondary-color)]">You Are</span>
                    <span className="block text-4xl font-extrabold !text-[var(--accent-color)] leading-tight">Officially In</span>
                </h2>
                <p className="pt-3 text-[var(--secondary-color)]/70 leading-relaxed max-w-lg px-auto py-5">
                    You are now subscribed to Equathora Briefs. Watch your inbox for curated updates, new challenge drops, and launch news.
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className="px-10 py-3 !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-[var(--white)] font-semibold rounded-md hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] transition-all cursor-pointer active:scale-95"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default EquathoraBriefsSuccessModal;
