import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaClock, FaCode, FaFire, FaLightbulb, FaRocket, FaTrophy, FaUsers } from 'react-icons/fa';
import ScrollReveal from '../ScrollReveal';

const AboutFeaturesSection = () => {
    return (
        <section className="w-full flex justify-center bg-gradient-to-b from-[var(--main-color)] via-[var(--white)] to-[var(--main-color)] py-20 overflow-hidden">
            <div className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw] flex flex-col justify-center items-center">
                <ScrollReveal direction="up">
                    <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--secondary-color)] pb-16 text-center">
                        What Makes Us <span className="text-transparent bg-clip-text bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]">Different</span>
                    </h2>
                </ScrollReveal>

                <div className="w-full flex flex-wrap gap-4">
                    <ScrollReveal direction="left" delay={0} className="w-full md:w-[calc(50%-0.5rem)] min-h-[360px]">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="group relative bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] rounded-md overflow-hidden shadow-2xl cursor-pointer flex flex-col justify-between p-8 h-full theme-lock"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <motion.div
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{ type: 'spring', stiffness: 300, duration: 0.8 }}
                                    className="flex items-center justify-center w-16 h-16 bg-[var(--white)]/20 backdrop-blur-sm rounded-md"
                                >
                                    <FaCode className="text-[var(--white)] text-3xl" />
                                </motion.div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black text-[var(--white)]">Math Editor</h3>
                                    <p className="text-[var(--white)]/90 text-sm md:text-base leading-relaxed">
                                        Natural LaTeX input with real-time preview. Write equations as easily as you think them.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.1} className="w-full md:w-[calc(50%-0.5rem)] min-h-[360px]">
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="group bg-[var(--white)] rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[var(--mid-main-secondary)] hover:border-[var(--accent-color)]/30 relative overflow-hidden p-8 h-full flex flex-col justify-between"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--accent-color)]/10 to-transparent rounded-bl-full"></div>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 12 }}
                                className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] rounded-md relative z-10"
                            >
                                <FaLightbulb className="text-[var(--white)] text-3xl" />
                            </motion.div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-[var(--secondary-color)] group-hover:text-[var(--accent-color)] transition-colors">Smart Hints</h3>
                                <p className="text-sm md:text-base text-[var(--mid-main-secondary)] leading-relaxed">Progressive guidance that adapts to your level</p>
                            </div>
                        </motion.div>
                    </ScrollReveal>

                    <ScrollReveal direction="right" delay={0.15} className="w-full md:w-[calc(33.333%-0.67rem)] min-h-[360px]">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="group bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden p-8 h-full flex flex-col justify-between theme-lock"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                                transition={{ duration: 0.5 }}
                                className="flex items-center justify-center w-16 h-16 bg-[var(--white)]/30 backdrop-blur-sm rounded-md relative z-10"
                            >
                                <FaRocket className="text-[var(--white)] text-3xl" />
                            </motion.div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-[var(--white)] relative z-10">Achievements</h3>
                                <p className="text-[var(--white)]/90 text-sm md:text-base leading-relaxed relative z-10">Track progress with meaningful milestones</p>
                            </div>
                        </motion.div>
                    </ScrollReveal>

                    <ScrollReveal direction="left" delay={0.2} className="w-full md:w-[calc(33.333%-0.67rem)] min-h-[360px]">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="group bg-[var(--white)] rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[var(--mid-main-secondary)] hover:border-[var(--accent-color)]/50 flex flex-col justify-between relative overflow-hidden p-8 h-full"
                        >
                            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-[var(--accent-color)]/5 to-transparent rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                                transition={{ duration: 0.5 }}
                                className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md relative z-10 shadow-lg"
                            >
                                <FaUsers className="text-[var(--white)] text-3xl" />
                            </motion.div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-[var(--secondary-color)] group-hover:text-[var(--accent-color)] transition-colors">Mentorship</h3>
                                <p className="text-sm md:text-base text-[var(--mid-main-secondary)] leading-relaxed">Expert support when you need it most. Real guidance from experienced math educators.</p>
                            </div>
                        </motion.div>
                    </ScrollReveal>

                    <div className="w-full md:w-[calc(33.333%-0.67rem)] flex flex-col gap-4 min-h-[360px]">
                        <ScrollReveal direction="right" delay={0.3} className="flex-1">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="group bg-[var(--white)] rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[var(--mid-main-secondary)] hover:border-green-400 relative overflow-hidden p-8 h-full flex flex-col justify-between"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300"></div>
                                <motion.div
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{ duration: 0.6 }}
                                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md relative z-10 shadow-md"
                                >
                                    <FaTrophy className="text-[var(--white)] text-3xl" />
                                </motion.div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black text-[var(--secondary-color)] group-hover:text-green-600 transition-colors relative z-10">Leaderboards</h3>
                                    <p className="text-sm md:text-base text-[var(--mid-main-secondary)] leading-relaxed relative z-10">Compete globally, grow together</p>
                                </div>
                            </motion.div>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.35} className="flex-1">
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="group bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden p-8 h-full flex flex-col justify-between theme-lock"
                            >
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--white)]/20 rounded-full blur-2xl"></div>
                                <motion.div
                                    whileHover={{ scale: 1.15, rotate: 15 }}
                                    className="flex items-center justify-center w-16 h-16 bg-[var(--white)]/30 backdrop-blur-sm rounded-md relative z-10"
                                >
                                    <FaChartLine className="text-[var(--white)] text-3xl" />
                                </motion.div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black text-[var(--white)] relative z-10">Progress Analytics</h3>
                                    <p className="text-[var(--white)]/90 text-sm md:text-base leading-relaxed relative z-10">Deep insights into your learning journey</p>
                                </div>
                            </motion.div>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal direction="up" delay={0.25} className="w-full md:w-[calc(50%-0.5rem)] min-h-[360px]">
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="group bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden p-8 h-full flex flex-col justify-between theme-lock"
                        >
                            <div className="absolute top-0 right-0 text-[var(--white)]/10 text-[200px] font-black">250+</div>
                            <motion.div
                                whileHover={{ scale: 1.15, rotate: -12 }}
                                className="flex items-center justify-center w-16 h-16 bg-[var(--white)]/30 backdrop-blur-sm rounded-md relative z-10"
                            >
                                <FaChartLine className="text-[var(--white)] text-3xl" />
                            </motion.div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-[var(--white)] relative z-10">250+ Problems</h3>
                                <p className="text-[var(--white)]/90 text-sm md:text-base leading-relaxed relative z-10">Curated library across many topics</p>
                            </div>
                        </motion.div>
                    </ScrollReveal>

                    <div className="w-full md:w-[calc(50%-0.5rem)] flex flex-col gap-4 min-h-[360px]">
                        <ScrollReveal direction="up" delay={0.4} className="flex-1">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="group bg-[var(--white)] rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[var(--mid-main-secondary)] hover:border-orange-400 relative overflow-hidden p-8 h-full flex flex-col justify-between"
                            >
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-tl-full"></div>
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: -15 }}
                                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-md relative z-10 shadow-md"
                                >
                                    <FaFire className="text-[var(--white)] text-3xl" />
                                </motion.div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black text-[var(--secondary-color)] group-hover:text-orange-600 transition-colors relative z-10">Study Streaks</h3>
                                    <p className="text-sm md:text-base text-[var(--mid-main-secondary)] leading-relaxed relative z-10">Build consistency with daily challenges</p>
                                </div>
                            </motion.div>
                        </ScrollReveal>

                        <ScrollReveal direction="right" delay={0.45} className="flex-1">
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="group bg-[var(--white)] rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[var(--mid-main-secondary)] hover:border-blue-400 relative overflow-hidden p-8 h-full flex flex-col justify-between"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md relative z-10 shadow-md"
                                >
                                    <FaClock className="text-[var(--white)] text-3xl" />
                                </motion.div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black text-[var(--secondary-color)] group-hover:text-blue-600 transition-colors relative z-10">Real-time Feedback</h3>
                                    <p className="text-sm md:text-base text-[var(--mid-main-secondary)] leading-relaxed relative z-10">Instant validation as you solve</p>
                                </div>
                            </motion.div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutFeaturesSection;
