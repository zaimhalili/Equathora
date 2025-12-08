// localStorage-based progress tracking system for MVP
// This will be replaced with backend API calls in v1.1

const STORAGE_KEYS = {
    USER_PROGRESS: 'equathora_user_progress',
    COMPLETED_PROBLEMS: 'equathora_completed_problems',
    FAVORITES: 'equathora_favorites',
    USER_STATS: 'equathora_user_stats',
    STREAK_DATA: 'equathora_streak',
    SUBMISSIONS: 'equathora_submissions'
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
    joinDate: new Date().toISOString()
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
export const markProblemCompleted = (problemId, score, timeSpent) => {
    const completed = getCompletedProblems();
    const existing = completed.find(p => p.problemId === problemId);

    if (existing) {
        // Update if better score
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

    // Update user stats
    const progress = getUserProgress();
    const totalScore = completed.reduce((sum, p) => sum + p.score, 0);
    const totalProblems = completed.length;
    const accuracy = totalProblems > 0 ? Math.round((totalScore / (totalProblems * 100)) * 100) : 0;

    updateUserProgress({
        problemsSolved: totalProblems,
        accuracy,
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

export const addSubmission = (problemId, answer, isCorrect, score, timeSpent) => {
    const submissions = getSubmissions();

    submissions.push({
        problemId,
        answer,
        isCorrect,
        score,
        timeSpent,
        timestamp: new Date().toISOString()
    });

    // Keep only last 100 submissions to avoid storage bloat
    if (submissions.length > 100) {
        submissions.shift();
    }

    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

    return submissions;
};

// Get user stats summary
export const getUserStats = () => {
    const progress = getUserProgress();
    const completed = getCompletedProblems();
    const streak = getStreakData();

    return {
        ...progress,
        currentStreak: streak.current,
        longestStreak: streak.longest,
        recentProblems: completed.slice(-5).reverse(),
        totalAttempts: completed.reduce((sum, p) => sum + p.attempts, 0)
    };
};

// Clear all data (for testing)
export const clearAllProgress = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
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
    getUserStats,
    clearAllProgress
};
