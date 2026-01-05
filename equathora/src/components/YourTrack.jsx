import React, { useEffect, useState } from 'react';
import LilArrow from '../assets/images/lilArrow.svg';
import { Link } from 'react-router-dom';
import { getUserProgress, getStreakData, getCompletedProblems } from '../lib/databaseService';
import { getAllProblems } from '../lib/problemService';
import { supabase } from '../lib/supabaseClient';
import { getSubmissions } from '../lib/progressStorage';

const fallbackStats = {
    problemsSolved: 0,
    accuracy: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalProblems: 30
};

const YourTrack = () => {
    const [stats, setStats] = useState({
        problemsSolved: 0,
        accuracy: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalProblems: 5,
        totalAttempts: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                // Fetch from database
                const [userProgress, streakData, allProblems, completedProblemIds] = await Promise.all([
                    getUserProgress(),
                    getStreakData(),
                    getAllProblems(),
                    getCompletedProblems()
                ]);

                const totalProblems = allProblems.length || 0;
                const validProblemIds = new Set((allProblems || []).map(p => String(p.id)));
                const solved = (completedProblemIds || []).filter(id => validProblemIds.has(String(id))).length;
                let correctAnswers = userProgress?.correct_answers || 0;
                let wrongSubmissions = userProgress?.wrong_submissions || 0;
                let totalAttempts = userProgress?.total_attempts || 0;

                // If backend counters aren't being maintained yet, fall back to local submissions.
                if (totalAttempts > 0 && correctAnswers === 0 && wrongSubmissions === 0) {
                    const local = (getSubmissions() || []).filter(s => validProblemIds.has(String(s.problemId)));
                    if (local.length > 0) {
                        const localCorrect = local.filter(s => s.isCorrect).length;
                        correctAnswers = localCorrect;
                        wrongSubmissions = local.length - localCorrect;
                        totalAttempts = local.length;
                    }
                }

                const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

                setStats({
                    problemsSolved: solved,
                    accuracy: accuracy,
                    currentStreak: streakData?.current_streak || 0,
                    longestStreak: streakData?.longest_streak || 0,
                    totalProblems: totalProblems,
                    totalAttempts: totalAttempts
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();

        // Refresh on focus
        window.addEventListener('focus', fetchStats);
        return () => window.removeEventListener('focus', fetchStats);
    }, []);

    const solved = stats.problemsSolved;
    const total = stats.totalProblems;
    const percentage = Math.min(100, (solved / (total || 1)) * 100);
    const nextMilestone = solved >= total
        ? total
        : Math.max(10, Math.ceil(solved / 10) * 10);
    const toNextMilestone = Math.max(0, nextMilestone - solved);
    const currentStreak = stats.currentStreak;
    const bestStreak = stats.longestStreak;
    const avgAccuracy = stats.accuracy;
    const totalAttempts = stats.totalAttempts;
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
                <div className="grid grid-cols-3 gap-3 mt-2 p-0 md:max-w-1/2 justify-items-center lg:justify-items-start">
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md border border-[rgba(43,45,66,0.1)] shadow-[0_10px_10px_rgba(141,153,174,0.3)] p-3 w-full">
                        <div className="text-xs text-[var(--secondary-color)] font-medium pb-1 text-center lg:text-left">Current Streak</div>
                        <div className="text-2xl font-bold text-[var(--accent-color)] flex items-center gap-1 justify-center lg:justify-start">
                            🔥 {currentStreak}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md border border-[rgba(43,45,66,0.1)] shadow-[0_10px_10px_rgba(141,153,174,0.3)] p-3 w-full">
                        <div className="text-xs text-[var(--secondary-color)] font-medium pb-1 text-center lg:text-left">Best Streak</div>
                        <div className="text-2xl font-bold text-[var(--secondary-color)] flex items-center gap-1 justify-center lg:justify-start">
                            ⚡ {bestStreak}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md border border-[rgba(43,45,66,0.1)] shadow-[0_10px_10px_rgba(141,153,174,0.3)] p-3 w-full">
                        <div className="text-xs text-[var(--secondary-color)] font-medium pb-1 text-center lg:text-left">Accuracy</div>
                        <div className="text-2xl font-bold text-[var(--secondary-color)] justify-center lg:justify-start flex">
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