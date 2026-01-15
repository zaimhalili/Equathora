
import React, { useEffect, useState } from 'react';
import './Statistics.css';
import { getUserProgress, getStreakData, getWeeklyProgress, getDifficultyBreakdown, getTopicFrequency, getCompletedProblems } from '../../lib/databaseService';
import { getAllProblems } from '../../lib/problemService';
import { supabase } from '../../lib/supabaseClient';
import { getSubmissions } from '../../lib/progressStorage';

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
        // Filter completed IDs to only count valid current problems (same as YourTrack)
        const validProblemIds = new Set((allProblems || []).map(p => String(p.id)));
        const validCompletedIds = (completedIds || []).filter(id => validProblemIds.has(String(id)));
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

        const topTopics = (topicData || []).sort((a, b) => b.count - a.count).slice(0, 5).map(t => t.topic);

        // Get correct/wrong from database
        let correctAnswers = userProgress?.correct_answers || 0;
        let wrongSubmissions = userProgress?.wrong_submissions || 0;
        let totalAttempts = userProgress?.total_attempts || 0;
        let totalTimeMinutes = userProgress?.total_time_minutes || 0;

        // If backend counters aren't populated, fall back to local submissions (same as Profile)
        if (totalAttempts === 0) {
          const local = (getSubmissions() || []).filter(s => validProblemIds.has(String(s.problemId)));
          if (local.length > 0) {
            const localCorrect = local.filter(s => s.isCorrect).length;
            correctAnswers = localCorrect;
            wrongSubmissions = local.length - localCorrect;
            totalAttempts = local.length;
          }
        }

        // Calculate time spent from completed problems if database doesn't have it
        const totalTimeSec = totalTimeMinutes * 60;
        const avgTimeSec = solved > 0 ? totalTimeSec / solved : 0;

        setProgress({
          correctAnswers: correctAnswers,
          wrongSubmissions: wrongSubmissions,
          totalAttempts: totalAttempts,
          totalProblems,
          solvedProblems: solved,
          streakDays: streakData?.current_streak || 0,
          totalTimeSpent: `${Math.floor(totalTimeSec / 3600)}h ${Math.floor((totalTimeSec % 3600) / 60)}m`,
          averageTime: `${Math.floor(avgTimeSec / 60)}m ${Math.floor(avgTimeSec % 60)}s`,
          favoriteTopics: topTopics.length > 0 ? topTopics : ['No data yet'],
          weeklyProgress: weeklyData,
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
            // Bar height maxes out at 5 problems (100% height), then only number increases
            const maxProblemsForFullHeight = 5;
            const heightPercentage = Math.min((problems / maxProblemsForFullHeight) * 100, 100);

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