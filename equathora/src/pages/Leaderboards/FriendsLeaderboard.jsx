import React, { useEffect, useState } from 'react';
import './GlobalLeaderboard.css';
import { Link } from 'react-router-dom';
import { getFriendsLeaderboard, getCurrentUserRank } from '../../lib/leaderboardService';

const FriendsLeaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            setLoading(true);
            setError(null);

            const friendsData = await getFriendsLeaderboard();
            setPlayers(friendsData);

            const userRankData = await getCurrentUserRank();
            if (userRankData) setCurrentUser(userRankData);
        } catch (err) {
            console.error('Error fetching friends leaderboard:', err);
            setError('Failed to load friends leaderboard');
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <article className="global-leaderboard">
                <div className="leaderboard-header">
                    <h2>Friends Leaderboard</h2>
                    <p className="leaderboard-subtitle">Compete with your friends</p>
                </div>
                <div className="loading-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--secondary-color)' }}>
                    <p>Loading friends leaderboard...</p>
                </div>
            </article>
        );
    }

    if (error) {
        return (
            <article className="global-leaderboard">
                <div className="leaderboard-header">
                    <h2>Friends Leaderboard</h2>
                    <p className="leaderboard-subtitle">Compete with your friends</p>
                </div>
                <div className="error-container" style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                    <p>{error}</p>
                    <button 
                        onClick={fetchFriends}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                    >
                        Retry
                    </button>
                </div>
            </article>
        );
    }

    if (!players.length) {
        return (
            <article className="global-leaderboard">
                <div className="leaderboard-header">
                    <h2>Friends Leaderboard</h2>
                    <p className="leaderboard-subtitle">Compete with your friends</p>
                </div>
                <div className="empty-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--secondary-color)' }}>
                    <p>No friends data yet.</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Add friends to see them here.</p>
                </div>
            </article>
        );
    }

    return (
        <article className="global-leaderboard">
            <div className="leaderboard-header">
                <h2>Friends Leaderboard</h2>
                <p className="leaderboard-subtitle">Compete with your friends</p>
            </div>

            <div className="leaderboard-list">
                {players.map((player) => (
                    <Link
                        key={player.userId}
                        to={`/profile/${player.userId}`}
                        className={`leaderboard-card ${getRankClass(player.rank)} ${currentUser && player.userId === currentUser.userId ? 'current-user' : ''}`}
                    >
                        <div className="rank-badge">{getRankBadge(player.rank)}</div>
                        <div className="player-info">
                            <div className="player-name">{player.name}</div>
                            <div className="player-stats">
                                <span className="stat-item">
                                    <span className="stat-icon">📊</span>
                                    {player.problemsSolved} solved
                                </span>
                                {player.accuracy > 0 && (
                                    <span className="stat-item" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                        <span className="stat-icon">🎯</span>
                                        {player.accuracy}%
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="player-xp">
                            <span className="xp-value">{player.xp.toLocaleString()}</span>
                            <span className="xp-label">XP</span>
                        </div>
                    </Link>
                ))}
            </div>

            {currentUser && (
                <div className="user-rank-card">
                    <div className="your-rank-label">Your Rank</div>
                    <Link
                        to={`/profile/${currentUser.userId}`}
                        className={`leaderboard-card current-user-highlight ${getRankClass(currentUser.rank)}`}
                    >
                        <div className="rank-badge">{getRankBadge(currentUser.rank)}</div>
                        <div className="player-info">
                            <div className="player-name">{currentUser.name}</div>
                            <div className="player-stats">
                                <span className="stat-item">
                                    <span className="stat-icon">📊</span>
                                    {currentUser.problemsSolved} solved
                                </span>
                                {currentUser.accuracy > 0 && (
                                    <span className="stat-item" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                        <span className="stat-icon">🎯</span>
                                        {currentUser.accuracy}%
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="player-xp">
                            <span className="xp-value">{currentUser.xp.toLocaleString()}</span>
                            <span className="xp-label">XP</span>
                        </div>
                    </Link>
                </div>
            )}
        </article>
    );
};

export default FriendsLeaderboard;