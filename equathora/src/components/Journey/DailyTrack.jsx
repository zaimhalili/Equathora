// DailyTrack.jsx
import React from 'react';
import {
    FaBullseye,
    FaPlay,
    FaClock,
    FaBolt,
    FaArrowRight,
    FaCheckCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { generateProblemSlug } from '@/lib/slugify';
import { getEstimatedTime } from '@/lib/problemProgress';
import { calculateProblemXP } from '@/lib/leaderboardService';
import { motion } from 'framer-motion';

// Daily minutes goal per weekly commitment tier. Mirrors the pool-size
// tiers in Journey.jsx but for the "minutes today" progress bar.
const GOAL_MINUTES_BY_COMMITMENT = {
    "under-1": 15,
    "1-3": 30,
    "3-6": 45,
    "6+": 60
};

const DailyTrack = ({
    streak,
    todayProgress,
    recommendedQueue = [],
    weeklyCommitment,
    totalRecommendedCount = 0
}) => {
    const streakDays = streak?.current_streak ?? streak?.streak ?? 0;
    const todayMinutes = todayProgress?.minutes_today ?? todayProgress?.today_minutes ?? 0;

    const goalMinutes = todayProgress?.daily_goal_minutes
        ?? todayProgress?.goal_minutes
        ?? GOAL_MINUTES_BY_COMMITMENT[weeklyCommitment]
        ?? 20;

    const goalPercent = goalMinutes > 0
        ? Math.min(100, Math.round((todayMinutes / goalMinutes) * 100))
        : 0;

    const queue = Array.isArray(recommendedQueue) ? recommendedQueue : [];
    const remainingInPool = Math.max(totalRecommendedCount - queue.length, 0);

    // Defensive XP calc: never let a missing difficulty crash the render loop.
    const getProblemXp = (problem) => {
        if (!problem?.difficulty) return 0;
        try {
            const result = calculateProblemXP(problem.difficulty, 0, true, 0, false);
            return Number.isFinite(result?.totalXP) ? result.totalXP : 0;
        } catch (err) {
            console.error("[DailyTrack] calculateProblemXP failed:", err);
            return 0;
        }
    };

    const getProblemSlug = (problem) => {
        if (!problem?.id) return null;
        try {
            return problem.slug || generateProblemSlug(problem.title ?? "problem", problem.id);
        } catch (err) {
            console.error("[DailyTrack] generateProblemSlug failed:", err);
            return null;
        }
    };

    return (
        <motion.section
            className="w-full rounded-2xl bg-[var(--main-color)] border border-white/10 p-5 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-[var(--accent-color)] flex items-center justify-center text-white">
                        <FaBullseye size={20} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">
                            Daily Mission
                        </h2>
                        <p className="text-sm text-[var(--secondary-color)]">
                            Stay consistent and keep your streak alive.
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 text-[var(--secondary-color)] font-bold">
                    <svg className="w-4 h-4" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="icon-gradient-fire-sidebar" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                <stop offset="100%" stopColor="var(--accent-color)" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#icon-gradient-fire-sidebar)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
                    </svg> {streakDays} Day Streak
                </div>
            </div>

            {/* Minutes Progress */}
            <div className="py-6">
                <div className="flex justify-between pb-2">
                    <span className="font-semibold">
                        Today's Goal
                    </span>

                    <span className="text-[var(--secondary-color)]">
                        {todayMinutes} / {goalMinutes} min
                    </span>
                </div>
                <div className="h-4 rounded-md bg-[var(--secondary-color)]/30 overflow-hidden">
                    <div
                        className="h-full rounded-md bg-[linear-gradient(90deg,var(--accent-color),var(--dark-accent-color))]"
                        style={{ width: `${goalPercent}%` }}
                    />
                </div>
            </div>

            {/* Recommended problem queue */}
            {queue.length > 0 ? (
                <>
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-4">
                        <p className="text-sm text-[var(--secondary-color)]">
                            Picked for you today, based on your level and pace.
                        </p>
                        {remainingInPool > 0 && (
                            <a
                                href="#learning-paths"
                                className="text-sm font-semibold text-[var(--accent-color)] hover:underline"
                            >
                                +{remainingInPool} more waiting in your tracks
                            </a>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {queue.map(problem => {
                            const slug = getProblemSlug(problem);
                            const xp = getProblemXp(problem);

                            return (
                                <div
                                    key={problem.id}
                                    className="rounded-xl border border-[var(--french-gray)] bg-white/5 p-5 flex flex-col justify-between gap-4"
                                >
                                    <div>
                                        <div className="text-xs uppercase tracking-wider opacity-70 pb-2">
                                            {problem.state === "progress" ? "In Progress" : "Up Next"}
                                        </div>

                                        <h3 className="text-lg font-bold leading-snug">
                                            {problem.title ?? "Untitled problem"}
                                        </h3>

                                        <div className="pt-3 flex flex-wrap gap-4 text-sm text-[var(--secondary-color)]">
                                            <div className="flex items-center gap-2">
                                                <FaClock />
                                                {problem.estimated_time ?? getEstimatedTime(problem.difficulty)}
                                            </div>

                                            <div className="flex items-center gap-2 text-[var(--rare-blue)]">
                                                <FaBolt />
                                                + {xp} XP
                                            </div>
                                        </div>
                                    </div>

                                    {slug ? (
                                        <Link
                                            to={`/problems/${slug}`}
                                            className="px-4 py-2 rounded-xl bg-[linear-gradient(0deg,var(--accent-color),var(--dark-accent-color))] !text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-[linear-gradient(0deg,var(--dark-accent-color),var(--dark-accent-color))]"
                                        >
                                            <FaPlay size={12} />
                                            Start
                                            <FaArrowRight size={12} />
                                        </Link>
                                    ) : (
                                        <span className="px-4 py-2 rounded-xl bg-white/10 text-center text-sm text-[var(--secondary-color)]">
                                            Unavailable right now
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="rounded-xl border border-[var(--french-gray)] bg-white/5 p-6 flex flex-col items-center text-center gap-3">
                    <FaCheckCircle className="text-3xl text-[var(--accent-color)]" />
                    <h3 className="text-xl font-bold">
                        You're all caught up!
                    </h3>
                    <p className="text-sm text-[var(--secondary-color)] max-w-md">
                        You've cleared today's picks. Browse the full learning paths below to keep going or get ahead.
                    </p>
                    <a
                        href="#learning-paths"
                        className="px-6 py-3 rounded-xl bg-[linear-gradient(0deg,var(--accent-color),var(--dark-accent-color))] !text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-[linear-gradient(0deg,var(--dark-accent-color),var(--dark-accent-color))]"
                    >
                        Review All Tracks
                        <FaArrowRight size={12} />
                    </a>
                </div>
            )}
        </motion.section>
    );
};

export default DailyTrack;