import React, { useEffect, useMemo, useState } from 'react';
import './RecentAchievements.css';
import { buildAchievements, RARITY_ORDER } from '../../data/achievements';
import { FaLock } from 'react-icons/fa';
import { useUserStats } from '../../context/UserStatsContext';

const toAchievementStats = (stats = {}) => {
    const difficultyByBucket = Array.isArray(stats.difficultyBreakdown)
        ? stats.difficultyBreakdown.reduce((acc, item) => {
            const key = (item.key || '').toLowerCase();
            if (['easy', 'medium', 'hard'].includes(key)) {
                acc[key] = Number(item.solved || 0);
            }
            return acc;
        }, { easy: 0, medium: 0, hard: 0 })
        : (stats.difficultyBreakdown || { easy: 0, medium: 0, hard: 0 });

    return {
        problemsSolved: Number(stats.problemsSolved || 0),
        currentStreak: Number(stats.currentStreak || 0),
        longestStreak: Number(stats.longestStreak || 0),
        bestStreak: Number(stats.longestStreak || stats.currentStreak || 0),
        totalTime: Number(stats.totalTimeSeconds || 0),
        difficultyBreakdown: difficultyByBucket,
        perfectStreak: Number(stats.perfectStreak || 0),
        favoriteTopics: Array.isArray(stats.favoriteTopics) ? stats.favoriteTopics : [],
        joinDate: stats.joinDate || null
    };
};

const RecentAchievements = () => {
    const { stats, loading, refreshStats } = useUserStats();
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        void refreshStats();
    }, [refreshStats]);

    useEffect(() => {
        setIsAnimated(true);
    }, []);

    const userStats = useMemo(() => toAchievementStats(stats), [stats]);

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

    if (loading) {
        return <div className='rec-achievements'><div className='py-12 flex justify-center items-center'>Loading achievements...</div></div>;
    }

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
