import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaCheckCircle } from 'react-icons/fa';

const Recommended = () => {
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
            description: 'Understand slopes, y-intercepts, and graphing linear functions with confidence.',
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
            <div className="bg-gradient-to-br from-[var(--main-color)] via-white to-[var(--main-color)] min-h-screen">
                {/* Hero Header */}
                <div className="relative px-6 md:px-16 lg:px-32 xl:px-48 pt-16 pb-12">
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzAwMCIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')]" />
                    <div className="relative max-w-4xl">
                        <div className="inline-block px-4 py-2 mb-5 bg-[var(--accent-color)] bg-opacity-10 rounded-full border-2 border-[var(--accent-color)]">
                            <span className="text-[var(--accent-color)] font-bold text-sm uppercase tracking-wider font-['Public_Sans']">
                                Curated For You
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--secondary-color)] font-['Public_Sans'] mb-6 leading-tight">
                            Your Learning<br />Path Awaits
                        </h1>
                        <p className="text-[var(--mid-main-secondary)] font-['Inter'] text-lg md:text-xl leading-relaxed max-w-2xl">
                            Discover mathematics topics handpicked based on your progress, strengths, and learning style. Each recommendation brings you one step closer to mastery.
                        </p>
                    </div>
                </div>

                {/* Recommendations Grid */}
                <div className="px-6 md:px-16 lg:px-32 xl:px-48 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {recommendations.map((rec) => (
                            <Link
                                key={rec.id}
                                to={rec.path}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[var(--accent-color)] hover:scale-105 flex flex-col"
                            >
                                {/* Card Header with Gradient */}
                                <div className="relative p-6 pb-4 bg-gradient-to-br from-[var(--secondary-color)] to-[var(--mid-main-secondary)]">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12" />

                                    <div className="relative flex items-start justify-between">
                                        <h3 className="text-2xl font-bold text-white font-['Public_Sans'] flex-1 leading-snug">
                                            {rec.topic}
                                        </h3>
                                        {rec.completed > 0 && (
                                            <div className="flex-shrink-0 ml-3">
                                                <div className="bg-yellow-400 p-2 rounded-lg">
                                                    <FaStar className="text-[var(--secondary-color)] text-base" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Difficulty Badge */}
                                    <div className="mt-4">
                                        <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border-2 ${getDifficultyColor(rec.difficulty)}`}>
                                            {rec.difficulty}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex-1 flex flex-col">
                                    {/* Description */}
                                    <p className="text-[var(--secondary-color)] font-['Inter'] text-sm leading-relaxed mb-5 flex-1">
                                        {rec.description}
                                    </p>

                                    {/* Reason Badge */}
                                    <div className="mb-5 px-4 py-3 bg-gradient-to-r from-[var(--main-color)] to-blue-50 rounded-xl border-l-4 border-[var(--accent-color)]">
                                        <p className="text-[var(--secondary-color)] font-['Inter'] text-xs font-semibold">
                                            {rec.reason}
                                        </p>
                                    </div>

                                    {/* Progress Bar */}
                                    {rec.completed > 0 ? (
                                        <div className="mb-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold text-[var(--secondary-color)] font-['Public_Sans'] uppercase tracking-wide">
                                                    Your Progress
                                                </span>
                                                <span className="text-xs font-bold text-[var(--accent-color)] font-['Inter']">
                                                    {getProgressPercentage(rec.completed, rec.problems)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-[var(--accent-color)] to-[var(--light-accent-color)] h-3 rounded-full transition-all duration-500 shadow-sm"
                                                    style={{ width: `${getProgressPercentage(rec.completed, rec.problems)}%` }}
                                                />
                                            </div>
                                            <div className="mt-2 text-xs text-[var(--mid-main-secondary)] font-['Inter']">
                                                {rec.completed} of {rec.problems} problems solved
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-5 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                            <p className="text-center text-xs font-semibold text-[var(--mid-main-secondary)] font-['Inter']">
                                                Start your journey
                                            </p>
                                        </div>
                                    )}

                                    {/* Footer Info */}
                                    <div className="grid grid-cols-2 gap-4 pt-5 border-t-2 border-gray-100">
                                        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                                            <FaClock className="text-blue-600 text-lg mb-2" />
                                            <span className="text-xs font-bold text-[var(--secondary-color)] font-['Inter']">
                                                {rec.estimatedTime}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                                            <FaCheckCircle className="text-green-600 text-lg mb-2" />
                                            <span className="text-xs font-bold text-[var(--secondary-color)] font-['Inter']">
                                                {rec.problems} problems
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Effect Arrow */}
                                <div className="px-6 pb-6">
                                    <div className="flex items-center justify-center py-3 bg-[var(--accent-color)] group-hover:bg-[var(--dark-accent-color)] rounded-lg transition-all duration-300">
                                        <span className="text-white font-bold text-sm font-['Public_Sans'] mr-2">Explore Topic</span>
                                        <svg className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
