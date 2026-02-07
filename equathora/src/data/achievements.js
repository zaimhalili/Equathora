import {
    FaTrophy, FaFire, FaBolt, FaGem, FaStar, FaRocket,
    FaBrain, FaHeart, FaCrown, FaMedal, FaCalculator, FaGraduationCap,
    FaMountain, FaInfinity, FaAward, FaLightbulb, FaChartLine, FaClock,
    FaBalanceScale, FaAtom, FaPuzzlePiece, FaFeather, FaDragon, FaSnowflake,
    FaSun, FaMoon, FaLeaf, FaGlobe, FaShieldAlt, FaBook
} from 'react-icons/fa';
import React from 'react';

/**
 * Builds the full achievements list from user stats.
 * This is the single source of truth — used by RecentAchievements and
 * anywhere else that needs to evaluate achievement unlock status.
 *
 * @param {object} userStats - Result of getUserStats() from progressStorage
 * @returns {{ id: string, icon: JSX.Element, title: string, description: string, color: string, unlocked: boolean, rarity: string }[]}
 */
export function buildAchievements(userStats = {}) {
    const solvedProblems = userStats.problemsSolved || 0;
    const streakDays = userStats.currentStreak || 0;
    const totalTimeMinutes = Math.floor((userStats.totalTime || 0) / 60);
    const diff = userStats.difficultyBreakdown || { easy: 0, medium: 0, hard: 0 };
    const hardProblems = diff.hard || 0;
    const mediumProblems = diff.medium || 0;
    const easyProblems = diff.easy || 0;
    const perfectStreak = userStats.perfectStreak || 0;
    const topicsExplored = Object.keys(userStats.favoriteTopics || {}).length || 0;
    const longestSession = userStats.longestSession || 0;
    const bestStreak = userStats.bestStreak || streakDays;
    const accountCreated = userStats.joinDate ? new Date(userStats.joinDate).getTime() : Date.now();
    const isEarlyUser = accountCreated < new Date('2025-01-01').getTime();

    const currentHour = new Date().getHours();
    const isNightOwl = currentHour >= 22 || currentHour < 5;
    const isEarlyBird = currentHour >= 5 && currentHour < 8;

    return [
        {
            id: 'early-bird',
            icon: React.createElement(FaCrown),
            title: 'Early Pioneer',
            description: 'Joined Equathora as one of the first users',
            color: '#FFD700',
            unlocked: isEarlyUser,
            automatic: true,
            rarity: 'Legendary',
        },
        {
            id: 'first-step',
            icon: React.createElement(FaStar),
            title: 'First Steps',
            description: 'Solved your first problem',
            color: '#4CAF50',
            unlocked: solvedProblems >= 1,
            rarity: 'Common',
        },
        {
            id: 'problem-solver',
            icon: React.createElement(FaBrain),
            title: 'Problem Solver',
            description: 'Solved 10 problems',
            color: '#2196F3',
            unlocked: solvedProblems >= 10,
            rarity: 'Uncommon',
        },
        {
            id: 'math-wizard',
            icon: React.createElement(FaGem),
            title: 'Math Wizard',
            description: 'Solved 50 problems',
            color: '#9C27B0',
            unlocked: solvedProblems >= 50,
            rarity: 'Rare',
        },
        {
            id: 'on-fire',
            icon: React.createElement(FaFire),
            title: 'On Fire!',
            description: 'Maintained a 7-day streak',
            color: '#FF5722',
            unlocked: streakDays >= 7,
            rarity: 'Rare',
        },
        {
            id: 'unstoppable',
            icon: React.createElement(FaBolt),
            title: 'Unstoppable',
            description: 'Maintained a 30-day streak',
            color: '#FF9800',
            unlocked: streakDays >= 30,
            rarity: 'Epic',
        },
        {
            id: 'speed-demon',
            icon: React.createElement(FaRocket),
            title: 'Speed Demon',
            description: 'Solved 5 problems in under 30 minutes',
            color: '#00BCD4',
            unlocked: totalTimeMinutes > 0 && solvedProblems >= 5 && (totalTimeMinutes / solvedProblems) < 30,
            rarity: 'Epic',
        },
        {
            id: 'hard-mode',
            icon: React.createElement(FaTrophy),
            title: 'Challenge Accepted',
            description: 'Solved 5 hard problems',
            color: '#E91E63',
            unlocked: hardProblems >= 5,
            rarity: 'Epic',
        },
        {
            id: 'dedicated',
            icon: React.createElement(FaHeart),
            title: 'Dedicated Learner',
            description: 'Spent over 10 hours learning',
            color: '#F44336',
            unlocked: totalTimeMinutes >= 600,
            rarity: 'Rare',
        },
        {
            id: 'perfectionist',
            icon: React.createElement(FaMedal),
            title: 'Perfectionist',
            description: 'Got 10 problems correct on first try',
            color: '#FFD700',
            unlocked: perfectStreak >= 10,
            rarity: 'Legendary',
        },
        {
            id: 'century',
            icon: React.createElement(FaCalculator),
            title: 'Century Club',
            description: 'Solved 100 problems',
            color: '#8E44AD',
            unlocked: solvedProblems >= 100,
            rarity: 'Epic',
        },
        {
            id: 'marathon',
            icon: React.createElement(FaMountain),
            title: 'Marathon Runner',
            description: 'Maintained a 60-day streak',
            color: '#1ABC9C',
            unlocked: streakDays >= 60,
            rarity: 'Legendary',
        },
        {
            id: 'balanced',
            icon: React.createElement(FaBalanceScale),
            title: 'Perfectly Balanced',
            description: 'Solved at least 5 problems of each difficulty',
            color: '#3498DB',
            unlocked: easyProblems >= 5 && mediumProblems >= 5 && hardProblems >= 5,
            rarity: 'Rare',
        },
        {
            id: 'explorer',
            icon: React.createElement(FaGlobe),
            title: 'Explorer',
            description: 'Explored problems from 5 different topics',
            color: '#27AE60',
            unlocked: topicsExplored >= 5,
            rarity: 'Uncommon',
        },
        {
            id: 'scholar',
            icon: React.createElement(FaGraduationCap),
            title: 'Math Scholar',
            description: 'Explored problems from 10 different topics',
            color: '#9B59B6',
            unlocked: topicsExplored >= 10,
            rarity: 'Rare',
        },
        {
            id: 'night-owl',
            icon: React.createElement(FaMoon),
            title: 'Night Owl',
            description: 'Solved a problem between 10 PM and 5 AM',
            color: '#2C3E50',
            unlocked: solvedProblems >= 1 && isNightOwl,
            rarity: 'Uncommon',
        },
        {
            id: 'early-riser',
            icon: React.createElement(FaSun),
            title: 'Early Riser',
            description: 'Solved a problem between 5 AM and 8 AM',
            color: '#F1C40F',
            unlocked: solvedProblems >= 1 && isEarlyBird,
            rarity: 'Uncommon',
        },
        {
            id: 'warm-up',
            icon: React.createElement(FaLeaf),
            title: 'Warm Up Champion',
            description: 'Solved 20 easy problems',
            color: '#2ECC71',
            unlocked: easyProblems >= 20,
            rarity: 'Uncommon',
        },
        {
            id: 'middle-ground',
            icon: React.createElement(FaPuzzlePiece),
            title: 'Middle Ground Master',
            description: 'Solved 20 medium problems',
            color: '#E67E22',
            unlocked: mediumProblems >= 20,
            rarity: 'Rare',
        },
        {
            id: 'hard-core',
            icon: React.createElement(FaDragon),
            title: 'Hardcore Mathematician',
            description: 'Solved 20 hard problems',
            color: '#C0392B',
            unlocked: hardProblems >= 20,
            rarity: 'Legendary',
        },
        {
            id: 'time-master',
            icon: React.createElement(FaClock),
            title: 'Time Master',
            description: 'Spent over 24 hours learning in total',
            color: '#16A085',
            unlocked: totalTimeMinutes >= 1440,
            rarity: 'Epic',
        },
        {
            id: 'infinity',
            icon: React.createElement(FaInfinity),
            title: 'To Infinity',
            description: 'Solved 200 problems',
            color: '#8E44AD',
            unlocked: solvedProblems >= 200,
            rarity: 'Legendary',
        },
        {
            id: 'quick-starter',
            icon: React.createElement(FaFeather),
            title: 'Quick Starter',
            description: 'Solved 3 problems on your first day',
            color: '#1ABC9C',
            unlocked: solvedProblems >= 3 && (Date.now() - accountCreated) < (24 * 60 * 60 * 1000),
            rarity: 'Uncommon',
        },
        {
            id: 'comeback',
            icon: React.createElement(FaShieldAlt),
            title: 'Comeback King',
            description: 'Reached a 14-day streak after a break',
            color: '#E74C3C',
            unlocked: streakDays >= 14 && bestStreak > streakDays,
            rarity: 'Rare',
        },
        {
            id: 'bookworm',
            icon: React.createElement(FaBook),
            title: 'Bookworm',
            description: 'Spent over 50 hours learning',
            color: '#6C5B7B',
            unlocked: totalTimeMinutes >= 3000,
            rarity: 'Legendary',
        },
        {
            id: 'rising-star',
            icon: React.createElement(FaChartLine),
            title: 'Rising Star',
            description: 'Solved 25 problems',
            color: '#F39C12',
            unlocked: solvedProblems >= 25,
            rarity: 'Uncommon',
        },
        {
            id: 'lightbulb',
            icon: React.createElement(FaLightbulb),
            title: 'Eureka Moment',
            description: 'Solved 5 problems in a single session',
            color: '#F7DC6F',
            unlocked: longestSession >= 5,
            rarity: 'Rare',
        },
        {
            id: 'atomic',
            icon: React.createElement(FaAtom),
            title: 'Atomic Precision',
            description: 'Got 20 problems correct on first try',
            color: '#5DADE2',
            unlocked: perfectStreak >= 20,
            rarity: 'Legendary',
        },
        {
            id: 'grandmaster',
            icon: React.createElement(FaAward),
            title: 'Grand Master',
            description: 'Reached an all-time best streak of 90 days',
            color: '#FFD700',
            unlocked: bestStreak >= 90,
            rarity: 'Legendary',
        },
        {
            id: 'snowflake',
            icon: React.createElement(FaSnowflake),
            title: 'Cool Under Pressure',
            description: 'Solved 10 hard problems without hints',
            color: '#85C1E9',
            unlocked: hardProblems >= 10,
            rarity: 'Epic',
        },
    ];
}

/** Rarity sort order */
export const RARITY_ORDER = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 };
