import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import mathTeacher from '../../assets/images/oldTeacher.png';
import Mathematics_cuate from '../../assets/images/Mathematics-cuate.svg';
import GradientText from '../ui/GradientText';
import {
    FaCheckCircle,
    FaArrowRight,
    FaUsers,
    FaHeart,
    FaStar,
    FaCrown,
    FaBolt,
    FaRocket,
    FaShieldAlt
} from 'react-icons/fa';
import Navbar from "@/components/Navbar.jsx";

const EquathoraBriefsHero = ({setIsBriefsModalOpen}) => {
    return (
        <>
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                <Navbar />
            </header>


            {/* Hero Section */}
            <section className="relative font-[Sansation] bg-[linear-gradient(180deg,var(--secondary-color),var(--accent-color)130%)] text-white flex justify-center overflow-hidden">

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 -left-20 w-72 h-72 bg-[var(--accent-color)]/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[var(--secondary-color)]/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 items-center justify-center max-w-7xl  w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-12">

                    <div className="flex  flex-1 flex-col justify-center w-full gap-8">
                        {/* Badge */}
                        <div className="flex items-center w-54 gap-2 px-4 py-2 bg-gradient-to-r from-[var(--dark-accent-color)] to-[var(--accent-color)] text-white rounded-full text-sm font-semibold shadow-lg animate-bounce">
                            <svg className="w-4 h-4" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="icon-gradient-bolt" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                        <stop offset="100%" stopColor="var(--accent-color)" />
                                    </linearGradient>
                                </defs>
                                <path fill="white" d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.7 20.8l-32 416C-.9 445.2 9.9 456 22.8 456.4c4.1.1 8.2-.3 12.1-1.6L266 420.1c10.2-3.3 17.5-12.6 17.5-23.2 0-6.6-2.7-12.8-7.4-17.3L150 256l119.3-99.3c11.3-9.4 14.8-25.6 7.8-38.8z" />
                            </svg>
                            <span>60+ Already Subscribed</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="flex flex-col w-full max-w-md text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--primary-color)] font-[Sansation] leading-tight">
                            <span>Master Math.</span>
                            <span className="text-[var(--accent-color)] relative inline-block">
                                Get Weekly Math Briefs.
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
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                    />
                                </motion.svg>
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="flex items-center text-sm md:text-lg text-[var(--primary-color)] max-w-3xl leading-relaxed">
                            Join Equathora Briefs for early feature announcements, fresh challenge drops, and updates for students and teachers.
                        </p>

                        {/* CTA Button */}
                        <div className="flex flex-col items-center justify-center w-full max-w-md pt-4 gap-4">
                            <button
                                onClick={() => setIsBriefsModalOpen(true)}
                                className="flex items-center justify-center gap-3 py-2 px-12 bg-[var(--accent-color)] hover:bg-[var(--dark-accent-color)] text-white text-xl font-bold rounded-md transition-all w-full cursor-pointer"
                            >
                                <span className={`text-[var(--primary-color)]`}>Join Equathora Briefs</span>
                                <svg className="w-5 h-5" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="icon-gradient-arrow-1" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                            <stop offset="100%" stopColor="var(--accent-color)" />
                                        </linearGradient>
                                    </defs>
                                    <path fill="white" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                                </svg>
                            </button>
                            <p className="flex items-center justify-center text-sm text-[var(--primary-color)]/60 text-center">
                                Weekly updates • No credit card required • Unsubscribe anytime
                            </p>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center  gap-6 text-sm text-[var(--primary-color)]/70">
                            <div className='flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded'>
                                <FaCheckCircle className='text-green-400 flex-shrink-0' />
                                <span>Early bird perks</span>
                            </div>
                            <div className='flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded'>
                                <FaCheckCircle className='text-green-400 flex-shrink-0' />
                                <span>Priority support</span>
                            </div>
                            <div className='flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded'>
                                <FaCheckCircle className='text-green-400 flex-shrink-0' />
                                <span>Founder badge</span>
                            </div>
                        </div>
                    </div>


                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className='flex flex-1 justify-center lg:justify-end'
                    >
                        <div className='relative flex items-center justify-center'>
                            <div className='absolute inset-0 bg-gradient-to-br from-[var(--accent-color)] to-blue-500 rounded-full blur-3xl opacity-20'></div>
                            <img
                                src={Mathematics_cuate}
                                alt="Mentor teaching"
                                className='relative w-64 md:w-80 lg:w-96 drop-shadow-2xl'
                            />
                        </div>
                    </motion.div>
                </div>
            </section>
        </>

    );
};

export default EquathoraBriefsHero;