import React, { useEffect, useState } from 'react';
import './RecentAchievements.css';
import { getAchievementProgress } from '../../lib/databaseService';
import { buildAchievements, RARITY_ORDER } from '../../data/achievements';
import { FaLock } from 'react-icons/fa'

const toAchievementStats = (snapshot = {}) => {
  const solvedProblems = Array.isArray(snapshot.solved_problems)
    ? snapshot.solved_problems.length
    : Number(snapshot.problemsSolved || 0);

  const currentStreak = Number(snapshot.currentStreak ?? snapshot.current_streak ?? 0);
  const longestStreak = Number(snapshot.longestStreak ?? snapshot.longest_streak ?? 0);

  const topicFrequency = Array.isArray(snapshot.topicFrequency)
    ? snapshot.topicFrequency
    : [];

  const favoriteTopics = topicFrequency
    .map((item) => item.topic)
    .filter(Boolean);

  const totalTimeSeconds = Math.max(0, Number(snapshot.total_time_minutes || 0)) * 60;

  return {
    problemsSolved: solvedProblems,
    currentStreak,
    longestStreak,
    bestStreak: longestStreak,
    totalTime: totalTimeSeconds,
    difficultyBreakdown: snapshot.difficultyBreakdown || { easy: 0, medium: 0, hard: 0 },
    perfectStreak: Number(snapshot.perfect_streak || snapshot.perfectStreak || 0),
    favoriteTopics,
    joinDate: snapshot.account_created || null
  };
};

const RecentAchievements = () => {
  const [userStats, setUserStats] = useState(() => toAchievementStats());

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      const snapshot = await getAchievementProgress();
      if (!isMounted) return;
      setUserStats(toAchievementStats(snapshot));
    };

    void fetchStats();

    const handleRefresh = () => {
      void fetchStats();
    };

    window.addEventListener('focus', handleRefresh);
    window.addEventListener('equathora:streak-updated', handleRefresh);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleRefresh);
      window.removeEventListener('equathora:streak-updated', handleRefresh);
    };
  }, []);

  const streakDays = userStats.currentStreak || 0;
  const conceptsLearned = Array.isArray(userStats.favoriteTopics)
    ? userStats.favoriteTopics.length
    : Object.keys(userStats.favoriteTopics || {}).length || 0;

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

  const getRarityStyle = (rarity) => {
    switch (rarity) {
      case 'Common':
        return { start: '#4a2b12', end: '#c67b34', border: '#d69557' };
      case 'Uncommon':
        return { start: '#3e4a59', end: '#9caec2', border: '#c7d3df' };
      case 'Rare':
        return { start: '#6b4f09', end: '#f4c542', border: '#ffe083' };
      case 'Epic':
        return { start: '#120f1f', end: '#46356f', border: '#7f68b0' };
      case 'Legendary':
        return { start: '#0a3142', end: '#6de3ff', border: '#aef2ff' };
      default:
        return { start: '#4a2b12', end: '#c67b34', border: '#d69557' };
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
        {sortedAchievements.map((achievement, index) => {
          const rarityStyle = getRarityStyle(achievement.rarity);

          return (
            <div
              key={achievement.id}
              className={`a-list-component ${achievement.unlocked ? 'unlocked' : 'locked'} ${isAnimated ? 'animate-in' : ''}`}
              style={{
                animationDelay: `${index * 0.1}s`,
                '--rarity-start': rarityStyle.start,
                '--rarity-end': rarityStyle.end,
                '--rarity-border': rarityStyle.border,
              }}
            >

              {!achievement.unlocked && (
                <div className="achievement-lock-badge" aria-label="Locked achievement" title="Locked achievement">
                  <FaLock />
                </div>
              )}

              <div className="achievement-content">

                <div className="achievement-header">
                  <div className='achievement-main'>
                    <div className="achievement-icon-shell">
                      <div className="achievement-icon">
                        {achievement.icon}
                      </div>
                    </div>
                    <h3>{achievement.title}</h3>
                  </div>
                </div>

                <p>{achievement.description}</p>
                {achievement.automatic && achievement.unlocked && (
                  <span className="automatic-badge">Auto-Unlocked</span>
                )}
              </div>

            </div>
          );
        })}
      </article>
    </section>
  );
};

export default RecentAchievements;
