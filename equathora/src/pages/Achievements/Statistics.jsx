
import React, { useEffect, useState } from 'react';
import './Statistics.css';

const Statistics = () => {
  // Load data from localStorage - starts at zero for new users
  const progress = JSON.parse(localStorage.getItem('equathoraProgress') || '{}');

  const correctAnswers = progress.correctAnswers || 0;
  const wrongSubmissions = progress.wrongSubmissions || 0;
  const totalAttempts = progress.totalAttempts || correctAnswers + wrongSubmissions;
  const accuracyDenominator = correctAnswers + wrongSubmissions;
  const accuracyRate = accuracyDenominator > 0 ? Math.round((correctAnswers / accuracyDenominator) * 100) : 0;

  const stats = {
    totalProblems: progress.totalProblems || 30,
    solvedProblems: progress.solvedProblems?.length || 0,
    correctAnswers,
    wrongSubmissions,
    totalAttempts,
    streakDays: progress.streakDays || 0,
    totalTimeSpent: progress.totalTimeSpent || "0h 0m",
    averageTime: progress.averageTime || "0m 0s",
    favoriteTopics: progress.favoriteTopics || ["Algebra", "Geometry"],
    weeklyProgress: progress.weeklyProgress || [0, 0, 0, 0, 0, 0, 0],
    difficultyBreakdown: {
      easy: progress.difficultyBreakdown?.easy || 0,
      medium: progress.difficultyBreakdown?.medium || 0,
      hard: progress.difficultyBreakdown?.hard || 0
    }
  };
  const completionRate = Math.round((stats.solvedProblems / stats.totalProblems) * 100);

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