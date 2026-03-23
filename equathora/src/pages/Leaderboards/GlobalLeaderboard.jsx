import React, { useState, useEffect, useMemo } from 'react';
import './GlobalLeaderboard.css';
import { Link } from 'react-router-dom';
import { getCachedGlobalLeaderboard, getCurrentUserRank } from '../../lib/leaderboardService';
import { supabase } from '../../lib/supabaseClient';
import GuestAvatar from '../../assets/images/guestAvatar.png';
import { FaBullseye, FaChartLine, FaCrown, FaFire, FaHashtag, FaMedal, FaSearch, FaSortAmountDown } from 'react-icons/fa';

const GlobalLeaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [metric, setMetric] = useState('xp');
    const [solvedFilter, setSolvedFilter] = useState('all');
    const [accuracyFilter, setAccuracyFilter] = useState('all');
    const [streakFilter, setStreakFilter] = useState('all');

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

    const minSolved = solvedFilter === 'all' ? 0 : Number(solvedFilter);
    const minAccuracy = accuracyFilter === 'all' ? 0 : Number(accuracyFilter);
    const minStreak = streakFilter === 'all' ? 0 : Number(streakFilter);

    const filteredPlayers = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        const base = players.filter((player) => {
            if ((player.problemsSolved || 0) < minSolved) return false;
            if ((player.accuracy || 0) < minAccuracy) return false;
            if ((player.currentStreak || 0) < minStreak) return false;
            if (!normalizedSearch) return true;
            return (player.name || '').toLowerCase().includes(normalizedSearch);
        });

        const sorted = [...base].sort((a, b) => {
            if (metric === 'solved') {
                if ((b.problemsSolved || 0) !== (a.problemsSolved || 0)) {
                    return (b.problemsSolved || 0) - (a.problemsSolved || 0);
                }
                return (b.xp || 0) - (a.xp || 0);
            }

            if (metric === 'accuracy') {
                if ((b.accuracy || 0) !== (a.accuracy || 0)) {
                    return (b.accuracy || 0) - (a.accuracy || 0);
                }
                return (b.xp || 0) - (a.xp || 0);
            }

            if (metric === 'streak') {
                if ((b.currentStreak || 0) !== (a.currentStreak || 0)) {
                    return (b.currentStreak || 0) - (a.currentStreak || 0);
                }
                return (b.xp || 0) - (a.xp || 0);
            }

            if ((b.xp || 0) !== (a.xp || 0)) {
                return (b.xp || 0) - (a.xp || 0);
            }
            return (b.problemsSolved || 0) - (a.problemsSolved || 0);
        });

        return sorted.map((player, index) => ({
            ...player,
            displayRank: index + 1
        }));
    }, [players, searchTerm, metric, minSolved, minAccuracy, minStreak]);

    const currentUserDisplayRank = useMemo(() => {
        if (!currentUser?.id) return 0;
        const index = filteredPlayers.findIndex(player => player.userId === currentUser.id);
        return index >= 0 ? index + 1 : 0;
    }, [filteredPlayers, currentUser]);

    const getRankBadge = (rank) => {
        if (rank === 1) return <FaCrown className="rank-badge-icon" />;
        if (rank === 2 || rank === 3) return <FaMedal className="rank-badge-icon" />;
        return <FaHashtag className="rank-badge-icon" />;
    };

    const getRankClass = (rank) => {
        if (rank === 1) return 'rank-gold';
        if (rank === 2) return 'rank-silver';
        if (rank === 3) return 'rank-bronze';
        return 'rank-default';
    };

    const getPrimaryMetric = (player) => {
        if (metric === 'solved') {
            return {
                value: String(player.problemsSolved ?? 0),
                label: 'Solved'
            };
        }

        if (metric === 'accuracy') {
            return {
                value: player.accuracy === null || player.accuracy === undefined ? 'N/A' : `${player.accuracy}%`,
                label: 'Accuracy'
            };
        }

        if (metric === 'streak') {
            return {
                value: `${player.currentStreak || 0}d`,
                label: 'Streak'
            };
        }

        return {
            value: (player.xp || 0).toLocaleString(),
            label: 'XP'
        };
    };

    if (loading) {
        return (
            <article className="global-leaderboard">
                <div className="leaderboard-header">
                    <h2>Global Leaderboard</h2>
                    <p className="leaderboard-subtitle">Filter by solved count, streak, accuracy, and ranking metric</p>
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
                    <p className="leaderboard-subtitle">Filter by solved count, streak, accuracy, and ranking metric</p>
                </div>
                <div className="error-container" style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                    <p>{error}</p>
                    <button
                        onClick={fetchLeaderboardData}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
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
                    <p className="leaderboard-subtitle">Filter by solved count, streak, accuracy, and ranking metric</p>
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
                <p className="leaderboard-subtitle">Filter by solved count, streak, accuracy, and ranking metric</p>

                <div className="leaderboard-filters">
                    <label className="leaderboard-filter search-filter">
                        <FaSearch className="filter-icon" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search player"
                            className="leaderboard-filter-input"
                        />
                    </label>

                    <label className="leaderboard-filter">
                        <FaSortAmountDown className="filter-icon" />
                        <select value={metric} onChange={(e) => setMetric(e.target.value)} className="leaderboard-filter-select">
                            <option value="xp">Sort by XP</option>
                            <option value="solved">Sort by Solved</option>
                            <option value="accuracy">Sort by Accuracy</option>
                            <option value="streak">Sort by Streak</option>
                        </select>
                    </label>

                    <label className="leaderboard-filter">
                        <FaChartLine className="filter-icon" />
                        <select value={solvedFilter} onChange={(e) => setSolvedFilter(e.target.value)} className="leaderboard-filter-select">
                            <option value="all">Solved: Any</option>
                            <option value="10">Solved: 10+</option>
                            <option value="25">Solved: 25+</option>
                            <option value="50">Solved: 50+</option>
                            <option value="100">Solved: 100+</option>
                        </select>
                    </label>

                    <label className="leaderboard-filter">
                        <FaBullseye className="filter-icon" />
                        <select value={accuracyFilter} onChange={(e) => setAccuracyFilter(e.target.value)} className="leaderboard-filter-select">
                            <option value="all">Accuracy: Any</option>
                            <option value="50">Accuracy: 50%+</option>
                            <option value="70">Accuracy: 70%+</option>
                            <option value="85">Accuracy: 85%+</option>
                            <option value="95">Accuracy: 95%+</option>
                        </select>
                    </label>

                    <label className="leaderboard-filter">
                        <FaFire className="filter-icon" />
                        <select value={streakFilter} onChange={(e) => setStreakFilter(e.target.value)} className="leaderboard-filter-select">
                            <option value="all">Streak: Any</option>
                            <option value="3">Streak: 3+ days</option>
                            <option value="7">Streak: 7+ days</option>
                            <option value="14">Streak: 14+ days</option>
                            <option value="30">Streak: 30+ days</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="leaderboard-list">
                {filteredPlayers.map((player) => (
                    (() => {
                        const primaryMetric = getPrimaryMetric(player);
                        return (
                    <Link
                        key={player.userId}
                        to={`/profile/${player.userId}`}
                        className={`leaderboard-card ${getRankClass(player.displayRank)} ${currentUser && player.userId === currentUser.id ? 'current-user' : ''}`}
                    >
                        <div className="rank-badge">
                            {getRankBadge(player.displayRank)}
                            <span className="rank-badge-number">{player.displayRank}</span>
                        </div>
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
                                    <FaChartLine className="stat-icon" />
                                    {player.problemsSolved} solved
                                </span>
                                {player.accuracy > 0 && (
                                    <span className="stat-item" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                        <FaBullseye className="stat-icon" />
                                        {player.accuracy}%
                                    </span>
                                )}
                                <span className="stat-item" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                    <FaFire className="stat-icon" />
                                    {player.currentStreak || 0}d
                                </span>
                            </div>
                        </div>
                        <div className="player-xp">
                            <span className="xp-value">{primaryMetric.value}</span>
                            <span className="xp-label">{primaryMetric.label}</span>
                        </div>
                    </Link>
                        );
                    })()
                ))}
            </div>

            {currentUser && (
                <div className="user-rank-card">
                    <div className="your-rank-label">Your Rank</div>
                    <Link
                        to={`/profile/${currentUser.id}`}
                        className={`leaderboard-card current-user-highlight ${getRankClass(currentUserDisplayRank || currentUser.rank)}`}
                    >
                        {(() => {
                            const primaryMetric = getPrimaryMetric(currentUser);
                            return (
                                <>
                        <div className="rank-badge">
                            {getRankBadge(currentUserDisplayRank || currentUser.rank)}
                            <span className="rank-badge-number">{currentUserDisplayRank || currentUser.rank}</span>
                        </div>
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
                                    <FaChartLine className="stat-icon" />
                                    {currentUser.problemsSolved} solved
                                </span>
                                {currentUser.accuracy > 0 && (
                                    <span className="stat-item" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                        <FaBullseye className="stat-icon" />
                                        {currentUser.accuracy}%
                                    </span>
                                )}
                                <span className="stat-item" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                    <FaFire className="stat-icon" />
                                    {currentUser.currentStreak || 0}d
                                </span>
                            </div>
                        </div>
                        <div className="player-xp">
                            <span className="xp-value">{primaryMetric.value}</span>
                            <span className="xp-label">{primaryMetric.label}</span>
                        </div>
                                </>
                            );
                        })()}
                    </Link>
                </div>
            )}
        </article>
    );
};

export default GlobalLeaderboard;