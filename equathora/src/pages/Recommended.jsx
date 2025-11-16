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
      <div className="bg-[var(--main-color)] min-h-screen">
        {/* Header */}
        <div className="px-6 md:px-16 lg:px-24 pt-8 pb-6">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--secondary-color)] font-['Public_Sans'] mb-3">
            Recommended for You
          </h1>
          <p className="text-[var(--mid-main-secondary)] font-['Inter'] text-base">
            Personalized topic recommendations based on your learning progress and interests
          </p>
        </div>

        {/* Recommendations Grid */}
        <div className="px-6 md:px-16 lg:px-24 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <Link
                key={rec.id}
                to={rec.path}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-[var(--accent-color)] flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-[var(--secondary-color)] font-['Public_Sans'] flex-1">
                    {rec.topic}
                  </h3>
                  {rec.completed > 0 && (
                    <FaStar className="text-yellow-500 text-lg flex-shrink-0 ml-2" />
                  )}
                </div>

                {/* Difficulty Badge */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(rec.difficulty)}`}>
                    {rec.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[var(--secondary-color)] font-['Inter'] text-sm leading-relaxed mb-4 flex-1">
                  {rec.description}
                </p>

                {/* Reason */}
                <div className="mb-4 p-3 bg-[var(--main-color)] rounded-lg">
                  <p className="text-[var(--mid-main-secondary)] font-['Inter'] text-xs italic">
                    💡 {rec.reason}
                  </p>
                </div>

                {/* Progress Bar */}
                {rec.completed > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[var(--secondary-color)] font-['Inter']">
                        Progress
                      </span>
                      <span className="text-xs font-semibold text-[var(--accent-color)] font-['Inter']">
                        {rec.completed}/{rec.problems} problems
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[var(--accent-color)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(rec.completed, rec.problems)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-[var(--mid-main-secondary)] text-sm" />
                    <span className="text-sm text-[var(--mid-main-secondary)] font-['Inter']">
                      {rec.estimatedTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-[var(--mid-main-secondary)] text-sm" />
                    <span className="text-sm text-[var(--mid-main-secondary)] font-['Inter']">
                      {rec.problems} problems
                    </span>
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
