import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import mathTeacher from '../assets/images/oldTeacher.png';
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
            <section className='relative bg-gradient-to-br from-[var(--secondary-color)] via-[#3a3d52] to-[var(--secondary-color)] text-white px-6 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24 overflow-hidden'>
                {/* Decorative Elements */}
                <div className='absolute top-0 right-0 w-96 h-96 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2'></div>
                <div className='absolute bottom-0 left-0 w-80 h-80 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2'></div>

                <div className='relative z-10 max-w-7xl mx-auto'>
                    <div className='flex flex-col lg:flex-row items-center gap-12'>
                        {/* Left Content */}
                        <div className='flex-1 text-center lg:text-left'>
                            <div className='inline-block px-4 py-2 bg-[var(--accent-color)]/20 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-[var(--accent-color)]/30'>
                                🎓 FREE TO JOIN
                            </div>
                            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
                                Become a <span className='text-[var(--accent-color)]'>Mentor</span>
                                <br />Shape the Future
                            </h1>
                            <p className='text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0'>
                                Guide students through logic and mathematics. Share your expertise, inspire learners, and make a lasting impact—all while strengthening your own skills.
                            </p>

                            {/* CTA Buttons */}
                            <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8'>
                                <Link
                                    to='/signup'
                                    className='group bg-[var(--accent-color)] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[var(--dark-accent-color)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent-color)]/50 hover:-translate-y-1 flex items-center justify-center gap-2 no-underline'
                                    style={{ color: 'white', textDecoration: 'none' }}
                                >
                                    Apply Now
                                    <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                                </Link>
                                <Link
                                    to='/login'
                                    className='bg-white/10 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30 hover:-translate-y-1 flex items-center justify-center gap-2 no-underline'
                                    style={{ color: 'white', textDecoration: 'none' }}
                                >
                                    Log In
                                </Link>
                            </div>

                            {/* Social Proof */}
                            <div className='flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm'>
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
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className='flex-1 flex justify-center lg:justify-end'>
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

            {/* Benefits Section */}
            <section className='px-6 py-16 sm:px-12 sm:py-20 lg:px-20 bg-[var(--main-color)]'>
                <div className='max-w-7xl mx-auto'>
                    <div className='text-center mb-12'>
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
                                className='group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100'
                            >
                                <div className='w-14 h-14 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform'>
                                    {benefit.icon}
                                </div>
                                <h3 className='text-xl font-bold mb-2'>{benefit.title}</h3>
                                <p className='text-gray-600 leading-relaxed'>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who Can Apply Section */}
            <section className='px-6 py-16 sm:px-12 sm:py-20 lg:px-20 bg-gradient-to-b from-[var(--main-color)] to-[var(--mid-main-secondary)]'>
                <div className='max-w-7xl mx-auto'>
                    <div className='text-center mb-12'>
                        <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
                            Who Can <span className='text-[var(--accent-color)]'>Apply?</span>
                        </h2>
                        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                            We welcome mentors from all backgrounds who share a passion for teaching
                        </p>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Community Mentors */}
                        <div className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2'>
                            <div className='p-8'>
                                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform'>
                                    <FaUsers />
                                </div>
                                <h3 className='text-2xl font-bold mb-4'>Community Mentors</h3>
                                <p className='text-gray-600 leading-relaxed mb-6'>
                                    Love helping others understand logic and math? Guide students publicly, answer questions, and share solutions that inspire the entire community.
                                </p>
                                <div className='flex flex-wrap gap-2 mb-6'>
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
                        <div className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2'>
                            <div className='p-8'>
                                <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform'>
                                    <FaChalkboardTeacher />
                                </div>
                                <h3 className='text-2xl font-bold mb-4'>Teachers</h3>
                                <p className='text-gray-600 leading-relaxed mb-6'>
                                    Built for classrooms. Track student progress, assign problem sets, and provide personalized feedback to help your students grow.
                                </p>
                                <div className='flex flex-wrap gap-2 mb-6'>
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
                        <div className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2'>
                            <div className='p-8'>
                                <div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform'>
                                    <FaHeart />
                                </div>
                                <h3 className='text-2xl font-bold mb-4'>Parents</h3>
                                <p className='text-gray-600 leading-relaxed mb-6'>
                                    Support your child's learning journey. Monitor time spent, exercises completed, and provide encouragement where they need it most.
                                </p>
                                <div className='flex flex-wrap gap-2 mb-6'>
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
            <section className='px-6 py-16 sm:px-12 sm:py-20 lg:px-20 bg-gradient-to-br from-[var(--secondary-color)] to-[#3a3d52] text-white'>
                <div className='max-w-4xl mx-auto text-center'>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-6'>
                        Ready to Make a Difference?
                    </h2>
                    <p className='text-xl text-gray-300 mb-10 max-w-2xl mx-auto'>
                        Join our community of mentors and start inspiring the next generation of problem solvers today.
                    </p>

                    <div className='flex flex-col sm:flex-row gap-4 justify-center mb-8'>
                        <Link
                            to='/signup'
                            className='group bg-[var(--accent-color)] text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-[var(--dark-accent-color)] transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--accent-color)]/50 hover:-translate-y-1 flex items-center justify-center gap-3 no-underline'
                            style={{ color: 'white', textDecoration: 'none' }}
                        >
                            Start Your Application
                            <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                        </Link>
                    </div>

                    <p className='text-sm text-gray-400'>
                        No commitment required • Apply in 2 minutes • Free forever
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
