import React, { useEffect, useState } from 'react';
import LilArrow from '../assets/images/lilArrow.svg';
import { Link } from 'react-router-dom';
import { getUserStats } from '../lib/progressStorage';
import { problems } from '../data/problems';

const TOTAL_PROBLEMS = problems.length;
const fallbackStats = {
    problemsSolved: 0,
    accuracy: 0,
    currentStreak: 0,
    longestStreak: 0
};

const getInitialStats = () => {
    if (typeof window === 'undefined') {
        return fallbackStats;
    }
    try {
        return getUserStats() || fallbackStats;
    } catch (error) {
        console.warn('Unable to read user stats, using defaults', error);
        return fallbackStats;
    }
};

const YourTrack = () => {
    const [stats, setStats] = useState(() => getInitialStats());

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const refreshStats = () => {
            try {
                setStats(getUserStats());
            } catch (error) {
                console.warn('Failed to refresh stats', error);
            }
        };

        window.addEventListener('focus', refreshStats);
        window.addEventListener('storage', refreshStats);
        refreshStats();
        return () => {
            window.removeEventListener('focus', refreshStats);
            window.removeEventListener('storage', refreshStats);
        };
    }, []);

    const solved = Math.max(0, stats?.problemsSolved || 0);
    const total = Math.max(TOTAL_PROBLEMS, solved);
    const percentage = Math.min(100, (solved / (total || 1)) * 100);
    const nextMilestone = solved >= total
        ? total
        : Math.max(10, Math.ceil(solved / 10) * 10);
    const toNextMilestone = Math.max(0, nextMilestone - solved);
    const currentStreak = stats?.currentStreak || 0;
    const bestStreak = stats?.longestStreak || 0;
    const avgAccuracy = Math.max(0, Math.min(100, stats?.accuracy || 0));
    const totalAttempts = stats?.totalAttempts || solved || 0;
    const milestoneMessage = solved >= total
        ? 'All core problems cleared'
        : `${toNextMilestone} to next milestone`;

    const level = Math.max(1, Math.floor(solved / 10) + 1);

    const progressLabel = `You have solved ${solved} of ${total} problems`;

    return (
        <article className="flex flex-col lg:flex-row items-start justify-center w-full text-[var(--secondary-color)] mt-8 gap-8">
            <div className="flex flex-col w-full gap-3 p-0">
                <div className="flex items-center justify-between p-0">
                    <h3 className="font-[Inter] text-[var(--secondary-color)] text-2xl font-bold">
                        Your Track
                    </h3>
                    <span className="text-sm font-semibold text-[var(--accent-color)] bg-[rgba(217,4,41,0.1)] px-3 py-1 rounded-md">
                        Level {level}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between w-full gap-3 p-0">
                    <Link
                        to="/achievements/stats"
                        className="flex-1 h-6 bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md flex items-center relative transition-all duration-300 overflow-hidden group"
                    >
                        <div
                            className="h-full rounded-md bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] transition-all duration-500 relative"
                            role="progressbar"
                            aria-label={progressLabel}
                            aria-valuenow={Math.round(percentage)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            style={{ width: `${percentage}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </Link>
                    <Link
                        to="/achievements/stats"
                        className="w-10 h-10 flex items-center justify-center transition-transform duration-300 ease-in hover:translate-x-2 hover:scale-110"
                    >
                        <img src={LilArrow} alt="arrow" className="w-full h-full" />
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between p-0">
                    <div className="font-[Inter] text-base">
                        <span className="font-bold text-lg">{solved}</span>{' '}/{' '}{total}
                        <span className="text-sm pl-1">Problems Solved</span>
                    </div>
                    <div className="text-s">
                        <span className="font-semibold">{milestoneMessage}</span>
                    </div>
                </div>

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mt-2 p-0 md:max-w-1/2">
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md border border-[rgba(43,45,66,0.1)] shadow-[0_10px_10px_rgba(141,153,174,0.3)] p-3">
                        <div className="text-xs text-[var(--secondary-color)] font-medium mb-1">Current Streak</div>
                        <div className="text-2xl font-bold text-[var(--accent-color)] flex items-center gap-1">
                            🔥 {currentStreak}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md border border-[rgba(43,45,66,0.1)] shadow-[0_10px_10px_rgba(141,153,174,0.3)] p-3">
                        <div className="text-xs text-[var(--secondary-color)] font-medium mb-1">Best Streak</div>
                        <div className="text-2xl font-bold text-[var(--secondary-color)] flex items-center gap-1">
                            ⚡ {bestStreak}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md border border-[rgba(43,45,66,0.1)] shadow-[0_10px_10px_rgba(141,153,174,0.3)] p-3">
                        <div className="text-xs text-[var(--secondary-color)] font-medium mb-1">Accuracy</div>
                        <div className="text-2xl font-bold text-[var(--secondary-color)]">
                            {avgAccuracy}%
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-[var(--secondary-color)] opacity-80">
                    <span>Total attempts: <strong>{totalAttempts}</strong></span>
                    <span>Updated just now</span>
                </div>
            </div>
            {/* Mentor CTA Section */}

        </article>
    );
};

export default YourTrack;