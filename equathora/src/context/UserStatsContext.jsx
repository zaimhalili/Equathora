import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getAllProblems } from '../lib/problemService';
import { getAchievementProgress, getUserSubmissions } from '../lib/databaseService';
import { computeAccuracyFromSources } from '../lib/accuracyService';

const CACHE_KEY = 'eq_user_stats_cache';

const defaultStats = {
  problemsSolved: 0,
  accuracy: 0,
  accuracyBreakdown: {
    accuracy: 0,
    correct: 0,
    wrong: 0,
    total: 0
  },
  currentStreak: 0,
  longestStreak: 0,
  totalAttempts: 0,
  totalProblems: 0,
  totalTimeMinutes: 0,
  totalTimeSeconds: 0,
  perfectStreak: 0,
  favoriteTopics: [],
  topicFrequency: [],
  difficultyBreakdown: [],
  weeklyProgress: Array(7).fill(0),
  completedProblemIds: [],
  attemptedProblemIds: [],
  totalSubmissions: 0,
  latestSubmissionAt: null,
  firstSubmissionAt: null,
  reputation: 0,
  joinDate: null,
  userProgress: null,
  streakData: null,
  lastUpdated: null
};

const difficultyDisplayRank = {
  beginner: 1,
  easy: 2,
  standard: 3,
  intermediate: 4,
  medium: 5,
  challenging: 6,
  hard: 7,
  advanced: 8,
  expert: 9
};

const normalizeDifficultyKey = (difficulty) => String(difficulty || '').trim().toLowerCase();

const formatDifficultyLabel = (difficulty) => {
  const raw = String(difficulty || '').trim();
  if (!raw) return 'Unspecified';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const getDifficultyColor = (difficultyKey, index) => {
  if (difficultyKey === 'easy') return '#16a34a';
  if (difficultyKey === 'medium') return '#d97706';
  if (difficultyKey === 'hard') return '#a3142c';
  const palette = ['#2563eb', '#7c3aed', '#0f766e', '#be123c', '#0ea5e9', '#f97316', '#6366f1'];
  return palette[index % palette.length];
};

function getCachedStats() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cached = window.sessionStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Failed to parse cached user stats:', error);
    return null;
  }
}

function setCachedStats(stats) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to cache user stats:', error);
  }
}

async function aggregateStats() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { ...defaultStats, lastUpdated: new Date().toISOString() };
    }

    const [achievementProgress, allProblems, userSubmissions] = await Promise.all([
      getAchievementProgress(),
      getAllProblems(),
      getUserSubmissions()
    ]);

    const validProblemIds = new Set((allProblems || []).map((problem) => String(problem.id)));
    const completedProblemIds = Array.isArray(achievementProgress?.solved_problems)
      ? achievementProgress.solved_problems.map((id) => String(id))
      : [];
    const filteredCompletedIds = completedProblemIds.filter((id) => validProblemIds.has(String(id)));
    const uniqueAttemptedProblemIds = Array.from(new Set((userSubmissions || []).map((submission) => String(submission.problem_id))));

    const solvedCount = filteredCompletedIds.length;
    const accuracyStats = computeAccuracyFromSources({
      submissions: userSubmissions || [],
      validProblemIds,
      solvedCount,
      totalAttempts: achievementProgress?.total_attempts,
      wrongSubmissions: achievementProgress?.wrong_submissions
    });

    const favoriteTopics = Array.isArray(achievementProgress?.topicFrequency)
      ? achievementProgress.topicFrequency
          .slice()
          .sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0))
          .slice(0, 5)
          .map((item) => item.topic)
          .filter(Boolean)
      : [];

    const difficultyMap = new Map();
    (allProblems || []).forEach((problem) => {
      const key = normalizeDifficultyKey(problem?.difficulty);
      const label = formatDifficultyLabel(problem?.difficulty);
      const existing = difficultyMap.get(key) || { key, label, solved: 0, total: 0 };
      existing.total += 1;
      if (existing.label === 'Unspecified' && label !== 'Unspecified') {
        existing.label = label;
      }
      difficultyMap.set(key, existing);
    });

    (allProblems || []).forEach((problem) => {
      if (filteredCompletedIds.includes(String(problem.id))) {
        const key = normalizeDifficultyKey(problem?.difficulty);
        const existing = difficultyMap.get(key);
        if (existing) {
          existing.solved += 1;
        }
      }
    });

    const difficultyBreakdown = Array.from(difficultyMap.values())
      .sort((a, b) => {
        const rankDiff = (difficultyDisplayRank[a.key] ?? 99) - (difficultyDisplayRank[b.key] ?? 99);
        if (rankDiff !== 0) return rankDiff;
        return a.label.localeCompare(b.label);
      })
      .map((difficulty, index) => ({
        ...difficulty,
        color: getDifficultyColor(difficulty.key, index)
      }));

    const weeklyProgress = Array.isArray(achievementProgress?.weeklyProgress)
      ? achievementProgress.weeklyProgress
      : Array(7).fill(0);

    const latestSubmissionAt = (userSubmissions || [])
      .map((submission) => submission?.submitted_at)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))[0] || null;

    const firstSubmissionAt = (userSubmissions || [])
      .map((submission) => submission?.submitted_at)
      .filter(Boolean)
      .sort((a, b) => new Date(a) - new Date(b))[0] || null;

    const totalTimeMinutes = Number(achievementProgress?.total_time_minutes || 0);
    const totalTimeSeconds = totalTimeMinutes * 60;

    const username = session?.user?.user_metadata?.username
      || session?.user?.user_metadata?.preferred_username
      || session?.user?.user_metadata?.full_name
      || session?.user?.user_metadata?.name
      || session?.user?.email?.split('@')[0]
      || null;

    return {
      username,
      problemsSolved: solvedCount,
      accuracy: accuracyStats.accuracy,
      accuracyBreakdown: accuracyStats,
      currentStreak: achievementProgress?.currentStreak || 0,
      longestStreak: achievementProgress?.longestStreak || 0,
      totalAttempts: accuracyStats.total,
      totalProblems: allProblems?.length || 0,
      totalSubmissions: (userSubmissions || []).length,
      totalTimeMinutes,
      totalTimeSeconds,
      completedProblemIds: filteredCompletedIds,
      attemptedProblemIds: uniqueAttemptedProblemIds,
      favoriteTopics,
      topicFrequency: Array.isArray(achievementProgress?.topicFrequency) ? achievementProgress.topicFrequency : [],
      difficultyBreakdown,
      weeklyProgress,
      latestSubmissionAt,
      firstSubmissionAt,
      reputation: Number(achievementProgress?.reputation || 0),
      joinDate: session?.user?.created_at || null,
      userProgress: achievementProgress,
      streakData: {
        current_streak: achievementProgress?.currentStreak || 0,
        longest_streak: achievementProgress?.longestStreak || 0
      },
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to aggregate user stats:', error);
    return { ...defaultStats, lastUpdated: new Date().toISOString() };
  }
}

const UserStatsContext = createContext(null);

export function UserStatsProvider({ children }) {
  const [stats, setStats] = useState(() => getCachedStats() || defaultStats);
  const [loading, setLoading] = useState(true);

  const refreshStats = useCallback(async () => {
    setLoading(true);
    const fetchedStats = await aggregateStats();
    setStats(fetchedStats);
    setCachedStats(fetchedStats);
    setLoading(false);
    return fetchedStats;
  }, []);

  useEffect(() => {
    void refreshStats();
  }, [refreshStats]);

  useEffect(() => {
    const handleStatsUpdated = () => {
      void refreshStats();
    };

    window.addEventListener('equathora:stats-updated', handleStatsUpdated);
    return () => {
      window.removeEventListener('equathora:stats-updated', handleStatsUpdated);
    };
  }, [refreshStats]);

  return (
    <UserStatsContext.Provider value={{ stats, loading, refreshStats }}>
      {children}
    </UserStatsContext.Provider>
  );
}

export function useUserStats() {
  const context = useContext(UserStatsContext);
  if (!context) {
    throw new Error('useUserStats must be used inside a UserStatsProvider');
  }
  return context;
}
