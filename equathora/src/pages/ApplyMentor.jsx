import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/ApplyMentor/Hero';
import Footer from '../components/Footer';
import EquathoraBriefsModal from '@/components/EquathoraBriefs/EquathoraBriefsModal.jsx';
import skate from '../assets/images/skate.svg';
import parents from '../assets/images/parents.svg';
import teachers from '../assets/images/teachers.svg';
import mentoring from '../assets/images/mentoring.svg';
import achievements from '../assets/images/achievements.svg';
import { subscribeToEquathoraBriefs } from '@/lib/equathoraBriefsService.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaUsers, FaChalkboardTeacher, FaHeart, FaArrowRight, FaStar, FaGraduationCap, FaBrain, FaChartLine } from 'react-icons/fa';

const ApplyMentor = () => {
    const [isBriefsModalOpen, setIsBriefsModalOpen] = useState(false);
    const { user } = useAuth() || {};

    const handleEquathoraBriefsSave = async (formData) => {
        try {
            await subscribeToEquathoraBriefs(formData);
        } catch (err) {
            console.error('Subscribe error:', err);
            throw err;
        }
    };

    return (
        <div className='text-[var(--secondary-color)] font-[Sansation] w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))]'>
            <header><Navbar /></header>

            {/* Hero Section */}
            <Hero onOpenBriefsModal={() => setIsBriefsModalOpen(true)} />

            {/* Benefits Section */}
            <section className='flex w-full flex-col items-center'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className='w-full px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-6 gap-8'
                >
                    <div className='flex flex-col items-center gap-6'>
                        <div className='text-center flex flex-col gap-2'>
                            <h2 className='text-2xl md:text-3xl font-bold font-[Sansation]'>Why Join Equathora’s Future Teacher Network?</h2>
                            <p className='text-sm md:text-base text-[var(--secondary-color)] max-w-2xl'>
                                Help shape a math learning experience built around step-by-step guidance, Sigma AI feedback, and clearer insight into student struggles.
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                            {[
                                {
                                    icon: <FaBrain className='text-xl text-white' />,
                                    title: 'AI-Enhanced Teaching',
                                    description: 'Support students with a platform designed around Sigma AI feedback, guided problem solving, and clearer explanations.',
                                    gradient: 'from-blue-500 to-cyan-500'
                                },
                                {
                                    icon: <FaUsers className='text-xl text-white' />,
                                    title: 'Shape the Experience',
                                    description: 'Help define how teachers and learners interact with Equathora as the platform grows.',
                                    gradient: 'from-purple-500 to-pink-500'
                                },
                                {
                                    icon: <FaHeart className='text-xl text-white' />,
                                    title: 'Support Real Learning',
                                    description: 'Help students move from confusion to confidence by focusing on the exact mistakes they make.',
                                    gradient: 'from-red-500 to-orange-500'
                                },
                                {
                                    icon: <FaChartLine className='text-xl text-white' />,
                                    title: 'Detailed Student Insights',
                                    description: 'Future tools will make it easier to spot repeated mistakes and understand where support is needed.',
                                    gradient: 'from-yellow-500 to-orange-500'
                                },
                                {
                                    icon: <FaCheckCircle className='text-xl text-white' />,
                                    title: 'Flexible Participation',
                                    description: 'Join early and contribute on your own terms as the teacher and mentor experience develops.',
                                    gradient: 'from-green-500 to-teal-500'
                                },
                                {
                                    icon: <FaChalkboardTeacher className='text-xl text-white' />,
                                    title: 'Future Classroom Tools',
                                    description: 'Be part of a roadmap that includes homework assignment, reporting, and richer teacher workflows.',
                                    gradient: 'from-indigo-500 to-blue-500'
                                }
                            ].map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                                    className='relative bg-[var(--white)] p-5 rounded-md shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 flex flex-col gap-3 overflow-hidden group'
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}></div>
                                    <div className={`relative w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-md flex items-center justify-center text-[var(--white)] shadow-md`}>
                                        {benefit.icon}
                                    </div>
                                    <h3 className='relative text-base md:text-lg font-bold'>{benefit.title}</h3>
                                    <p className='relative text-sm text-[var(--mid-main-secondary)] leading-relaxed'>{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className='w-full max-w-[1500px] px-[4vw] xl:px-[6vw] py-8'
                >
                    <div className='flex flex-col items-center gap-6'>
                        <div className='text-center flex flex-col gap-2'>
                            <h2 className='text-2xl md:text-3xl font-bold font-[Sansation]'>
                                Who Can <span className='text-[var(--accent-color)]'>Join Early?</span>
                            </h2>
                            <p className='text-sm md:text-base text-[var(--secondary-color)] max-w-xl'>
                                Educators, teachers, and learning supporters who want to help build a more thoughtful math experience are welcome.
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full'>
                            {/* Teachers */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                className='bg-[var(--white)] rounded-md shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col hover:scale-102'
                            >
                                <div className='relative h-48 bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={teachers}
                                        alt="Teachers"
                                        className='w-40 h-40 object-contain'
                                    />
                                </div>
                                <div className='flex flex-col p-5 gap-3'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-md flex items-center justify-center text-[var(--white)] text-lg shadow-md'>
                                        <FaChalkboardTeacher />
                                    </div>
                                    <h3 className='text-lg md:text-xl font-bold'>Teachers</h3>
                                    <p className='text-sm text-[var(--mid-main-secondary)] leading-relaxed'>
                                        Shape classroom workflows with homework assignment, skill insights, and detailed feedback on recurring mistakes.
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        <span className='px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-semibold'>Progress Tracking</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-xs font-semibold'>Assignments</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full text-xs font-semibold'>Reports</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Parents */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.6 }}
                                className='bg-[var(--white)] rounded-md shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col  md:col-span-2 lg:col-span-1 hover:scale-102'
                            >
                                <div className='relative h-48 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={parents}
                                        alt="Parents"
                                        className='w-40 h-40 object-contain'
                                    />
                                </div>
                                <div className='flex flex-col p-5 gap-3'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-md flex items-center justify-center text-[var(--white)] text-lg shadow-md'>
                                        <FaHeart />
                                    </div>
                                    <h3 className='text-lg md:text-xl font-bold'>Parents</h3>
                                    <p className='text-sm text-[var(--mid-main-secondary)] leading-relaxed'>
                                        Follow your child’s learning journey and see where they need support most with clearer progress signals.
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        <span className='px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-xs font-semibold'>Monitoring</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-full text-xs font-semibold'>Insights</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-xs font-semibold'>Support</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Community Mentors */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className='bg-[var(--white)] rounded-md shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col hover:scale-102'
                            >
                                <div className='relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={skate}
                                        alt="Community mentors"
                                        className='w-40 h-40 object-contain'
                                    />
                                </div>
                                <div className='flex flex-col p-5 gap-3'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-[var(--white)] text-lg shadow-md'>
                                        <FaUsers />
                                    </div>
                                    <h3 className='text-lg md:text-xl font-bold'>Learning Supporters</h3>
                                    <p className='text-sm text-[var(--mid-main-secondary)] leading-relaxed'>
                                        Help students publicly, share useful approaches, and contribute to a community focused on understanding rather than shortcuts.
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                        <span className='px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 
                                        text-blue-700 rounded-full text-xs font-semibold'>Guidance</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 
                                        text-purple-700 rounded-full text-xs font-semibold'>Discussion</span>
                                        <span className='px-3 py-1 bg-gradient-to-r from-pink-100 to-red-100 
                                        text-pink-700 rounded-full text-xs font-semibold'>Community</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </section>


            {/* Final CTA Section */}
            <section className='relative w-full flex justify-center bg-[linear-gradient(180deg,var(--secondary-color),var(--accent-color)130%)] text-[var(--white)] overflow-hidden theme-lock'>
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
                            <div className='inline-flex items-center justify-center lg:justify-start px-4 py-1.5 bg-[var(--secondary-color)]/20 border border-[var(--[var(--white)]-color)]/50 rounded-full text-[var(--white)] text-xs font-semibold self-center lg:self-start'>
                                COMING SOON
                            </div>
                            <h2 className='text-2xl md:text-3xl font-bold font-[Sansation]'>
                                Teacher and Learning Support Features Coming Soon!
                            </h2>
                            <p className='text-base md:text-lg text-gray-300 max-w-xl lg:max-w-none'>
                                We’re building the next phase of Equathora around guided feedback, AI-assisted support, and teacher workflows such as homework assignment and detailed mistake reporting.
                            </p>

                            <div className='flex flex-col gap-3'>
                                <button
                                    type='button'
                                    onClick={() => setIsBriefsModalOpen(true)}
                                    className='bg-[var(--main-color)] hover:bg-gray-300 !text-[var(--accent-color)] px-8 py-4 rounded-md !font-bold text-base flex items-center justify-center gap-2 no-underline shadow-lg transition-colors duration-200 w-full sm:w-auto cursor-pointer'
                                >
                                    <FaUsers />
                                    <span>Join Equathora Briefs</span>
                                    <FaArrowRight className='text-sm' />
                                </button>

                                <div className='flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-gray-300'>
                                    <div className='flex items-center gap-1.5'>
                                        <FaCheckCircle className='text-green-400' />
                                        <span>No commitment</span>
                                    </div>
                                    <div className='flex items-center gap-1.5'>
                                        <FaCheckCircle className='text-green-400' />
                                        <span>Join for free</span>
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
                                alt="Join Equathora Briefs"
                                className='w-64 md:w-80 lg:w-96 drop-shadow-2xl'
                            />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer><Footer /></footer>

            <EquathoraBriefsModal
                isOpen={isBriefsModalOpen}
                onClose={() => setIsBriefsModalOpen(false)}
                onSave={handleEquathoraBriefsSave}
                userData={user ? { name: user.user_metadata?.full_name || '', email: user.email } : null}
            />

            <div className='w-full bg-[var(--secondary-color)] border-t border-[var(--white)]/10 flex justify-center py-5 text-[var(--white)]/60 text-xs'>
                <a href="https://storyset.com/education" target="_blank" rel="noopener noreferrer" className='hover:text-[var(--white)]/80 transition-colors no-underline'>
                    Education illustrations by Storyset
                </a>
            </div>
        </div>
    );
};

export default ApplyMentor;
