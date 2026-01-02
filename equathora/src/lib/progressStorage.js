// localStorage-based progress tracking system for MVP
// This will be replaced with backend API calls in v1.1

import { markProblemComplete as dbMarkProblemComplete } from './databaseService';
import { getAllProblems } from './problemService';

// Generate a unique device ID to prevent cross-device sync issues
// Using sessionStorage to ensure it NEVER syncs between devices
const getDeviceId = () => {
    const DEVICE_ID_KEY = 'equathora_device_id';
    // Check sessionStorage first (never syncs)
    let deviceId = sessionStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
        // Check if we have it in localStorage from before
        deviceId = localStorage.getItem(DEVICE_ID_KEY);

        if (!deviceId) {
            // Create a completely unique device ID using multiple entropy sources
            const timestamp = Date.now();
            const random1 = Math.random().toString(36).substring(2, 15);
            const random2 = Math.random().toString(36).substring(2, 15);
            const userAgent = navigator.userAgent.substring(0, 10);
            deviceId = `device_${timestamp}_${random1}_${random2}_${btoa(userAgent).substring(0, 8)}`;
        }

        // Store in sessionStorage (which never syncs across devices)
        sessionStorage.setItem(DEVICE_ID_KEY, deviceId);
        // Also keep a backup in localStorage
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
};

// Add device ID to all storage keys to make them device-specific
const DEVICE_ID = getDeviceId();

const STORAGE_KEYS = {
    USER_PROGRESS: `equathora_user_progress_${DEVICE_ID}`,
    COMPLETED_PROBLEMS: `equathora_completed_problems_${DEVICE_ID}`,
    FAVORITES: `equathora_favorites_${DEVICE_ID}`,
    USER_STATS: `equathora_user_stats_${DEVICE_ID}`,
    STREAK_DATA: `equathora_streak_${DEVICE_ID}`,
    SUBMISSIONS: `equathora_submissions_${DEVICE_ID}`
};

const ACHIEVEMENTS_KEY = `equathoraProgress_${DEVICE_ID}`;

const defaultProgressSnapshot = () => ({
    totalProblems: 30,
    solvedProblems: [],
    correctAnswers: 0,
    wrongSubmissions: 0,
    totalAttempts: 0,
    streakDays: 0,
    totalTimeMinutes: 0,
    totalTimeSpent: '0h 0m',
    averageTime: '0m 0s',
    favoriteTopics: ['Algebra', 'Geometry'],
    topicFrequency: {},
    weeklyProgress: Array(7).fill(0),
    difficultyBreakdown: {
        easy: 0,
        medium: 0,
        hard: 0
    },
    conceptsLearned: 0,
    perfectStreak: 0,
    accountCreated: Date.now(),
    reputation: 0,
    accuracyRate: 0,
    lastReputationStreak: 0
});

const getAchievementProgress = () => {
    try {
        const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
        if (!raw) return defaultProgressSnapshot();
        const parsed = JSON.parse(raw);
        return {
            ...defaultProgressSnapshot(),
            ...parsed,
            weeklyProgress: Array.isArray(parsed?.weeklyProgress) && parsed.weeklyProgress.length === 7
                ? parsed.weeklyProgress
                : Array(7).fill(0),
            difficultyBreakdown: {
                ...defaultProgressSnapshot().difficultyBreakdown,
                ...parsed?.difficultyBreakdown
            },
            topicFrequency: parsed?.topicFrequency || {}
        };
    } catch (error) {
        console.error('Failed to parse achievement progress', error);
        return defaultProgressSnapshot();
    }
};

const saveAchievementProgress = (progress) => {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(progress));
};

const formatHoursMinutes = (totalMinutes) => {
    const minutes = Math.max(0, Math.round(totalMinutes));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
};

const formatMinutesSeconds = (totalSeconds) => {
    const seconds = Math.max(0, Math.round(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
};

const getWeekdayIndex = (date) => {
    const day = new Date(date).getDay();
    return day === 0 ? 6 : day - 1; // Map Monday -> 0 ... Sunday -> 6
};

// Initialize default user data
const getDefaultUserData = () => ({
    username: 'Student',
    problemsSolved: 0,
    accuracy: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTime: 0,
    level: 1,
    xp: 0,
    joinDate: new Date().toISOString(),
    reputation: 0,
    totalAttempts: 0
});

// Get user progress
export const getUserProgress = () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return data ? JSON.parse(data) : getDefaultUserData();
};

// Update user progress
export const updateUserProgress = (updates) => {
    const current = getUserProgress();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updated));
    return updated;
};

// Get completed problems
export const getCompletedProblems = () => {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_PROBLEMS);
    return data ? JSON.parse(data) : [];
};

// Mark problem as completed
export const markProblemCompleted = async (problemId, score, timeSpent) => {
    try {
        const allProblems = await getAllProblems();
        const problem = allProblems.find(p => p.id === problemId);
        
        if (problem) {
            await dbMarkProblemComplete(
                problemId,
                timeSpent,
                problem.difficulty,
                problem.topic || 'General'
            );
        }
        
        const completed = getCompletedProblems();
        const existing = completed.find(p => p.problemId === problemId);

        if (existing) {
            if (score > existing.score) {
                existing.score = score;
                existing.timeSpent = Math.min(timeSpent, existing.timeSpent);
                existing.attempts += 1;
                existing.lastAttempt = new Date().toISOString();
            }
        } else {
            completed.push({
                problemId,
                score,
                timeSpent,
                attempts: 1,
                completedAt: new Date().toISOString(),
                lastAttempt: new Date().toISOString()
            });
        }

        localStorage.setItem(STORAGE_KEYS.COMPLETED_PROBLEMS, JSON.stringify(completed));
    } catch (error) {
        console.error('Failed to mark problem as complete:', error);
    }

    // Update user stats snapshot (accuracy handled by recordProblemStats)
    updateUserProgress({
        problemsSolved: completed.length,
        totalTime: completed.reduce((sum, p) => sum + p.timeSpent, 0)
    });

    return completed;
};

// Check if problem is completed
export const isProblemCompleted = (problemId) => {
    const completed = getCompletedProblems();
    return completed.some(p => p.problemId === problemId);
};

// Get problem score
export const getProblemScore = (problemId) => {
    const completed = getCompletedProblems();
    const problem = completed.find(p => p.problemId === problemId);
    return problem ? problem.score : 0;
};

// Favorites management
export const getFavorites = () => {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
};

export const toggleFavorite = (problemId) => {
    const favorites = getFavorites();
    const index = favorites.indexOf(problemId);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(problemId);
    }

    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return favorites;
};

export const isFavorite = (problemId) => {
    const favorites = getFavorites();
    return favorites.includes(problemId);
};

// Streak management
export const getStreakData = () => {
    const data = localStorage.getItem(STORAGE_KEYS.STREAK_DATA);
    return data ? JSON.parse(data) : { current: 0, longest: 0, lastDate: null };
};

export const updateStreak = () => {
    const streakData = getStreakData();
    const today = new Date().toDateString();

    if (streakData.lastDate === today) {
        return streakData; // Already counted today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (streakData.lastDate === yesterdayStr) {
        // Continue streak
        streakData.current += 1;
    } else if (streakData.lastDate) {
        // Streak broken
        streakData.current = 1;
    } else {
        // First day
        streakData.current = 1;
    }

    streakData.longest = Math.max(streakData.longest, streakData.current);
    streakData.lastDate = today;

    localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));

    // Update user progress
    updateUserProgress({
        currentStreak: streakData.current,
        longestStreak: streakData.longest
    });

    return streakData;
};

// Submissions history
export const getSubmissions = (problemId = null) => {
    const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    const submissions = data ? JSON.parse(data) : [];

    if (problemId) {
        return submissions.filter(s => s.problemId === problemId);
    }

    return submissions;
};

export const addSubmission = (
    problemId,
    answer,
    isCorrect,
    score,
    timeSpent,
    steps = [],
    attemptNumber = 1,
    hintsUsed = 0,
    extraFields = {}
) => {
    const submissions = getSubmissions();

    const entry = {
        id: Date.now(),
        problemId,
        answer,
        isCorrect,
        score,
        timeSpent,
        steps,
        timestamp: new Date().toISOString(),
        status: isCorrect ? 'accepted' : 'wrong',
        metadata: {
            attempts: attemptNumber,
            hintsUsed,
            timeSpent,
            timeSpentLabel: formatMinutesSeconds(timeSpent),
            recordedAt: new Date().toISOString()
        },
        ...extraFields
    };

    submissions.push(entry);

    // Keep only last 100 submissions to avoid storage bloat
    if (submissions.length > 100) {
        submissions.shift();
    }

    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

    return entry;
};

export const recordProblemStats = (
    problem,
    {
        isCorrect = false,
        timeSpentSeconds = 0,
        timestamp = new Date().toISOString(),
        attemptNumber = 1,
        streakData = null,
        hintsUsed = 0
    } = {}
) => {
    if (!problem) return null;

    const progress = getAchievementProgress();
    progress.totalAttempts = (progress.totalAttempts || 0) + 1;

    const solved = new Set(progress.solvedProblems || []);
    const alreadySolved = solved.has(problem.id);

    if (isCorrect && !alreadySolved) {
        solved.add(problem.id);
        progress.solvedProblems = Array.from(solved);
        progress.correctAnswers = (progress.correctAnswers || 0) + 1;

        const difficultyKey = (problem.difficulty || 'easy').toLowerCase();
        if (!progress.difficultyBreakdown) {
            progress.difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
        }
        if (progress.difficultyBreakdown[difficultyKey] !== undefined) {
            progress.difficultyBreakdown[difficultyKey] += 1;
        }
    } else if (!isCorrect) {
        progress.wrongSubmissions = (progress.wrongSubmissions || 0) + 1;
    }

    const correctCount = progress.correctAnswers || 0;
    const wrongCount = progress.wrongSubmissions || 0;
    const totalCount = correctCount + wrongCount;
    progress.accuracyRate = totalCount > 0
        ? Math.round((correctCount / totalCount) * 100)
        : progress.accuracyRate || 0;

    const minutesSpent = Math.max(1, Math.round(timeSpentSeconds / 60));
    progress.totalTimeMinutes = (progress.totalTimeMinutes || 0) + minutesSpent;
    progress.totalTimeSpent = formatHoursMinutes(progress.totalTimeMinutes);

    const solvedCount = (progress.solvedProblems || []).length;
    if (solvedCount > 0) {
        const avgSeconds = Math.round((progress.totalTimeMinutes * 60) / solvedCount);
        progress.averageTime = formatMinutesSeconds(avgSeconds);
    }

    if (!Array.isArray(progress.weeklyProgress) || progress.weeklyProgress.length !== 7) {
        progress.weeklyProgress = Array(7).fill(0);
    }
    const weekdayIndex = getWeekdayIndex(timestamp);
    progress.weeklyProgress[weekdayIndex] = (progress.weeklyProgress[weekdayIndex] || 0) + 1;

    const topicKey = problem.topic || 'General Concepts';
    progress.topicFrequency = progress.topicFrequency || {};
    if (isCorrect && !alreadySolved) {
        progress.topicFrequency[topicKey] = (progress.topicFrequency[topicKey] || 0) + 1;
    }
    progress.favoriteTopics = Object.entries(progress.topicFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([topic]) => topic);
    progress.conceptsLearned = Object.keys(progress.topicFrequency).length;

    if (isCorrect && attemptNumber === 1) {
        progress.perfectStreak = (progress.perfectStreak || 0) + 1;
    } else if (!isCorrect) {
        progress.perfectStreak = 0;
    }

    if (streakData && typeof streakData.current === 'number') {
        progress.streakDays = streakData.current;
    }

    progress.reputation = progress.reputation || 0;
    if (isCorrect && !alreadySolved) {
        progress.reputation += 20;
    }
    if (streakData && typeof streakData.current === 'number') {
        const previous = progress.lastReputationStreak || 0;
        if (streakData.current > previous) {
            progress.reputation += (streakData.current - previous) * 2;
            progress.lastReputationStreak = streakData.current;
        }
    }

    progress.lastSubmissionAt = timestamp;
    progress.totalHintsUsed = (progress.totalHintsUsed || 0) + (hintsUsed || 0);

    saveAchievementProgress(progress);
    updateUserProgress({
        problemsSolved: progress.solvedProblems.length,
        accuracy: progress.accuracyRate || 0,
        totalAttempts: progress.totalAttempts,
        reputation: progress.reputation || 0
    });
    return progress;
};

// Get user stats summary
export const getUserStats = () => {
    const progress = getUserProgress();
    const completed = getCompletedProblems();
    const streak = getStreakData();
    const achievement = getAchievementProgress();

    const correct = achievement.correctAnswers || 0;
    const wrong = achievement.wrongSubmissions || 0;
    const totalAttempts = achievement.totalAttempts || correct + wrong || progress.totalAttempts || 0;
    const accuracyRate = achievement.accuracyRate || (correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : progress.accuracy || 0);

    return {
        ...progress,
        problemsSolved: achievement.solvedProblems?.length || progress.problemsSolved || 0,
        accuracy: accuracyRate,
        reputation: achievement.reputation || progress.reputation || 0,
        currentStreak: streak.current,
        longestStreak: streak.longest,
        weeklyProgress: achievement.weeklyProgress,
        favoriteTopics: achievement.favoriteTopics,
        difficultyBreakdown: achievement.difficultyBreakdown,
        accuracyBreakdown: {
            correct,
            wrong,
            total: totalAttempts
        },
        recentProblems: completed.slice(-5).reverse(),
        totalAttempts,
        streakDays: achievement.streakDays || streak.current
    };
};

// Clear all data (for testing)
export const clearAllProgress = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    localStorage.removeItem(ACHIEVEMENTS_KEY);
};

// Export a default object with all functions
export default {
    getUserProgress,
    updateUserProgress,
    getCompletedProblems,
    markProblemCompleted,
    isProblemCompleted,
    getProblemScore,
    getFavorites,
    toggleFavorite,
    isFavorite,
    getStreakData,
    updateStreak,
    getSubmissions,
    addSubmission,
    recordProblemStats,
    getUserStats,
    clearAllProgress
};
