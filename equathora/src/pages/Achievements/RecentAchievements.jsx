import React, { useEffect, useState } from 'react';
import './RecentAchievements.css';
import { FaTrophy, FaFire, FaBolt, FaGem, FaStar, FaRocket } from 'react-icons/fa';
import { FaBrain, FaHeart, FaCrown, FaMedal, FaCalculator, FaGraduationCap } from 'react-icons/fa';
import { FaMountain, FaInfinity, FaAward, FaLightbulb, FaChartLine, FaClock } from 'react-icons/fa';
import { FaBalanceScale, FaAtom, FaPuzzlePiece, FaFeather, FaDragon, FaSnowflake } from 'react-icons/fa';
import { FaSun, FaMoon, FaLeaf, FaGlobe, FaShieldAlt, FaBook } from 'react-icons/fa';
import { getUserStats } from '../../lib/progressStorage';

const RecentAchievements = () => {
  // Load data from device-specific localStorage
  const userStats = getUserStats();
  const progress = {
    solvedProblems: userStats.problemsSolved || 0,
    streakDays: userStats.currentStreak || 0,
    conceptsLearned: Object.keys(userStats.favoriteTopics || {}).length || 0,
    totalTimeMinutes: Math.floor(userStats.totalTime / 60) || 0,
    difficultyBreakdown: userStats.difficultyBreakdown || { easy: 0, medium: 0, hard: 0 },
    perfectStreak: userStats.perfectStreak || 0,
    accountCreated: userStats.joinDate ? new Date(userStats.joinDate).getTime() : Date.now(),
    achievementsUnlocked: [],
    achievementsEarned: 0,
    // Extended stats for more achievements
    mediumProblems: userStats.difficultyBreakdown?.medium || 0,
    easyProblems: userStats.difficultyBreakdown?.easy || 0,
    totalAttempts: userStats.totalAttempts || 0,
    weekendProblems: userStats.weekendProblems || 0,
    nightProblems: userStats.nightProblems || 0,
    topicsExplored: Object.keys(userStats.favoriteTopics || {}).length || 0,
    longestSession: userStats.longestSession || 0,
    bestStreak: userStats.bestStreak || userStats.currentStreak || 0,
  };
  const solvedProblems = progress.solvedProblems;
  const streakDays = progress.streakDays;
  const conceptsLearned = progress.conceptsLearned;
  const totalTimeSpent = progress.totalTimeMinutes;
  const hardProblems = progress.difficultyBreakdown?.hard || 0;
  const mediumProblems = progress.difficultyBreakdown?.medium || 0;
  const easyProblems = progress.difficultyBreakdown?.easy || 0;
  const perfectStreak = progress.perfectStreak;
  const totalAttempts = progress.totalAttempts;
  const topicsExplored = progress.topicsExplored;
  const longestSession = progress.longestSession;
  const bestStreak = progress.bestStreak;

  // Check if user is an early user (created account before a certain date)
  const accountCreated = progress.accountCreated || Date.now();
  const isEarlyUser = accountCreated < new Date('2025-01-01').getTime();

  // Time-based checks
  const currentHour = new Date().getHours();
  const isNightOwl = currentHour >= 22 || currentHour < 5;
  const isEarlyBird = currentHour >= 5 && currentHour < 8;

  const achievements = [
    // Original 10 achievements
    {
      id: 'early-bird',
      icon: <FaCrown />,
      title: 'Early Pioneer',
      description: 'Joined Equathora as one of the first users',
      color: '#FFD700',
      unlocked: isEarlyUser,
      automatic: true,
      rarity: 'Legendary'
    },
    {
      id: 'first-step',
      icon: <FaStar />,
      title: 'First Steps',
      description: 'Solved your first problem',
      color: '#4CAF50',
      unlocked: solvedProblems >= 1,
      rarity: 'Common'
    },
    {
      id: 'problem-solver',
      icon: <FaBrain />,
      title: 'Problem Solver',
      description: 'Solved 10 problems',
      color: '#2196F3',
      unlocked: solvedProblems >= 10,
      rarity: 'Uncommon'
    },
    {
      id: 'math-wizard',
      icon: <FaGem />,
      title: 'Math Wizard',
      description: 'Solved 50 problems',
      color: '#9C27B0',
      unlocked: solvedProblems >= 50,
      rarity: 'Rare'
    },
    {
      id: 'on-fire',
      icon: <FaFire />,
      title: 'On Fire!',
      description: 'Maintained a 7-day streak',
      color: '#FF5722',
      unlocked: streakDays >= 7,
      rarity: 'Rare'
    },
    {
      id: 'unstoppable',
      icon: <FaBolt />,
      title: 'Unstoppable',
      description: 'Maintained a 30-day streak',
      color: '#FF9800',
      unlocked: streakDays >= 30,
      rarity: 'Epic'
    },
    {
      id: 'speed-demon',
      icon: <FaRocket />,
      title: 'Speed Demon',
      description: 'Solved 5 problems in under 30 minutes',
      color: '#00BCD4',
      unlocked: totalTimeSpent > 0 && solvedProblems >= 5 && (totalTimeSpent / solvedProblems) < 30,
      rarity: 'Epic'
    },
    {
      id: 'hard-mode',
      icon: <FaTrophy />,
      title: 'Challenge Accepted',
      description: 'Solved 5 hard problems',
      color: '#E91E63',
      unlocked: hardProblems >= 5,
      rarity: 'Epic'
    },
    {
      id: 'dedicated',
      icon: <FaHeart />,
      title: 'Dedicated Learner',
      description: 'Spent over 10 hours learning',
      color: '#F44336',
      unlocked: totalTimeSpent >= 600,
      rarity: 'Rare'
    },
    {
      id: 'perfectionist',
      icon: <FaMedal />,
      title: 'Perfectionist',
      description: 'Got 10 problems correct on first try',
      color: '#FFD700',
      unlocked: perfectStreak >= 10,
      rarity: 'Legendary'
    },
    // 20 NEW achievements
    {
      id: 'century',
      icon: <FaCalculator />,
      title: 'Century Club',
      description: 'Solved 100 problems',
      color: '#8E44AD',
      unlocked: solvedProblems >= 100,
      rarity: 'Epic'
    },
    {
      id: 'marathon',
      icon: <FaMountain />,
      title: 'Marathon Runner',
      description: 'Maintained a 60-day streak',
      color: '#1ABC9C',
      unlocked: streakDays >= 60,
      rarity: 'Legendary'
    },
    {
      id: 'balanced',
      icon: <FaBalanceScale />,
      title: 'Perfectly Balanced',
      description: 'Solved at least 5 problems of each difficulty',
      color: '#3498DB',
      unlocked: easyProblems >= 5 && mediumProblems >= 5 && hardProblems >= 5,
      rarity: 'Rare'
    },
    {
      id: 'explorer',
      icon: <FaGlobe />,
      title: 'Explorer',
      description: 'Explored problems from 5 different topics',
      color: '#27AE60',
      unlocked: topicsExplored >= 5,
      rarity: 'Uncommon'
    },
    {
      id: 'scholar',
      icon: <FaGraduationCap />,
      title: 'Math Scholar',
      description: 'Explored problems from 10 different topics',
      color: '#9B59B6',
      unlocked: topicsExplored >= 10,
      rarity: 'Rare'
    },
    {
      id: 'night-owl',
      icon: <FaMoon />,
      title: 'Night Owl',
      description: 'Solved a problem between 10 PM and 5 AM',
      color: '#2C3E50',
      unlocked: solvedProblems >= 1 && (isNightOwl || false),
      rarity: 'Uncommon'
    },
    {
      id: 'early-riser',
      icon: <FaSun />,
      title: 'Early Riser',
      description: 'Solved a problem between 5 AM and 8 AM',
      color: '#F1C40F',
      unlocked: solvedProblems >= 1 && (isEarlyBird || false),
      rarity: 'Uncommon'
    },
    {
      id: 'warm-up',
      icon: <FaLeaf />,
      title: 'Warm Up Champion',
      description: 'Solved 20 easy problems',
      color: '#2ECC71',
      unlocked: easyProblems >= 20,
      rarity: 'Uncommon'
    },
    {
      id: 'middle-ground',
      icon: <FaPuzzlePiece />,
      title: 'Middle Ground Master',
      description: 'Solved 20 medium problems',
      color: '#E67E22',
      unlocked: mediumProblems >= 20,
      rarity: 'Rare'
    },
    {
      id: 'hard-core',
      icon: <FaDragon />,
      title: 'Hardcore Mathematician',
      description: 'Solved 20 hard problems',
      color: '#C0392B',
      unlocked: hardProblems >= 20,
      rarity: 'Legendary'
    },
    {
      id: 'time-master',
      icon: <FaClock />,
      title: 'Time Master',
      description: 'Spent over 24 hours learning in total',
      color: '#16A085',
      unlocked: totalTimeSpent >= 1440,
      rarity: 'Epic'
    },
    {
      id: 'infinity',
      icon: <FaInfinity />,
      title: 'To Infinity',
      description: 'Solved 200 problems',
      color: '#8E44AD',
      unlocked: solvedProblems >= 200,
      rarity: 'Legendary'
    },
    {
      id: 'quick-starter',
      icon: <FaFeather />,
      title: 'Quick Starter',
      description: 'Solved 3 problems on your first day',
      color: '#1ABC9C',
      unlocked: solvedProblems >= 3 && (Date.now() - accountCreated) < (24 * 60 * 60 * 1000),
      rarity: 'Uncommon'
    },
    {
      id: 'comeback',
      icon: <FaShieldAlt />,
      title: 'Comeback King',
      description: 'Reached a 14-day streak after a break',
      color: '#E74C3C',
      unlocked: streakDays >= 14 && bestStreak > streakDays,
      rarity: 'Rare'
    },
    {
      id: 'bookworm',
      icon: <FaBook />,
      title: 'Bookworm',
      description: 'Spent over 50 hours learning',
      color: '#6C5B7B',
      unlocked: totalTimeSpent >= 3000,
      rarity: 'Legendary'
    },
    {
      id: 'rising-star',
      icon: <FaChartLine />,
      title: 'Rising Star',
      description: 'Solved 25 problems',
      color: '#F39C12',
      unlocked: solvedProblems >= 25,
      rarity: 'Uncommon'
    },
    {
      id: 'lightbulb',
      icon: <FaLightbulb />,
      title: 'Eureka Moment',
      description: 'Solved 5 problems in a single session',
      color: '#F7DC6F',
      unlocked: longestSession >= 5,
      rarity: 'Rare'
    },
    {
      id: 'atomic',
      icon: <FaAtom />,
      title: 'Atomic Precision',
      description: 'Got 20 problems correct on first try',
      color: '#5DADE2',
      unlocked: perfectStreak >= 20,
      rarity: 'Legendary'
    },
    {
      id: 'grandmaster',
      icon: <FaAward />,
      title: 'Grand Master',
      description: 'Reached an all-time best streak of 90 days',
      color: '#FFD700',
      unlocked: bestStreak >= 90,
      rarity: 'Legendary'
    },
    {
      id: 'snowflake',
      icon: <FaSnowflake />,
      title: 'Cool Under Pressure',
      description: 'Solved 10 hard problems without hints',
      color: '#85C1E9',
      unlocked: hardProblems >= 10,
      rarity: 'Epic'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const achievementsEarned = unlockedAchievements.length;

  // Sort achievements: unlocked first, then by rarity (harder at bottom)
  const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5 };
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return b.unlocked - a.unlocked;
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });

  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return '#95a5a6';
      case 'Uncommon': return '#27ae60';
      case 'Rare': return '#3498db';
      case 'Epic': return '#9b59b6';
      case 'Legendary': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  return (
    <section className='rec-achievements'>
      <article className="a-top">
        <h2>Your Achievements</h2>
        <p>You have come a long way</p>
        <div className="block-container">
          <div className={`block ${isAnimated ? "animate-in" : ''}`}>
            <span style={{ fontSize: " clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--dark-accent-color)" }}>{achievementsEarned}</span> <br />
            Achievements Earned
          </div>
          <div className={`block ${isAnimated ? "animate-in" : ''}`}>
            <span style={{ fontSize: " clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--dark-accent-color)" }}>{streakDays}</span> <br />
            Days Streak
          </div>
          <div className={`block ${isAnimated ? "animate-in" : ''}`}>
            <span style={{ fontSize: " clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--dark-accent-color)" }}>{conceptsLearned}</span> <br />
            Concepts Learned
          </div>
        </div>
      </article>

      <article className="achievements-list">
        {sortedAchievements.map((achievement, index) => (
          <div
            key={achievement.id}
            className={`a-list-component ${achievement.unlocked ? 'unlocked' : 'locked'} ${isAnimated ? 'animate-in' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="achievement-icon" style={{ color: achievement.unlocked ? achievement.color : '#95a5a6' }}>
              {achievement.icon}
            </div>
            <div className="achievement-content">
              <div className="achievement-header">
                <h3>{achievement.title}</h3>
                <span className="achievement-rarity" style={{ color: getRarityColor(achievement.rarity) }}>
                  {achievement.rarity}
                </span>
              </div>
              <p>{achievement.description}</p>
              {achievement.automatic && achievement.unlocked && (
                <span className="automatic-badge">Auto-Unlocked</span>
              )}
            </div>
            <div className={`achievement-status ${achievement.unlocked ? 'unlocked-badge' : 'locked-badge'}`}>
              {achievement.unlocked ? '✓' : '🔒'}
            </div>
          </div>
        ))}
      </article>
    </section>
  );
};

export default RecentAchievements;