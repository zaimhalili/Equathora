import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import BetaBanner from '../components/BetaBanner.jsx';
import CookieConsent from '../components/CookieConsent.jsx';
import Teacher from '../assets/images/Professor-pana.svg';
import YourTrack from '../components/YourTrack.jsx';
import Books from '../assets/images/learningBooks.svg';
import Mentoring from '../assets/images/mentoring.svg';
import QuestionMark from '../assets/images/questionMark.svg';
import Leaderboards from '../assets/images/leaderboards.svg'
import { Link } from 'react-router-dom';
import CommunityPosts from '../components/Dashboard/CommunityPosts.jsx';
import Mentor from '../assets/images/mentoring.svg';
import { getDailyProblemSlug } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const Dashboard = () => {
    const [username, setUsername] = useState("Friend");
    const [dailyProblemSlug, setDailyProblemSlug] = useState('');

    useEffect(() => {
        const loadDailyProblem = async () => {
            try {
                const slug = await getDailyProblemSlug();
                setDailyProblemSlug(slug);
            } catch (error) {
                console.error('Failed to load daily problem:', error);
            }
        };
        loadDailyProblem();
    }, []);

    // Fetch username from database
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const displayName = session.user.user_metadata?.full_name ||
                        session.user.user_metadata?.name ||
                        session.user.email?.split('@')[0] ||
                        "Friend";
                    setUsername(displayName);
                }
            } catch (error) {
                console.error('Failed to fetch username:', error);
            }
        };
        fetchUsername();
    }, []);



    return (
        <>
            <FeedbackBanner />
            <CookieConsent />
            <main className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen">
                <header>
                    <Navbar />
                </header>

                {/* Hero Section */}
                <div className='flex w-full justify-center items-center pb-6'>
                    <div className='flex flex-col lg:flex-row justify-start items-center lg:items-start px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-6 gap-8'>
                        <section className="flex flex-col justify-start w-full lg:w-[70%]">
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-[var(--secondary-color)] font-[Sansation] w-full cursor-default flex flex-col items-center md:items-start"
                            >
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="text-4xl text-center md:text-left pb-2 cursor-default font-[Sansation] font-extrabold"
                                >
                                    Welcome Back, <span className="text-[var(--secondary-color)]">{username}</span>!
                                </motion.h1>
                                <motion.h4
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-md text-center md:text-left lg:text-lg font-normal leading-[1.2] w-4/5 lg:w-[90%] cursor-default text-[var(--secondary-color)]"
                                >
                                    Tackle fun math and logic challenges with guided support to master your topics. <span className="font-semibold">Equathora is open, student-centered, and built to grow with you.</span>
                                </motion.h4>

                                {/* Where To Start Section/ 4 Main Blocks */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="flex flex-col text-center sm:text-left pt-8 pb-8"
                                >
                                    <h3 className="text-[var(--secondary-color)] font-[Sansation] text-2xl font-bold pb-2">
                                        Where To Start...
                                    </h3>

                                    {/* Blocks - Squares */}
                                    <div className="w-full pt-2 gap-[1px] flex flex-wrap justify-center sm:justify-start">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="w-[calc(50%-0.5px)] min-[480px]:w-[calc(25%-0.75px)]"
                                        >
                                            <Link
                                                to={`/problems/${dailyProblemSlug}`}
                                                className="w-full aspect-square bg-[var(--white)] transition-all duration-150 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-sm hover:rounded-lg hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105 active:scale-100"
                                            >
                                                <img src={QuestionMark} alt="daily-challenge" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                                                <h6 className="text-[var(--secondary-color)] font-[Sansation,sans-serif] text-lg font-normal w-full text-center flex items-center justify-center">
                                                    Daily challenge
                                                </h6>
                                            </Link>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="w-[calc(50%-0.5px)] min-[480px]:w-[calc(25%-0.75px)]"
                                        >
                                            <Link
                                                to="/learn"
                                                className="w-full aspect-square bg-[var(--white)] transition-all duration-150 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-sm hover:rounded-lg hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105 active:scale-100"
                                            >
                                                <img src={Books} alt="books" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                                                <h6 className="text-[var(--secondary-color)] font-[Sansation] text-lg font-normal w-full text-center flex items-center justify-center">
                                                    Browse problems
                                                </h6>
                                            </Link>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="w-[calc(50%-0.5px)] min-[480px]:w-[calc(25%-0.75px)]"
                                        >
                                            <Link
                                                to="/applyMentor"
                                                className="w-full aspect-square bg-[var(--white)] transition-all duration-150 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-sm hover:rounded-lg hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105 active:scale-100"
                                            >
                                                <img src={Mentoring} alt="mentoring" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                                                <h6 className="text-[var(--secondary-color)] font-[Sansation] text-lg font-normal w-full text-center flex items-center justify-center">
                                                    Try mentoring
                                                </h6>
                                            </Link>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="w-[calc(50%-0.5px)] min-[480px]:w-[calc(25%-0.75px)]"
                                        >
                                            <Link
                                                to="/leaderboards/global"
                                                className="w-full aspect-square bg-[var(--white)] transition-all duration-150 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-sm hover:rounded-lg hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105 active:scale-100"
                                            >
                                                <img src={Leaderboards} alt="leaderboards" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                                                <h6 className="text-[var(--secondary-color)] font-[Sansation] text-lg font-normal w-full text-center flex items-center justify-center ">
                                                    Join the race
                                                </h6>
                                            </Link>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.article>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                className="w-full"
                            >
                                <YourTrack />
                            </motion.div>
                            {/* Community Posts - That Leads to Forum, Blog and News Page */}
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className='w-full'
                            >
                                <CommunityPosts />
                            </motion.article>

                        </section>

                        {/* Aside Right Section - Image and Apply to be a Mentor */}
                        <motion.aside
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className='flex flex-col w-full lg:w-[30%] gap-8'
                        >
                            <figure className="hidden lg:flex justify-center">
                                <img src={Teacher} alt="teacher" loading='lazy' className="" />
                            </figure>

                            {/* Become a Mentor Section */}
                            <div className="w-full">
                                <div className="w-full bg-[var(--white)] border border-[rgba(43,45,66,0.12)] rounded-md p-8">
                                    {/* Header with Badge */}
                                    <div className="flex flex-col items-center w-full gap-3 pb-1">
                                        <img src={Mentor} alt="Mentor" className="w-32 h-full" />
                                        <h3 className="font-[Sansation] font-semibold text-2xl text-[var(--secondary-color)] leading-[1.3]">
                                            Become a Mentor
                                        </h3>
                                    </div>

                                    {/* Value Proposition */}
                                    <p className="font-[Sansation] text-sm text-[var(--secondary-color)] leading-relaxed text-center pb-4 opacity-90">
                                        Guide learners, reinforce your expertise, and make a meaningful impact in the mathematics community.
                                    </p>

                                    {/* Benefits List */}
                                    <div className="flex flex-col gap-2.5 pb-6">
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-[var(--accent-color)] font-bold text-sm pt-0.5">✓</span>
                                            <span className="font-[Sansation] text-sm text-[var(--secondary-color)] opacity-90">Flexible scheduling that fits your lifestyle</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-[var(--accent-color)] font-bold text-sm pt-0.5">✓</span>
                                            <span className="font-[Sansation] text-sm text-[var(--secondary-color)] opacity-80">Strengthen understanding through teaching</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-[var(--accent-color)] font-bold text-sm pt-0.5">✓</span>
                                            <span className="font-[Sansation] text-sm text-[var(--secondary-color)] opacity-80">Build your professional portfolio</span>
                                        </div>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex gap-3 max-w-[400px]">
                                        <Link
                                            to="/applymentor"
                                            className="flex items-center justify-center font-[Sansation] font-semibold text-sm !text-[var(--white)] bg-[var(--secondary-color)] rounded-md no-underline transition-all duration-200 hover:bg-transparent hover:!text-[var(--secondary-color)] hover:outline-1 hover:outline-[var(--secondary-color)] text-center flex-2 py-2 px-2 text-wrap active:scale-95"
                                        >
                                            Apply Now
                                        </Link>
                                        <Link
                                            to="/applymentor"
                                            className="flex items-center justify-center font-[Sansation] font-medium text-sm !text-[var(--secondary-color)] bg-transparent border rounded-md no-underline transition-all duration-200 border-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:!text-[var(--white)] text-center py-2 px-2 md:flex-1 active:scale-95"
                                        >
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.aside>
                    </div>
                </div>


                <footer>
                    <Footer />
                    <div className='w-full bg-[var(--secondary-color)] border-t border-white/10 flex justify-center py-5 text-white/60 text-xs theme-lock'>
                        <a href="https://storyset.com/education" target="_blank" rel="noopener noreferrer" className='hover:text-white/80 transition-colors no-underline'>
                            Education illustrations by Storyset
                        </a>
                    </div>
                </footer>
            </main>
        </>
    );
};

export default Dashboard;