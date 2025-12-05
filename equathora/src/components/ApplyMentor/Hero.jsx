import React from 'react';
import { Link } from 'react-router-dom';
import mathTeacher from '../../assets/images/oldTeacher.png';
import GradientText from '../ui/GradientText';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className='relative bg-gradient-to-br from-[var(--secondary-color)] via-[#3a3d52] to-[var(--secondary-color)] text-white px-[4vw] xl:px-[12vw] py-[8vh] lg:py-[12vh] overflow-hidden'>
            {/* Decorative Elements */}
            <div className='absolute top-0 right-0 w-96 h-96 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2'></div>
            <div className='absolute bottom-0 left-0 w-80 h-80 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2'></div>

            <div className='relative z-10 w-full'>
                <div className='flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16'>
                    {/* Left Content */}
                    <div className='flex flex-col flex-1 text-center lg:text-left gap-6'>
                        <div className='inline-flex items-center justify-center px-4 py-2 bg-[var(--accent-color)]/20 rounded-full text-sm font-semibold backdrop-blur-sm border border-[var(--accent-color)]/30 self-center lg:self-start'>
                            🎓 FREE TO JOIN
                        </div>

                        <h1 className='text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight'>
                            <GradientText
                                colors={['#d90429', '#ef233c', '#d90429']}
                                animationSpeed={3}
                                showBorder={false}
                                inline={true}
                            >
                                <span className='font-[DynaPuff]'>Become a Mentor</span>
                            </GradientText>
                            <br />
                            <span className='font-[DynaPuff]'>Shape the Future</span>
                        </h1>

                        <p className='text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl lg:mx-0'>
                            Guide students through math challenges, reinforce your expertise, and make a lasting impact.
                        </p>

                        {/* CTA Buttons */}
                        <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                            <Link
                                to='/signup'
                                className='group relative bg-[var(--accent-color)] text-white px-8 py-4 rounded-lg font-bold text-lg overflow-hidden transition-all duration-300 hover:bg-[var(--dark-accent-color)] hover:shadow-[0_0_30px_rgba(217,4,41,0.5)] hover:scale-105 flex items-center justify-center gap-2 no-underline'
                            >
                                <span className='relative z-10'>Apply Now</span>
                                <FaArrowRight className='relative z-10 group-hover:translate-x-1 transition-transform' />
                                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
                            </Link>
                            <Link
                                to='/login'
                                className='group bg-white/10 text-white px-8 py-4 rounded-lg font-bold text-lg backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 no-underline'
                            >
                                Log In
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className='flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-400'>
                            <div className='flex items-center gap-2'>
                                <FaCheckCircle className='text-green-400 flex-shrink-0' />
                                <span>No commitment</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <FaCheckCircle className='text-green-400 flex-shrink-0' />
                                <span>2 min apply</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <FaCheckCircle className='text-green-400 flex-shrink-0' />
                                <span>Always free</span>
                            </div>
                        </div>

                        {/* Social Proof - Commented for future use */}
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
                        <div className='relative group'>
                            <div className='absolute inset-0 bg-[var(--accent-color)] rounded-2xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300'></div>
                            <img
                                src={mathTeacher}
                                alt="Math mentor"
                                className='relative w-full max-w-md lg:max-w-lg rounded-2xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-300'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;