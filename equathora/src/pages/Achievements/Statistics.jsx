
import React, { useEffect, useState } from 'react';
import './Statistics.css';
import { getUserProgress, getStreakData, getWeeklyProgress, getDifficultyBreakdown, getTopicFrequency, getUserSubmissions } from '../../lib/databaseService';
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
    difficultyBreakdown: { easy: 0, medium: 0, hard: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const [userProgress, streakData, weeklyData, allProblems, completedRowsResult, difficultyData, topicData, allSubmissions] = await Promise.all([
          getUserProgress(),
          getStreakData(),
          getWeeklyProgress(),
          getAllProblems(),
          supabase
            .from('user_completed_problems')
            .select('problem_id')
            .eq('user_id', session.user.id),
          getDifficultyBreakdown(),
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

        // Calculate difficulty breakdown from completed problems (same as Profile)
        const completedProblems = allProblems.filter(p => validCompletedIds.includes(String(p.id)));
        const easySolved = completedProblems.filter(p => p.difficulty === 'Easy').length;
        const mediumSolved = completedProblems.filter(p => p.difficulty === 'Medium').length;
        const hardSolved = completedProblems.filter(p => p.difficulty === 'Hard').length;

        // Use calculated breakdown if database breakdown is empty
        const calculatedBreakdown = { easy: easySolved, medium: mediumSolved, hard: hardSolved };
        const finalDifficultyBreakdown = (difficultyData?.easy || difficultyData?.medium || difficultyData?.hard)
          ? difficultyData
          : calculatedBreakdown;

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
    difficultyBreakdown: progress.difficultyBreakdown
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
          <div className="difficulty-item easy">
            <div className="difficulty-count">{stats.difficultyBreakdown.easy}</div>
            <div className="difficulty-label">Easy</div>
          </div>
          <div className="difficulty-item medium">
            <div className="difficulty-count">{stats.difficultyBreakdown.medium}</div>
            <div className="difficulty-label">Medium</div>
          </div>
          <div className="difficulty-item hard">
            <div className="difficulty-count">{stats.difficultyBreakdown.hard}</div>
            <div className="difficulty-label">Hard</div>
          </div>
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