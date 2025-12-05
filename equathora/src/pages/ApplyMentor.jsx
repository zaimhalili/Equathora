import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/ApplyMentor/Hero';
import Footer from '../components/Footer';
import skate from '../assets/images/skate.svg';
import parents from '../assets/images/parents.svg';
import teachers from '../assets/images/teachers.svg';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaUsers, FaChalkboardTeacher, FaHeart, FaArrowRight, FaStar, FaGraduationCap } from 'react-icons/fa';

const ApplyMentor = () => {
    return (
        <div className='text-[var(--secondary-color)] font-[Inter] w-full bg-[var(--main-color)]'>
            <header><Navbar /></header>

            {/* Hero Section */}
            <Hero />

            {/* Benefits Section */}
            <section className='bg-[var(--main-color)] px-[4vw] xl:px-[12vw] py-[6vh]'>
                <div className='w-full flex flex-col items-center gap-8'>
                    <div className='text-center flex flex-col gap-2'>
                        <h2 className='text-2xl lg:text-3xl font-bold'>Why Become a Mentor?</h2>
                        <p className='text-sm text-gray-600 max-w-xl'>
                            Join a community making math accessible and enjoyable
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                        {[
                            {
                                icon: <FaGraduationCap className='text-2xl' />,
                                title: 'Reinforce Expertise',
                                description: 'Master subjects by teaching. Solidify understanding while helping others learn.'
                            },
                            {
                                icon: <FaUsers className='text-2xl' />,
                                title: 'Build Network',
                                description: 'Connect with educators, students, and mentors worldwide.'
                            },
                            {
                                icon: <FaHeart className='text-2xl' />,
                                title: 'Make Impact',
                                description: 'Inspire students to fall in love with mathematics and logic.'
                            },
                            {
                                icon: <FaStar className='text-2xl' />,
                                title: 'Earn Recognition',
                                description: 'Build reputation with badges and testimonials from students.'
                            },
                            {
                                icon: <FaCheckCircle className='text-2xl' />,
                                title: 'Flexible Schedule',
                                description: 'Mentor on your time. No commitments, contribute when you can.'
                            },
                            {
                                icon: <FaChalkboardTeacher className='text-2xl' />,
                                title: 'Free Tools',
                                description: 'Access platform features to track progress and engage students.'
                            }
                        ].map((benefit, index) => (
                            <div
                                key={index}
                                className='bg-white p-5 rounded shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col gap-3'
                            >
                                <div className='w-12 h-12 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] rounded flex items-center justify-center text-white'>
                                    {benefit.icon}
                                </div>
                                <h3 className='text-lg font-bold'>{benefit.title}</h3>
                                <p className='text-sm text-gray-600 leading-relaxed'>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who Can Apply Section */}
            <section className='bg-gradient-to-b from-[var(--main-color)] to-[var(--mid-main-secondary)] px-[4vw] xl:px-[12vw] py-[6vh]'>
                <div className='w-full flex flex-col items-center gap-8'>
                    <div className='text-center flex flex-col gap-2'>
                        <h2 className='text-2xl lg:text-3xl font-bold'>
                            Who Can <span className='text-[var(--accent-color)]'>Apply?</span>
                        </h2>
                        <p className='text-sm text-gray-600 max-w-xl'>
                            All backgrounds welcome—share your passion for teaching
                        </p>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 w-full'>
                        {/* Community Mentors */}
                        <div className='bg-white rounded shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col'>
                            <div className='flex flex-col p-6 gap-4'>
                                <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xl'>
                                    <FaUsers />
                                </div>
                                <h3 className='text-xl font-bold'>Community Mentors</h3>
                                <p className='text-sm text-gray-600 leading-relaxed'>
                                    Guide students publicly, answer questions, and share solutions that inspire the community.
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    <span className='px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold'>Public Forums</span>
                                    <span className='px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold'>Q&A</span>
                                    <span className='px-2.5 py-0.5 bg-pink-100 text-pink-700 rounded text-xs font-semibold'>Solutions</span>
                                </div>
                            </div>
                            <div className='relative h-40 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50'>
                                <img
                                    src={skate}
                                    alt="Community mentors"
                                    className='w-full h-full object-contain'
                                />
                            </div>
                        </div>

                        {/* Teachers */}
                        <div className='bg-white rounded shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col'>
                            <div className='flex flex-col p-6 gap-4'>
                                <div className='w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded flex items-center justify-center text-white text-xl'>
                                    <FaChalkboardTeacher />
                                </div>
                                <h3 className='text-xl font-bold'>Teachers</h3>
                                <p className='text-sm text-gray-600 leading-relaxed'>
                                    Track student progress, assign problems, and provide personalized classroom feedback.
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    <span className='px-2.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold'>Progress Tracking</span>
                                    <span className='px-2.5 py-0.5 bg-teal-100 text-teal-700 rounded text-xs font-semibold'>Assignments</span>
                                    <span className='px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold'>Feedback</span>
                                </div>
                            </div>
                            <div className='relative h-40 overflow-hidden bg-gradient-to-br from-green-50 to-teal-50'>
                                <img
                                    src={teachers}
                                    alt="Teachers"
                                    className='w-full h-full object-contain'
                                />
                            </div>
                        </div>

                        {/* Parents */}
                        <div className='bg-white rounded shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col'>
                            <div className='flex flex-col p-6 gap-4'>
                                <div className='w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded flex items-center justify-center text-white text-xl'>
                                    <FaHeart />
                                </div>
                                <h3 className='text-xl font-bold'>Parents</h3>
                                <p className='text-sm text-gray-600 leading-relaxed'>
                                    Monitor your child's learning journey and provide encouragement where needed.
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    <span className='px-2.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-semibold'>Monitoring</span>
                                    <span className='px-2.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-semibold'>Insights</span>
                                    <span className='px-2.5 py-0.5 bg-pink-100 text-pink-700 rounded text-xs font-semibold'>Support</span>
                                </div>
                            </div>
                            <div className='relative h-40 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50'>
                                <img
                                    src={parents}
                                    alt="Parents"
                                    className='w-full h-full object-contain'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className='bg-gradient-to-br from-[var(--secondary-color)] to-[#3a3d52] text-white px-[4vw] xl:px-[12vw] py-[6vh]'>
                <div className='w-full flex flex-col items-center text-center gap-6'>
                    <h2 className='text-2xl lg:text-3xl font-bold'>
                        Ready to Make a Difference?
                    </h2>
                    <p className='text-base text-gray-300 max-w-xl'>
                        Start inspiring the next generation of problem solvers today.
                    </p>

                    <Link
                        to='/signup'
                        className='bg-[var(--accent-color)] text-white px-8 py-3 rounded font-semibold text-sm transition-colors duration-200 hover:bg-[var(--dark-accent-color)] flex items-center justify-center gap-2 no-underline'
                    >
                        Start Your Application
                        <FaArrowRight className='text-xs' />
                    </Link>

                    <p className='text-xs text-gray-400'>
                        No commitment • 2 min apply • Always free
                    </p>
                </div>
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
