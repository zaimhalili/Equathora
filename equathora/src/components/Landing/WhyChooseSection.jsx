import React from 'react';
import { motion } from 'framer-motion';
import GradientText from '../ui/GradientText.jsx';
import { FaRocket, FaCheckCircle, FaTrophy, FaLightbulb } from 'react-icons/fa';
import JourneyImg from '../../assets/images/journey.jpg';

const WhyChooseSection = () => {
    const features = [
        {
            icon: FaRocket,
            title: 'Structured Learning Path',
            text: 'Unlike scattered practice problems, Equathora offers organized tracks that guide you from fundamentals to advanced concepts.',
        },
        {
            icon: FaCheckCircle,
            title: 'Instant Feedback',
            text: 'Get immediate validation of your solutions with detailed explanations. Learn from mistakes in real-time.',
        },
        {
            icon: FaTrophy,
            title: 'Gamified Experience',
            text: 'Earn achievements, maintain streaks, and climb leaderboards. Turn learning into an engaging experience.',
        },
        {
            icon: FaLightbulb,
            title: 'Clean & Focused',
            text: 'No ads, no clutter, no distractions. A minimalist interface that lets you focus entirely on learning.',
        },
    ];

    return (
        <section className="w-full bg-gray-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--accent-color)] to-transparent opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[var(--secondary-color)] to-transparent opacity-5 rounded-full blur-3xl"></div>

            <div className="max-w-6xl px-8 py-24 relative z-10" style={{ margin: '0 auto' }}>
                <div className="flex flex-col gap-16">
                    <motion.div
                        className="flex flex-col gap-4 text-center text-3xl font-bold sm:text-4xl text-[var(--secondary-color]"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Why choose Equathora?
                        <p className="text-gray-600 text-lg">Built differently for better results</p>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Image section */}
                        <motion.div
                            className="flex-1 flex justify-center"
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] opacity-10 blur-2xl rounded-3xl"></div>
                                <img src={JourneyImg} alt="Learning journey" className="relative w-full max-w-lg drop-shadow-xl rounded-2xl shadow-2xl object-cover" />
                            </motion.div>
                        </motion.div>

                        {/* Features grid */}
                        <motion.div
                            className="flex-1 flex flex-col gap-6"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            {features.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    className="flex flex-row gap-4 p-5 bg-white hover:translate-x-2 hover:scale-102 rounded-xl border border-gray-200 hover:border-[var(--accent-color)] hover:shadow-lg transition-all"
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <motion.div
                                        className="flex items-center justify-center w-12 h-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] text-white text-xl"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <item.icon />
                                    </motion.div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-lg font-bold text-[var(--secondary-color)]">{item.title}</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm">{item.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
