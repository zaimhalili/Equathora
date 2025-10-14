import React, { useState } from 'react';
import './GlobalLeaderboard.css';
import { Link } from 'react-router-dom';

const FriendsLeaderboard = () => {
    const user = { id: 11, name: 'Zaim', problemsSolved: 80, xp: 1500, }
    // Mock data - replace with real data from your backend
    const players = [
        { id: 1, name: 'Alice', problemsSolved: 80, xp: 1500, },
        { id: 2, name: 'Bob', problemsSolved: 195, xp: 1900 },
        { id: 3, name: 'Charlie', problemsSolved: 120, xp: 2100 },
        { id: 4, name: 'David', problemsSolved: 95, xp: 1800 },
        { id: 5, name: 'Emma', problemsSolved: 150, xp: 2500 },
        { id: 6, name: 'Frank', problemsSolved: 100, xp: 3244 },
        { id: 7, name: 'Grace', problemsSolved: 75, xp: 1400 },
        { id: 8, name: 'Henry', problemsSolved: 110, xp: 2200 },
    ];

    const sortedPlayers = players.sort((a, b) => b.xp - a.xp);
    const userRank = sortedPlayers.findIndex(p => p.id === user.id) + 1;

    const getRankBadge = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const getRankClass = (rank) => {
        if (rank === 1) return 'rank-gold';
        if (rank === 2) return 'rank-silver';
        if (rank === 3) return 'rank-bronze';
        return 'rank-default';
    };

    return (
        <article className="global-leaderboard">
            <div className="leaderboard-header">
                <h2>Friends Leaderboard</h2>
                <p className="leaderboard-subtitle">Compete with your friends</p>
            </div>

            <div className="leaderboard-list">
                {sortedPlayers.map((player, index) => (
                    <Link
                        key={player.id}
                        to={`/profile/${player.id}`}
                        className={`leaderboard-card ${getRankClass(index + 1)} ${player.id === user.id ? 'current-user' : ''}`}
                    >
                        <div className="rank-badge">{getRankBadge(index + 1)}</div>
                        <div className="player-info">
                            <div className="player-name">{player.name}</div>
                            <div className="player-stats">
                                <span className="stat-item">
                                    <span className="stat-icon">📊</span>
                                    {player.problemsSolved} solved
                                </span>
                            </div>
                        </div>
                        <div className="player-xp">
                            <span className="xp-value">{player.xp.toLocaleString()}</span>
                            <span className="xp-label">XP</span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="user-rank-card">
                <div className="your-rank-label">Your Rank</div>
                <Link
                    to={`/profile/${user.id}`}
                    className={`leaderboard-card current-user-highlight ${getRankClass(userRank)}`}
                >
                    <div className="rank-badge">{getRankBadge(userRank)}</div>
                    <div className="player-info">
                        <div className="player-name">{user.name}</div>
                        <div className="player-stats">
                            <span className="stat-item">
                                <span className="stat-icon">📊</span>
                                {user.problemsSolved} solved
                            </span>
                        </div>
                    </div>
                    <div className="player-xp">
                        <span className="xp-value">{user.xp.toLocaleString()}</span>
                        <span className="xp-label">XP</span>
                    </div>
                </Link>
            </div>
        </article>
    );
};

export default FriendsLeaderboard;