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
                <span>🔥 {currentStreak} streak ({longestStreak} best)</span>
            </div>
        </div>
    );
};

export default ReputationBadge;
