import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaCheckCircle, FaFire, FaLightbulb } from 'react-icons/fa';
import { FaRocket, FaTrophy, FaBookmark, FaRegBookmark, FaChartLine } from 'react-icons/fa';
import { FaBullseye, FaExclamationTriangle, FaPlay, FaCalculator, FaRulerCombined, FaBolt, FaSortNumericUp, FaLink, FaChartBar, FaSquareRootAlt, FaInfinity } from 'react-icons/fa';

const Tracks = () => {
    const [bookmarked, setBookmarked] = useState({});

    const toggleBookmark = (e, id) => {
        e.preventDefault();
        setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const [tracks] = useState([
        {
            id: 1,
            name: 'Quadratic Equations Track',
            topic: 'quadratic-equations',
            difficulty: 'Medium',
            icon: FaSquareRootAlt,
            iconColor: 'text-blue-500',
            description: 'Master solving quadratic equations using factoring, completing the square, and the quadratic formula.',
            problems: 12,
            completed: 3,
            attempted: 5,
            wrong: 2,
            timeSpent: '2.5 hours',
            progress: 25,
            streak: 3,
            recommended: true,
            reason: 'Based on your algebra progress'
        },
        {
            id: 2,
            name: 'Trigonometric Identities Track',
            topic: 'trig-identities',
            difficulty: 'Hard',
            icon: FaRulerCombined,
            iconColor: 'text-purple-500',
            description: 'Learn and apply fundamental trigonometric identities to simplify expressions and solve equations.',
            problems: 15,
            completed: 0,
            attempted: 2,
            wrong: 2,
            timeSpent: '1 hour',
            progress: 0,
            streak: 0,
            recommended: false,
            reason: 'Next step in your trigonometry journey'
        },
        {
            id: 3,
            name: 'Linear Functions Track',
            topic: 'linear-functions',
            difficulty: 'Easy',
            icon: FaChartLine,
            iconColor: 'text-green-500',
            description: 'Understand slopes, intercepts, and graphing linear functions with confidence.',
            problems: 10,
            completed: 8,
            attempted: 9,
            wrong: 1,
            timeSpent: '45 minutes',
            progress: 80,
            streak: 5,
            recommended: false,
            reason: 'Strengthen your foundation'
        },
        {
            id: 4,
            name: 'Derivatives Track',
            topic: 'derivatives',
            difficulty: 'Hard',
            icon: FaBolt,
            iconColor: 'text-yellow-500',
            description: 'Introduction to derivatives: limits, rules, and applications in real-world problems.',
            problems: 20,
            completed: 0,
            attempted: 0,
            wrong: 0,
            timeSpent: '0 minutes',
            progress: 0,
            streak: 0,
            recommended: true,
            reason: 'You\'re ready for calculus'
        },
        {
            id: 5,
            name: 'Polynomial Operations Track',
            topic: 'polynomial-operations',
            difficulty: 'Medium',
            icon: FaSortNumericUp,
            iconColor: 'text-indigo-500',
            description: 'Add, subtract, multiply, and divide polynomials. Learn about polynomial long division.',
            problems: 14,
            completed: 5,
            attempted: 7,
            wrong: 2,
            timeSpent: '1.5 hours',
            progress: 36,
            streak: 2,
            recommended: false,
            reason: 'Popular among similar learners'
        },
        {
            id: 6,
            name: 'Systems of Equations Track',
            topic: 'systems-equations',
            difficulty: 'Medium',
            icon: FaLink,
            iconColor: 'text-cyan-500',
            description: 'Solve systems using substitution, elimination, and graphical methods.',
            problems: 11,
            completed: 2,
            attempted: 4,
            wrong: 2,
            timeSpent: '1 hour',
            progress: 18,
            streak: 1,
            recommended: false,
            reason: 'Complement your algebra skills'
        },
        {
            id: 7,
            name: 'Exponential Functions Track',
            topic: 'exponential-functions',
            difficulty: 'Medium',
            icon: FaChartBar,
            iconColor: 'text-orange-500',
            description: 'Explore exponential growth and decay, and learn to solve exponential equations.',
            problems: 13,
            completed: 1,
            attempted: 3,
            wrong: 2,
            timeSpent: '50 minutes',
            progress: 8,
            streak: 0,
            recommended: false,
            reason: 'Build on your function knowledge'
        },
        {
            id: 8,
            name: 'Integrals Track',
            topic: 'integrals',
            difficulty: 'Hard',
            icon: FaInfinity,
            iconColor: 'text-pink-500',
            description: 'Learn integration techniques including substitution, integration by parts, and definite integrals.',
            problems: 18,
            completed: 0,
            attempted: 0,
            wrong: 0,
            timeSpent: '0 minutes',
            progress: 0,
            streak: 0,
            recommended: true,
            reason: 'Advanced calculus topic'
        }
    ]);

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

    // Calculate user insights
    const totalProblems = tracks.reduce((sum, track) => sum + track.problems, 0);
    const completedProblems = tracks.reduce((sum, track) => sum + track.completed, 0);
    const attemptedProblems = tracks.reduce((sum, track) => sum + track.attempted, 0);
    const wrongProblems = tracks.reduce((sum, track) => sum + track.wrong, 0);
    const totalTimeSpent = tracks.reduce((sum, track) => {
        const time = parseFloat(track.timeSpent.split(' ')[0]);
        return sum + (track.timeSpent.includes('hour') ? time * 60 : time);
    }, 0);

    // Find track with most time spent
    const mostTimeTrack = tracks.reduce((max, track) => {
        const time = parseFloat(track.timeSpent.split(' ')[0]);
        return time > parseFloat(max.timeSpent.split(' ')[0]) ? track : max;
    });

    // Find track with most wrongs
    const mostWrongTrack = tracks.reduce((max, track) => track.wrong > max.wrong ? track : max);

    return (
        <>
            <Navbar />
            <div className="bg-gradient-to-b from-[var(--mid-main-secondary)] via-[var(--main-color)] to-[var(--main-color)] min-h-screen pt-24">
                {/* Hero Header */}
                <div className="px-6 md:px-16 lg:px-32 xl:px-48 pb-12">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 mb-4 px-5 py-2.5 bg-gradient-to-r from-[var(--accent-color)] to-[var(--light-accent-color)] text-white rounded-full shadow-lg animate-pulse">
                            <FaRocket className="text-sm" />
                            <span className="text-xs font-bold uppercase tracking-wider">
                                Learning Tracks
                            </span>
                            <FaLightbulb className="text-sm" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[var(--secondary-color)] via-[var(--mid-main-secondary)] to-[var(--secondary-color)] bg-clip-text text-transparent leading-tight">
                            Your Math Journey
                        </h1>
                        <p className="text-[var(--mid-main-secondary)] font-['Sansation'] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                            Follow structured learning paths designed to build your mathematical skills progressively. Each track guides you through concepts with increasing complexity.
                        </p>

                        {/* User Stats */}
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                                <FaCheckCircle className="text-green-500 text-lg" />
                                <div className="text-left">
                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium">Completed</p>
                                    <p className="text-sm font-bold text-[var(--secondary-color)]">{completedProblems}/{totalProblems}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                                <FaBullseye className="text-blue-500 text-lg" />
                                <div className="text-left">
                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium">Attempted</p>
                                    <p className="text-sm font-bold text-[var(--secondary-color)]">{attemptedProblems}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                                <FaClock className="text-orange-500 text-lg" />
                                <div className="text-left">
                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium">Time Spent</p>
                                    <p className="text-sm font-bold text-[var(--secondary-color)]">{Math.round(totalTimeSpent)} min</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                                <FaFire className="text-red-500 text-lg" />
                                <div className="text-left">
                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium">Current Streak</p>
                                    <p className="text-sm font-bold text-[var(--secondary-color)]">12 Days</p>
                                </div>
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 max-w-4xl mx-auto">
                            <h3 className="text-lg font-bold text-[var(--secondary-color)] mb-4 flex items-center gap-2">
                                <FaChartLine className="text-[var(--accent-color)]" />
                                Your Learning Insights
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-800 mb-2">Focus Area</h4>
                                    <p className="text-sm text-blue-700">
                                        You spend the most time on <strong>{mostTimeTrack.name}</strong> ({mostTimeTrack.timeSpent}).
                                        Consider practicing more problems in this area to improve efficiency.
                                    </p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-1">
                                        <FaExclamationTriangle />
                                        Review Needed
                                    </h4>
                                    <p className="text-sm text-orange-700">
                                        <strong>{mostWrongTrack.name}</strong> has the most incorrect attempts ({mostWrongTrack.wrong} wrongs).
                                        Review the fundamentals and try similar problems.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tracks Grid */}
                <div className="px-6 md:px-16 lg:px-32 xl:px-48 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {tracks.map((track, index) => {
                            const IconComponent = track.icon;
                            return (
                                <Link
                                    key={track.id}
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
                                                    {track.completed}/{track.problems}
                                                </span>
                                            </div>
                                            <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--light-accent-color)] rounded-full transition-all duration-700 ease-out"
                                                    style={{ width: `${track.progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Track Stats */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 p-3 rounded-md text-center">
                                                <p className="text-xs text-[var(--mid-main-secondary)] font-medium mb-1">Attempted</p>
                                                <p className="text-lg font-bold text-[var(--secondary-color)]">{track.attempted}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-md text-center">
                                                <p className="text-xs text-[var(--mid-main-secondary)] font-medium mb-1">Wrong</p>
                                                <p className="text-lg font-bold text-red-600">{track.wrong}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-1.5 flex-1 justify-center">
                                                <FaClock className="text-[var(--mid-main-secondary)] text-xs" />
                                                <span className="text-xs text-[var(--secondary-color)] font-['Sansation'] font-medium">
                                                    {track.timeSpent}
                                                </span>
                                            </div>
                                            <div className="w-px h-4 bg-gray-200"></div>
                                            <div className="flex items-center gap-1.5 flex-1 justify-center">
                                                <FaTrophy className="text-[var(--mid-main-secondary)] text-xs" />
                                                <span className="text-xs text-[var(--secondary-color)] font-['Sansation'] font-medium">
                                                    Streak: {track.streak}
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
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Tracks;
