import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import mathTeacher from '../../assets/images/oldTeacher.png';
import teacherSvg from '../../assets/images/teacher.svg';
import GradientText from '../ui/GradientText';
import { FaCheckCircle, FaArrowRight, FaUsers, FaHeart, FaStar } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className='relative bg-gradient-to-br from-[var(--secondary-color)] via-[#3a3d52] to-[var(--secondary-color)] text-white flex justify-center overflow-hidden'>
            {/* Decorative Elements */}
            <div className='px-[4vw] xl:px-[6vw] max-w-[1500px] py-4 lg:py-6 gap-8'>
                <div className='absolute top-0 right-0 w-72 h-72 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2'></div>
                <div className='absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2'></div>
                <div className='absolute top-1/2 left-1/4 w-48 h-48 bg-blue-400 rounded-full opacity-5 blur-3xl'></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='relative z-10 w-full max-w-[1500px] flex justify-center'
                >
                    <div className='flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full'>
                        {/* Left Content */}
                        <div className='flex flex-col flex-1 text-center lg:text-left gap-4'>
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className='inline-flex items-center justify-center px-3 py-1.5 bg-[var(--accent-color)]/20 rounded-lg text-xs font-semibold backdrop-blur-sm border border-[var(--accent-color)]/30 self-center lg:self-start gap-2'
                            >
                                <FaStar className='text-[var(--accent-color)]' />
                                <span>FREE TO JOIN</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className='text-3xl md:text-4xl font-bold leading-tight font-[DynaPuff]'
                            >
                                <span className='text-[var(--accent-color)]'>Become a Mentor</span>
                                <br />
                                <span>Shape the Future</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className='text-base md:text-lg text-gray-300 leading-relaxed max-w-xl lg:max-w-none'
                            >
                                Guide students through math challenges, reinforce your expertise, and make a lasting impact.
                            </motion.p>

                            {/* Waitlist CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.25 }}
                                className='flex flex-col gap-4 justify-center lg:justify-start pt-2'
                            >
                                <a
                                    href='YOUR_GOOGLE_FORM_LINK_HERE'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='group relative bg-[var(--accent-color)] text-white px-8 py-3 rounded-lg font-semibold text-sm md:text-base overflow-hidden transition-colors duration-200 hover:bg-[var(--dark-accent-color)] flex items-center justify-center gap-2 no-underline shadow-lg w-full sm:w-auto'
                                >
                                    <FaUsers />
                                    <span className='relative z-10'>Join 47+ Educators</span>
                                    <FaArrowRight className='relative z-10 text-xs' />
                                </a>

                                {/* Trust Indicators */}
                                <div className='flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-gray-400'>
                                    <div className='flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded'>
                                        <FaCheckCircle className='text-green-400 flex-shrink-0' />
                                        <span>No commitment</span>
                                    </div>
                                    <div className='flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded'>
                                        <FaCheckCircle className='text-green-400 flex-shrink-0' />
                                        <span>2 min signup</span>
                                    </div>
                                    <div className='flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded'>
                                        <FaCheckCircle className='text-green-400 flex-shrink-0' />
                                        <span>Always free</span>
                                    </div>
                                </div>
                            </motion.div>                        {/* Social Proof - Commented for future use */}
                            {/* <div className='flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm'>
                            <div className='flex items-center gap-2'>
                                <div className='flex -space-x-2'>
                                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white'></div>
                                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white'></div>
                                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white'></div>
                                </div>
                                <span className='text-gray-300'>50+ Active Mentors</span>
                            </div>
                            <div className='flex items-center gap-1 text-yellow-400'>
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <span className='text-gray-300 ml-2'>4.9/5 Rating</span>
                            </div>
                        </div> */}
                        </div>

                        {/* Right Illustration */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className='flex flex-1 justify-center lg:justify-end'
                        >
                            <div className='relative flex items-center justify-center'>
                                <div className='absolute inset-0 bg-gradient-to-br from-[var(--accent-color)] to-blue-500 rounded-full blur-3xl opacity-20'></div>
                                <img
                                    src={teacherSvg}
                                    alt="Mentor teaching"
                                    className='relative w-64 md:w-80 lg:w-96 drop-shadow-2xl'
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
            
        </section>
    );
};

export default Hero;