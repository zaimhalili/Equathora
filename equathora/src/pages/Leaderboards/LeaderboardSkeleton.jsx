import React from 'react';
import './LeaderboardSkeleton.css';

const LeaderboardSkeleton = () => (
    <article className="global-leaderboard" aria-busy="true" aria-label="Loading leaderboard">
        <div className="leaderboard-header">
            <div className="leaderboard-skeleton-title" />
            <div className="leaderboard-skeleton-subtitle" />
        </div>

        <section className="leaderboard-leaders" aria-hidden="true">
            <div className="leaderboard-skeleton-heading" />
            <div className="leaderboard-podium">
                {[1, 2, 3].map((leader) => (
                    <div className="leader-podium-card leaderboard-skeleton-card" key={leader}>
                        <div className="leaderboard-skeleton-profile">
                            <span className="leaderboard-skeleton-avatar" />
                            <span className="leaderboard-skeleton-lines">
                                <span />
                                <span />
                            </span>
                        </div>
                        <div className="leaderboard-skeleton-stats">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section className="leaderboard-ranking" aria-hidden="true">
            <div className="leaderboard-skeleton-heading" />
            <div className="leaderboard-table">
                <div className="leaderboard-table-header">
                    <span>Rank</span>
                    <span>Player</span>
                    <span>Problems solved</span>
                    <span>Time spent</span>
                    <span>Accuracy</span>
                    <span>Streak</span>
                    <span>Reputation</span>
                    <span>Total XP</span>
                </div>
                <div className="leaderboard-list">
                    {[1, 2, 3, 4, 5].map((row) => (
                        <div className="leaderboard-card leaderboard-skeleton-row" key={row}>
                            <span />
                            <span className="leaderboard-skeleton-player">
                                <i />
                                <i />
                            </span>
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </article>
);

export default LeaderboardSkeleton;
