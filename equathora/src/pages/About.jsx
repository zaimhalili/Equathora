import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import { FaGithub, FaCode, FaLightbulb, FaUsers, FaRocket, FaChartLine } from 'react-icons/fa';

const About = () => {
    return (
        <>
            <FeedbackBanner />
            <div className="w-full bg-white min-h-screen">
                <Navbar />
                <main className="w-full flex flex-col items-center">
                    {/* Hero - Full Width Clean */}
                    <section className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw] py-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full flex flex-col items-center text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold font-[Sansation] pb-4">
                                <span className="bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">About Equathora</span>
                            </h1>
                            <p className="text-base text-gray-600 font-[Sansation] max-w-2xl leading-relaxed">
                                Where equations meet time, a platform built for mathematical mastery in 2025
                            </p>
                        </motion.div>
                    </section>

                    {/* Stats - Horizontal Bar */}
                    <section className="w-full flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw] py-4"
                        >
                            <div className="w-full bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] rounded-2xl p-6 flex flex-wrap justify-around items-center gap-4 text-white shadow-lg">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="text-2xl font-bold text-white">100+</div>
                                    <div className="text-sm text-white opacity-90">Practice Problems</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="text-2xl font-bold text-white">30+</div>
                                    <div className="text-sm text-white opacity-90">Achievements</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="text-2xl font-bold text-white">10+</div>
                                    <div className="text-sm text-white opacity-90">Math Topics</div>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* Story - Two Column Layout */}
                    <section className="w-full flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw] py-8"
                        >
                            <div className="w-full flex flex-col lg:flex-row gap-12">
                                {/* Left Column */}
                                <div className="lg:w-1/2">
                                    <div className="flex items-center gap-3 pb-6">
                                        <FaLightbulb className="text-3xl text-[var(--accent-color)]" />
                                        <h2 className="text-3xl font-bold text-[var(--secondary-color)] font-[Sansation]">
                                            The Name
                                        </h2>
                                    </div>
                                    <div className="space-y-6 text-gray-700">
                                        <div className="border-l-2 border-gray-300 pl-6">
                                            <div className="text-xl font-bold text-[var(--accent-color)] pb-2">Equat-</div>
                                            <p className="text-base leading-relaxed">From "Equation"-the foundation of mathematical thinking and problem-solving</p>
                                        </div>
                                        <div className="border-l-2 border-gray-300 pl-6">
                                            <div className="text-xl font-bold text-[var(--accent-color)] pb-2">-hora</div>
                                            <p className="text-base leading-relaxed">Greek "ὥρα" meaning time and hour, representing your dedication to learning</p>
                                        </div>
                                        <div className="border-l-2 border-[var(--accent-color)] pl-6">
                                            <div className="text-2xl font-bold bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] bg-clip-text text-transparent pb-2">Equathora</div>
                                            <p className="text-base leading-relaxed font-medium">Time invested in mastering mathematical equations</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="lg:w-1/2">
                                    <h2 className="text-3xl font-bold text-[var(--secondary-color)] font-[Sansation] pb-6">
                                        Why <span className="text-[var(--accent-color)]">Red</span>?
                                    </h2>
                                    <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                                        <p>
                                            Red is the color of <span className="font-semibold text-[var(--accent-color)]">focus and urgency</span>. In mathematics, red marks highlight what matters most: the key concepts, critical steps, and important corrections that drive learning <strong>forward.</strong>
                                        </p>
                                        <p>
                                            Throughout history, red has signaled <strong>importance</strong>: from red ink in ancient manuscripts to the red pen every teacher uses. It draws attention, demands <strong>precision</strong>, and marks the moments where understanding crystallizes.
                                        </p>
                                        <p className="font-medium text-[var(--secondary-color)] border-l-2 border-[var(--accent-color)] pl-4">
                                            Red represents <strong>clarity</strong>, emphasis, and the decisive moments of mathematical insight.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* Platform strengths */}
                    <section className="w-full flex justify-center bg-[#fafbfc]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw] py-10"
                        >
                            <div className="flex flex-col items-center justify-center w-full pb-8">
                                <h2 className="text-3xl font-bold text-[var(--secondary-color)] font-[Sansation] pb-3">
                                    What Equathora does best
                                </h2>
                                <p className="text-base text-gray-600 leading-relaxed max-w-3xl text-center">
                                    Practice-first learning designed to build real mathematical confidence. The platform focuses on clarity, progression, and measurable improvement.
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="p-6 bg-white rounded border border-gray-100 transition-all duration-200 hover:shadow-xl">
                                    <FaChartLine className="text-3xl text-[var(--accent-color)]" />
                                    <h3 className="text-lg font-bold text-[var(--secondary-color)] mt-4">Adaptive practice</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mt-2">
                                        Problems evolve with your skill level so you always train at the right difficulty.
                                    </p>
                                </div>
                                <div className="p-6 bg-white rounded border border-gray-100 transition-all duration-200 hover:shadow-xl">
                                    <FaLightbulb className="text-3xl text-[var(--accent-color)]" />
                                    <h3 className="text-lg font-bold text-[var(--secondary-color)] mt-4">Guided solutions</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mt-2">
                                        Clear explanations and structured hints help you learn the method, not just the answer.
                                    </p>
                                </div>
                                <div className="p-6 bg-white rounded border border-gray-100 transition-all duration-200 hover:shadow-xl">
                                    <FaRocket className="text-3xl text-[var(--accent-color)]" />
                                    <h3 className="text-lg font-bold text-[var(--secondary-color)] mt-4">Progress insights</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mt-2">
                                        Track growth, spot weak areas, and stay motivated with focused progress metrics.
                                    </p>
                                </div>
                                <div className="p-6 bg-white rounded border border-gray-100 transition-all duration-200 hover:shadow-xl">
                                    <FaUsers className="text-3xl text-[var(--accent-color)]" />
                                    <h3 className="text-lg font-bold text-[var(--secondary-color)] mt-4">Achievement flow</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mt-2">
                                        Earn badges and milestones that celebrate consistency and mastery.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* Mission - Full Width Text Block */}
                    <section className="w-full flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw] py-8"
                        >
                            <div className="w-full flex flex-col items-center text-center">
                                <h2 className="text-3xl font-bold text-[var(--secondary-color)] font-[Sansation] pb-6">
                                    Our Mission
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                                    Transform how students approach mathematics, not as a subject to fear, but as a journey of discovery. We provide an Sansationactive platform where learners build confidence through step-by-step guidance and achievement-based motivation.
                                </p>
                            </div>
                        </motion.div>
                    </section>

                    {/* Features - Bento Grid Style */}
                    <section className="w-full flex justify-center bg-gradient-to-b from-gray-50 to-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw] py-8"
                        >
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] font-[Sansation] pb-6 text-center">
                                What Makes Us Different
                            </h2>
                            <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { icon: <FaCode className="text-4xl text-[var(--accent-color)]" />, title: 'Math Editor', desc: 'Natural LaTeX input with real-time preview' },
                                    { icon: <FaLightbulb className="text-4xl text-[var(--accent-color)]" />, title: 'Smart Hints', desc: 'Progressive guidance that adapts to your level' },
                                    { icon: <FaRocket className="text-4xl text-[var(--accent-color)]" />, title: 'Achievements', desc: 'Track progress with meaningful milestones' },
                                    { icon: <FaUsers className="text-4xl text-[var(--accent-color)]" />, title: 'Mentorship', desc: 'Expert support when you need it most' },
                                    { icon: <FaChartLine className="text-4xl text-[var(--accent-color)]" />, title: '100+ Problems', desc: 'Curated library across many topics' },
                                    { icon: <FaRocket className="text-4xl text-[var(--accent-color)]" />, title: 'Leaderboards', desc: 'Compete globally, grow together' }
                                ].map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.6 + idx * 0.05 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl"
                                    >
                                        <div className="pb-3">{feature.icon}</div>
                                        <h3 className="text-lg font-bold text-[var(--secondary-color)] pb-2">{feature.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    {/* CTA - Centered Simple */}
                    <section className="w-full flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw] py-8"
                        >
                            <div className="w-full flex flex-col items-center text-center">
                                <h2 className="text-3xl font-bold text-[var(--secondary-color)] font-[Sansation] pb-4">
                                    Ready to Start Learning?
                                </h2>
                                <p className="text-base text-gray-600 pb-6 max-w-2xl">
                                    Join students mastering mathematics through Sansationactive problem-solving
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        to="/signup"
                                        className="px-8 py-3 bg-[var(--accent-color)] text-white rounded-full font-semibold hover:bg-[var(--dark-accent-color)] transition-all duration-200 shadow-lg shadow-[var(--accent-color)]/30 no-underline text-center text-base"
                                    >
                                        Get Started Free
                                    </Link>
                                    <Link
                                        to="/learn"
                                        className="px-8 py-3 bg-white !text-[var(--secondary-color)] border-2 border-[var(--secondary-color)] rounded-full font-semibold transition-all duration-200 hover:bg-[var(--secondary-color)] hover:!text-white no-underline text-center text-base"
                                    >
                                        Explore Problems
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default About;
