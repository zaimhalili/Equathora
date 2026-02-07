import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaCheckCircle, FaFire, FaLightbulb } from 'react-icons/fa';
import { FaRocket, FaTrophy, FaBookmark, FaRegBookmark, FaChartLine } from 'react-icons/fa';
import { FaBullseye, FaExclamationTriangle, FaPlay, FaCalculator, FaRulerCombined, FaBolt, FaSortNumericUp, FaLink, FaChartBar, FaSquareRootAlt, FaInfinity } from 'react-icons/fa';
import { getUserProgress, getStreakData, getCompletedProblems, getUserSubmissions } from '../lib/databaseService';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const Tracks = () => {
    const [bookmarked, setBookmarked] = useState({});
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);

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
                setUserStats({
                    totalProblems: 0,
                    completedProblems: 0,
                    attemptedProblems: 0,
                    currentStreak: 0,
                    totalTimeSpent: 0,
                    trackStats: {
                        'polynomial_simplification': { completed: 0, attempted: 0, wrong: 0, timeSpent: 0, problems: 0 },
                        'polynomial_operations': { completed: 0, attempted: 0, wrong: 0, timeSpent: 0, problems: 0 },
                        'polynomial_equations': { completed: 0, attempted: 0, wrong: 0, timeSpent: 0, problems: 0 }
                    }
                });
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
            reason: 'Perfect starting point for algebra mastery'
        },
        {
            id: 2,
            name: 'Polynomial Operations Track',
            topic: 'polynomial_operations',
            difficulty: 'Medium',
            icon: FaSortNumericUp,
            iconColor: 'text-blue-500',
            description: 'Add, subtract, multiply, and divide polynomials. Learn advanced manipulation techniques.',
            recommended: false,
            reason: 'Build on your simplification skills'
        },
        {
            id: 3,
            name: 'Polynomial Equations Track',
            topic: 'polynomial_equations',
            difficulty: 'Hard',
            icon: FaBolt,
            iconColor: 'text-orange-500',
            description: 'Solve complex polynomial equations using factoring, quadratic formula, and advanced algebraic techniques.',
            recommended: true,
            reason: 'Challenge yourself with equation solving'
        }
    ];

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'medium':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'hard':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const statVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 200,
                damping: 15
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-gradient-to-b from-[var(--mid-main-secondary)] via-[var(--main-color)] to-[var(--main-color)] min-h-screen pt-24 font-[Sansation]">
                {/* Hero Header */}
                <div className="px-6 md:px-16 lg:px-32 xl:px-48 pb-12 flex justify-center">
                    <motion.div
                        className="text-center flex items-center flex-col gap-3"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold pb-4 text-[var(--secondary-color)] leading-tight">
                            Your Math Journey
                        </h1>
                        <p className="text-[var(--secondary-color)] font-['Sansation'] text-lg md:text-xl leading-relaxed max-w-2xl">
                            Follow structured learning paths designed to build your mathematical skills progressively. Each track guides you through concepts with increasing complexity.
                        </p>

                        {/* User Stats */}
                        <motion.div
                            className="flex justify-between w-full"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className="flex items-center gap-2 px-4 py-3 text-white backdrop-blur-sm rounded-lg shadow-sm border border-gray-200"
                                variants={statVariants}
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                            >
                                <FaCheckCircle className="text-green-500 text-lg" />
                                <div className="text-left text-white">
                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium">Completed</p>
                                    <p className="text-sm font-bold text-[var(--secondary-color)]">
                                        {loading ? '...' : `${userStats?.completedProblems || 0}/${userStats?.totalProblems || 0}`}
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-2 px-4 py-3 text-white backdrop-blur-sm rounded-lg shadow-sm border border-gray-200"
                                variants={statVariants}
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                            >
                                <FaBullseye className="text-blue-500 text-lg" />
                                <div className="text-left">
                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium">Attempted</p>
                                    <p className="text-sm font-bold text-[var(--secondary-color)]">
                                        {loading ? '...' : (userStats?.attemptedProblems || 0)}
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-2 px-4 py-3 text-white backdrop-blur-sm rounded-lg shadow-sm border border-gray-200"
                                variants={statVariants}
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                            >
                                <FaClock className="text-orange-500 text-lg" />
                                <div className="text-left">
                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium">Time Spent</p>
                                    <p className="text-sm font-bold text-[var(--secondary-color)]">
                                        {loading ? '...' : `${Math.round(userStats?.totalTimeSpent || 0)} min`}
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-2 px-4 py-3 text-white backdrop-blur-sm rounded-lg shadow-sm border border-gray-200"
                                variants={statVariants}
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                            >
                                <FaFire className="text-red-500 text-lg" />
                                <div className="text-left">
                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium">Current Streak</p>
                                    <p className="text-sm font-bold text-[var(--secondary-color)]">
                                        {loading ? '...' : `${userStats?.currentStreak || 0} Days`}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Insights */}
                        <motion.div
                            className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <h3 className="text-lg font-bold text-[var(--secondary-color)] mb-4 flex items-center gap-2">
                                <FaChartLine className="text-[var(--accent-color)]" />
                                Your Learning Insights
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-800 mb-2">Focus Area</h4>
                                    <p className="text-sm text-blue-700">
                                        {loading ? 'Loading...' : (
                                            mostTimeTrackStats.timeSpent > 0
                                                ? `You spend the most time on ${mostTimeTrack.name} (${formatTime(mostTimeTrackStats.timeSpent)}). Consider practicing more problems in this area to improve efficiency.`
                                                : 'Start solving problems to see your focus areas!'
                                        )}
                                    </p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-1">
                                        <FaExclamationTriangle />
                                        Review Needed
                                    </h4>
                                    <p className="text-sm text-orange-700">
                                        {loading ? 'Loading...' : (
                                            mostWrongTrackStats.wrong > 0
                                                ? `${mostWrongTrack.name} has the most incorrect attempts (${mostWrongTrackStats.wrong} wrongs). Review the fundamentals and try similar problems.`
                                                : 'Keep up the great work! No incorrect attempts yet.'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Tracks Grid */}
                <div className="px-6 md:px-16 lg:px-32 xl:px-48 pb-20">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {tracks.map((track, index) => {
                            const IconComponent = track.icon;
                            const trackData = getTrackData(track.topic);
                            const progress = trackData.problems > 0 ? Math.round((trackData.completed / trackData.problems) * 100) : 0;
                            return (
                                <motion.div
                                    key={track.id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        to={`/learn?topic=${track.topic}`}
                                        className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[var(--accent-color)] flex flex-col animate-in fade-in slide-in-from-bottom-4"
                                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                                    >
                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                        {/* Track Header */}
                                        <div className="relative p-5 bg-gradient-to-br from-[var(--secondary-color)] to-[var(--mid-main-secondary)] overflow-hidden">
                                            {/* Decorative Elements */}
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10" />
                                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8" />

                                            <div className="relative flex items-start justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className={`text-3xl ${track.iconColor} bg-white/10 p-3 rounded-lg backdrop-blur-sm`}>
                                                        <IconComponent />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-white font-['Sansation'] leading-tight">
                                                            {track.name}
                                                        </h3>
                                                        {track.recommended && (
                                                            <span className="inline-block mt-1 px-2 py-1 bg-yellow-400 text-[var(--secondary-color)] text-xs font-bold rounded-full">
                                                                Recommended
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-yellow-400 p-1.5 rounded-md shadow-sm">
                                                        <FaStar className="text-[var(--secondary-color)] text-sm" />
                                                    </div>
                                                    <button
                                                        onClick={(e) => toggleBookmark(e, track.id)}
                                                        className="bg-white/20 hover:bg-white/30 p-1.5 rounded-md transition-colors duration-200"
                                                    >
                                                        {bookmarked[track.id] ? (
                                                            <FaBookmark className="text-white text-sm" />
                                                        ) : (
                                                            <FaRegBookmark className="text-white text-sm" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex justify-center">
                                                <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getDifficultyColor(track.difficulty)}`}>
                                                    {track.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Track Body */}
                                        <div className="p-5 flex-1 flex flex-col gap-4">
                                            <p className="text-[var(--secondary-color)] font-['Sansation'] text-sm leading-relaxed text-center">
                                                {track.description}
                                            </p>

                                            <div className="px-3 py-2 bg-[var(--main-color)] rounded-lg border-l-3 border-[var(--accent-color)]">
                                                <p className="text-[var(--secondary-color)] font-['Sansation'] text-xs font-medium text-center">
                                                    {track.reason}
                                                </p>
                                            </div>

                                            {/* Progress */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-semibold text-[var(--secondary-color)] font-['Sansation']">
                                                        Progress
                                                    </span>
                                                    <span className="text-xs font-semibold text-[var(--accent-color)] font-['Sansation']">
                                                        {loading ? '...' : `${trackData.completed}/${trackData.problems}`}
                                                    </span>
                                                </div>
                                                <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--light-accent-color)] rounded-full transition-all duration-700 ease-out"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Track Stats */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-gray-50 p-3 rounded-md text-center">
                                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium mb-1">Attempted</p>
                                                    <p className="text-lg font-bold text-[var(--secondary-color)]">
                                                        {loading ? '...' : trackData.attempted}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-md text-center">
                                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium mb-1">Wrong</p>
                                                    <p className="text-lg font-bold text-red-600">
                                                        {loading ? '...' : trackData.wrong}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center pt-3 border-t border-gray-100">
                                                <div className="flex items-center gap-1.5">
                                                    <FaClock className="text-[var(--mid-main-secondary)] text-xs" />
                                                    <span className="text-xs text-[var(--secondary-color)] font-['Sansation'] font-medium">
                                                        {loading ? '...' : formatTime(trackData.timeSpent)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="p-5 pt-0">
                                            <div className="flex items-center justify-center gap-2 py-3 bg-[var(--accent-color)] group-hover:bg-[var(--dark-accent-color)] rounded-lg transition-colors duration-300">
                                                <FaPlay className="text-white text-sm" />
                                                <span className="text-white font-semibold text-sm font-['Sansation']">Start Track</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Tracks;
