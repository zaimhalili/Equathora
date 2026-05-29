import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaDumbbell } from 'react-icons/fa';
import { getUserProgress, getStreakData, getCompletedProblems, getUserSubmissions } from '../lib/databaseService';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import YourTrack from '@/components/YourTrack';
import { formatTopicLabel } from '@/lib/utils';
import LoadingSpinner from '../components/LoadingSpinner';

const Tracks = () => {
    const [userStats, setUserStats] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isActive = true;
        let channel;

        const fetchUserStats = async () => {
            try {
                const { data: problemsData, error: problemsError } = await supabase
                    .from('problems')
                    .select('id, topic')
                    .eq('is_active', true);

                if (problemsError) throw problemsError;

                const [progress, streak, completed, submissions] = await Promise.all([
                    getUserProgress(),
                    getStreakData(),
                    getCompletedProblems(),
                    getUserSubmissions()
                ]);

                const topicStatsMap = new Map();
                const problemTopicMap = new Map();

                (problemsData || []).forEach((problem) => {
                    const topicKey = String(problem.topic || '').trim();
                    if (!topicKey) return;
                    problemTopicMap.set(String(problem.id), topicKey);
                    if (!topicStatsMap.has(topicKey)) {
                        topicStatsMap.set(topicKey, {
                            completed: 0,
                            attempted: 0,
                            wrong: 0,
                            timeSpent: 0,
                            problems: 0
                        });
                    }
                    topicStatsMap.get(topicKey).problems += 1;
                });

                (completed || []).forEach((pid) => {
                    const topicKey = problemTopicMap.get(String(pid));
                    if (!topicKey || !topicStatsMap.has(topicKey)) return;
                    topicStatsMap.get(topicKey).completed += 1;
                });

                (submissions || []).forEach((submission) => {
                    const topicKey = problemTopicMap.get(String(submission.problem_id));
                    if (!topicKey || !topicStatsMap.has(topicKey)) return;
                    const stats = topicStatsMap.get(topicKey);
                    stats.attempted += 1;
                    if (!submission.is_correct) {
                        stats.wrong += 1;
                    }
                    const timeSeconds = submission.time_spent_seconds ?? submission.time_spent ?? 0;
                    stats.timeSpent += Number(timeSeconds || 0) / 60;
                });

                const trackStats = Object.fromEntries(topicStatsMap.entries());
                const topicList = Array.from(topicStatsMap.keys()).sort((a, b) =>
                    formatTopicLabel(a).localeCompare(formatTopicLabel(b))
                );

                if (!isActive) return;

                setTopics(topicList);
                setUserStats({
                    totalProblems: problemsData?.length || 0,
                    completedProblems: completed?.length || 0,
                    attemptedProblems: submissions?.length || 0,
                    currentStreak: streak?.current_streak || 0,
                    totalTimeSpent: progress?.total_time_minutes || 0,
                    trackStats
                });
            } catch (error) {
                console.error('Error fetching user stats:', error);
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        const subscribeToUpdates = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;

            channel = supabase.channel('tracks-updates')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'problems' },
                    () => fetchUserStats()
                )
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'user_submissions',
                        ...(userId ? { filter: `user_id=eq.${userId}` } : {})
                    },
                    () => fetchUserStats()
                )
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'user_completed_problems',
                        ...(userId ? { filter: `user_id=eq.${userId}` } : {})
                    },
                    () => fetchUserStats()
                )
                .subscribe();
        };

        fetchUserStats();
        subscribeToUpdates();

        return () => {
            isActive = false;
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, []);

    const getTrackData = useCallback((topic) => {
        if (!userStats || !userStats.trackStats[topic]) {
            return { completed: 0, attempted: 0, wrong: 0, timeSpent: 0, problems: 0 };
        }
        return userStats.trackStats[topic];
    }, [userStats]);

    const availableTopics = useMemo(() => {
        return topics.map((topic) => ({
            value: topic,
            label: formatTopicLabel(topic)
        }));
    }, [topics]);
    const orderedTopics = useMemo(() => {
        if (!userStats) return [];
        return [...availableTopics].sort((a, b) => {
            const aStats = getTrackData(a.value);
            const bStats = getTrackData(b.value);
            const aStarted = aStats.completed > 0;
            const bStarted = bStats.completed > 0;
            if (aStarted !== bStarted) return aStarted ? -1 : 1;
            return a.label.localeCompare(b.label);
        });
    }, [availableTopics, getTrackData, userStats]);

    const startedTopics = useMemo(
        () => orderedTopics.filter((topic) => getTrackData(topic.value).completed > 0),
        [orderedTopics, getTrackData]
    );

    const otherTopics = useMemo(
        () => orderedTopics.filter((topic) => getTrackData(topic.value).completed === 0),
        [orderedTopics, getTrackData]
    );

    const renderTrackCard = (track) => {
        const stats = getTrackData(track.value);
        const solvedCount = stats.completed;
        const totalCount = stats.problems;
        const progressPercent = totalCount > 0
            ? Math.min(100, Math.round((solvedCount / totalCount) * 100))
            : 0;
        const isStarted = solvedCount > 0;
        const isFinished = totalCount > 0 && solvedCount >= totalCount;
        const progressLabel = `You have solved ${solvedCount} of ${totalCount} problems`;

        return (
            <Link
                key={track.value}
                to={`/learn?topic=${encodeURIComponent(track.value)}`}
                className='bg-[var(--white)] flex w-full rounded-md pt-4 pb-6 px-6 gap-3 hover:scale-103 transition-all duration-200 shadow-md hover:shadow-2xl cursor-pointer ease-in-out sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)]'
            >
                <div className='flex flex-col w-full gap-3'>
                    <div className="flex items-center justify-between gap-3 h-1/3">
                        <p className='text-md text-[var(--secondary-color)] font-bold'>{track.label}</p>
                        {isFinished ? (
                            <div className="flex items-center gap-2 bg-[var(--main-color)] px-2 rounded-md py-1">
                                <FaCheckCircle className='text-[var(--secondary-color)] rounded-full text-md' />
                                <span className='text-xs font-semibold text-[var(--secondary-color)]'>Finished</span>
                            </div>
                        ) : isStarted ? (
                            <div className="flex items-center gap-2 bg-[var(--main-color)] px-2 rounded-md py-1">
                                <FaCheckCircle className='text-[var(--secondary-color)] rounded-full text-md' />
                                <span className='text-xs font-semibold text-[var(--secondary-color)]'>Started</span>
                            </div>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-3 h-1/3">
                        <FaDumbbell className='text-sm text-[var(--secondary-color)]' />
                        <p>{solvedCount}/{totalCount} Exercises</p>
                    </div>
                    <div className="flex h-1/3">
                        <div className='flex-1 h-2 bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md flex items-center relative transition-all duration-300 overflow-hidden group'>
                            <div
                                className="h-full rounded-md bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] transition-all duration-500 relative"
                                role="progressbar"
                                aria-label={progressLabel}
                                aria-valuenow={Math.round(progressPercent)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                style={{ width: `${progressPercent}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    if (loading) {
        return <LoadingSpinner message="Loading tracks..." />;
    }

    return (
        <>
            <Navbar />
            <div className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen">
                <div className='flex items-center justify-center w-full'>
                    {/* Header */}
                    <div className="flex flex-col justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-6">
                        <motion.div
                            className="flex flex-col gap-3 text-center"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl text-center md:text-left pb-2 cursor-default font-[Sansation] font-extrabold">
                                Your Math Journey
                            </h1>
                            <p className="text-md text-center md:text-left lg:text-lg font-normal leading-[1.2] lg:w-[60%] cursor-default text-[var(--secondary-color)]">
                                Follow structured learning paths designed to build your mathematical skills progressively. Each track guides you through concepts with increasing complexity.
                            </p>

                            {/* User Stats */}
                            {/* 
                                        <p className="text-xs font-medium">Time Spent</p>
                                        <p className="text-sm font-bold text-[var(--secondary-color)]">
                                            {loading ? '...' : `${Math.round(userStats?.totalTimeSpent || 0)} min`}
                                        </p> */}
                        </motion.div>
                        <YourTrack></YourTrack>

                        {/* Tracks Grid */}
                        <div className="flex flex-wrap w-full gap-3 py-8">
                            {startedTopics.map(renderTrackCard)}
                            {startedTopics.length > 0 && otherTopics.length > 0 ? (
                                <div className="w-full h-4" />
                            ) : null}
                            {otherTopics.map(renderTrackCard)}
                        </div>
                    </div>


                </div>

            </div >
            <Footer />
        </>
    );
};

export default Tracks;
