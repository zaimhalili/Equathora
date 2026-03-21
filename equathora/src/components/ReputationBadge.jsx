import React from 'react';

const TIERS = ['Rookie', 'Trailblazer', 'Strategist', 'Mastermind', 'Legend'];

const getTierLabel = (level) => {
    if (level >= 25) return TIERS[4];
    if (level >= 15) return TIERS[3];
    if (level >= 10) return TIERS[2];
    if (level >= 5) return TIERS[1];
    return TIERS[0];
};

const ReputationBadge = ({
    value = 0,
    currentStreak = 0,
    longestStreak = 0,
    problemsSolved = 0
}) => {
    const level = Math.max(1, Math.floor(value / 100) + 1);
    const tierLabel = getTierLabel(level);
    const progressPercent = Math.min(100, (value % 100));

    return (
        <div className="bg-white/95 border border-[rgba(43,45,66,0.1)] rounded-md shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-4 flex flex-col gap-3 w-full">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--french-gray)] font-semibold">Reputation</p>
                    <p className="text-3xl font-[Sansation] font-bold text-[var(--secondary-color)]">{value}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--secondary-color)]">Level {level}</p>
                    <p className="text-xs text-[var(--french-gray)]">{tierLabel}</p>
                </div>
            </div>

            <div className="w-full h-2 rounded-full bg-[rgba(43,45,66,0.08)] overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] transition-[width] duration-500"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            <div className="flex justify-between text-xs font-medium text-[var(--secondary-color)]">
                <span>✓ {problemsSolved} solves</span>
                <span className='flex gap-1'>
                    <svg className="w-4 h-4" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="icon-gradient-fire-navbar" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                <stop offset="100%" stopColor="var(--accent-color)" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#icon-gradient-fire-navbar)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
                    </svg> {currentStreak} streak ({longestStreak} best)
                </span>
            </div>
        </div>
    );
};

export default ReputationBadge;
