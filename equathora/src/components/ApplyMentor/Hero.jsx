import React from 'react';
import { Link } from 'react-router-dom';
import mathTeacher from '../../assets/images/oldTeacher.png';
import GradientText from '../ui/GradientText';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className='relative bg-gradient-to-br from-[var(--secondary-color)] via-[#3a3d52] to-[var(--secondary-color)] text-white px-[4vw] xl:px-[12vw] py-[6vh] overflow-hidden'>
            {/* Decorative Elements */}
            <div className='absolute top-0 right-0 w-96 h-96 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2'></div>
            <div className='absolute bottom-0 left-0 w-80 h-80 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2'></div>

            <div className='relative z-10 w-full'>
                <div className='flex flex-col lg:flex-row items-center justify-center gap-10'>
                    {/* Left Content */}
                    <div className='flex flex-col flex-1 text-center lg:text-left gap-5'>
                        <div className='inline-flex items-center justify-center px-3 py-1.5 bg-[var(--accent-color)]/20 rounded text-xs font-semibold backdrop-blur-sm border border-[var(--accent-color)]/30 self-center lg:self-start'>
                            🎓 FREE TO JOIN
                        </div>

                        <h1 className='text-3xl lg:text-4xl font-bold leading-tight'>
                            <GradientText
                                colors={['#d90429', '#ef233c', '#d90429']}
                                animationSpeed={3}
                                showBorder={false}
                                inline={true}
                            >
                                <span className='font-[DynaPuff]'>Become a Mentor</span>
                            </GradientText>
                            <br />
                            <span>Shape the Future</span>
                        </h1>

                        <p className='text-base text-gray-300 leading-relaxed max-w-xl lg:mx-0'>
                            Guide students through math challenges, reinforce your expertise, and make a lasting impact.
                        </p>

                        {/* Waitlist CTA */}
                        <div className='flex flex-col gap-4 justify-center lg:justify-start'>
                            <div className='flex flex-col sm:flex-row gap-3'>
                                <a
                                    href='YOUR_GOOGLE_FORM_LINK_HERE'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='group relative bg-[var(--accent-color)] text-white px-6 py-2.5 rounded font-semibold text-sm overflow-hidden transition-colors duration-200 hover:bg-[var(--dark-accent-color)] flex items-center justify-center gap-2 no-underline'
                                >
                                    <span className='relative z-10'>Join Waitlist (47+ Already Joined!)</span>
                                    <FaArrowRight className='relative z-10 text-xs' />
                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
                                </a>
                            </div>

                            {/* Trust Indicators */}
                            <div className='flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-400'>
                                <div className='flex items-center gap-1.5'>
                                    <FaCheckCircle className='text-green-400 flex-shrink-0 text-xs' />
                                    <span>No commitment</span>
                                </div>
                                <div className='flex items-center gap-1.5'>
                                    <FaCheckCircle className='text-green-400 flex-shrink-0 text-xs' />
                                    <span>2 min signup</span>
                                </div>
                                <div className='flex items-center gap-1.5'>
                                    <FaCheckCircle className='text-green-400 flex-shrink-0 text-xs' />
                                    <span>Always free</span>
                                </div>
                            </div>
                        </div>                        {/* Social Proof - Commented for future use */}
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
                            <div className='absolute inset-0 bg-[var(--accent-color)] rounded blur-2xl opacity-15'></div>
                            <img
                                src={mathTeacher}
                                alt="Math mentor"
                                className='relative w-full max-w-sm lg:max-w-md rounded shadow-lg'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;