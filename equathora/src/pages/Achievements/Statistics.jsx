
import React, { useEffect, useState } from 'react';
import './Statistics.css';
import { useUserStats } from '../../context/UserStatsContext';
import { formatTopicLabel } from '../../lib/utils';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FaSpinner } from 'react-icons/fa';
import { withAlpha } from '@/hooks/useStatisticsColors';

const difficultyChartColors = {
  easy: 'var(--easy)',
  medium: 'var(--medium)',
  hard: 'var(--dark-accent-color)'
};

const formatDuration = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${Math.floor(safeSeconds % 60)}s`;
};

const Statistics = () => {
  const { stats, loading } = useUserStats();
  const [isAnimated, setIsAnimated] = useState(false);

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
  const difficultyBreakdown = Array.isArray(stats.difficultyBreakdown)
    ? stats.difficultyBreakdown
    : [];
  const weeklyDifficultyProgress = Array.isArray(stats.weeklyDifficultyProgress)
    ? stats.weeklyDifficultyProgress
    : [];
  const topicPerformance = Array.isArray(stats.topicPerformance) ? stats.topicPerformance : [];
  const difficultyPerformance = Array.isArray(stats.difficultyPerformance) ? stats.difficultyPerformance : [];
  const timeByDifficulty = difficultyPerformance.filter((difficulty) => difficulty.timeSeconds > 0);
  const trackedTimeSeconds = difficultyPerformance.reduce((total, difficulty) => total + difficulty.timeSeconds, 0);
  const hasWeeklyActivity = weeklyDifficultyProgress.some((week) => week.total > 0);
  const hasDifficultyTime = timeByDifficulty.length > 0;

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
    difficultyBreakdown
  };
  const completionRate = displayStats.totalProblems > 0 ? Math.round((displayStats.solvedProblems / displayStats.totalProblems) * 100) : 0;

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  if (loading) {
    return <div className="statistics-container">
      <div className="py-6 flex justify-center items-center animate-spin">
        <FaSpinner className='text-2xl' />
      </div>
      Loading Statistics
    </div>;
  }

  return (
    <div className="statistics-container">
      <div className="stats-header">
        <h2>Your Learning Statistics</h2>
        <p>Track your progress and see how you're improving over time</p>
      </div>

      {/* Overview Cards */}
      <div className="stats-overview">
        <div className={`stat-card ${isAnimated ? 'animate-in' : ''} primary`}>
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
          <div className="stat-number">{displayStats.streakDays}</div>
          <div className="stat-label">Day Streak</div>
          <div className="stat-sublabel">Keep it up!</div>
        </div>

        <div className={`stat-card ${isAnimated ? 'animate-in' : ''}`}>
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
          {displayStats.difficultyBreakdown.length > 0 ? (
            displayStats.difficultyBreakdown.map((difficulty) => (
              <div
                key={difficulty.key || difficulty.label}
                className="difficulty-item"
                style={{
                  '--difficulty-border': withAlpha(difficulty.color, 0.3),
                  '--difficulty-hover-border': withAlpha(difficulty.color, 0.6),
                  '--difficulty-hover-bg': withAlpha(difficulty.color, 0.12),
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

      {/* Learning activity and performance */}
      <section className="activity-section learning-insights">
        <div className="learning-insights-header">
          <div>
            <h3>Learning Activity</h3>
            <p>Attempts by difficulty over the last 10 weeks</p>
          </div>
        </div>

        <div className="activity-chart-container">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={weeklyDifficultyProgress} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--mid-main-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: 'var(--mid-main-secondary)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--secondary-color)',
                  border: '1px solid var(--dark-accent-color)',
                  borderRadius: '10px',
                  color: 'var(--main-color)',
                }}
                labelStyle={{ color: 'var(--mid-main-secondary)' }}
                formatter={(value, name) => [`${value} attempt${value !== 1 ? 's' : ''}`, name]}
              />
              <Legend wrapperStyle={{ color: 'var(--mid-main-secondary)', fontSize: '0.85rem' }} />
              <Bar dataKey="easy" name="Easy" stackId="difficulty" fill={difficultyChartColors.easy} />
              <Bar dataKey="medium" name="Medium" stackId="difficulty" fill={difficultyChartColors.medium} />
              <Bar dataKey="hard" name="Hard" stackId="difficulty" fill={difficultyChartColors.hard} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {!hasWeeklyActivity && <p className="chart-empty-state">Weekly activity will appear here after your first attempt.</p>}
        </div>

        <div className="learning-insights-grid">
          <section className="insight-card topic-insight-card">
            <div className="insight-card-heading">
              <div>
                <h4>Topic performance</h4>
                <p>Your most-practiced topics</p>
              </div>
            </div>
            {topicPerformance.length > 0 ? (
              <div className="topic-performance-list">
                {topicPerformance.map((topic) => (
                  <article className="topic-performance-item" key={topic.topic}>
                    <div className="topic-performance-heading">
                      <div>
                        <h5 title={formatTopicLabel(topic.topic)}>{formatTopicLabel(topic.topic)}</h5>
                        <span>{topic.attempts} attempts</span>
                      </div>
                      <strong>{topic.accuracy}%</strong>
                    </div>
                    <div
                      className="topic-performance-track"
                      role="meter"
                      aria-label={`${formatTopicLabel(topic.topic)} accuracy`}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={topic.accuracy}
                    >
                      <span style={{ width: `${topic.accuracy}%` }} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="insight-empty-state">Topic performance will appear after your first attempt.</p>
            )}
          </section>

          <section className="insight-card difficulty-insight-card">
            <div className="insight-card-heading">
              <div>
                <h4>Time by difficulty</h4>
                <p>Practice time from your submissions</p>
              </div>
            </div>
            <div className="difficulty-time-summary">
              <div className="difficulty-donut">
                {hasDifficultyTime ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <PieChart>
                        <Pie
                          data={timeByDifficulty}
                          dataKey="timeSeconds"
                          nameKey="label"
                          innerRadius="68%"
                          outerRadius="94%"
                          paddingAngle={3}
                          stroke="none"
                        >
                          {timeByDifficulty.map((difficulty) => (
                            <Cell key={difficulty.key} fill={difficultyChartColors[difficulty.key]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: 'var(--secondary-color)',
                            border: '1px solid var(--dark-accent-color)',
                            borderRadius: '10px',
                            color: 'var(--main-color)',
                          }}
                          formatter={(value) => [formatDuration(value), 'Practice time']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="difficulty-donut-center">
                      <strong>{formatDuration(trackedTimeSeconds)}</strong>
                      <span>total</span>
                    </div>
                  </>
                ) : (
                  <div className="difficulty-donut-empty">
                    <span>No time</span>
                    <span>tracked yet</span>
                  </div>
                )}
              </div>
              <div className="difficulty-time-legend">
                {difficultyPerformance.map((difficulty) => (
                  <div className="difficulty-time-row" key={difficulty.key}>
                    <span className="difficulty-time-name">
                      <i style={{ backgroundColor: difficultyChartColors[difficulty.key] }} />
                      {difficulty.label}
                    </span>
                    <span className="difficulty-time-values">
                      <strong>{formatDuration(difficulty.timeSeconds)}</strong>
                      <small>{difficulty.attempts} attempts</small>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

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