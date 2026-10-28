import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getTopSolvers, getCurrentUserRank, getRecentTopSolvers } from '../../lib/leaderboardService';
import { supabase } from '../../lib/supabaseClient';
import GuestAvatar from '../../assets/images/guestAvatar.png';
import { FaBullseye, FaChartLine, FaCrown, FaFire, FaHashtag, FaMedal, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import {
    getRankBadgeClass,
    getRankToneClass,
    leaderboardAvatarClass,
    leaderboardAvatarWrapClass,
    leaderboardEmptyClass,
    leaderboardFilterClass,
    leaderboardFilterIconClass,
    leaderboardFilterInputClass,
    leaderboardFilterSelectClass,
    leaderboardListClass,
    leaderboardPanelClass,
    leaderboardPlayerInfoClass,
    leaderboardPlayerNameClass,
    leaderboardPlayerStatsClass,
    leaderboardRowClass,
    leaderboardStatClass,
    leaderboardSubtitleClass,
    leaderboardTitleClass,
    leaderboardYouBadgeClass,
    leaderboardXpClass,
    leaderboardXpLabelClass,
    leaderboardXpValueClass
} from './leaderboardStyles';

const TopSolversLeaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('overall');
    const [searchTerm, setSearchTerm] = useState('');
    const [metric, setMetric] = useState('solved');
    const [solvedFilter, setSolvedFilter] = useState('all');
    const [accuracyFilter, setAccuracyFilter] = useState('all');
    const [streakFilter, setStreakFilter] = useState('all');

    const fetchTopSolvers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current user session
            const { data: { session } } = await supabase.auth.getSession();

            // Fetch top solvers data
            const topSolversData = viewMode === 'weekly'
                ? await getRecentTopSolvers(7)
                : await getTopSolvers(metric === 'accuracy' || metric === 'streak' ? metric : 'overall');
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
    }, [viewMode, metric]);

    useEffect(() => {
        fetchTopSolvers();
    }, [fetchTopSolvers]);

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
            if (metric === 'xp') {
                if ((b.xp || 0) !== (a.xp || 0)) return (b.xp || 0) - (a.xp || 0);
                return (b.problemsSolved || 0) - (a.problemsSolved || 0);
            }
            if (metric === 'accuracy') {
                if ((b.accuracy || 0) !== (a.accuracy || 0)) return (b.accuracy || 0) - (a.accuracy || 0);
                return (b.xp || 0) - (a.xp || 0);
            }
            if (metric === 'streak') {
                if ((b.currentStreak || 0) !== (a.currentStreak || 0)) return (b.currentStreak || 0) - (a.currentStreak || 0);
                return (b.xp || 0) - (a.xp || 0);
            }

            if (viewMode === 'weekly') {
                if ((b.recentSolved || 0) !== (a.recentSolved || 0)) return (b.recentSolved || 0) - (a.recentSolved || 0);
            }
            if ((b.problemsSolved || 0) !== (a.problemsSolved || 0)) return (b.problemsSolved || 0) - (a.problemsSolved || 0);
            return (b.xp || 0) - (a.xp || 0);
        });

        return sorted.map((player, index) => ({
            ...player,
            displayRank: index + 1
        }));
    }, [players, searchTerm, metric, minSolved, minAccuracy, minStreak, viewMode]);

    const getRankBadge = (rank) => {
        if (rank === 1) return <FaCrown className="text-sm" />;
        if (rank === 2 || rank === 3) return <FaMedal className="text-sm" />;
        return <FaHashtag className="text-sm" />;
    };

    const getRankClass = (rank) => {
        return getRankToneClass(rank);
    };

    const getPrimaryMetric = (player) => {
        if (metric === 'solved' || viewMode === 'weekly') {
            const solvedValue = viewMode === 'weekly'
                ? (player.recentSolved ?? player.problemsSolved ?? 0)
                : (player.problemsSolved ?? 0);

            return {
                value: String(solvedValue),
                label: viewMode === 'weekly' ? 'Solved (7d)' : 'Solved'
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
            <article className={leaderboardPanelClass}>
                <div>
                    <h2 className={leaderboardTitleClass}>Performance Board</h2>
                    <p className={leaderboardSubtitleClass}>Rank by weekly momentum, solved count, accuracy, streak, or XP</p>
                </div>
                <div className="p-12 text-center text-(--secondary-color)">
                    <p>Loading performance board...</p>
                </div>
            </article>
        );
    }

    if (error) {
        return (
            <article className={leaderboardPanelClass}>
                <div>
                    <h2 className={leaderboardTitleClass}>Performance Board</h2>
                    <p className={leaderboardSubtitleClass}>Rank by weekly momentum, solved count, accuracy, streak, or XP</p>
                </div>
                <div className="p-12 text-center text-red-500">
                    <p role="alert">{error}</p>
                    <button
                        onClick={fetchTopSolvers}
                        className="mt-4 cursor-pointer rounded-lg bg-(--accent-color) px-4 py-2 text-white transition hover:opacity-90"
                    >
                        Retry
                    </button>
                </div>
            </article>
        );
    }

    return (
        <article className={leaderboardPanelClass}>
            <div>
                <h2 className={leaderboardTitleClass}>Performance Board</h2>
                <p className={leaderboardSubtitleClass}>Rank by weekly momentum, solved count, accuracy, streak, or XP</p>

                <div className="mt-4 inline-flex gap-1 rounded-[10px] border border-[color-mix(in_srgb,var(--secondary-color)_13%,transparent)] bg-[color-mix(in_srgb,var(--secondary-color)_4%,var(--main-color))] p-1" role="group" aria-label="Leaderboard period">
                    <button
                        type="button"
                        onClick={() => setViewMode('overall')}
                        className={`rounded-md px-3 py-2 text-xs font-semibold text-(--secondary-color) transition ${viewMode === 'overall' ? 'bg-[color-mix(in_srgb,var(--accent-color)_12%,var(--main-color))] opacity-100' : 'opacity-70 hover:opacity-100'}`}
                        aria-pressed={viewMode === 'overall'}
                    >
                        Overall
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('weekly')}
                        className={`rounded-md px-3 py-2 text-xs font-semibold text-(--secondary-color) transition ${viewMode === 'weekly' ? 'bg-[color-mix(in_srgb,var(--accent-color)_12%,var(--main-color))] opacity-100' : 'opacity-70 hover:opacity-100'}`}
                        aria-pressed={viewMode === 'weekly'}
                    >
                        Last 7 days
                    </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <label className={`${leaderboardFilterClass} min-w-[190px] max-[680px]:min-w-0 max-[680px]:flex-1 max-[420px]:basis-full`}>
                        <FaSearch className={leaderboardFilterIconClass} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search player"
                            className={leaderboardFilterInputClass}
                        />
                    </label>

                    <label className={leaderboardFilterClass}>
                        <FaSortAmountDown className={leaderboardFilterIconClass} />
                        <select value={metric} onChange={(e) => setMetric(e.target.value)} className={leaderboardFilterSelectClass}>
                            <option value="solved">Rank by solved</option>
                            <option value="xp">Rank by XP</option>
                            <option value="accuracy">Rank by accuracy</option>
                            <option value="streak">Rank by streak</option>
                        </select>
                    </label>

                    <label className={leaderboardFilterClass}>
                        <FaChartLine className={leaderboardFilterIconClass} />
                        <select value={solvedFilter} onChange={(e) => setSolvedFilter(e.target.value)} className={leaderboardFilterSelectClass}>
                            <option value="all">Solved: Any</option>
                            <option value="10">Solved: 10+</option>
                            <option value="25">Solved: 25+</option>
                            <option value="50">Solved: 50+</option>
                            <option value="100">Solved: 100+</option>
                        </select>
                    </label>

                    <label className={leaderboardFilterClass}>
                        <FaBullseye className={leaderboardFilterIconClass} />
                        <select value={accuracyFilter} onChange={(e) => setAccuracyFilter(e.target.value)} className={leaderboardFilterSelectClass}>
                            <option value="all">Accuracy: Any</option>
                            <option value="50">Accuracy: 50%+</option>
                            <option value="70">Accuracy: 70%+</option>
                            <option value="85">Accuracy: 85%+</option>
                            <option value="95">Accuracy: 95%+</option>
                        </select>
                    </label>

                    <label className={leaderboardFilterClass}>
                        <FaFire className={leaderboardFilterIconClass} />
                        <select value={streakFilter} onChange={(e) => setStreakFilter(e.target.value)} className={leaderboardFilterSelectClass}>
                            <option value="all">Streak: Any</option>
                            <option value="3">Streak: 3+ days</option>
                            <option value="7">Streak: 7+ days</option>
                            <option value="14">Streak: 14+ days</option>
                            <option value="30">Streak: 30+ days</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className={leaderboardListClass}>
                {filteredPlayers.map((player) => (
                    (() => {
                        const primaryMetric = getPrimaryMetric(player);
                        return (
                            <Link
                                key={player.userId}
                                to={`/profile/${player.userId}`}
                                className={`${leaderboardRowClass} ${getRankClass(player.displayRank)} ${currentUser && player.userId === currentUser.id ? 'bg-[color-mix(in_srgb,var(--accent-color)_7%,var(--main-color))] shadow-[inset_3px_0_0_var(--accent-color)]' : ''}`}
                                aria-current={currentUser && player.userId === currentUser.id ? 'true' : undefined}
                            >
                                <div className={`flex h-10 w-[54px] min-w-[54px] items-center justify-center gap-1.5 rounded-[10px] bg-[color-mix(in_srgb,var(--secondary-color)_6%,var(--main-color))] text-base font-bold max-[680px]:h-9 max-[680px]:w-9 max-[680px]:min-w-9 max-[680px]:gap-0.5 ${getRankBadgeClass(player.displayRank)}`}>
                                    <span className="max-[680px]:hidden">{getRankBadge(player.displayRank)}</span>
                                    <span className="text-sm font-extrabold">{player.displayRank}</span>
                                </div>
                                <div className={leaderboardAvatarWrapClass}>
                                    <img
                                        src={player.avatarUrl || GuestAvatar}
                                        alt={`${player.name} avatar`}
                                        className={leaderboardAvatarClass}
                                    />
                                </div>
                                <div className={leaderboardPlayerInfoClass}>
                                    <div className={leaderboardPlayerNameClass}>
                                        {player.name}
                                        {currentUser && player.userId === currentUser.id && (
                                            <span className={leaderboardYouBadgeClass}>You</span>
                                        )}
                                    </div>
                                    <div className={leaderboardPlayerStatsClass}>
                                        <span className={leaderboardStatClass}>
                                            <FaChartLine className={leaderboardFilterIconClass} />
                                            {viewMode === 'weekly' ? player.recentSolved || player.problemsSolved : player.problemsSolved} solved
                                        </span>
                                        {metric === 'accuracy' && player.accuracy !== null && player.accuracy !== undefined && (
                                            <span className={leaderboardStatClass}>
                                                <FaBullseye className={leaderboardFilterIconClass} />
                                                {player.accuracy}%
                                            </span>
                                        )}
                                        {metric === 'streak' && (
                                            <span className={leaderboardStatClass}>
                                                <FaFire className={leaderboardFilterIconClass} />
                                                {player.currentStreak} days
                                            </span>
                                        )}
                                        {viewMode === 'weekly' && (
                                            <span className={leaderboardStatClass}>
                                                <FaChartLine className={leaderboardFilterIconClass} />
                                                last 7d
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={leaderboardXpClass}>
                                    <span className={leaderboardXpValueClass}>{primaryMetric.value}</span>
                                    <span className={leaderboardXpLabelClass}>{primaryMetric.label}</span>
                                </div>
                            </Link>
                        );
                    })()
                ))}
            </div>

            {filteredPlayers.length === 0 && (
                <div className={leaderboardEmptyClass}>No players match these filters.</div>
            )}

            {currentUser && (
                <div className="absolute inset-x-0 bottom-0 z-[3] border-t border-[color-mix(in_srgb,var(--accent-color)_30%,transparent)] bg-[color-mix(in_srgb,var(--main-color)_96%,transparent)] p-2 shadow-[0_-8px_22px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                    <div className="mb-1 text-left text-xs font-bold uppercase tracking-wider">Your global rank</div>
                    <Link
                        to={`/profile/${currentUser.id}`}
                        className={`${leaderboardRowClass} rounded-lg bg-[color-mix(in_srgb,var(--accent-color)_7%,var(--main-color))] shadow-[inset_3px_0_0_var(--accent-color)] ${getRankClass(currentUser.rank)}`}
                    >
                        {(() => {
                            const primaryMetric = getPrimaryMetric(currentUser);
                            return (
                                <>
                                    <div className={`flex h-10 w-[54px] min-w-[54px] items-center justify-center gap-1.5 rounded-[10px] bg-[color-mix(in_srgb,var(--secondary-color)_6%,var(--main-color))] text-base font-bold max-[680px]:h-9 max-[680px]:w-9 max-[680px]:min-w-9 max-[680px]:gap-0.5 ${getRankBadgeClass(currentUser.rank)}`}>
                                        <span className="max-[680px]:hidden">{getRankBadge(currentUser.rank)}</span>
                                        <span className="text-sm font-extrabold">{currentUser.rank}</span>
                                    </div>
                                    <div className={leaderboardAvatarWrapClass}>
                                        <img
                                            src={currentUser.avatarUrl || GuestAvatar}
                                            alt={`${currentUser.name} avatar`}
                                            className={leaderboardAvatarClass}
                                        />
                                    </div>
                                    <div className={leaderboardPlayerInfoClass}>
                                        <div className={leaderboardPlayerNameClass}>
                                            {currentUser.name}
                                            <span className={leaderboardYouBadgeClass}>You</span>
                                        </div>
                                        <div className={leaderboardPlayerStatsClass}>
                                            <span className={leaderboardStatClass}>
                                                <FaChartLine className={leaderboardFilterIconClass} />
                                                {currentUser.problemsSolved} solved
                                            </span>
                                            {metric === 'accuracy' && currentUser.accuracy !== null && currentUser.accuracy !== undefined && (
                                                <span className={leaderboardStatClass}>
                                                    <FaBullseye className={leaderboardFilterIconClass} />
                                                    {currentUser.accuracy}%
                                                </span>
                                            )}
                                            {metric === 'streak' && (
                                                <span className={leaderboardStatClass}>
                                                    <FaFire className={leaderboardFilterIconClass} />
                                                    {currentUser.currentStreak} days
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={leaderboardXpClass}>
                                        <span className={leaderboardXpValueClass}>{primaryMetric.value}</span>
                                        <span className={leaderboardXpLabelClass}>{primaryMetric.label}</span>
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

export default TopSolversLeaderboard;