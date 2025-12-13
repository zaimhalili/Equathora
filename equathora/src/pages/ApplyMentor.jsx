import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/ApplyMentor/Hero';
import Footer from '../components/Footer';
import skate from '../assets/images/skate.svg';
import parents from '../assets/images/parents.svg';
import teachers from '../assets/images/teachers.svg';
import mentoring from '../assets/images/mentoring.svg';
import achievements from '../assets/images/achievements.svg';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaUsers, FaChalkboardTeacher, FaHeart, FaArrowRight, FaStar, FaGraduationCap } from 'react-icons/fa';

const ApplyMentor = () => {
    return (
        <div className='text-[var(--secondary-color)] font-[Inter] w-full bg-gradient-to-b from-blue-50 via-white to-purple-50'>
            <header><Navbar /></header>

            {/* Hero Section */}
            <Hero />

            {/* Benefits Section */}
            <section className='flex justify-center w-full'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className='w-full px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-6 gap-8'
                >
                    <div className='flex flex-col items-center gap-6'>
                        <div className='text-center flex flex-col gap-2'>
                            <h2 className='text-2xl md:text-3xl font-bold font-[DynaPuff]'>Why Become a Mentor?</h2>
                            <p className='text-sm md:text-base text-gray-600 max-w-2xl'>
                                Join a vibrant community making math accessible and enjoyable for everyone
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                            {[
                                {
                                    icon: <FaGraduationCap className='text-xl' />,
                                    title: 'Reinforce Expertise',
                                    description: 'Master subjects by teaching. Solidify understanding while helping others learn.',
                                    gradient: 'from-blue-500 to-cyan-500'
                                },
                                {
                                    icon: <FaUsers className='text-xl' />,
                                    title: 'Build Network',
                                    description: 'Connect with educators, students, and mentors worldwide.',
                                    gradient: 'from-purple-500 to-pink-500'
                                },
                                {
                                    icon: <FaHeart className='text-xl' />,
                                    title: 'Make Impact',
                                    description: 'Inspire students to fall in love with mathematics and logic.',
                                    gradient: 'from-red-500 to-orange-500'
                                },
                                {
                                    icon: <FaStar className='text-xl' />,
                                    title: 'Earn Recognition',
                                    description: 'Build reputation with badges and testimonials from students.',
                                    gradient: 'from-yellow-500 to-orange-500'
                                },
                                {
                                    icon: <FaCheckCircle className='text-xl' />,
                                    title: 'Flexible Schedule',
                                    description: 'Mentor on your time. No commitments, contribute when you can.',
                                    gradient: 'from-green-500 to-teal-500'
                                },
                                {
                                    icon: <FaChalkboardTeacher className='text-xl' />,
                                    title: 'Free Tools',
                                    description: 'Access platform features to track progress and engage students.',
                                    gradient: 'from-indigo-500 to-blue-500'
                                }
                            ].map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                    className='relative bg-white p-5 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 flex flex-col gap-3 overflow-hidden group'
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}></div>
                                    <div className={`relative w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-lg flex items-center justify-center text-white shadow-md`}>
                                        {benefit.icon}
                                    </div>
                                    <h3 className='relative text-base md:text-lg font-bold'>{benefit.title}</h3>
                                    <p className='relative text-sm text-gray-600 leading-relaxed'>{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Who Can Apply Section */}
            <section className='flex justify-center w-full bg-gradient-to-b from-white to-gray-50'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className='w-full max-w-[1500px] px-[4vw] xl:px-[6vw] py-8'
                >
                    <div className='flex flex-col items-center gap-6'>
                        <div className='text-center flex flex-col gap-2'>
                            <h2 className='text-2xl md:text-3xl font-bold font-[DynaPuff]'>
                                Who Can <span className='text-[var(--accent-color)]'>Apply?</span>
                            </h2>
                            <p className='text-sm md:text-base text-gray-600 max-w-2xl'>
                                All backgrounds welcome, share your passion for teaching
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full'>
                            {/* Community Mentors */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                whileHover={{ scale: 1.02 }}
                                className='bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col border-2 border-transparent hover:border-blue-200'
                            >
                                <div className='relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={skate}
                                        alt="Community mentors"
                                        className='w-40 h-40 object-contain'
                                    />
                                </div>
                                <div className='flex flex-col p-5 gap-3'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-lg shadow-md'>
                                        <FaUsers />
                                    </div>
                                    <h3 className='text-lg md:text-xl font-bold'>Community Mentors</h3>
                                    <p className='text-sm text-gray-600 leading-relaxed'>
                                        Guide students publicly, answer questions, and share solutions that inspire the community.
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        <span className='px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-semibold'>Public Forums</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-semibold'>Q&A</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-pink-100 to-red-100 text-pink-700 rounded-full text-xs font-semibold'>Solutions</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Teachers */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                                className='bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col border-2 border-transparent hover:border-green-200'
                            >
                                <div className='relative h-48 bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={teachers}
                                        alt="Teachers"
                                        className='w-40 h-40 object-contain'
                                    />
                                </div>
                                <div className='flex flex-col p-5 gap-3'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-lg shadow-md'>
                                        <FaChalkboardTeacher />
                                    </div>
                                    <h3 className='text-lg md:text-xl font-bold'>Teachers</h3>
                                    <p className='text-sm text-gray-600 leading-relaxed'>
                                        Track student progress, assign problems, and provide personalized classroom feedback.
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        <span className='px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-semibold'>Progress Tracking</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-xs font-semibold'>Assignments</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full text-xs font-semibold'>Feedback</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Parents */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.6 }}
                                whileHover={{ scale: 1.02 }}
                                className='bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col border-2 border-transparent hover:border-orange-200 md:col-span-2 lg:col-span-1'
                            >
                                <div className='relative h-48 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={parents}
                                        alt="Parents"
                                        className='w-40 h-40 object-contain'
                                    />
                                </div>
                                <div className='flex flex-col p-5 gap-3'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-lg shadow-md'>
                                        <FaHeart />
                                    </div>
                                    <h3 className='text-lg md:text-xl font-bold'>Parents</h3>
                                    <p className='text-sm text-gray-600 leading-relaxed'>
                                        Monitor your child's learning journey and provide encouragement where needed.
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        <span className='px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-xs font-semibold'>Monitoring</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-full text-xs font-semibold'>Insights</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-xs font-semibold'>Support</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Final CTA Section */}
            <section className='relative w-full flex justify-center bg-gradient-to-br from-[var(--secondary-color)] to-[#3a3d52] text-white overflow-hidden'>
                <div className='absolute top-0 right-0 w-64 h-64 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl'></div>
                <div className='absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full opacity-10 blur-3xl'></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className='relative z-10 w-full max-w-[1500px] px-[4vw] xl:px-[6vw] py-8'
                >
                    <div className='flex flex-col lg:flex-row items-center gap-8'>
                        <div className='flex-1 flex flex-col text-center lg:text-left gap-5'>
                            <div className='inline-flex items-center justify-center lg:justify-start px-4 py-1.5 bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/50 rounded-full text-[var(--accent-color)] text-xs font-semibold self-center lg:self-start'>
                                COMING SOON
                            </div>
                            <h2 className='text-2xl md:text-3xl font-bold font-[DynaPuff]'>
                                Applications Opening Soon!
                            </h2>
                            <p className='text-base md:text-lg text-gray-300 max-w-xl lg:max-w-none'>
                                We're putting the final touches on the mentor platform. Join 47+ educators already on the waitlist!
                            </p>

                            <div className='flex flex-col gap-3'>
                                <a
                                    href='YOUR_GOOGLE_FORM_LINK_HERE'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='bg-[var(--accent-color)] hover:bg-[var(--dark-accent-color)] text-white px-8 py-4 rounded-lg font-semibold text-base flex items-center justify-center gap-2 no-underline shadow-lg transition-colors duration-200 w-full sm:w-auto'
                                >
                                    <FaUsers />
                                    <span>Join the Waitlist</span>
                                    <FaArrowRight className='text-sm' />
                                </a>

                                <div className='flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-gray-300'>
                                    <div className='flex items-center gap-1.5'>
                                        <FaCheckCircle className='text-green-400' />
                                        <span>No commitment</span>
                                    </div>
                                    <div className='flex items-center gap-1.5'>
                                        <FaCheckCircle className='text-green-400' />
                                        <span>Always free</span>
                                    </div>
                                    <div className='flex items-center gap-1.5'>
                                        <FaCheckCircle className='text-green-400' />
                                        <span>Shape the future</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex-1 flex justify-center lg:justify-end'>
                            <img
                                src={achievements}
                                alt="Join waitlist"
                                className='w-64 md:w-80 lg:w-96 drop-shadow-2xl'
                            />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer><Footer /></footer>
            <div className='w-full bg-[var(--secondary-color)] border-t border-white/10 flex justify-center py-3 text-white/60 text-xs'>
                <a href="https://storyset.com/education" target="_blank" rel="noopener noreferrer" className='hover:text-white/80 transition-colors no-underline'>
                    Education illustrations by Storyset
                </a>
            </div>
        </div>
    );
};

export default ApplyMentor;
