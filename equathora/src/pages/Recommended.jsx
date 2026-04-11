import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaCheckCircle, FaFire, FaLightbulb } from 'react-icons/fa';
import { FaRocket, FaTrophy, FaBookmark, FaRegBookmark } from 'react-icons/fa';

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
            description: 'Understand slopes, y-Interceptions, and graphing linear functions with confidence.',
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
            <Footer/>
        </>
    );
}

export default Recommended;
