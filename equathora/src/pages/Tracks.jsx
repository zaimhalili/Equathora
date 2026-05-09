import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaCheckCircle, FaFire, FaLightbulb } from 'react-icons/fa';
import { FaRocket, FaTrophy, FaBookmark, FaRegBookmark, FaChartLine } from 'react-icons/fa';
import { FaBullseye, FaExclamationTriangle, FaPlay, FaCalculator, FaRulerCombined, FaBolt, FaSortNumericUp, FaLink, FaChartBar, FaSquareRootAlt, FaInfinity, FaDumbbell } from 'react-icons/fa';
import { getUserProgress, getStreakData, getCompletedProblems, getUserSubmissions } from '../lib/databaseService';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import YourTrack from '@/components/YourTrack';
import { formatTopicLabel } from '@/lib/utils';

const Tracks = () => {
    const [bookmarked, setBookmarked] = useState({});
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startedTrack, setStartedTrack] = useState(true);

    const toggleBookmark = (e, id) => {
        e.preventDefault();
        setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                // Fetch problems from backend
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

                // Calculate track-specific stats using database topics
                const trackStats = {
                    'polynomial_simplification': {
                        completed: 0,
                        attempted: 0,
                        wrong: 0,
                        timeSpent: 0,
                        problems: 0
                    },
                    'polynomial_operations': {
                        completed: 0,
                        attempted: 0,
                        wrong: 0,
                        timeSpent: 0,
                        problems: 0
                    },
                    'polynomial_equations': {
                        completed: 0,
                        attempted: 0,
                        wrong: 0,
                        timeSpent: 0,
                        problems: 0
                    }
                };

                // Count total problems per topic
                problemsData.forEach(problem => {
                    if (trackStats[problem.topic]) {
                        trackStats[problem.topic].problems++;
                    }
                });

                // Count completed problems by topic
                completed.forEach(pid => {
                    const problem = problemsData.find(p => String(p.id) === String(pid));
                    if (problem && trackStats[problem.topic]) {
                        trackStats[problem.topic].completed++;
                    }
                });

                // Count attempts and wrong answers by topic
                submissions.forEach(sub => {
                    const problem = problemsData.find(p => String(p.id) === String(sub.problem_id));
                    if (problem && trackStats[problem.topic]) {
                        trackStats[problem.topic].attempted++;
                        if (!sub.is_correct) {
                            trackStats[problem.topic].wrong++;
                        }
                        trackStats[problem.topic].timeSpent += (sub.time_spent || 0) / 60; // Convert to minutes
                    }
                });

                setUserStats({
                    totalProblems: problemsData.length,
                    completedProblems: completed.length,
                    attemptedProblems: submissions.length,
                    currentStreak: streak?.current_streak || 0,
                    totalTimeSpent: progress?.total_time_minutes || 0,
                    trackStats
                });
            } catch (error) {
                console.error('Error fetching user stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats();
    }, []);

    const getTrackData = (topic) => {
        if (!userStats || !userStats.trackStats[topic]) {
            return { completed: 0, attempted: 0, wrong: 0, timeSpent: 0, problems: 0 };
        }
        return userStats.trackStats[topic];
    };

    const formatTime = (minutes) => {
        if (minutes === 0) return '0 minutes';
        if (minutes < 60) return `${Math.round(minutes)} minutes`;
        return `${(minutes / 60).toFixed(1)} hours`;
    };

    const tracks = [
        {
            id: 1,
            name: 'Polynomial Simplification Track',
            topic: 'polynomial_simplification',
            difficulty: 'Easy',
            icon: FaSquareRootAlt,
            iconColor: 'text-green-500',
            description: 'Master the art of simplifying polynomial expressions by combining like terms and reducing complex expressions.',
            recommended: true,
            reason: 'Perfect starting point for algebra mastery',
            joined: startedTrack,
        },
        {
            id: 2,
            name: 'Polynomial Simplification Track',
            topic: 'polynomial_simplification',
            difficulty: 'Easy',
            icon: FaSquareRootAlt,
            iconColor: 'text-green-500',
            description: 'Master the art of simplifying polynomial expressions by combining like terms and reducing complex expressions.',
            recommended: true,
            reason: 'Perfect starting point for algebra mastery',
            joined: startedTrack,
        }
    ];

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'text-green-600 bg-green-50 border-green-200';
        }
    };

    // Calculate user insights from database data
    const getMostTimeTrack = () => {
        if (!userStats || !userStats.trackStats) return tracks[0];
        let maxTime = 0;
        let maxTrack = tracks[0];
        tracks.forEach(track => {
            const stats = userStats.trackStats[track.topic];
            if (stats && stats.timeSpent > maxTime) {
                maxTime = stats.timeSpent;
                maxTrack = track;
            }
        });
        return maxTrack;
    };

    const getMostWrongTrack = () => {
        if (!userStats || !userStats.trackStats) return tracks[0];
        let maxWrong = 0;
        let maxTrack = tracks[0];
        tracks.forEach(track => {
            const stats = userStats.trackStats[track.topic];
            if (stats && stats.wrong > maxWrong) {
                maxWrong = stats.wrong;
                maxTrack = track;
            }
        });
        return maxTrack;
    };

    const mostTimeTrack = getMostTimeTrack();
    const mostWrongTrack = getMostWrongTrack();
    const mostTimeTrackStats = userStats ? getTrackData(mostTimeTrack.topic) : { timeSpent: 0 };
    const mostWrongTrackStats = userStats ? getTrackData(mostWrongTrack.topic) : { wrong: 0 };


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
                        <div className="flex flex-wrap w-full gap-3 pt-8">
                            {tracks.map((track) => (
                                <div key={track.id} className='bg-[var(--white)] flex w-full rounded-md pt-4 pb-6 px-6 gap-3 hover:scale-103 transition-all duration-200 shadow-md hover:shadow-2xl cursor-pointer ease-in-out sm:w-[calc(50%-6px)]'>
                                    <div className='flex items-center self-stretch justify-center flex-shrink-0 aspect-square'>
                                        <FaTrophy className='w-full h-full text-[var(--dark-accent-color)]' />
                                    </div>
                                    <div className='flex flex-col w-full gap-3'>
                                        <div className="flex items-center justify-between gap-3 h-1/3">
                                            <p className='text-md text-[var(--secondary-color)] font-bold'>{formatTopicLabel(track.topic)}</p>
                                            {track.joined && <div className="flex items-center gap-3 bg-[var(--main-color)] px-2 rounded-md py-1"><FaCheckCircle className='text-[var(--secondary-color)] rounded-full text-md' />Joined</div>}


                                        </div>
                                        <div className="flex items-center gap-3 h-1/3">
                                            <FaDumbbell className='text-sm text-[var(--secondary-color)]' />
                                            <p>4/100 Exercises</p>
                                        </div>
                                        {/* Mini Progress Bar */}
                                        {startedTrack && (
                                            <div className="flex h-1/3">
                                                <div className='flex-1 h-2 bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md flex items-center relative transition-all duration-300 overflow-hidden group' />
                                            </div>
                                        )}

                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>


                </div>

            </div >
            <Footer />
        </>
    );
};

export default Tracks;
