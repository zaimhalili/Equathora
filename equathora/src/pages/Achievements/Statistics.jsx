
import React, { useEffect, useState } from 'react';
import './Statistics.css';
import { useUserStats } from '../../context/UserStatsContext';
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
  const { stats, loading, refreshStats } = useUserStats();
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    void refreshStats();
  }, [refreshStats]);

  const solved = stats.problemsSolved || 0;
  const totalProblems = stats.totalProblems || 0;
  const correctAnswers = stats.accuracyBreakdown?.correct || 0;
  const wrongSubmissions = stats.accuracyBreakdown?.wrong || 0;
  const totalAttempts = stats.accuracyBreakdown?.total || 0;
  const accuracyRate = stats.accuracy;
  const streakDays = stats.currentStreak || 0;
  const totalTimeSeconds = stats.totalTimeSeconds || 0;
  const totalTimeSpent = `${Math.floor(totalTimeSeconds / 3600)}h ${Math.floor((totalTimeSeconds % 3600) / 60)}m`;
  const averageTime = solved > 0 ? `${Math.floor(totalTimeSeconds / solved / 60)}m ${Math.floor((totalTimeSeconds / solved) % 60)}s` : '0m 0s';
  const favoriteTopics = Array.isArray(stats.favoriteTopics) && stats.favoriteTopics.length > 0
    ? stats.favoriteTopics
    : ['No data yet'];
  const weeklyProgress = Array.isArray(stats.weeklyProgress) ? stats.weeklyProgress : Array(7).fill(0);
  const difficultyBreakdown = Array.isArray(stats.difficultyBreakdown)
    ? stats.difficultyBreakdown
    : [];

  const displayStats = {
    totalProblems,
    solvedProblems: solved,
    correctAnswers,
    wrongSubmissions,
    totalAttempts,
    streakDays,
    totalTimeSpent,
    averageTime,
    favoriteTopics,
    weeklyProgress,
    difficultyBreakdown
  };
  const completionRate = displayStats.totalProblems > 0 ? Math.round((displayStats.solvedProblems / displayStats.totalProblems) * 100) : 0;

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  if (loading) {
    return <div className="statistics-container"><div className="py-12 flex justify-center items-center"><div>Loading statistics...</div></div></div>;
  }

  return (
    <div className="statistics-container">
      <div className="stats-header">
        <h2>Your Learning Statistics</h2>
        <p>Track your progress and see how you're improving over time</p>
      </div>

      {/* Overview Cards */}
      {/* Overview Cards */}
      <div className="stats-overview">
        <div className={`stat-card ${isAnimated ? 'animate-in' : ''} primary`}>
          {/* FIXED: Changed stats.solvedProblems -> displayStats.solvedProblems */}
          <div className="stat-number">{displayStats.solvedProblems}</div>
          <div className="stat-label">Problems Solved</div>
          <div className="stat-sublabel">out of {displayStats.totalProblems}</div>
        </div>

        <div className={`stat-card ${isAnimated ? 'animate-in' : ''}`}>
          <div className="stat-number">{accuracyRate === null ? 'N/A' : `${accuracyRate}%`}</div>
          <div className="stat-label">Accuracy Rate</div>
          <div className="stat-sublabel">
            {displayStats.totalAttempts > 0
              ? `${displayStats.correctAnswers} correct · ${displayStats.wrongSubmissions} wrong`
              : 'No attempts tracked'}
          </div>
        </div>

        <div className={`stat-card ${isAnimated ? 'animate-in' : ''}`}>
          {/* FIXED: Changed stats.streakDays -> displayStats.streakDays */}
          <div className="stat-number">{displayStats.streakDays}</div>
          <div className="stat-label">Day Streak</div>
          <div className="stat-sublabel">Keep it up!</div>
        </div>

        <div className={`stat-card ${isAnimated ? 'animate-in' : ''}`}>
          {/* FIXED: Changed stats.totalTimeSpent -> displayStats.totalTimeSpent */}
          <div className="stat-number">{displayStats.totalTimeSpent}</div>
          <div className="stat-label">Time Spent</div>
          <div className="stat-sublabel">Avg: {displayStats.averageTime}</div>
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
          <ResponsiveContainer width="100%" height={250} minWidth={0} minHeight={0}>
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
            <div key={index} className="rounded-full topic-tag">
              {topic === 'No data yet' ? topic : formatTopicLabel(topic)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;