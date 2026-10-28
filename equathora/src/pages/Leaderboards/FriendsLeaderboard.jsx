import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFriendsLeaderboard, getCurrentUserRank } from '../../lib/leaderboardService';
import GuestAvatar from '../../assets/images/guestAvatar.png';
import { FaBullseye, FaChartLine, FaCrown, FaHashtag, FaMedal, FaSpinner } from 'react-icons/fa';
import {
    getRankBadgeClass,
    getRankToneClass,
    leaderboardAvatarClass,
    leaderboardAvatarWrapClass,
    leaderboardEmptyClass,
    leaderboardFilterIconClass,
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
        if (rank === 1) return <FaCrown className="text-sm" />;
        if (rank === 2 || rank === 3) return <FaMedal className="text-sm" />;
        return <FaHashtag className="text-sm" />;
    };

    const getRankClass = (rank) => {
        return getRankToneClass(rank);
    };

    const currentUserFriendsRank = players.find(
        (player) => player.userId === currentUser?.userId
    )?.rank ?? currentUser?.rank;

    if (loading) {
        return (
            <article className={leaderboardPanelClass}>
                <div>
                    <h2 className={leaderboardTitleClass}>Friends Leaderboard</h2>
                    <p className={leaderboardSubtitleClass}>Compete with your friends</p>
                </div>
                <div className="w-full flex justify-center pt-40">
                    <FaSpinner className='animate-spin text-3xl' />
                </div>
            </article>
        );
    }

    if (error) {
        return (
            <article className={leaderboardPanelClass}>
                <div>
                    <h2 className={leaderboardTitleClass}>Friends Leaderboard</h2>
                    <p className={leaderboardSubtitleClass}>Compete with your friends</p>
                </div>
                <div className="p-12 text-center text-red-500">
                    <p role="alert">{error}</p>
                    <button
                        onClick={fetchFriends}
                        className="mt-4 cursor-pointer rounded-lg bg-(--accent-color) px-4 py-2 text-white transition hover:opacity-90"
                    >
                        Retry
                    </button>
                </div>
            </article>
        );
    }

    if (!players.length) {
        return (
            <article className={leaderboardPanelClass}>
                <div>
                    <h2 className={leaderboardTitleClass}>Friends Leaderboard</h2>
                    <p className={leaderboardSubtitleClass}>Compete with your friends</p>
                </div>
                <div className={leaderboardEmptyClass}>
                    <p>No friends data yet.</p>
                    <p className="mt-2 text-sm">Add friends to see them here.</p>
                </div>
            </article>
        );
    }

    return (
        <article className={leaderboardPanelClass}>
            <div>
                <h2 className={leaderboardTitleClass}>Friends Leaderboard</h2>
                <p className={leaderboardSubtitleClass}>Compete with your friends</p>
            </div>

            <div className={leaderboardListClass}>
                {players.map((player) => (
                    <Link
                        key={player.userId}
                        to={`/profile/${player.userId}`}
                        className={`${leaderboardRowClass} ${getRankClass(player.rank)} ${currentUser && player.userId === currentUser.userId ? 'bg-[color-mix(in_srgb,var(--accent-color)_7%,var(--main-color))] shadow-[inset_3px_0_0_var(--accent-color)]' : ''}`}
                        aria-current={currentUser && player.userId === currentUser.userId ? 'true' : undefined}
                    >
                        <div className={`flex h-10 w-[54px] min-w-[54px] items-center justify-center gap-1.5 rounded-[10px] bg-[color-mix(in_srgb,var(--secondary-color)_6%,var(--main-color))] text-base font-bold max-[680px]:h-9 max-[680px]:w-9 max-[680px]:min-w-9 max-[680px]:gap-0.5 ${getRankBadgeClass(player.rank)}`}>
                            <span className="max-[680px]:hidden">{getRankBadge(player.rank)}</span>
                            <span className="text-sm font-extrabold">{player.rank}</span>
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
                                {currentUser && player.userId === currentUser.userId && (
                                    <span className={leaderboardYouBadgeClass}>You</span>
                                )}
                            </div>
                            <div className={leaderboardPlayerStatsClass}>
                                <span className={leaderboardStatClass}>
                                    <FaChartLine className={leaderboardFilterIconClass} />
                                    {player.problemsSolved} solved
                                </span>
                                {player.accuracy !== null && player.accuracy !== undefined && (
                                    <span className={leaderboardStatClass}>
                                        <FaBullseye className={leaderboardFilterIconClass} />
                                        {player.accuracy}%
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={leaderboardXpClass}>
                            <span className={leaderboardXpValueClass}>{player.xp.toLocaleString()}</span>
                            <span className={leaderboardXpLabelClass}>XP</span>
                        </div>
                    </Link>
                ))}
            </div>

            {currentUser && (
                <div className="absolute inset-x-0 bottom-0 z-[3] border-t border-[color-mix(in_srgb,var(--accent-color)_30%,transparent)] bg-[color-mix(in_srgb,var(--main-color)_96%,transparent)] p-2 shadow-[0_-8px_22px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                    <div className="mb-1 text-left text-xs font-bold uppercase tracking-wider">Your friends rank</div>
                    <Link
                        to={`/profile/${currentUser.userId}`}
                        className={`${leaderboardRowClass} rounded-lg bg-[color-mix(in_srgb,var(--accent-color)_7%,var(--main-color))] shadow-[inset_3px_0_0_var(--accent-color)] ${getRankClass(currentUserFriendsRank)}`}
                    >
                        <div className={`flex h-10 w-[54px] min-w-[54px] items-center justify-center gap-1.5 rounded-[10px] bg-[color-mix(in_srgb,var(--secondary-color)_6%,var(--main-color))] text-base font-bold max-[680px]:h-9 max-[680px]:w-9 max-[680px]:min-w-9 max-[680px]:gap-0.5 ${getRankBadgeClass(currentUserFriendsRank)}`}>
                            <span className="max-[680px]:hidden">{getRankBadge(currentUserFriendsRank)}</span>
                            <span className="text-sm font-extrabold">{currentUserFriendsRank}</span>
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
                                {currentUser.accuracy !== null && currentUser.accuracy !== undefined && (
                                    <span className={leaderboardStatClass}>
                                        <FaBullseye className={leaderboardFilterIconClass} />
                                        {currentUser.accuracy}%
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={leaderboardXpClass}>
                            <span className={leaderboardXpValueClass}>{currentUser.xp.toLocaleString()}</span>
                            <span className={leaderboardXpLabelClass}>XP</span>
                        </div>
                    </Link>
                </div>
            )}
        </article>
    );
};

export default FriendsLeaderboard;