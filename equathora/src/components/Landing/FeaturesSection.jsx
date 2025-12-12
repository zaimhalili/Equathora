import React from 'react';
import { motion } from 'framer-motion';
import GradientText from '../ui/GradientText.jsx';
import { FaBookOpen, FaChartLine, FaUsers, FaLightbulb, FaTrophy, FaFire } from 'react-icons/fa';
import Journey from '../../assets/images/journey.svg';
import Achievements from '../../assets/images/achievements.svg';
import Progress from '../../assets/images/Progress.svg';
import Teacher from '../../assets/images/teacher.svg';

const FeaturesSection = () => {
    const mainFeatures = [
        {
            icon: FaBookOpen,
            title: 'Guided practice',
            text: 'Solve curated problem sets with structured hints and clear explanations. Every problem is carefully designed to build your understanding step by step.',
        },
        {
            icon: FaChartLine,
            title: 'Progress tracking',
            text: 'Track streaks, achievements, and improvement without noisy distractions. Visualize your growth with detailed statistics and performance insights.',
        },
        {
            icon: FaUsers,
            title: 'Community learning',
            text: 'Learn alongside friends, compare leaderboards, and stay motivated. Join a supportive community of learners working towards similar goals.',
        },
    ];

    const additionalFeatures = [
        {
            icon: FaLightbulb,
            title: 'Hints & Solutions',
            text: 'Get unstuck with progressive hints and detailed step-by-step solutions.',
            bg: 'from-yellow-400 to-orange-500'
        },
        {
            icon: FaTrophy,
            title: 'Achievements',
            text: 'Unlock badges and milestones as you progress through your learning journey.',
            bg: 'from-purple-400 to-pink-500'
        },
        {
            icon: FaFire,
            title: 'Daily Streaks',
            text: 'Build consistent learning habits and maintain your momentum.',
            bg: 'from-red-400 to-orange-500'
        },
    ];

    return (
        <section className="w-full bg-white border-b border-gray-100 relative overflow-hidden flex justify-center">

            <div className="max-w-6xl px-8 py-3 md:py-20 z-10">
                <div className="flex flex-col gap-16">
                    <motion.div
                        className="flex flex-col gap-2 items-center text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <GradientText
                            className="flex text-3xl font-bold sm:text-5xl"
                            colors={['#d90429', '#2b2d42', '#d90429']}
                            animationSpeed={6}
                        >
                            Everything you need to excel
                        </GradientText>
                        <p className="text-gray-600 text-lg max-w-2xl">Powerful features designed to accelerate your math learning journey</p>
                    </motion.div>

                    {/* Main Feature Showcase */}
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <motion.div
                            className="flex-1 flex flex-col gap-8"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            {mainFeatures.map((card, index) => (
                                <motion.article
                                    key={card.title}
                                    className="flex flex-row gap-5 p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:shadow-lg transition-all hover:border-[var(--accent-color)] hover:bg-white"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ scale: 1.02, x: 10 }}
                                >
                                    <motion.div
                                        className="flex items-center justify-center w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] text-white text-2xl"
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <card.icon />
                                    </motion.div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-xl font-semibold">{card.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">{card.text}</p>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>

                        {/* Visual Element */}
                        <motion.div
                            className="flex-1 flex justify-center items-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                className="relative"
                            >
                                <div className="rounded-full"></div>
                                <img src={Teacher} alt="Learning illustration" className="relative w-full max-w-md drop-shadow-2xl" />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Additional Features Grid */}
                    <motion.div
                        className="flex flex-col md:flex-row gap-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {additionalFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="flex-1 flex flex-col gap-3 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-md transition-all"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                <motion.div
                                    className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.bg} text-white text-xl`}
                                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <feature.icon />
                                </motion.div>
                                <h4 className="text-lg font-bold text-[var(--secondary-color)]">{feature.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{feature.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
