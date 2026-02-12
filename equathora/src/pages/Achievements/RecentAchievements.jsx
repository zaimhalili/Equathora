import React, { useEffect, useState } from 'react';
import './RecentAchievements.css';
import { getUserStats } from '../../lib/progressStorage';
import { buildAchievements, RARITY_ORDER } from '../../data/achievements';

const RecentAchievements = () => {
  const userStats = getUserStats();
  const solvedProblems = userStats.problemsSolved || 0;
  const streakDays = userStats.currentStreak || 0;
  const conceptsLearned = Object.keys(userStats.favoriteTopics || {}).length || 0;

  const achievements = buildAchievements(userStats);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const achievementsEarned = unlockedAchievements.length;

  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return b.unlocked - a.unlocked;
    return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
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
            <span className="h-1/2" style={{ fontSize: " clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--dark-accent-color)" }}>{achievementsEarned}</span> <br />
            <div className="h-1/2">Achievements Earned</div>
            
          </div>
          <div className={`block ${isAnimated ? "animate-in" : ''}`}>
            <span className="h-1/2 " style={{ fontSize: " clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--dark-accent-color)" }}>{streakDays}</span> <br />
            <div className="h-1/2">Days Streak</div>
            
          </div>
          <div className={`block ${isAnimated ? "animate-in" : ''}`}>
            <span className="h-1/2" style={{ fontSize: " clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--dark-accent-color)" }}>{conceptsLearned}</span> <br />
            <div className="h-1/2">
              Concepts Learned
            </div>
            
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
            
            <div className="achievement-content">
              <div className="achievement-header">
                <div className="achievement-icon" style={{ color: achievement.unlocked ? achievement.color : '#95a5a6' }}>
                  {achievement.icon}
                </div>
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
            <div className={`achievement-status ${achievement.unlocked ? '' : 'locked-badge'}`}>
              {achievement.unlocked ? '' : '🔒'}
            </div>
          </div>
        ))}
      </article>
    </section>
  );
};

export default RecentAchievements;
