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
            <Hero></Hero>

            {/* Benefits Section */}
            <section className='bg-[var(--main-color)]' style={{ padding: '4rem 1.5rem' }}>
                <div className='max-w-7xl mx-auto' style={{ padding: '0' }}>
                    <div className='text-center' style={{ marginBottom: '3rem' }}>
                        <h2 className='text-3xl sm:text-4xl font-bold mb-4'>Why Become a Mentor?</h2>
                        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                            Join a community dedicated to making math accessible and enjoyable for everyone
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {[
                            {
                                icon: <FaGraduationCap className='text-3xl' />,
                                title: 'Reinforce Your Expertise',
                                description: 'Teaching is the best way to master a subject. Solidify your own understanding while helping others.'
                            },
                            {
                                icon: <FaUsers className='text-3xl' />,
                                title: 'Build Your Network',
                                description: 'Connect with educators, students, and fellow mentors from around the world.'
                            },
                            {
                                icon: <FaHeart className='text-3xl' />,
                                title: 'Make Real Impact',
                                description: 'Be the reason someone falls in love with mathematics and logical thinking.'
                            },
                            {
                                icon: <FaStar className='text-3xl' />,
                                title: 'Earn Recognition',
                                description: 'Build your reputation with badges, ratings, and testimonials from grateful students.'
                            },
                            {
                                icon: <FaCheckCircle className='text-3xl' />,
                                title: 'Flexible Schedule',
                                description: 'Mentor on your own time. No commitments, just contribute when you can.'
                            },
                            {
                                icon: <FaChalkboardTeacher className='text-3xl' />,
                                title: 'Free Tools & Resources',
                                description: 'Access our complete platform features to track progress and engage students.'
                            }
                        ].map((benefit, index) => (
                            <div
                                key={index}
                                className='group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col'
                                style={{ padding: '1.5rem', gap: '1rem' }}
                            >
                                <div className='w-14 h-14 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform'>
                                    {benefit.icon}
                                </div>
                                <h3 className='text-xl font-bold' style={{ margin: '0' }}>{benefit.title}</h3>
                                <p className='text-gray-600 leading-relaxed' style={{ margin: '0' }}>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who Can Apply Section */}
            <section className='bg-gradient-to-b from-[var(--main-color)] to-[var(--mid-main-secondary)]' style={{ padding: '4rem 1.5rem' }}>
                <div className='max-w-7xl mx-auto' style={{ padding: '0' }}>
                    <div className='text-center' style={{ marginBottom: '3rem' }}>
                        <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
                            Who Can <span className='text-[var(--accent-color)]'>Apply?</span>
                        </h2>
                        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                            We welcome mentors from all backgrounds who share a passion for teaching
                        </p>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Community Mentors */}
                        <div className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 flex flex-col'>
                            <div className='flex flex-col' style={{ padding: '2rem', gap: '1.5rem' }}>
                                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform'>
                                    <FaUsers />
                                </div>
                                <h3 className='text-2xl font-bold' style={{ margin: '0' }}>Community Mentors</h3>
                                <p className='text-gray-600 leading-relaxed' style={{ margin: '0' }}>
                                    Love helping others understand logic and math? Guide students publicly, answer questions, and share solutions that inspire the entire community.
                                </p>
                                <div className='flex flex-wrap' style={{ gap: '0.5rem' }}>
                                    <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold'>Public Forums</span>
                                    <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold'>Q&A</span>
                                    <span className='px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold'>Solutions</span>
                                </div>
                            </div>
                            <div className='relative h-48 overflow-hidden'>
                                <img
                                    src={skate}
                                    alt="Community mentors"
                                    className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300'
                                />
                            </div>
                        </div>

                        {/* Teachers */}
                        <div className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 flex flex-col'>
                            <div className='flex flex-col' style={{ padding: '2rem', gap: '1.5rem' }}>
                                <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform'>
                                    <FaChalkboardTeacher />
                                </div>
                                <h3 className='text-2xl font-bold' style={{ margin: '0' }}>Teachers</h3>
                                <p className='text-gray-600 leading-relaxed' style={{ margin: '0' }}>
                                    Built for classrooms. Track student progress, assign problem sets, and provide personalized feedback to help your students grow.
                                </p>
                                <div className='flex flex-wrap' style={{ gap: '0.5rem' }}>
                                    <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold'>Progress Tracking</span>
                                    <span className='px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold'>Assignments</span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold'>Feedback</span>
                                </div>
                            </div>
                            <div className='relative h-48 overflow-hidden'>
                                <img
                                    src={teachers}
                                    alt="Teachers"
                                    className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300'
                                />
                            </div>
                        </div>

                        {/* Parents */}
                        <div className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 flex flex-col'>
                            <div className='flex flex-col' style={{ padding: '2rem', gap: '1.5rem' }}>
                                <div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform'>
                                    <FaHeart />
                                </div>
                                <h3 className='text-2xl font-bold' style={{ margin: '0' }}>Parents</h3>
                                <p className='text-gray-600 leading-relaxed' style={{ margin: '0' }}>
                                    Support your child's learning journey. Monitor time spent, exercises completed, and provide encouragement where they need it most.
                                </p>
                                <div className='flex flex-wrap' style={{ gap: '0.5rem' }}>
                                    <span className='px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold'>Monitoring</span>
                                    <span className='px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold'>Insights</span>
                                    <span className='px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold'>Support</span>
                                </div>
                            </div>
                            <div className='relative h-48 overflow-hidden'>
                                <img
                                    src={parents}
                                    alt="Parents"
                                    className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className='bg-gradient-to-br from-[var(--secondary-color)] to-[#3a3d52] text-white' style={{ padding: '4rem 1.5rem' }}>
                <div className='max-w-4xl mx-auto text-center flex flex-col items-center' style={{ gap: '2rem' }}>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold' style={{ margin: '0' }}>
                        Ready to Make a Difference?
                    </h2>
                    <p className='text-xl text-gray-300 max-w-2xl' style={{ margin: '0' }}>
                        Join our community of mentors and start inspiring the next generation of problem solvers today.
                    </p>

                    <div className='flex flex-col sm:flex-row justify-center gap-4'>
                        <Link
                            to='/signup'
                            className='group bg-[var(--accent-color)] text-white rounded-xl font-bold text-lg hover:bg-[var(--dark-accent-color)] transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--accent-color)]/50 flex items-center justify-center no-underline'
                            style={{ color: 'white', textDecoration: 'none', padding: '1.25rem 2.5rem', gap: '0.75rem' }}
                        >
                            Start Your Application
                            <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                        </Link>
                    </div>

                    <p className='text-sm text-gray-400' style={{ margin: '0' }}>
                        No commitment required • Apply in 2 minutes • Free forever
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer><Footer /></footer>
            <div className='w-full bg-[var(--secondary-color)] border-t border-white/10 flex justify-center text-white/60 text-xs' style={{ padding: '0.75rem' }}>
                <a href="https://storyset.com/education" target="_blank" rel="noopener noreferrer" className='hover:text-white/80 transition-colors no-underline'>
                    Education illustrations by Storyset
                </a>
            </div>
        </div>
    );
};

export default ApplyMentor;
