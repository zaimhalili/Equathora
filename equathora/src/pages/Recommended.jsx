import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaCheckCircle, FaFire, FaLightbulb, FaRocket, FaTrophy, FaBookmark, FaRegBookmark } from 'react-icons/fa';

const Recommended = () => {
    const [bookmarked, setBookmarked] = useState({});

    const toggleBookmark = (e, id) => {
        e.preventDefault();
        setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const [recommendations] = useState([
        {
            id: 1,
            topic: 'Quadratic Equations',
            difficulty: 'Medium',
            reason: 'Based on your algebra progress',
            problems: 12,
            completed: 3,
            estimatedTime: '2 hours',
            description: 'Master solving quadratic equations using factoring, completing the square, and the quadratic formula.',
            path: '/learn?topic=quadratic-equations'
        },
        {
            id: 2,
            topic: 'Trigonometric Identities',
            difficulty: 'Hard',
            reason: 'Next step in your trigonometry journey',
            problems: 15,
            completed: 0,
            estimatedTime: '3 hours',
            description: 'Learn and apply fundamental trigonometric identities to simplify expressions and solve equations.',
            path: '/learn?topic=trig-identities'
        },
        {
            id: 3,
            topic: 'Linear Functions',
            difficulty: 'Easy',
            reason: 'Strengthen your foundation',
            problems: 10,
            completed: 8,
            estimatedTime: '1 hour',
            description: 'Understand slopes, y-Sansationcepts, and graphing linear functions with confidence.',
            path: '/learn?topic=linear-functions'
        },
        {
            id: 4,
            topic: 'Derivatives',
            difficulty: 'Hard',
            reason: 'You\'re ready for calculus',
            problems: 20,
            completed: 0,
            estimatedTime: '4 hours',
            description: 'Introduction to derivatives: limits, rules, and applications in real-world problems.',
            path: '/learn?topic=derivatives'
        },
        {
            id: 5,
            topic: 'Polynomial Operations',
            difficulty: 'Medium',
            reason: 'Popular among similar learners',
            problems: 14,
            completed: 5,
            estimatedTime: '2.5 hours',
            description: 'Add, subtract, multiply, and divide polynomials. Learn about polynomial long division.',
            path: '/learn?topic=polynomial-operations'
        },
        {
            id: 6,
            topic: 'Systems of Equations',
            difficulty: 'Medium',
            reason: 'Complement your algebra skills',
            problems: 11,
            completed: 2,
            estimatedTime: '2 hours',
            description: 'Solve systems using substitution, elimination, and graphical methods.',
            path: '/learn?topic=systems-equations'
        },
        {
            id: 7,
            topic: 'Exponential Functions',
            difficulty: 'Medium',
            reason: 'Build on your function knowledge',
            problems: 13,
            completed: 1,
            estimatedTime: '2.5 hours',
            description: 'Explore exponential growth and decay, and learn to solve exponential equations.',
            path: '/learn?topic=exponential-functions'
        },
        {
            id: 8,
            topic: 'Integrals',
            difficulty: 'Hard',
            reason: 'Advanced calculus topic',
            problems: 18,
            completed: 0,
            estimatedTime: '5 hours',
            description: 'Learn integration techniques including substitution, integration by parts, and definite integrals.',
            path: '/learn?topic=integrals'
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

    const getProgressPercentage = (completed, total) => {
        return Math.round((completed / total) * 100);
    };

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
                                Curated For You
                            </span>
                            <FaLightbulb className="text-sm" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[var(--secondary-color)] via-[var(--mid-main-secondary)] to-[var(--secondary-color)] bg-clip-text text-transparent leading-tight">
                            Your Learning Path
                        </h1>
                        <p className="text-[var(--mid-main-secondary)] font-['Sansation'] text-lg md:text-xl leading-relaxed max-w-2xl">
                            Discover mathematics topics handpicked based on your progress, strengths, and learning style. Each recommendation brings you one step closer to mastery.
                        </p>

                        {/* Stats Bar */}
                        <div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                                <FaFire className="text-orange-500 text-lg" />
                                <div className="text-left">
                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium">Streak</p>
                                    <p className="text-sm font-bold text-[var(--secondary-color)]">12 Days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                                <FaTrophy className="text-yellow-500 text-lg" />
                                <div className="text-left">
                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium">Achievements</p>
                                    <p className="text-sm font-bold text-[var(--secondary-color)]">24 Earned</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                                <FaStar className="text-[var(--accent-color)] text-lg" />
                                <div className="text-left">
                                    <p className="text-xs text-[var(--mid-main-secondary)] font-medium">XP Points</p>
                                    <p className="text-sm font-bold text-[var(--secondary-color)]">1,250</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations Grid */}
                <div className="px-6 md:px-16 lg:px-32 xl:px-48 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {recommendations.map((rec, index) => (
                            <Link
                                key={rec.id}
                                to={rec.path}
                                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[var(--accent-color)] flex flex-col animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                            >
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                {/* Card Header */}
                                <div className="relative p-5 bg-gradient-to-br from-[var(--secondary-color)] to-[var(--mid-main-secondary)] overflow-hidden">
                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10" />
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8" />

                                    <div className="relative flex items-start justify-between gap-3 mb-3">
                                        <h3 className="text-xl font-bold text-white font-['Sansation'] leading-tight flex-1">
                                            {rec.topic}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            {rec.completed > 0 && (
                                                <div className="bg-yellow-400 p-1.5 rounded-md shadow-sm">
                                                    <FaStar className="text-[var(--secondary-color)] text-sm" />
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => toggleBookmark(e, rec.id)}
                                                className="bg-white/20 hover:bg-white/30 p-1.5 rounded-md transition-colors duration-200"
                                            >
                                                {bookmarked[rec.id] ? (
                                                    <FaBookmark className="text-white text-sm" />
                                                ) : (
                                                    <FaRegBookmark className="text-white text-sm" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getDifficultyColor(rec.difficulty)}`}>
                                        {rec.difficulty}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 flex flex-col gap-4">
                                    <p className="text-[var(--secondary-color)] font-['Sansation'] text-sm leading-relaxed">
                                        {rec.description}
                                    </p>

                                    <div className="px-3 py-2 bg-[var(--main-color)] rounded-lg border-l-3 border-[var(--accent-color)]">
                                        <p className="text-[var(--secondary-color)] font-['Sansation'] text-xs font-medium">
                                            {rec.reason}
                                        </p>
                                    </div>

                                    {rec.completed > 0 ? (
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold text-[var(--secondary-color)] font-['Sansation']">
                                                    Progress
                                                </span>
                                                <span className="text-xs font-semibold text-[var(--accent-color)] font-['Sansation']">
                                                    {rec.completed}/{rec.problems}
                                                </span>
                                            </div>
                                            <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--light-accent-color)] rounded-full transition-all duration-700 ease-out"
                                                    style={{ width: `${getProgressPercentage(rec.completed, rec.problems)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-2 px-3 bg-gray-50 rounded-md border border-dashed border-gray-300">
                                            <p className="text-center text-xs font-medium text-[var(--mid-main-secondary)] font-['Sansation']">
                                                Not Started
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-1.5">
                                            <FaClock className="text-[var(--mid-main-secondary)] text-xs" />
                                            <span className="text-xs text-[var(--secondary-color)] font-['Sansation'] font-medium">
                                                {rec.estimatedTime}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FaCheckCircle className="text-[var(--mid-main-secondary)] text-xs" />
                                            <span className="text-xs text-[var(--secondary-color)] font-['Sansation'] font-medium">
                                                {rec.problems} problems
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="p-5 pt-0">
                                    <div className="flex items-center justify-center gap-2 py-2.5 bg-[var(--accent-color)] group-hover:bg-[var(--dark-accent-color)] rounded-lg transition-colors duration-300">
                                        <span className="text-white font-semibold text-sm font-['Sansation']">Start Learning</span>
                                        <svg className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Recommended;
