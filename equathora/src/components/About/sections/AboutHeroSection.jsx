import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const AboutHeroSection = () => {
    return (
        <section
            className="w-full relative bg-[var(--main-color)] overflow-hidden flex justify-center"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/gplay.png")', backgroundBlendMode: 'overlay' }}
        >
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-[0.85]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/gplay.png")' }}></div>
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 10px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 10px)
                        `,
                        backgroundSize: '80px 80px'
                    }}
                />
            </div>

            <div className="relative z-10 w-full flex justify-center">
                <div className="w-full max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 pt-40 sm:pt-24 md:pt-30 lg:pt-20 xl:pt-40 pb-14 sm:pb-16 md:pb-18 lg:pb-20 flex flex-col items-center text-center gap-5 sm:gap-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl sm:text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] text-[var(--secondary-color)] max-w-4xl"
                    >
                        Building stronger thinkers,
                        <br />
                        one problem at a time at{' '}
                        <span className="text-[var(--accent-color)] relative inline-block">
                            Equathora
                            <motion.svg
                                className="absolute -bottom-2 left-0 w-full"
                                viewBox="0 0 200 8"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.65, duration: 0.8 }}
                            >
                                <motion.path
                                    d="M0 4 Q50 0 100 4 Q150 8 200 4"
                                    fill="none"
                                    stroke="var(--accent-color)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.65, duration: 0.8 }}
                                />
                            </motion.svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.55 }}
                        className="text-xs sm:text-sm md:text-base text-[var(--secondary-color)]/70 leading-relaxed max-w-2xl"
                    >
                        We design focused math practice that values clarity over speed, depth over noise, and long-term reasoning over short-term memorization.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                        className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 pt-1"
                    >
                        <Link
                            to="/learn"
                            className="group flex items-center gap-2 rounded-full !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-center !text-white font-semibold transition-all ease-in hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] shadow-lg shadow-[var(--raisin-black)]/30 active:translate-y-1"
                        >
                            Start practicing
                            <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <FaArrowRight className="text-xs sm:text-sm" />
                            </motion.span>
                        </Link>
                        <Link
                            to="/equathora-briefs"
                            className="group relative text-sm sm:text-base !text-[var(--secondary-color)] font-medium transition-all flex items-center gap-2 min-w-[140px]"
                        >
                            <FaArrowRight className="text-xs sm:text-sm opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                            <span className="transition-transform duration-300">Join Equathora Briefs</span>
                            <FaArrowRight className="text-xs sm:text-sm opacity-100 group-hover:translate-x-4 group-hover:opacity-0 transition-all duration-300" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutHeroSection;
