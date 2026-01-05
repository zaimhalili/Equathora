
import React, { useEffect, useState } from 'react';
import './Statistics.css';
import { getUserProgress, getStreakData, getWeeklyProgress, getDifficultyBreakdown, getTopicFrequency, getCompletedProblems } from '../../lib/databaseService';
import { getAllProblems } from '../../lib/problemService';
import { supabase } from '../../lib/supabaseClient';

const Statistics = () => {
  const [progress, setProgress] = useState({
    correctAnswers: 0,
    wrongSubmissions: 0,
    totalAttempts: 0,
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

        const [userProgress, streakData, weeklyData, allProblems, completedIds, difficultyData, topicData] = await Promise.all([
          getUserProgress(),
          getStreakData(),
          getWeeklyProgress(),
          getAllProblems(),
          getCompletedProblems(),
          getDifficultyBreakdown(),
          getTopicFrequency()
        ]);

        const totalProblems = allProblems.length || 0;
        const solved = completedIds?.length || 0;
        const totalTimeSec = completedIds.length > 0 ? (userProgress?.total_time_minutes || 0) * 60 : 0;
        const avgTimeSec = solved > 0 ? totalTimeSec / solved : 0;

        const topTopics = (topicData || []).sort((a, b) => b.count - a.count).slice(0, 5).map(t => t.topic);

        setProgress({
          correctAnswers: userProgress?.correct_answers || 0,
          wrongSubmissions: userProgress?.wrong_submissions || 0,
          totalAttempts: userProgress?.total_attempts || 0,
          totalProblems,
          solvedProblems: solved,
          streakDays: streakData?.current_streak || 0,
          totalTimeSpent: `${Math.floor(totalTimeSec / 3600)}h ${Math.floor((totalTimeSec % 3600) / 60)}m`,
          averageTime: `${Math.floor(avgTimeSec / 60)}m ${Math.floor(avgTimeSec % 60)}s`,
          favoriteTopics: topTopics.length > 0 ? topTopics : ['No data yet'],
          weeklyProgress: weeklyData,
          difficultyBreakdown: difficultyData || { easy: 0, medium: 0, hard: 0 }
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
  const accuracyRate = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

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
          <div className="stat-number">{accuracyRate}%</div>
          <div className="stat-label">Accuracy Rate</div>
          <div className="stat-sublabel">{stats.correctAnswers} correct · {stats.wrongSubmissions} wrong</div>
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
            <span>{accuracyRate}%</span>
          </div>
          <progress className="progress-bar" value={accuracyRate} max="100"></progress>
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
        <div className="activity-chart">
          {stats.weeklyProgress.map((problems, index) => {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const maxHeight = Math.max(...stats.weeklyProgress, 1); // Prevent division by zero
            const heightPercentage = maxHeight > 0 ? (problems / maxHeight) * 100 : 0;

            return (
              <div key={index} className="activity-day">
                <div
                  className="activity-bar"
                  style={{ height: `${heightPercentage}%` }}
                  title={`${problems} problems on ${days[index]}`}
                >
                  {problems > 0 && <span className="bar-value">{problems}</span>}
                </div>
                <div className="activity-label">{days[index]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Favorite Topics */}
      <div className="topics-section">
        <h3>Your Favorite Topics</h3>
        <div className="topics-list">
          {stats.favoriteTopics.map((topic, index) => (
            <div key={index} className="topic-tag">
              #{topic}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;