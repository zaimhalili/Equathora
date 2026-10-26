import React, { useState, useEffect, useMemo } from 'react';
import './GlobalLeaderboard.css';
import { Link } from 'react-router-dom';
import { getCachedGlobalLeaderboard, getCurrentUserRank } from '../../lib/leaderboardService';
import { getCompletedProblems, getStreakData, getUserProgress } from '../../lib/databaseService';
import { supabase } from '../../lib/supabaseClient';
import GuestAvatar from '../../assets/images/guestAvatar.png';
import { FaCrown, FaHashtag, FaMedal, FaSearch } from 'react-icons/fa';
import LeaderboardSkeleton from './LeaderboardSkeleton';

const GlobalLeaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [metric, setMetric] = useState('xp');
    const formatStudyTime = (minutes) => {
        const totalMinutes = Math.max(0, Math.round(Number(minutes) || 0));
        const hours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
    };

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current user session
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id ?? null;
            setCurrentUserId(userId);

            const [leaderboardData, userRankData, ownProgress, ownCompletedProblems, ownStreak] = await Promise.all([
                getCachedGlobalLeaderboard(),
                session ? getCurrentUserRank() : Promise.resolve(null),
                session ? getUserProgress() : Promise.resolve(null),
                session ? getCompletedProblems() : Promise.resolve([]),
                session ? getStreakData() : Promise.resolve(null)
            ]);

            const totalAttempts = Number(ownProgress?.total_attempts ?? 0);
            const wrongSubmissions = Number(ownProgress?.wrong_submissions ?? 0);
            const ownSolvedCount = ownCompletedProblems.length;
            const metadata = session?.user?.user_metadata ?? {};
            const userData = session ? {
                id: userId,
                userId,
                name: userRankData?.name
                    || metadata.full_name
                    || metadata.name
                    || metadata.display_name
                    || session.user.email
                    || 'Your account',
                problemsSolved: userRankData?.problemsSolved ?? ownSolvedCount,
                xp: userRankData?.xp ?? Number(ownProgress?.total_xp ?? 0),
                rank: userRankData?.rank ?? null,
                accuracy: userRankData?.accuracy ?? (
                    totalAttempts > 0
                        ? Math.max(0, Math.min(100, Math.round(
                            ((totalAttempts - wrongSubmissions) / totalAttempts) * 100
                        )))
                        : ownSolvedCount > 0 ? null : 0
                ),
                currentStreak: userRankData?.currentStreak ?? ownStreak?.current_streak ?? 0,
                avatarUrl: userRankData?.avatarUrl
                    || metadata.avatar_url
                    || metadata.picture
                    || metadata.image
                    || metadata.photo_url
                    || '',
                reputation: userRankData?.reputation ?? Number(ownProgress?.reputation ?? 0),
                totalTimeMinutes: Number(
                    userRankData?.totalTimeMinutes ?? ownProgress?.total_time_minutes ?? 0
                )
            } : null;
            const visibleLeaderboard = leaderboardData.map((player) => {
                if (!userData || String(player.userId) !== String(userId)) {
                    return player;
                }

                return {
                    ...player,
                    ...userData,
                    rank: userData.rank ?? player.rank
                };
            });
            if (userData && !visibleLeaderboard.some(
                (player) => String(player.userId) === String(userId)
            ) && userRankData) {
                visibleLeaderboard.push({
                    ...userData,
                    rank: userData.rank ?? userRankData.rank
                });
            }

            setPlayers(visibleLeaderboard);
            setCurrentUser(userData);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError('Failed to load leaderboard data');
        } finally {
            setLoading(false);
        }
    };

    const rankedPlayers = useMemo(() => {
        const sorted = [...players].sort((a, b) => {
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
            displayRank: metric === 'xp' && Number.isInteger(player.rank) && player.rank > 0
                ? player.rank
                : index + 1
        }));
    }, [players, metric]);

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredPlayers = rankedPlayers.filter((player) =>
        (player.name || '').toLowerCase().includes(normalizedSearch)
    );
    const leaders = rankedPlayers.slice(0, 3);
    const visibleCurrentUser = players.find(
        (player) => String(player.userId) === String(currentUserId)
    );
    const pinnedUser = currentUser || (visibleCurrentUser ? {
        ...visibleCurrentUser,
        id: visibleCurrentUser.userId
    } : null);
    const rankedCurrentUser = rankedPlayers.find(
        (player) => String(player.userId) === String(currentUserId)
    );
    const pinnedRank = currentUser?.rank ?? visibleCurrentUser?.rank ?? rankedCurrentUser?.displayRank;
    const hasPinnedRank = Number.isInteger(pinnedRank) && pinnedRank > 0;

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

    if (loading) {
        return <LeaderboardSkeleton />;
    }

    if (error) {
        return (
            <article className="global-leaderboard">
                <div className="leaderboard-header">
                    <h2>Global Leaderboard</h2>
                    <p className="leaderboard-subtitle">See how you rank across the Equathora community.</p>
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

    return (
        <article className="global-leaderboard">
            <div className="leaderboard-header">
                <div className="leaderboard-toolbar">
                    <div className="leaderboard-title">
                        <h2>Global Leaderboard</h2>
                        <p className="leaderboard-subtitle">See how you rank across the Equathora community.</p>
                    </div>
                    <div className="leaderboard-filters">
                        <label className="leaderboard-filter search-filter">
                            <FaSearch className="filter-icon" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search player"
                                className="leaderboard-filter-input"
                                aria-label="Search leaderboard by player name"
                            />
                        </label>

                        <label className="leaderboard-filter">
                            <span className="sort-label">Sort by</span>
                            <select value={metric} onChange={(e) => setMetric(e.target.value)} className="leaderboard-filter-select" aria-label="Sort by">
                                <option value="xp">Total XP</option>
                                <option value="solved">Problems solved</option>
                                <option value="accuracy">Accuracy</option>
                                <option value="streak">Streak</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>

            <section className="leaderboard-leaders" aria-labelledby="leaderboard-leaders-title">
                <h3 id="leaderboard-leaders-title">Current leaders</h3>
                <div className="leaderboard-podium">
                    {leaders.map((player) => {
                        const isCurrentUser = String(player.userId) === String(currentUserId);
                        return (
                            <Link
                                key={player.userId}
                                to={`/profile/${player.userId}`}
                                className={`leader-podium-card ${getRankClass(player.displayRank)} ${isCurrentUser ? 'current-user' : ''}`}
                            >
                                <div className="leader-podium-top">
                                    <span className="leader-podium-rank">
                                        {getRankBadge(player.displayRank)}
                                        {player.displayRank}
                                    </span>
                                    <span className="player-avatar-wrapper">
                                        <img src={player.avatarUrl || GuestAvatar} alt="" className="player-avatar" />
                                    </span>
                                    <span className="leader-podium-identity">
                                        <span className="player-name">
                                            {player.name}
                                            {isCurrentUser && <span className="you-badge">You</span>}
                                        </span>
                                        <strong>{(player.xp || 0).toLocaleString()} <small>XP</small></strong>
                                    </span>
                                </div>
                                <div className="leader-podium-stats">
                                    <div><span>Solved</span><strong>{player.problemsSolved ?? 0}</strong></div>
                                    <div><span>Time spent</span><strong>{formatStudyTime(player.totalTimeMinutes)}</strong></div>
                                    <div><span>Reputation</span><strong>{player.reputation ?? 0}</strong></div>
                                </div>
                            </Link>
                        );
                    })}
                    {leaders.length === 0 && <p className="leaderboard-empty-state">No leaders to show yet.</p>}
                </div>
            </section>

            <section className="leaderboard-ranking" aria-labelledby="global-ranking-title">
                <div className="leaderboard-ranking-heading">
                    <h3 id="global-ranking-title">Global ranking</h3>
                    <span>{filteredPlayers.length} players</span>
                </div>
                <div className="leaderboard-table">
                    <div className="leaderboard-table-header" aria-hidden="true">
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
                        {filteredPlayers.length === 0 ? (
                            <div className="leaderboard-empty-state">No players match this search.</div>
                        ) : filteredPlayers.map((player) => {
                            const isCurrentUser = String(player.userId) === String(currentUserId);
                            return (
                                <Link
                                    key={player.userId}
                                    to={`/profile/${player.userId}`}
                                    className={`leaderboard-card ${getRankClass(player.displayRank)} ${isCurrentUser ? 'current-user' : ''}`}
                                    aria-current={isCurrentUser ? 'true' : undefined}
                                >
                                    <span className="leaderboard-rank-cell">
                                        {getRankBadge(player.displayRank)}
                                        {player.displayRank}
                                    </span>
                                    <span className="leaderboard-player-cell">
                                        <span className="player-avatar-wrapper">
                                            <img src={player.avatarUrl || GuestAvatar} alt="" className="player-avatar" />
                                        </span>
                                        <span className="leaderboard-player-name">
                                            {player.name}
                                            {isCurrentUser && <span className="you-badge">You</span>}
                                        </span>
                                    </span>
                                    <span className="leaderboard-value-cell">{player.problemsSolved ?? 0}</span>
                                    <span className="leaderboard-value-cell">{formatStudyTime(player.totalTimeMinutes)}</span>
                                    <span className="leaderboard-value-cell">
                                        {player.accuracy === null || player.accuracy === undefined ? '—' : `${player.accuracy}%`}
                                    </span>
                                    <span className="leaderboard-value-cell">{player.currentStreak ?? 0}d</span>
                                    <span className="leaderboard-value-cell">{player.reputation ?? 0}</span>
                                    <span className="leaderboard-value-cell leaderboard-xp-cell">{(player.xp || 0).toLocaleString()}</span>
                                </Link>
                            );
                        })}
                    </div>
                {currentUserId && (
                    <div className="user-rank-card">
                        <Link
                            to={`/profile/${currentUserId}`}
                            className={`leaderboard-card current-user-highlight ${getRankClass(hasPinnedRank ? pinnedRank : 0)}`}
                            aria-label={`Your leaderboard position${hasPinnedRank ? `: rank ${pinnedRank}` : ': rank unavailable'}`}
                        >
                            <span className="leaderboard-rank-cell">
                                {hasPinnedRank ? getRankBadge(pinnedRank) : <FaHashtag className="rank-badge-icon" />}
                                {hasPinnedRank ? pinnedRank : '—'}
                            </span>
                            <span className="leaderboard-player-cell">
                                <span className="player-avatar-wrapper">
                                    <img src={pinnedUser?.avatarUrl || GuestAvatar} alt="" className="player-avatar" />
                                </span>
                                <span className="leaderboard-player-name">
                                    {pinnedUser?.name || 'Your account'}
                                    <span className="you-badge">You</span>
                                </span>
                            </span>
                            <span className="leaderboard-value-cell">{pinnedUser?.problemsSolved ?? 0}</span>
                            <span className="leaderboard-value-cell">{formatStudyTime(pinnedUser?.totalTimeMinutes)}</span>
                            <span className="leaderboard-value-cell">{pinnedUser?.accuracy ?? '—'}{pinnedUser?.accuracy === null || pinnedUser?.accuracy === undefined ? '' : '%'}</span>
                            <span className="leaderboard-value-cell">{pinnedUser?.currentStreak ?? 0}d</span>
                            <span className="leaderboard-value-cell">{pinnedUser?.reputation ?? 0}</span>
                            <span className="leaderboard-value-cell leaderboard-xp-cell">{(pinnedUser?.xp ?? 0).toLocaleString()}</span>
                        </Link>
                    </div>
                )}
                </div>
            </section>
        </article>
    );
};

export default GlobalLeaderboard;