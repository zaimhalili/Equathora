import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeedbackBanner from '../components/FeedbackBanner';
import { Link } from 'react-router-dom';
import { FaRocket, FaBug, FaStar, FaPalette, FaCode, FaCheckCircle } from 'react-icons/fa';

const SystemUpdates = () => {
    const updates = [
        {
            version: "1.3.0",
            date: "December 28, 2025",
            type: "feature",
            icon: <FaRocket className="text-xl" />,
            color: "from-blue-500 to-cyan-500",
            title: "Blog & Sharing Features",
            changes: [
                "Added new blog section to share updates and insights",
                "You can now share posts on WhatsApp, Twitter, LinkedIn, Facebook, Reddit, and Telegram",
                "Blog posts appear in your dashboard for easy access",
                "Each post shows reading time and category"
            ]
        },
        {
            version: "1.2.9",
            date: "December 27, 2025",
            type: "improvement",
            icon: <FaPalette className="text-xl" />,
            color: "from-purple-500 to-pink-500",
            title: "Faster & Smoother Experience",
            changes: [
                "Page animations are now faster and more responsive",
                "Refreshed the Apply Mentor page with better colors",
                "Improved button designs across the platform",
                "Blog page works better on mobile devices"
            ]
        },
        {
            version: "1.2.8",
            date: "December 25, 2025",
            type: "feature",
            icon: <FaCode className="text-xl" />,
            color: "from-indigo-500 to-blue-500",
            title: "Export Your Data & Easier Navigation",
            changes: [
                "Download your progress and stats as PDF or CSV files",
                "Exported files now include the Equathora logo",
                "Added next problem button to move through questions faster",
                "Math editor now clears automatically when you start a new problem"
            ]
        },
        {
            version: "1.2.7",
            date: "December 23, 2025",
            type: "improvement",
            icon: <FaStar className="text-xl" />,
            color: "from-green-500 to-teal-500",
            title: "Better Login & Security",
            changes: [
                "More secure login system to protect your account",
                "Added email verification for new accounts",
                "You can now sign in with Google",
                "Fixed issues with answer checking ignoring extra spaces"
            ]
        },
        {
            version: "1.2.3",
            date: "December 17, 2025",
            type: "improvement",
            icon: <FaStar className="text-xl" />,
            color: "from-indigo-500 to-blue-500",
            title: "Leaderboard Polish & Reporting",
            changes: [
                "Renamed leaderboards for clearer labeling",
                "Fixed the faulty report flag button",
                "Minor UI refinements across recent pages"
            ]
        },
        {
            version: "1.2.2",
            date: "December 16, 2025",
            type: "feature",
            icon: <FaRocket className="text-xl" />,
            color: "from-amber-500 to-orange-500",
            title: "Waitlist & Navigation Boosts",
            changes: [
                "Added join waitlist card directly in the dashboard",
                "Introduced next/previous problem buttons for faster practice",
                "Restyled Waitlist page with fresher layout",
                "Minor visual polish across components"
            ]
        },
        {
            version: "1.2.1",
            date: "December 14, 2025",
            type: "improvement",
            icon: <FaCode className="text-xl" />,
            color: "from-slate-500 to-gray-700",
            title: "Performance & Reliability",
            changes: [
                "Integrated Vercel Speed Insights for monitoring",
                "Updated navigation links to land on dashboard and load stats reliably",
                "Replaced faulty links with Google Form fallback in Hero section",
                "Smoothed achievements background rendering"
            ]
        },
        {
            version: "1.2.0",
            date: "December 8, 2025",
            type: "feature",
            icon: <FaRocket className="text-xl" />,
            color: "from-blue-500 to-cyan-500",
            title: "Major Feature Update",
            changes: [
                "New achievement system with badges and rewards",
                "Enhanced leaderboard with friend comparisons",
                "Improved problem filtering and search",
                "Daily challenge system with streaks"
            ]
        },
        {
            version: "1.1.5",
            date: "December 5, 2025",
            type: "improvement",
            icon: <FaStar className="text-xl" />,
            color: "from-purple-500 to-pink-500",
            title: "UI/UX Improvements",
            changes: [
                "Redesigned navigation with better accessibility",
                "More responsive layout across all devices",
                "Updated color scheme for better readability",
                "Smoother animations and transitions"
            ]
        },
        {
            version: "1.1.4",
            date: "December 1, 2025",
            type: "bugfix",
            icon: <FaBug className="text-xl" />,
            color: "from-red-500 to-orange-500",
            title: "Bug Fixes & Performance",
            changes: [
                "Fixed timer not pausing correctly",
                "Resolved issue with favorite problems not saving",
                "Improved page load times by 40%",
                "Fixed notification badge count accuracy"
            ]
        },
        {
            version: "1.1.0",
            date: "November 20, 2025",
            type: "feature",
            icon: <FaPalette className="text-xl" />,
            color: "from-green-500 to-teal-500",
            title: "Design System Update",
            changes: [
                "New consistent design patterns across pages",
                "Updated dashboard with better information hierarchy",
                "Refined card layouts and shadows",
                "Improved mobile navigation experience"
            ]
        },
        {
            version: "1.0.5",
            date: "November 15, 2025",
            type: "improvement",
            icon: <FaCode className="text-xl" />,
            color: "from-indigo-500 to-blue-500",
            title: "Technical Improvements",
            changes: [
                "Added button to switch problems quicker",
                "Better error handling and user feedback",
                "Improved data caching for faster loading"
            ]
        }
    ];

    const getTypeStyle = (type) => {
        switch (type) {
            case 'feature':
                return 'bg-blue-100 text-blue-700';
            case 'improvement':
                return 'bg-purple-100 text-purple-700';
            case 'bugfix':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <>
            <FeedbackBanner />
            <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 font-[Inter]">
                <header>
                    <Navbar />
                </header>

                {/* Hero Section */}
                <section className="w-full flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="px-[4vw] xl:px-[6vw] py-12 max-w-[1500px] w-full"
                    >
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl">🔔</span>
                                <h1 className="text-4xl font-bold text-[var(--secondary-color)] font-[DynaPuff]">
                                    System Updates
                                </h1>
                            </div>
                            <p className="text-base text-gray-600 max-w-2xl">
                                Stay informed about the latest features, improvements, and bug fixes in Equathora
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Updates Timeline */}
                <section className="w-full flex justify-center">
                    <div className="px-[4vw] xl:px-[6vw] pb-12 max-w-[1500px] w-full">
                        <motion.div className="flex flex-col gap-4">
                            {updates.map((update, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45, delay: 0.1 * index }}
                                    className="bg-white rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className="flex items-start gap-4 p-6 pb-4">
                                        <div className={`bg-gradient-to-br ${update.color} p-3 rounded-md text-white flex-shrink-0`}>
                                            {update.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 pb-2">
                                                <h2 className="text-xl font-bold text-[var(--secondary-color)]">
                                                    {update.title}
                                                </h2>
                                                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getTypeStyle(update.type)}`}>
                                                    {update.type === 'bugfix' ? 'Bug Fix' : update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="font-semibold">{update.version}</span>
                                                <span>•</span>
                                                <span>{update.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Changes List */}
                                    <div className="px-6 pb-6">
                                        <ul className="flex flex-col gap-2">
                                            {update.changes.map((change, changeIndex) => (
                                                <li key={changeIndex} className="flex items-start gap-2 text-gray-700 text-sm">
                                                    <FaCheckCircle className="text-green-500 flex-shrink-0 text-base pt-0.5" />
                                                    <span>{change}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Subscribe Section */}
                        <div className="pt-8">
                            <div className="bg-gradient-to-br from-[var(--secondary-color)] to-[#3a3d52] rounded-md p-8 text-center text-white shadow-[0_10px_10px_rgba(141,153,174,0.3)]">
                                <h3 className="text-2xl font-bold pb-3 font-[DynaPuff]">Stay Updated</h3>
                                <p className="text-gray-300 text-base pb-4">
                                    Get notified about new features and updates directly in your notifications
                                </p>
                                {/* <div className="flex items-center justify-center gap-2 text-sm">
                                    <FaCheckCircle className="text-green-400" />
                                    <span>You're already subscribed to update notifications</span>
                                </div> */}
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <span>Are you subscribed to our newsletter? </span>
                                    <Link to="/waitlist" className='!text-yellow-500 !underline hover:!text-yellow-400' title='Subscribe to our waitlist now for free!'>Click to Join</Link>
                                    <FaCheckCircle className="text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer>
                    <Footer />
                </footer>
            </div>
        </>
    );
};

export default SystemUpdates;
