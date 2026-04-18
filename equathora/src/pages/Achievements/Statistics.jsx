
import React, { useEffect, useState } from 'react';
import './Statistics.css';
import { getUserProgress, getStreakData, getWeeklyProgress, getTopicFrequency, getUserSubmissions } from '../../lib/databaseService';
import { getAllProblems } from '../../lib/problemService';
import { supabase } from '../../lib/supabaseClient';
import { formatTopicLabel } from '../../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const normalizeCompletedProblemId = (rawValue) => {
  if (rawValue === null || rawValue === undefined) return '';

  if (typeof rawValue === 'string' && rawValue.startsWith('{')) {
    try {
      const parsed = JSON.parse(rawValue);
      return String(parsed?.problemId ?? parsed?.id ?? '').trim();
    } catch {
      return '';
    }
  }

  return String(rawValue).trim();
};

const calculateAccuracy = (totalAttempts = 0, wrongSubmissions = 0, solvedCount = 0) => {
  if (totalAttempts > 0) {
    const correctSubmissions = totalAttempts - (wrongSubmissions || 0);
    return Math.max(0, Math.min(100, Math.round((correctSubmissions / totalAttempts) * 100)));
  }

  if (solvedCount > 0) {
    return null;
  }

  return 0;
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
  expert: 9,
};

const difficultyPalette = ['#2563eb', '#7c3aed', '#0f766e', '#be123c', '#0ea5e9', '#f97316', '#6366f1'];

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
  return difficultyPalette[index % difficultyPalette.length];
};

const hexToRgba = (hex, alpha) => {
  const safeHex = String(hex || '').replace('#', '');
  if (!/^[a-fA-F0-9]{6}$/.test(safeHex)) return `rgba(255,255,255,${alpha})`;
  const r = parseInt(safeHex.slice(0, 2), 16);
  const g = parseInt(safeHex.slice(2, 4), 16);
  const b = parseInt(safeHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Statistics = () => {
  const [progress, setProgress] = useState({
    correctAnswers: 0,
    wrongSubmissions: 0,
    totalAttempts: 0,
    accuracyRate: 0,
    totalProblems: 0,
    solvedProblems: 0,
    streakDays: 0,
    totalTimeSpent: '0h 0m',
    averageTime: '0m 0s',
    favoriteTopics: [],
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    difficultyBreakdown: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const [userProgress, streakData, weeklyData, allProblems, completedRowsResult, topicData, allSubmissions] = await Promise.all([
          getUserProgress(),
          getStreakData(),
          getWeeklyProgress(),
          getAllProblems(),
          supabase
            .from('user_completed_problems')
            .select('problem_id')
            .eq('user_id', session.user.id),
          getTopicFrequency(),
          getUserSubmissions()
        ]);

        const completedRows = completedRowsResult?.data || [];

        const totalProblems = allProblems.length || 0;
        // Filter completed IDs to only count valid current problems (same as YourTrack)
        const validProblemIds = new Set((allProblems || []).map(p => String(p.id)));
        const completedIds = Array.from(
          new Set(
            (completedRows || [])
              .map((row) => normalizeCompletedProblemId(row.problem_id))
              .filter(Boolean)
          )
        );
        const validCompletedIds = completedIds.filter(id => validProblemIds.has(String(id)));
        const solved = validCompletedIds.length;

        const completedProblems = allProblems.filter(p => validCompletedIds.includes(String(p.id)));

        const difficultyMap = new Map();

        (allProblems || []).forEach((problem) => {
          const key = normalizeDifficultyKey(problem?.difficulty);
          const label = formatDifficultyLabel(problem?.difficulty);
          const existing = difficultyMap.get(key) || { key, label, solved: 0, total: 0 };
          existing.total += 1;
          difficultyMap.set(key, existing);
        });

        completedProblems.forEach((problem) => {
          const key = normalizeDifficultyKey(problem?.difficulty);
          const label = formatDifficultyLabel(problem?.difficulty);
          const existing = difficultyMap.get(key) || { key, label, solved: 0, total: 0 };
          existing.solved += 1;
          if (existing.label === 'Unspecified' && label !== 'Unspecified') {
            existing.label = label;
          }
          difficultyMap.set(key, existing);
        });

        const finalDifficultyBreakdown = Array.from(difficultyMap.values())
          .sort((a, b) => {
            const rankDiff = (difficultyDisplayRank[a.key] ?? 99) - (difficultyDisplayRank[b.key] ?? 99);
            if (rankDiff !== 0) return rankDiff;
            return a.label.localeCompare(b.label);
          })
          .map((difficulty, index) => ({
            ...difficulty,
            color: getDifficultyColor(difficulty.key, index),
          }));

        // Get favorite topics from database topic frequency first
        let topTopics = (topicData || []).sort((a, b) => b.count - a.count).slice(0, 5).map(t => t.topic);

        // If database topic frequency is empty, derive from completed problems (same as Profile)
        if (topTopics.length === 0 && completedProblems.length > 0) {
          topTopics = [...new Set(completedProblems.map(p => p.topic).filter(Boolean))];
        }

        // Get attempts counters from database (canonical source for accuracy parity with leaderboard)
        const wrongSubmissionsRaw = Number(userProgress?.wrong_submissions || 0);
        const totalAttemptsRaw = Number(userProgress?.total_attempts || 0);
        const wrongSubmissions = Number.isFinite(wrongSubmissionsRaw) ? wrongSubmissionsRaw : 0;
        const totalAttempts = Number.isFinite(totalAttemptsRaw) ? totalAttemptsRaw : 0;
        const correctAnswers = totalAttempts > 0 ? Math.max(totalAttempts - wrongSubmissions, 0) : 0;
        const accuracyRate = calculateAccuracy(totalAttempts, wrongSubmissions, solved);
        let totalTimeMinutes = userProgress?.total_time_minutes || 0;

        // DB-only time source: use aggregated minutes, then fallback to persisted DB submissions.
        let totalTimeSec = totalTimeMinutes * 60;

        if (totalTimeSec === 0) {
          const submissionTimeSec = (allSubmissions || []).reduce((sum, sub) => {
            return sum + (sub.time_spent_seconds || 0);
          }, 0);
          if (submissionTimeSec > 0) {
            totalTimeSec = submissionTimeSec;
          }
        }

        const avgTimeSec = solved > 0 ? totalTimeSec / solved : 0;

        // DB-only weekly fallback: derive from DB submissions if weekly aggregate table is empty.
        let finalWeeklyData = weeklyData;
        const hasDbWeekly = (weeklyData || []).some(v => v > 0);
        if (!hasDbWeekly) {
          const now = new Date();
          const dayOfWeek = now.getDay();
          const mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
          const weekStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayDiff);
          weekStartDate.setHours(0, 0, 0, 0);

          const computedWeekly = Array(7).fill(0);

          const correctSubs = (allSubmissions || []).filter(s => s.is_correct);
          const seenByDay = new Map();
          correctSubs.forEach(sub => {
            const subDate = new Date(sub.submitted_at || sub.created_at);
            if (subDate >= weekStartDate) {
              const jsDay = subDate.getDay();
              const dayIdx = jsDay === 0 ? 6 : jsDay - 1; // Mon=0 ... Sun=6
              const key = `${dayIdx}-${sub.problem_id}`;
              if (!seenByDay.has(key)) {
                seenByDay.set(key, true);
                computedWeekly[dayIdx] = (computedWeekly[dayIdx] || 0) + 1;
              }
            }
          });

          if (computedWeekly.some(v => v > 0)) {
            finalWeeklyData = computedWeekly;
          }
        }

        setProgress({
          correctAnswers: correctAnswers,
          wrongSubmissions: wrongSubmissions,
          totalAttempts: totalAttempts,
          accuracyRate: accuracyRate,
          totalProblems,
          solvedProblems: solved,
          streakDays: streakData?.current_streak || 0,
          totalTimeSpent: `${Math.floor(totalTimeSec / 3600)}h ${Math.floor((totalTimeSec % 3600) / 60)}m`,
          averageTime: `${Math.floor(avgTimeSec / 60)}m ${Math.floor(avgTimeSec % 60)}s`,
          favoriteTopics: topTopics.length > 0 ? topTopics : ['No data yet'],
          weeklyProgress: finalWeeklyData,
          difficultyBreakdown: finalDifficultyBreakdown
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
    fetchData();
  }, []);

  const correctAnswers = progress.correctAnswers;
  const wrongSubmissions = progress.wrongSubmissions;
  const totalAttempts = progress.totalAttempts;
  const accuracyRate = progress.accuracyRate;

  const stats = {
    totalProblems: progress.totalProblems,
    solvedProblems: progress.solvedProblems,
    correctAnswers,
    wrongSubmissions,
    totalAttempts,
    streakDays: progress.streakDays,
    totalTimeSpent: progress.totalTimeSpent,
    averageTime: progress.averageTime,
    favoriteTopics: progress.favoriteTopics,
    weeklyProgress: progress.weeklyProgress,
    difficultyBreakdown: Array.isArray(progress.difficultyBreakdown) ? progress.difficultyBreakdown : []
  };
  const completionRate = stats.totalProblems > 0 ? Math.round((stats.solvedProblems / stats.totalProblems) * 100) : 0;

  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div className="statistics-container">
      <div className="stats-header">
        <h2>Your Learning Statistics</h2>
        <p>Track your progress and see how you're improving over time</p>
      </div>

      {/* Overview Cards */}
      <div className="stats-overview">
        <div className={`stat-card ${isAnimated ? 'animate-in' : ''} primary`}>
          <div className="stat-number">{stats.solvedProblems}</div>
          <div className="stat-label">Problems Solved</div>
          <div className="stat-sublabel">out of {stats.totalProblems}</div>
        </div>

        <div className={`stat-card ${isAnimated ? 'animate-in' : ''}`}>
          <div className="stat-number">{accuracyRate === null ? 'N/A' : `${accuracyRate}%`}</div>
          <div className="stat-label">Accuracy Rate</div>
          <div className="stat-sublabel">
            {stats.totalAttempts > 0
              ? `${stats.correctAnswers} correct · ${stats.wrongSubmissions} wrong`
              : 'No attempts tracked'}
          </div>
        </div>

        <div className={`stat-card ${isAnimated ? 'animate-in' : ''}`}>
          <div className="stat-number">{stats.streakDays}</div>
          <div className="stat-label">Day Streak</div>
          <div className="stat-sublabel">Keep it up!</div>
        </div>

        <div className={`stat-card ${isAnimated ? 'animate-in' : ''}`}>
          <div className="stat-number">{stats.totalTimeSpent}</div>
          <div className="stat-label">Time Spent</div>
          <div className="stat-sublabel">Avg: {stats.averageTime}</div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="progress-section">
        <div className="progress-item">
          <div className="progress-header">
            <span>Overall Completion </span>
            <span>{completionRate}%</span>
          </div>
          <progress className="progress-bar" value={completionRate} max="100"></progress>
        </div>

        <div className="progress-item">
          <div className="progress-header">
            <span>Accuracy Rate </span>
            <span>{accuracyRate === null ? 'N/A' : `${accuracyRate}%`}</span>
          </div>
          <progress className="progress-bar" value={accuracyRate === null ? 0 : accuracyRate} max="100"></progress>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="difficulty-section">
        <h3>Problems by Difficulty</h3>
        <div className="difficulty-grid">
          {stats.difficultyBreakdown.length > 0 ? (
            stats.difficultyBreakdown.map((difficulty) => (
              <div
                key={difficulty.key || difficulty.label}
                className="difficulty-item"
                style={{
                  '--difficulty-border': hexToRgba(difficulty.color, 0.3),
                  '--difficulty-hover-border': hexToRgba(difficulty.color, 0.6),
                  '--difficulty-hover-bg': hexToRgba(difficulty.color, 0.12),
                }}
              >
                <div className="difficulty-count">{difficulty.solved}</div>
                <div className="difficulty-label">{difficulty.label}</div>
              </div>
            ))
          ) : (
            <div className="difficulty-item">
              <div className="difficulty-count">0</div>
              <div className="difficulty-label">No data yet</div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="activity-section">
        <h3>Weekly Activity</h3>
        <div className="activity-chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={(() => {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                return stats.weeklyProgress.map((problems, i) => ({
                  day: days[i],
                  problems,
                }));
              })()}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d70427" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d70427" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="day"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 13 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 13 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#1e1f30',
                  border: '1px solid rgba(215,4,39,0.4)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.9rem',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                formatter={(value) => [`${value} problem${value !== 1 ? 's' : ''}`, 'Solved']}
              />
              <Area
                type="monotone"
                dataKey="problems"
                stroke="#d70427"
                strokeWidth={3}
                fill="url(#weeklyGradient)"
                dot={{ r: 5, fill: '#d70427', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#fff', stroke: '#d70427', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Favorite Topics */}
      <div className="topics-section">
        <h3>Your Favorite Topics</h3>
        <div className="topics-list">
          {stats.favoriteTopics.map((topic, index) => (
            <div key={index} className="topic-tag  rounded-full">
              {topic === 'No data yet' ? topic : formatTopicLabel(topic)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;