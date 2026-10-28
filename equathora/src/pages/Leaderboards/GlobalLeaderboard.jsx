import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCachedGlobalLeaderboard, getCurrentUserRank } from '../../lib/leaderboardService';
import { getCompletedProblems, getStreakData, getUserProgress } from '../../lib/databaseService';
import { supabase } from '../../lib/supabaseClient';
import GuestAvatar from '../../assets/images/guestAvatar.png';
import { FaCrown, FaHashtag, FaMedal, FaSearch } from 'react-icons/fa';
import LeaderboardSkeleton from './LeaderboardSkeleton';
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
    leaderboardPanelClass,
    leaderboardPlayerNameClass,
    leaderboardSubtitleClass,
    leaderboardTitleClass,
    leaderboardYouBadgeClass
} from './leaderboardStyles';

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
            const listedUser = leaderboardData.find(
                (player) => String(player.userId) === String(userId)
            );
            const metadataAvatar = metadata.avatar_url
                || metadata.picture
                || metadata.image
                || metadata.photo_url
                || '';
            const userData = session ? {
                id: userId,
                userId,
                name: userRankData?.name
                    || metadata.full_name
                    || metadata.name
                    || metadata.display_name
                    || session.user.email
                    || 'Your account',
                problemsSolved: listedUser
                    ? listedUser.problemsSolved
                    : userRankData?.problemsSolved ?? ownSolvedCount,
                xp: listedUser
                    ? listedUser.xp
                    : userRankData?.xp ?? Number(ownProgress?.total_xp ?? 0),
                rank: listedUser ? listedUser.rank : userRankData?.rank ?? null,
                accuracy: listedUser ? listedUser.accuracy : userRankData?.accuracy ?? (
                    totalAttempts > 0
                        ? Math.max(0, Math.min(100, Math.round(
                            ((totalAttempts - wrongSubmissions) / totalAttempts) * 100
                        )))
                        : ownSolvedCount > 0 ? null : 0
                ),
                currentStreak: listedUser
                    ? listedUser.currentStreak
                    : userRankData?.currentStreak ?? ownStreak?.current_streak ?? 0,
                avatarUrl: metadataAvatar || userRankData?.avatarUrl || listedUser?.avatarUrl || '',
                reputation: listedUser
                    ? listedUser.reputation
                    : userRankData?.reputation ?? Number(ownProgress?.reputation ?? 0),
                totalTimeMinutes: listedUser
                    ? listedUser.totalTimeMinutes
                    : Number(
                        userRankData?.totalTimeMinutes
                        ?? ownProgress?.total_time_minutes
                        ?? 0
                    )
            } : null;
            const visibleLeaderboard = leaderboardData.map((player) => {
                if (!userData || String(player.userId) !== String(userId)) {
                    return player;
                }

                return {
                    ...player,
                    name: userData.name,
                    avatarUrl: userData.avatarUrl
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
    const pinnedUser = visibleCurrentUser ? {
        ...visibleCurrentUser,
        id: visibleCurrentUser.userId
    } : currentUser;
    const currentUserName = currentUser?.name?.trim().toLowerCase();
    const rankedCurrentUser = rankedPlayers.find(
        (player) => String(player.userId) === String(currentUserId)
    );
    const pinnedRank = rankedCurrentUser?.displayRank ?? currentUser?.rank ?? visibleCurrentUser?.rank;
    const hasPinnedRank = Number.isInteger(pinnedRank) && pinnedRank > 0;

    const getRankBadge = (rank) => {
        if (rank === 1) return <FaCrown className="text-sm" />;
        if (rank === 2 || rank === 3) return <FaMedal className="text-sm" />;
        return <FaHashtag className="text-sm" />;
    };

    const getRankClass = (rank) => {
        return getRankToneClass(rank);
    };

    if (loading) {
        return <LeaderboardSkeleton />;
    }

    if (error) {
        return (
            <article className={leaderboardPanelClass}>
                <div>
                    <h2 className={leaderboardTitleClass}>Global Leaderboard</h2>
                    <p className={leaderboardSubtitleClass}>See how you rank across the Equathora community.</p>
                </div>
                <div className="p-12 text-center text-red-500">
                    <p role="alert">{error}</p>
                    <button
                        onClick={fetchLeaderboardData}
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
                <div className="flex items-center justify-between gap-5 max-[680px]:flex-col max-[680px]:items-stretch max-[680px]:gap-3">
                    <div className="space-y-1">
                        <h2 className={leaderboardTitleClass}>Global Leaderboard</h2>
                        <p className={leaderboardSubtitleClass}>See how you rank across the Equathora community.</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 max-[680px]:justify-stretch">
                        <label className={`${leaderboardFilterClass} min-w-[190px] max-[680px]:min-w-0 max-[680px]:flex-1 max-[420px]:basis-full`}>
                            <FaSearch className={leaderboardFilterIconClass} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search player"
                                className={leaderboardFilterInputClass}
                                aria-label="Search leaderboard by player name"
                            />
                        </label>

                        <label className={`${leaderboardFilterClass} max-[420px]:min-h-[38px]`}>
                            <span className="shrink-0 text-[0.82rem] opacity-70">Sort by</span>
                            <select value={metric} onChange={(e) => setMetric(e.target.value)} className={leaderboardFilterSelectClass} aria-label="Sort by">
                                <option value="xp">Total XP</option>
                                <option value="solved">Problems solved</option>
                                <option value="accuracy">Accuracy</option>
                                <option value="streak">Streak</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>

            <section className="grid gap-3" aria-labelledby="leaderboard-leaders-title">
                <h3 id="leaderboard-leaders-title" className="m-0 text-xl font-bold">Current leaders</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {leaders.map((player) => {
                        const isCurrentUser = String(player.userId) === String(currentUserId);
                        return (
                            <Link
                                key={player.userId}
                                to={`/profile/${player.userId}`}
                                className={`flex min-w-0 flex-col overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--secondary-color)_14%,transparent)] bg-[color-mix(in_srgb,var(--secondary-color)_3%,var(--main-color))] text-(--secondary-color) no-underline ${getRankClass(player.displayRank)} ${isCurrentUser ? 'shadow-[inset_0_0_0_2px_var(--accent-color)]' : ''}`}
                            >
                                <div className="flex min-h-[84px] items-center gap-3 p-3">
                                    <span className="inline-flex w-7 shrink-0 flex-col items-center gap-1 text-xs font-bold">
                                        <span className="text-base">{getRankBadge(player.displayRank)}</span>
                                        <span>{player.displayRank}</span>
                                    </span>
                                    <span className={leaderboardAvatarWrapClass}>
                                        <img src={player.avatarUrl || GuestAvatar} alt="" className={leaderboardAvatarClass} />
                                    </span>
                                    <span className="grid min-w-0 flex-1 gap-1">
                                        <span className={`${leaderboardPlayerNameClass} text-[0.95rem]`}>
                                            {player.name}
                                            {isCurrentUser && <span className={leaderboardYouBadgeClass}>You</span>}
                                            {!isCurrentUser
                                                && currentUserName
                                                && player.name?.trim().toLowerCase() === currentUserName
                                                && <span className="inline-flex shrink-0 items-center rounded-full border border-[color-mix(in_srgb,var(--secondary-color)_16%,transparent)] px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide opacity-70">Other profile</span>}
                                        </span>
                                        <strong className="text-lg">{(player.xp || 0).toLocaleString()} <small className="text-[0.68rem] opacity-70">XP</small></strong>
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 border-t border-[color-mix(in_srgb,var(--secondary-color)_12%,transparent)] [&>div+div]:border-l [&>div+div]:border-[color-mix(in_srgb,var(--secondary-color)_12%,transparent)]">
                                    <div className="grid gap-1 p-2.5"><span className="text-[0.68rem] uppercase opacity-70">Solved</span><strong>{player.problemsSolved ?? 0}</strong></div>
                                    <div className="grid gap-1 p-2.5"><span className="text-[0.68rem] uppercase opacity-70">Time spent</span><strong>{formatStudyTime(player.totalTimeMinutes)}</strong></div>
                                    <div className="grid gap-1 p-2.5"><span className="text-[0.68rem] uppercase opacity-70">Reputation</span><strong>{player.reputation ?? 0}</strong></div>
                                </div>
                            </Link>
                        );
                    })}
                    {leaders.length === 0 && <p className={leaderboardEmptyClass}>No leaders to show yet.</p>}
                </div>
            </section>

            <section className="grid gap-3" aria-labelledby="global-ranking-title">
                <div className="flex items-baseline justify-between gap-3">
                    <h3 id="global-ranking-title" className="m-0 text-xl font-bold">Global ranking</h3>
                    <span className="text-xs opacity-70">{filteredPlayers.length} players</span>
                </div>
                <div className="relative min-w-0 overflow-x-auto rounded-xl border border-[color-mix(in_srgb,var(--secondary-color)_13%,transparent)] pb-[5.5rem]">
                    <div className="sticky top-0 z-[2] grid min-w-[930px] grid-cols-[64px_minmax(190px,2.2fr)_repeat(5,minmax(88px,1fr))_minmax(100px,1fr)] items-center gap-3 border-b border-[color-mix(in_srgb,var(--secondary-color)_14%,transparent)] bg-[color-mix(in_srgb,var(--secondary-color)_4%,var(--main-color))] px-4 py-3 text-xs font-bold opacity-80" aria-hidden="true">
                        <span>Rank</span>
                        <span>Player</span>
                        <span>Problems solved</span>
                        <span>Time spent</span>
                        <span>Accuracy</span>
                        <span>Streak</span>
                        <span>Reputation</span>
                        <span>Total XP</span>
                    </div>
                    <div className="flex max-h-[min(600px,58vh)] min-w-[930px] flex-col overflow-auto">
                        {filteredPlayers.length === 0 ? (
                            <div className={`${leaderboardEmptyClass} min-w-[930px]`}>No players match this search.</div>
                        ) : filteredPlayers.map((player) => {
                            const isCurrentUser = String(player.userId) === String(currentUserId);
                            return (
                                <Link
                                    key={player.userId}
                                    to={`/profile/${player.userId}`}
                                    className={`grid min-h-[68px] min-w-[930px] grid-cols-[64px_minmax(190px,2.2fr)_repeat(5,minmax(88px,1fr))_minmax(100px,1fr)] items-center gap-3 border-b border-[color-mix(in_srgb,var(--secondary-color)_10%,transparent)] px-4 py-2.5 text-(--secondary-color) no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--secondary-color)_5%,var(--main-color))] ${getRankClass(player.displayRank)} ${isCurrentUser ? 'bg-[color-mix(in_srgb,var(--accent-color)_9%,var(--main-color))] shadow-[inset_4px_0_0_var(--accent-color)]' : ''}`}
                                    aria-current={isCurrentUser ? 'true' : undefined}
                                >
                                    <span className="flex items-center gap-2 font-bold">
                                        <span className={`inline-flex rounded-lg p-1 ${getRankBadgeClass(player.displayRank)}`}>{getRankBadge(player.displayRank)}</span>
                                        {player.displayRank}
                                    </span>
                                    <span className="flex min-w-0 items-center gap-2.5">
                                        <span className={`${leaderboardAvatarWrapClass} h-[38px] w-[38px]`}>
                                            <img src={player.avatarUrl || GuestAvatar} alt="" className={leaderboardAvatarClass} />
                                        </span>
                                        <span className={leaderboardPlayerNameClass}>
                                            {player.name}
                                            {isCurrentUser && <span className={leaderboardYouBadgeClass}>You</span>}
                                            {!isCurrentUser
                                                && currentUserName
                                                && player.name?.trim().toLowerCase() === currentUserName
                                                && <span className="inline-flex shrink-0 items-center rounded-full border border-[color-mix(in_srgb,var(--secondary-color)_16%,transparent)] px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide opacity-70">Other profile</span>}
                                        </span>
                                    </span>
                                    <span className="px-1 text-center tabular-nums">{player.problemsSolved ?? 0}</span>
                                    <span className="px-1 text-center tabular-nums">{formatStudyTime(player.totalTimeMinutes)}</span>
                                    <span className="px-1 text-center tabular-nums">
                                        {player.accuracy === null || player.accuracy === undefined ? '—' : `${player.accuracy}%`}
                                    </span>
                                    <span className="px-1 text-center tabular-nums">{player.currentStreak ?? 0}d</span>
                                    <span className="px-1 text-center tabular-nums">{player.reputation ?? 0}</span>
                                    <span className="px-1 text-center font-bold tabular-nums">{(player.xp || 0).toLocaleString()}</span>
                                </Link>
                            );
                        })}
                    </div>
                {currentUserId && (
                    <div className="absolute inset-x-0 bottom-0 z-[3] border-t border-[color-mix(in_srgb,var(--accent-color)_30%,transparent)] bg-[color-mix(in_srgb,var(--main-color)_96%,transparent)] p-2 shadow-[0_-8px_22px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                        <Link
                            to={`/profile/${currentUserId}`}
                            className={`grid min-h-[68px] min-w-[930px] grid-cols-[64px_minmax(190px,2.2fr)_repeat(5,minmax(88px,1fr))_minmax(100px,1fr)] items-center gap-3 rounded-lg px-4 py-2.5 text-(--secondary-color) no-underline shadow-[inset_4px_0_0_var(--accent-color)] ${getRankClass(hasPinnedRank ? pinnedRank : 0)}`}
                            aria-label={`Your leaderboard position${hasPinnedRank ? `: rank ${pinnedRank}` : ': rank unavailable'}`}
                        >
                            <span className="flex items-center gap-2 font-bold">
                                <span className={`inline-flex rounded-lg p-1 ${getRankBadgeClass(pinnedRank)}`}>{hasPinnedRank ? getRankBadge(pinnedRank) : <FaHashtag />}</span>
                                {hasPinnedRank ? pinnedRank : '—'}
                            </span>
                            <span className="flex min-w-0 items-center gap-2.5">
                                <span className={`${leaderboardAvatarWrapClass} h-[38px] w-[38px]`}>
                                    <img src={pinnedUser?.avatarUrl || GuestAvatar} alt="" className={leaderboardAvatarClass} />
                                </span>
                                <span className={leaderboardPlayerNameClass}>
                                    {pinnedUser?.name || 'Your account'}
                                    <span className={leaderboardYouBadgeClass}>You</span>
                                </span>
                            </span>
                            <span className="px-1 text-center tabular-nums">{pinnedUser?.problemsSolved ?? 0}</span>
                            <span className="px-1 text-center tabular-nums">{formatStudyTime(pinnedUser?.totalTimeMinutes)}</span>
                            <span className="px-1 text-center tabular-nums">{pinnedUser?.accuracy ?? '—'}{pinnedUser?.accuracy === null || pinnedUser?.accuracy === undefined ? '' : '%'}</span>
                            <span className="px-1 text-center tabular-nums">{pinnedUser?.currentStreak ?? 0}d</span>
                            <span className="px-1 text-center tabular-nums">{pinnedUser?.reputation ?? 0}</span>
                            <span className="px-1 text-center font-bold tabular-nums">{(pinnedUser?.xp ?? 0).toLocaleString()}</span>
                        </Link>
                    </div>
                )}
                </div>
            </section>
        </article>
    );
};

export default GlobalLeaderboard;