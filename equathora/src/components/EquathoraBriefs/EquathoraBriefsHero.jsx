import React from 'react';
import { motion } from 'framer-motion';
import Mathematics_cuate from '../../assets/images/Mathematics-cuate.svg';
import {
    FaCheckCircle,
    FaArrowRight,
    FaUsers,
    FaStar
} from 'react-icons/fa';
import Navbar from "@/components/Navbar.jsx";

const EquathoraBriefsHero = ({ setIsBriefsModalOpen }) => {
    return (
        <section className='relative bg-[linear-gradient(180deg,var(--secondary-color),var(--accent-color)130%)] text-white flex flex-col justify-between overflow-hidden theme-lock'>
            <header className="bg-transparent border-b border-white/10 z-50">
                <Navbar />
            </header>

            {/* Decorative Elements */}
            <div className='px-[4vw] xl:px-[6vw] max-w-[1500px] py-12 lg:py-20 gap-8 mx-auto w-full'>
                <div className='absolute top-0 right-0 w-72 h-72 bg-[var(--accent-color)] rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2'></div>
                <div className='absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-color)] rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2'></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='relative z-10 w-full max-w-[1500px] flex justify-center'
                >
                    <div className='flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full'>
                        {/* Left Content */}
                        <div className='flex flex-col flex-1 text-center lg:text-left gap-6'>
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className='inline-flex items-center justify-center px-4 py-2 bg-[var(--white)]/10 rounded-full text-xs font-semibold backdrop-blur-sm border border-[var(--white)]/20 self-center lg:self-start gap-2 shadow-lg hover:shadow-xl transition-all'
                            >
                                <FaStar className='text-[var(--accent-color)]' />
                                <span className="text-[var(--white)]">Weekly Math Excellence</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className='text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight font-[Sansation]'
                            >
                                <span className='text-[var(--white)]'>Master Math.</span>
                                <br />
                                <span className='text-[var(--accent-color)] relative inline-block'>
                                    Get Weekly Briefs.
                                    <motion.svg
                                        className="absolute -bottom-2 left-0 w-full"
                                        viewBox="0 0 200 8"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                    >
                                        <motion.path
                                            d="M0 4 Q50 0 100 4 Q150 8 200 4"
                                            fill="none"
                                            stroke="var(--accent-color)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />
                                    </motion.svg>
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className='text-base md:text-lg text-[var(--main-color)] opacity-90 leading-relaxed max-w-xl mx-auto lg:mx-0'
                            >
                                Join Equathora Briefs for early feature announcements, fresh challenge drops, and exclusive updates for students and teachers.
                            </motion.p>

                            {/* Equathora Briefs CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.25 }}
                                className='flex flex-col gap-6 justify-center lg:justify-start pt-4'
                            >
                                <button
                                    onClick={() => setIsBriefsModalOpen(true)}
                                    aria-label="Join Equathora Briefs"
                                    className='group relative bg-[var(--white)] hover:bg-[var(--main-color)] text-[var(--accent-color)] px-8 py-4 rounded-md font-bold text-base md:text-lg overflow-hidden transition-all flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] w-full sm:w-auto self-center lg:self-start'
                                >
                                    <FaUsers className='text-xl' />
                                    <span className='relative z-10'>Join 50+ Subscribers</span>
                                    <FaArrowRight className='relative z-10 text-lg group-hover:translate-x-1 transition-transform' />
                                </button>

                                {/* Trust Indicators */}
                                <div className='flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm'>
                                    <div className='flex items-center gap-2 bg-[var(--white)]/10 px-3 py-1.5 rounded-md text-[var(--white)] border border-[var(--white)]/5 backdrop-blur-sm'>
                                        <FaCheckCircle className='text-[var(--main-color)] flex-shrink-0' />
                                        <span>Early bird perks</span>
                                    </div>
                                    <div className='flex items-center gap-2 bg-[var(--white)]/10 px-3 py-1.5 rounded-md text-[var(--white)] border border-[var(--white)]/5 backdrop-blur-sm'>
                                        <FaCheckCircle className='text-[var(--main-color)] flex-shrink-0' />
                                        <span>Priority support</span>
                                    </div>
                                    <div className='flex items-center gap-2 bg-[var(--white)]/10 px-3 py-1.5 rounded-md text-[var(--white)] border border-[var(--white)]/5 backdrop-blur-sm'>
                                        <FaCheckCircle className='text-[var(--main-color)] flex-shrink-0' />
                                        <span>Founder badge</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Illustration */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className='flex flex-1 justify-center lg:justify-end mt-10 lg:mt-0'
                        >
                            <div className='relative flex items-center justify-center'>
                                <div className='absolute inset-0 bg-[var(--main-color)] rounded-full blur-[80px] opacity-10 animate-pulse'></div>
                                <img
                                    src={Mathematics_cuate}
                                    alt="Mathematics Illustration"
                                    width={400}
                                    height={400}
                                    className='relative w-72 md:w-80 lg:w-[450px] drop-shadow-2xl hover:scale-105 transition-transform duration-500'
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default EquathoraBriefsHero;