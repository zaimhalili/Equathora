
import React, { useEffect, useState } from 'react';
import './Statistics.css';
import { useUserStats } from '../../context/UserStatsContext';
import { formatTopicLabel } from '../../lib/utils';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FaSpinner } from 'react-icons/fa';
import { difficultyDisplayRank, formatDifficultyLabel, getDifficultyColor, normalizeDifficultyKey, withAlpha } from '@/hooks/useStatisticsColors';

const ChartTooltip = ({ active, payload, label, formatValue }) => {
  const visibleItems = (payload || []).filter((item) => Number(item.value) > 0);
  if (!active || visibleItems.length === 0) return null;

  return (
    <div className="pointer-events-none z-50 min-w-36 rounded-2xl border bg-(--secondary-color) px-4 py-3 text-(--main-color) shadow-2xl backdrop-blur-xl">
      <p className="mb-2 text-xs font-medium text-(--mid-main-secondary)">{label}</p>
      <div className="grid gap-1.5">
        {visibleItems.map((item) => (
          <div className="flex items-center justify-between gap-5 text-sm" key={item.dataKey || item.name}>
            <span className="flex items-center gap-2 font-medium">
              <i
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color || item.payload?.fill }}
              />
              {item.name}
            </span>
            <strong className="font-semibold">
              {formatValue ? formatValue(item.value, item.name) : item.value}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
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
  const activeDifficultyPerformance = difficultyPerformance.filter((difficulty) => difficulty.solved > 0);
  const totalSolvedFromHistory = activeDifficultyPerformance.reduce((total, difficulty) => total + difficulty.solved, 0);
  const difficultyKeys = Object.keys(difficultyDisplayRank).sort(
    (a, b) => difficultyDisplayRank[a] - difficultyDisplayRank[b]
  );
  const getDifficultyColorForKey = (key) => getDifficultyColor(normalizeDifficultyKey(key));
  const hasWeeklyActivity = weeklyDifficultyProgress.some((week) => week.total > 0);
  const hasDifficultyData = activeDifficultyPerformance.length > 0;

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

      {/* Weekly activity */}
      <section className="activity-section learning-activity">
        <div className="learning-insights-header">
          <div>
            <h3>Learning Activity</h3>
            <p>Your weekly attempts, grouped by difficulty</p>
          </div>
        </div>

        <div className="activity-chart-container">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={weeklyDifficultyProgress} margin={{ top: 16, right: 12, left: -18, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke="var(--chart-grid-color)" strokeDasharray="4 6" />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--mid-main-secondary)', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: 'var(--chart-axis-color)' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: 'var(--mid-main-secondary)', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'var(--chart-hover-color)', radius: 8 }}
                content={
                  <ChartTooltip
                    formatValue={(value) => `${value} attempt${value !== 1 ? 's' : ''}`}
                  />
                }
              />
              {difficultyKeys.map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={formatDifficultyLabel(key)}
                  stackId="difficulty"
                  fill={getDifficultyColorForKey(key)}
                  radius={[6, 6, 6, 6]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
          {!hasWeeklyActivity && <p className="chart-empty-state">Weekly activity will appear here after your first attempt.</p>}
        </div>

        <div className="difficulty-chart-legend" aria-label="Difficulty chart legend">
          {difficultyKeys.map((key) => (
            <span className="difficulty-legend-item" key={key}>
              <i style={{ '--difficulty-color': getDifficultyColorForKey(key) }} />
              {formatDifficultyLabel(key)}
            </span>
          ))}
        </div>
      </section>

      {/* Difficulty distribution and topic insights */}
      <section className="learning-insights-grid">
        <section className="insight-card difficulty-insight-card">
          <div className="insight-card-heading">
            <div>
              <h4>Solved by difficulty</h4>
              <p>Your completed problems across every level</p>
            </div>
          </div>
          <div className="difficulty-donut-layout">
            <div className="difficulty-donut">
              {hasDifficultyData ? (
                <>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie
                        data={activeDifficultyPerformance}
                        dataKey="solved"
                        nameKey="label"
                        innerRadius="70%"
                        outerRadius="94%"
                        paddingAngle={2}
                        cornerRadius={7}
                        stroke="var(--chart-pie-stroke)"
                        strokeWidth={3}
                        isAnimationActive={false}
                      >
                        {activeDifficultyPerformance.map((difficulty) => (
                          <Cell
                            key={difficulty.key}
                            fill={getDifficultyColorForKey(difficulty.key)}
                            stroke="var(--chart-pie-stroke)"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={<ChartTooltip formatValue={(value) => `${value} solved`} />}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="difficulty-donut-center">
                    <strong>{totalSolvedFromHistory}</strong>
                    <span>solved</span>
                  </div>
                </>
              ) : (
                <div className="difficulty-donut-empty">
                  <strong>0</strong>
                  <span>solved</span>
                </div>
              )}
            </div>
            {hasDifficultyData ? (
              <div className="difficulty-solved-legend">
                {activeDifficultyPerformance.map((difficulty) => (
                  <div
                    className="difficulty-time-row"
                    key={difficulty.key}
                    style={{ '--difficulty-color': getDifficultyColorForKey(difficulty.key) }}
                  >
                    <span className="difficulty-time-name">
                      <i style={{ '--difficulty-color': getDifficultyColorForKey(difficulty.key) }} />
                      {difficulty.label}
                    </span>
                    <span className="difficulty-time-values">
                      <strong>{difficulty.solved}</strong>
                      <small>{difficulty.attempts} attempts</small>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="insight-empty-state">Your completed levels will appear here.</p>
            )}
          </div>
        </section>

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
      </section>

      {/* Progress Bars */}
      <div className="progress-section">
        <div className="progress-item">
          <div className="progress-header">
            <span>Overall Completion</span>
            <span>{completionRate}%</span>
          </div>
          <progress className="progress-bar" value={completionRate} max="100"></progress>
        </div>

        <div className="progress-item">
          <div className="progress-header">
            <span>Accuracy Rate</span>
            <span>{accuracyRate === null ? 'N/A' : `${accuracyRate}%`}</span>
          </div>
          <progress className="progress-bar" value={accuracyRate === null ? 0 : accuracyRate} max="100"></progress>
        </div>
      </div>

      {/* Problems by difficulty */}
      <div className="difficulty-section">
        <h3>Problems by Difficulty</h3>
        <div className="difficulty-grid">
          {displayStats.difficultyBreakdown.length > 0 ? (
            displayStats.difficultyBreakdown.map((difficulty) => (
              <div
                key={difficulty.key || difficulty.label}
                className="difficulty-item"
                style={{
                  '--difficulty-border': withAlpha(difficulty.color, 0.32),
                  '--difficulty-hover-border': withAlpha(difficulty.color, 0.78),
                  '--difficulty-hover-bg': withAlpha(difficulty.color, 0.2),
                  '--difficulty-color': difficulty.color,
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