import { useCallback, useEffect, useRef, useState } from 'react';
import { computeAccuracyFromSubmissions } from '../lib/accuracyService';
import { getCachedGlobalLeaderboard } from '../lib/leaderboardService';
import { getAllProblems } from '../lib/problemService';
import { supabase } from '../lib/supabaseClient';
import {
    difficultyDisplayRank,
    formatDifficultyLabel,
    getDifficultyColor,
    normalizeDifficultyKey
} from './useStatisticsColors';

const getEffectiveStreak = (currentStreak = 0, lastActivityDate = null) => {
    if (!currentStreak || currentStreak <= 0) return 0;
    if (!lastActivityDate) return currentStreak;

    const todayUtc = new Date();
    todayUtc.setUTCHours(0, 0, 0, 0);
    const lastUtc = new Date(lastActivityDate);
    if (Number.isNaN(lastUtc.getTime())) return currentStreak;
    lastUtc.setUTCHours(0, 0, 0, 0);

    const diffDays = Math.floor((todayUtc.getTime() - lastUtc.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? currentStreak : 0;
};

const normalizeCompletedProblemId = (rawValue) => {
    if (rawValue === null || rawValue === undefined) return '';
    if (typeof rawValue === 'string' && rawValue.startsWith('{')) {
        try {
            const parsed = JSON.parse(rawValue);
            return String(parsed?.problemId ?? parsed?.id ?? '').trim();
        } catch {
            return '';
        }
    }
    return String(rawValue).trim();
};

export function useProfileData(profile) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewingOwnProfile, setViewingOwnProfile] = useState(false);
    const [error, setError] = useState(null);
    const fetchRequestIdRef = useRef(0);

    const handleProfileSave = useCallback((updatedData) => {
        setUserData((prevData) => {
            if (!prevData) return prevData;
            return {
                ...prevData,
                name: updatedData.full_name ?? updatedData.name ?? prevData.name,
                username: updatedData.username ?? prevData.username,
                bio: updatedData.bio ?? prevData.bio,
                location: updatedData.location ?? prevData.location,
                website: updatedData.website ?? prevData.website,
                avatar_url: updatedData.avatar_url ?? prevData.avatar_url
            };
        });
    }, []);

    useEffect(() => {
        const requestId = ++fetchRequestIdRef.current;
        let isActive = true;

        const fetchUserData = async () => {
            setLoading(true);
            setUserData(null);
            setViewingOwnProfile(false);
            setError(null);

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    setError('Sign in to view profile data.');
                    return;
                }

                const isMyProfileAlias = profile === 'myprofile' || profile === 'me';
                const targetUserId = isMyProfileAlias || !profile ? session.user.id : profile;
                const isSelf = targetUserId === session.user.id;
                if (!isActive || fetchRequestIdRef.current !== requestId) return;
                setViewingOwnProfile(isSelf);

                const [
                    { data: profileRow },
                    { data: progressRow },
                    { data: streakRow },
                    { data: leaderboardRow },
                    { data: submissionsRow, error: submissionsError }
                ] = await Promise.all([
                    supabase.from('profiles').select('*').eq('id', targetUserId).maybeSingle(),
                    supabase.from('user_progress').select('*').eq('user_id', targetUserId).maybeSingle(),
                    supabase.from('user_streak_data').select('*').eq('user_id', targetUserId).maybeSingle(),
                    supabase.from('leaderboard_view').select('*').eq('user_id', targetUserId).maybeSingle(),
                    isSelf
                        ? supabase.from('user_submissions').select('problem_id, is_correct').eq('user_id', targetUserId)
                        : Promise.resolve({ data: [], error: null })
                ]);

                const { data: completedRows } = await supabase
                    .from('user_completed_problems')
                    .select('problem_id')
                    .eq('user_id', targetUserId);
                const completedIds = Array.from(new Set(
                    (completedRows || [])
                        .map((row) => normalizeCompletedProblemId(row.problem_id))
                        .filter(Boolean)
                ));

                const problemList = await getAllProblems().catch((problemError) => {
                    console.error('Error fetching all problems:', problemError);
                    return [];
                });
                const metadata = isSelf ? session.user.user_metadata : {};
                const displayName = profileRow?.full_name
                    ?? profileRow?.username
                    ?? metadata.full_name
                    ?? metadata.name
                    ?? session.user.email?.split('@')[0]
                    ?? 'Student';
                const username = profileRow?.username
                    ?? metadata.preferred_username
                    ?? session.user.email?.split('@')[0]
                    ?? 'student';
                const avatarUrl = profileRow?.avatar_url
                    ?? metadata.avatar_url
                    ?? metadata.picture
                    ?? metadata.image
                    ?? metadata.photo_url
                    ?? '';
                const validProblemIds = new Set(problemList.map((problem) => String(problem.id)));
                const validCompletedIds = completedIds.filter((id) => validProblemIds.has(String(id)));
                const completedProblems = problemList.filter((problem) =>
                    validCompletedIds.includes(String(problem.id))
                );
                const solved = completedProblems.length;

                let accuracyStats = { accuracy: 0, correct: 0, wrong: 0, total: 0 };
                if (isSelf && !submissionsError) {
                    accuracyStats = computeAccuracyFromSubmissions({
                        submissions: submissionsRow || [],
                        validProblemIds,
                        solvedCount: solved
                    });
                } else {
                    const wrongSubmissions = Number(progressRow?.wrong_submissions ?? 0);
                    const totalAttempts = Number(progressRow?.total_attempts ?? 0);
                    const safeWrongSubmissions = Number.isFinite(wrongSubmissions) ? wrongSubmissions : 0;
                    const safeTotalAttempts = Number.isFinite(totalAttempts) ? totalAttempts : 0;
                    const correctSubmissions = Math.max(safeTotalAttempts - safeWrongSubmissions, 0);
                    if (safeTotalAttempts > 0) {
                        accuracyStats = {
                            accuracy: Math.max(0, Math.min(100, Math.round((correctSubmissions / safeTotalAttempts) * 100))),
                            correct: correctSubmissions,
                            wrong: safeWrongSubmissions,
                            total: safeTotalAttempts
                        };
                    } else if (solved > 0) {
                        accuracyStats = { accuracy: null, correct: 0, wrong: 0, total: 0 };
                    }
                }

                const difficultyMap = new Map();
                for (const problem of problemList) {
                    const key = normalizeDifficultyKey(problem?.difficulty);
                    const label = formatDifficultyLabel(problem?.difficulty);
                    const existing = difficultyMap.get(key) || { key, label, solved: 0, total: 0 };
                    existing.total += 1;
                    if (existing.label === 'Unspecified' && label !== 'Unspecified') existing.label = label;
                    difficultyMap.set(key, existing);
                }
                for (const problem of completedProblems) {
                    const key = normalizeDifficultyKey(problem?.difficulty);
                    const label = formatDifficultyLabel(problem?.difficulty);
                    const existing = difficultyMap.get(key) || { key, label, solved: 0, total: 0 };
                    existing.solved += 1;
                    difficultyMap.set(key, existing);
                }
                const difficultyBreakdown = Array.from(difficultyMap.values())
                    .sort((a, b) => {
                        const rankDiff = (difficultyDisplayRank[a.key] ?? 99) - (difficultyDisplayRank[b.key] ?? 99);
                        return rankDiff || a.label.localeCompare(b.label);
                    })
                    .map((difficulty, index) => ({
                        ...difficulty,
                        percentage: difficulty.total > 0
                            ? Math.round((difficulty.solved / difficulty.total) * 100)
                            : 0,
                        color: getDifficultyColor(difficulty.key, index)
                    }));

                let resolvedGlobalRank = leaderboardRow?.rank || 0;
                if (!resolvedGlobalRank) {
                    try {
                        const globalLeaderboard = await getCachedGlobalLeaderboard();
                        const leaderboardEntry = (globalLeaderboard || []).find((entry) => entry.userId === targetUserId);
                        resolvedGlobalRank = leaderboardEntry?.rank || 0;
                    } catch (rankError) {
                        console.warn('Could not resolve rank from global leaderboard fallback:', rankError);
                    }
                }

                const rawReputation = Number(progressRow?.reputation ?? 0);
                const reputationValue = Number.isFinite(rawReputation) ? Math.max(rawReputation, 0) : 0;
                const newUserData = {
                    name: displayName,
                    username,
                    email: isSelf ? session.user.email ?? '' : '',
                    createdAt: isSelf ? session.user.created_at ?? null : profileRow?.created_at ?? null,
                    role: profileRow?.role ?? (isSelf ? metadata.role : null),
                    bio: profileRow?.bio ?? metadata.bio ?? '',
                    location: profileRow?.location ?? metadata.location ?? '',
                    website: profileRow?.website ?? metadata.website ?? '',
                    avatar_url: avatarUrl,
                    title: 'Problem Solver',
                    status: isSelf ? 'Online' : 'Viewing',
                    stats: {
                        problemsSolved: solved,
                        accuracy: accuracyStats.accuracy,
                        accuracyDetail: {
                            correct: accuracyStats.correct,
                            wrong: accuracyStats.wrong,
                            total: accuracyStats.total
                        },
                        currentStreak: getEffectiveStreak(
                            streakRow?.current_streak || 0,
                            streakRow?.last_activity_date || null
                        ),
                        longestStreak: streakRow?.longest_streak || 0,
                        reputation: reputationValue,
                        globalRank: resolvedGlobalRank,
                        totalProblems: problemList.length,
                        difficulties: difficultyBreakdown
                    },
                    mathTopics: [...new Set(completedProblems.map((problem) => problem.topic).filter(Boolean))],
                    problemsSolved: completedProblems.slice(-10).reverse()
                };

                if (!isActive || fetchRequestIdRef.current !== requestId) return;
                setUserData(newUserData);
            } catch (fetchError) {
                console.error('Failed to fetch user data:', fetchError);
                if (isActive && fetchRequestIdRef.current === requestId) {
                    setError('We could not load this profile. Please try again.');
                }
            } finally {
                if (isActive && fetchRequestIdRef.current === requestId) setLoading(false);
            }
        };

        fetchUserData();
        return () => {
            isActive = false;
        };
    }, [profile]);

    return { userData, loading, viewingOwnProfile, error, handleProfileSave };
}