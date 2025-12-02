import React, { useEffect, useState } from 'react';
import './RecentAchievements.css';
import { FaTrophy, FaFire, FaBolt, FaGem, FaStar, FaRocket, FaBrain, FaHeart, FaCrown, FaMedal } from 'react-icons/fa';

const RecentAchievements = () => {
  // Load data from localStorage - starts at zero for new users
  const progress = JSON.parse(localStorage.getItem('equathoraProgress') || '{}');
  const solvedProblems = progress.solvedProblems?.length || 0;
  const streakDays = progress.streakDays || 0;
  const conceptsLearned = progress.conceptsLearned || 0;
  const totalTimeSpent = progress.totalTimeMinutes || 0;
  const hardProblems = progress.difficultyBreakdown?.hard || 0;
  const perfectStreak = progress.perfectStreak || 0;

  // Check if user is an early user (created account before a certain date)
  const accountCreated = progress.accountCreated || Date.now();
  const isEarlyUser = accountCreated < new Date('2025-01-01').getTime();

  const achievements = [
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
    }
  ];

  // Automatically grant early user achievement
  useEffect(() => {
    if (isEarlyUser && !progress.achievementsUnlocked?.includes('early-bird')) {
      const updatedProgress = {
        ...progress,
        achievementsUnlocked: [...(progress.achievementsUnlocked || []), 'early-bird'],
        achievementsEarned: (progress.achievementsEarned || 0) + 1
      };
      localStorage.setItem('equathoraProgress', JSON.stringify(updatedProgress));
    }
  }, [isEarlyUser]);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const achievementsEarned = unlockedAchievements.length;

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
        {achievements.map((achievement, index) => (
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