import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './GlobalLeaderboard.css';
import { getTopSolvers, getCurrentUserRank, getRecentTopSolvers } from '../../lib/leaderboardService';
import { supabase } from '../../lib/supabaseClient';
import GuestAvatar from '../../assets/images/guestAvatar.png';

const TopSolversLeaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('overall');

    useEffect(() => {
        fetchTopSolvers();
    }, [category]);

    const fetchTopSolvers = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current user session
            const { data: { session } } = await supabase.auth.getSession();

            // Fetch top solvers data
            const topSolversData = category === 'weekly'
                ? await getRecentTopSolvers(7)
                : await getTopSolvers(category);
            setPlayers(topSolversData);

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
            console.error('Error fetching top solvers:', err);
            setError('Failed to load top solvers data');
        } finally {
            setLoading(false);
        }
    };

    const sortedPlayers = players;

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
                    <h2>Top Solvers</h2>
                    <p className="leaderboard-subtitle">Most problems solved</p>
                </div>
                <div className="loading-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--secondary-color)' }}>
                    <p>Loading top solvers...</p>
                </div>
            </article>
        );
    }

    if (error) {
        return (
            <article className="global-leaderboard">
                <div className="leaderboard-header">
                    <h2>Top Solvers</h2>
                    <p className="leaderboard-subtitle">Most problems solved</p>
                </div>
                <div className="error-container" style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                    <p>{error}</p>
                    <button
                        onClick={fetchTopSolvers}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointeration' }}
                    >
                        Retry
                    </button>
                </div>
            </article>
        );
    }

    return (
        <article className="global-leaderboard">
            <div className="leaderboard-header">
                <h2>Top Solvers</h2>
                <p className="leaderboard-subtitle">Most problems solved</p>

                {/* Category selector */}
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['overall', 'weekly', 'accuracy', 'streak'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: category === cat ? 'var(--accent-color)' : 'var(--main-color)',
                                color: category === cat ? 'white' : 'var(--secondary-color)',
                                border: '1px solid var(--french-gray)',
                                borderRadius: '0.5rem',
                                cursor: 'pointeration',
                                textTransform: 'capitalize',
                                fontSize: '0.9rem'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
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
                                    {category === 'weekly' ? player.recentSolved || player.problemsSolved : player.problemsSolved} solved
                                </span>
                                {category === 'accuracy' && player.accuracy > 0 && (
                                    <span className="stat-item" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                        <span className="stat-icon">🎯</span>
                                        {player.accuracy}%
                                    </span>
                                )}
                                {category === 'streak' && (
                                    <span className="stat-item" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                        <span className="stat-icon">🔥</span>
                                        {player.currentStreak} days
                                    </span>
                                )}
                                {category === 'weekly' && (
                                    <span className="stat-item" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                        <span className="stat-icon">📅</span>
                                        last 7d
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
                                {category === 'accuracy' && currentUser.accuracy > 0 && (
                                    <span className="stat-item" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                        <span className="stat-icon">🎯</span>
                                        {currentUser.accuracy}%
                                    </span>
                                )}
                                {category === 'streak' && (
                                    <span className="stat-item" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                        <span className="stat-icon">🔥</span>
                                        {currentUser.currentStreak} days
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

export default TopSolversLeaderboard;