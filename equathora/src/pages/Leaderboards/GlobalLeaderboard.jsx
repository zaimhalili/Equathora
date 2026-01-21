import React, { useState, useEffect } from 'react';
import './GlobalLeaderboard.css';
import { Link } from 'react-router-dom';
import { getCachedGlobalLeaderboard, getCurrentUserRank } from '../../lib/leaderboardService';
import { supabase } from '../../lib/supabaseClient';
import GuestAvatar from '../../assets/images/guestAvatar.png';

const GlobalLeaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current user session
            const { data: { session } } = await supabase.auth.getSession();

            // Fetch leaderboard data
            const leaderboardData = await getCachedGlobalLeaderboard();
            setPlayers(leaderboardData);

            // Get current user's rank if logged in
            if (session) {
                const userRankData = await getCurrentUserRank();
                if (userRankData) {
                    setCurrentUser({
                        id: userRankData.userId,
                        name: userRankData.name,
                        problemsSolved: userRankData.problemsSolved,
                        xp: userRankData.xp,
                        rank: userRankData.rank,
                        accuracy: userRankData.accuracy,
                        currentStreak: userRankData.currentStreak,
                        avatarUrl: userRankData.avatarUrl
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError('Failed to load leaderboard data');
        } finally {
            setLoading(false);
        }
    };

    const sortedPlayers = players;
    const userRank = currentUser?.rank || 0;

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
                    <h2>Global Leaderboard</h2>
                    <p className="leaderboard-subtitle">Top players worldwide</p>
                </div>
                <div className="loading-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--secondary-color)' }}>
                    <p>Loading leaderboard...</p>
                </div>
            </article>
        );
    }

    if (error) {
        return (
            <article className="global-leaderboard">
                <div className="leaderboard-header">
                    <h2>Global Leaderboard</h2>
                    <p className="leaderboard-subtitle">Top players worldwide</p>
                </div>
                <div className="error-container" style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                    <p>{error}</p>
                    <button
                        onClick={fetchLeaderboardData}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointeration' }}
                    >
                        Retry
                    </button>
                </div>
            </article>
        );
    }

    if (players.length === 0) {
        return (
            <article className="global-leaderboard">
                <div className="leaderboard-header">
                    <h2>Global Leaderboard</h2>
                    <p className="leaderboard-subtitle">Top players worldwide</p>
                </div>
                <div className="empty-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--secondary-color)' }}>
                    <p>No leaderboard data available yet.</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Start solving problems to appear on the leaderboard!</p>
                </div>
            </article>
        );
    }

    return (
        <article className="global-leaderboard">
            <div className="leaderboard-header">
                <h2>Global Leaderboard</h2>
                <p className="leaderboard-subtitle">Top players worldwide</p>
            </div>

            <div className="leaderboard-list">
                {sortedPlayers.map((player) => (
                    <Link
                        key={player.userId}
                        to={`/profile/${player.userId}`}
                        className={`leaderboard-card ${getRankClass(player.rank)} ${currentUser && player.userId === currentUser.id ? 'current-user' : ''}`}
                    >
                        <div className="rank-badge">{getRankBadge(player.rank)}</div>
                        <div className="player-avatar-wrapper">
                            <img
                                src={player.avatarUrl || GuestAvatar}
                                alt={`${player.name} avatar`}
                                className="player-avatar"
                            />
                        </div>
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
                        to={`/profile/${currentUser.id}`}
                        className={`leaderboard-card current-user-highlight ${getRankClass(currentUser.rank)}`}
                    >
                        <div className="rank-badge">{getRankBadge(currentUser.rank)}</div>
                        <div className="player-avatar-wrapper">
                            <img
                                src={currentUser.avatarUrl || GuestAvatar}
                                alt={`${currentUser.name} avatar`}
                                className="player-avatar"
                            />
                        </div>
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

export default GlobalLeaderboard;