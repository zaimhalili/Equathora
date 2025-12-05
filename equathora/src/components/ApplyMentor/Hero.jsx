import React from 'react';
import { Link } from 'react-router-dom';
import mathTeacher from '../../assets/images/oldTeacher.png';
import { FaCheckCircle, FaUsers, FaChalkboardTeacher, FaHeart, FaArrowRight, FaStar, FaGraduationCap } from 'react-icons/fa';



const Hero = () => {
    return (
        <div>
            <section className='relative bg-gradient-to-br from-[var(--secondary-color)] via-[#3a3d52] to-[var(--secondary-color)] text-white px-6 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24 overflow-hidden'>
                {/* Decorative Elements */}
                <div className='absolute top-0 right-0 w-96 h-96 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2'></div>
                <div className='absolute bottom-0 left-0 w-80 h-80 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2'></div>

                <div className='relative z-10 max-w-7xl mx-auto'>
                    <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-12'>
                        {/* Left Content */}
                        <div className='flex flex-col flex-1 text-center lg:text-left' style={{ padding: '0', gap: '1.5rem' }}>
                            <div className='flex px-4 py-2 bg-[var(--accent-color)]/20 rounded-full text-sm font-semibold backdrop-blur-sm border border-[var(--accent-color)]/30 self-center lg:self-start'>
                                🎓 FREE TO JOIN
                            </div>
                            <h1 className='text-4xl font-bold leading-tight font-[DynaPuff]' style={{ margin: '0' }}>
                                Become a <span className='text-[var(--accent-color)]'>Mentor</span>
                                <br />Shape the Future
                            </h1>
                            <p className='text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0' style={{ margin: '0' }}>
                                Guide students through logic and mathematics. Share your expertise, inspire learners, and make a lasting impact—all while strengthening your own skills.
                            </p>

                            {/* CTA Buttons */}
                            <div className='flex flex-col sm:flex-row justify-center lg:justify-start' style={{ gap: '1rem' }}>
                                <Link
                                    to='/signup'
                                    className='group bg-[var(--accent-color)] text-white rounded-lg font-bold text-lg hover:bg-[var(--dark-accent-color)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent-color)]/50 flex items-center justify-center no-underline'
                                    style={{ color: 'white', textDecoration: 'none', padding: '1rem 2rem', gap: '0.5rem' }}
                                >
                                    Apply Now
                                    <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                                </Link>
                                <Link
                                    to='/login'
                                    className='bg-white/10 text-white rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center justify-center no-underline'
                                    style={{ color: 'white', textDecoration: 'none', padding: '1rem 2rem', gap: '0.5rem' }}
                                >
                                    Log In
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className='flex flex-wrap items-center justify-center lg:justify-start text-sm text-gray-400' style={{ gap: '1.5rem' }}>
                                <div className='flex items-center' style={{ gap: '0.5rem' }}>
                                    <FaCheckCircle className='text-green-400' />
                                    <span>No commitment required</span>
                                </div>
                                <div className='flex items-center' style={{ gap: '0.5rem' }}>
                                    <FaCheckCircle className='text-green-400' />
                                    <span>Apply in 2 minutes</span>
                                </div>
                                <div className='flex items-center' style={{ gap: '0.5rem' }}>
                                    <FaCheckCircle className='text-green-400' />
                                    <span>Free forever</span>
                                </div>
                            </div>

                            {/* Social Proof - Commented for now */}
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

                        {/* Right Image */}
                        <div className='flex flex-1 justify-center lg:justify-end'>
                            <div className='relative'>
                                <div className='absolute inset-0 bg-[var(--accent-color)] rounded-2xl blur-2xl opacity-20'></div>
                                <img
                                    src={mathTeacher}
                                    alt="Math mentor"
                                    className='relative w-full max-w-md lg:max-w-lg rounded-2xl shadow-2xl'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hero;