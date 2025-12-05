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
            <section className='bg-[var(--main-color)] px-[4vw] xl:px-[12vw] py-[8vh]'>
                <div className='w-full flex flex-col items-center gap-12'>
                    <div className='text-center flex flex-col gap-4'>
                        <h2 className='text-3xl lg:text-4xl font-bold font-[DynaPuff]'>Why Become a Mentor?</h2>
                        <p className='text-lg text-gray-600 max-w-2xl'>
                            Join a community making math accessible and enjoyable
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
                        {[
                            {
                                icon: <FaGraduationCap className='text-3xl' />,
                                title: 'Reinforce Expertise',
                                description: 'Master subjects by teaching. Solidify understanding while helping others learn.'
                            },
                            {
                                icon: <FaUsers className='text-3xl' />,
                                title: 'Build Network',
                                description: 'Connect with educators, students, and mentors worldwide.'
                            },
                            {
                                icon: <FaHeart className='text-3xl' />,
                                title: 'Make Impact',
                                description: 'Inspire students to fall in love with mathematics and logic.'
                            },
                            {
                                icon: <FaStar className='text-3xl' />,
                                title: 'Earn Recognition',
                                description: 'Build reputation with badges and testimonials from students.'
                            },
                            {
                                icon: <FaCheckCircle className='text-3xl' />,
                                title: 'Flexible Schedule',
                                description: 'Mentor on your time. No commitments, contribute when you can.'
                            },
                            {
                                icon: <FaChalkboardTeacher className='text-3xl' />,
                                title: 'Free Tools',
                                description: 'Access platform features to track progress and engage students.'
                            }
                        ].map((benefit, index) => (
                            <div
                                key={index}
                                className='group bg-white p-6 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col gap-4'
                            >
                                <div className='w-14 h-14 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] rounded-lg flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
                                    {benefit.icon}
                                </div>
                                <h3 className='text-xl font-bold'>{benefit.title}</h3>
                                <p className='text-gray-600 leading-relaxed'>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who Can Apply Section */}
            <section className='bg-gradient-to-b from-[var(--main-color)] to-[var(--mid-main-secondary)] px-[4vw] xl:px-[12vw] py-[8vh]'>
                <div className='w-full flex flex-col items-center gap-12'>
                    <div className='text-center flex flex-col gap-4'>
                        <h2 className='text-3xl lg:text-4xl font-bold font-[DynaPuff]'>
                            Who Can <span className='text-[var(--accent-color)]'>Apply?</span>
                        </h2>
                        <p className='text-lg text-gray-600 max-w-2xl'>
                            All backgrounds welcome—share your passion for teaching
                        </p>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 w-full'>
                        {/* Community Mentors */}
                        <div className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 flex flex-col'>
                            <div className='flex flex-col p-8 gap-6'>
                                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
                                    <FaUsers />
                                </div>
                                <h3 className='text-2xl font-bold'>Community Mentors</h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    Guide students publicly, answer questions, and share solutions that inspire the community.
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold'>Public Forums</span>
                                    <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold'>Q&A</span>
                                    <span className='px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold'>Solutions</span>
                                </div>
                            </div>
                            <div className='relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50'>
                                <img
                                    src={skate}
                                    alt="Community mentors"
                                    className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-500'
                                />
                            </div>
                        </div>

                        {/* Teachers */}
                        <div className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 flex flex-col'>
                            <div className='flex flex-col p-8 gap-6'>
                                <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
                                    <FaChalkboardTeacher />
                                </div>
                                <h3 className='text-2xl font-bold'>Teachers</h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    Track student progress, assign problems, and provide personalized classroom feedback.
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold'>Progress Tracking</span>
                                    <span className='px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold'>Assignments</span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold'>Feedback</span>
                                </div>
                            </div>
                            <div className='relative h-48 overflow-hidden bg-gradient-to-br from-green-50 to-teal-50'>
                                <img
                                    src={teachers}
                                    alt="Teachers"
                                    className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-500'
                                />
                            </div>
                        </div>

                        {/* Parents */}
                        <div className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 flex flex-col'>
                            <div className='flex flex-col p-8 gap-6'>
                                <div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
                                    <FaHeart />
                                </div>
                                <h3 className='text-2xl font-bold'>Parents</h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    Monitor your child's learning journey and provide encouragement where needed.
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    <span className='px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold'>Monitoring</span>
                                    <span className='px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold'>Insights</span>
                                    <span className='px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold'>Support</span>
                                </div>
                            </div>
                            <div className='relative h-48 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50'>
                                <img
                                    src={parents}
                                    alt="Parents"
                                    className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-500'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className='bg-gradient-to-br from-[var(--secondary-color)] to-[#3a3d52] text-white px-[4vw] xl:px-[12vw] py-[10vh]'>
                <div className='w-full max-w-4xl flex flex-col items-center text-center gap-8'>
                    <h2 className='text-3xl lg:text-5xl font-bold font-[DynaPuff]'>
                        Ready to Make a Difference?
                    </h2>
                    <p className='text-xl text-gray-300 max-w-2xl leading-relaxed'>
                        Start inspiring the next generation of problem solvers today.
                    </p>

                    <Link
                        to='/signup'
                        className='group relative bg-[var(--accent-color)] text-white px-12 py-5 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 hover:bg-[var(--dark-accent-color)] hover:shadow-[0_0_40px_rgba(217,4,41,0.6)] hover:scale-110 flex items-center justify-center gap-3 no-underline'
                    >
                        <span className='relative z-10'>Start Your Application</span>
                        <FaArrowRight className='relative z-10 group-hover:translate-x-1 transition-transform' />
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
                    </Link>

                    <p className='text-sm text-gray-400'>
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
