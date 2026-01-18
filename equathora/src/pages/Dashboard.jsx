import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import BetaBanner from '../components/BetaBanner.jsx';
import Teacher from '../assets/images/teacher.svg';
import YourTrack from '../components/YourTrack.jsx';
import Books from '../assets/images/learningBooks.svg';
import Mentoring from '../assets/images/mentoring.svg';
import QuestionMark from '../assets/images/questionMark.svg';
import Leaderboards from '../assets/images/leaderboards.svg'
import { Link } from 'react-router-dom';
import CommunityPosts from '../components/Dashboard/CommunityPosts.jsx';
import Mentor from '../assets/images/mentoring.svg';
import { getDailyProblemSlug } from '../lib/utils';
import { migrateLocalStorageToDatabase, needsMigration } from '../lib/migrateStorage';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const [migrationStatus, setMigrationStatus] = useState(null);
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

  // Auto-migrate localStorage data on first visit
  useEffect(() => {
    const checkAndMigrate = async () => {
      const needs = await needsMigration();
      if (needs) {
        console.log('Starting localStorage migration...');
        const result = await migrateLocalStorageToDatabase();
        setMigrationStatus(result);
        if (result.success) {
          console.log('Migration complete:', result.message);
        }
      }
    };
    checkAndMigrate();
  }, []);

  return (
    <>
      <BetaBanner />
      <FeedbackBanner />
      <main className="w-full bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] min-h-screen ">
        <header>
          <Navbar />
        </header>

        {/* Hero Section */}
        <div className='flex w-full justify-center items-center'>
          <div className='flex flex-col lg:flex-row justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-6 gap-8'>
            <section className="flex flex-col items-center justify-center w-full lg:w-[70%]">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[var(--secondary-color)] font-[Inter] w-full cursor-default flex flex-col items-center md:items-start"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl text-center md:text-left pb-2 cursor-default font-[Inter] font-medium"
                >
                  Welcome Back, <span className="text-[var(--secondary-color)]">{username}</span>!
                </motion.h1>
                <motion.h4
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-md text-center md:text-left lg:text-lg font-normal leading-[1.2] w-4/5 lg:w-[90%] cursor-default"
                >
                  Tackle fun math and logic challenges with guided support to master your topics. <span className="font-semibold">Equathora is open, student-centered, and built to grow with you.</span>
                </motion.h4>

                {/* Where To Start Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col text-center sm:text-left pt-8 pb-8"
                >
                  <h3 className="text-[var(--secondary-color)] font-[Inter] text-2xl font-bold pb-2">
                    Where To Start...
                  </h3>

                  {/* Blocks - Squares */}
                  <div className="w-full pt-2 gap-0.5 lg:gap-[2px] flex flex-wrap justify-center sm:justify-start">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Link
                        to={`/problems/${dailyProblemSlug}`}
                        className="w-40 h-35 lg:w-[11rem] lg:h-[10rem] bg-white transition-all duration-150 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105"
                      >
                        <img src={QuestionMark} alt="daily-challenge" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                        <h6 className="text-[var(--secondary-color)] font-[Inter] text-lg font-normal w-full text-center flex items-center justify-center ">
                          Solve the daily challenge
                        </h6>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Link
                        to="/learn"
                        className="w-40 h-35 lg:w-[11rem] lg:h-[10rem] bg-white transition-all duration-150 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105"
                      >
                        <img src={Books} alt="books" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                        <h6 className="text-[var(--secondary-color)] font-[Inter] text-lg font-normal w-full text-center flex items-center justify-center">
                          Browse problems
                        </h6>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Link
                        to="/applyMentor"
                        className="w-40 h-35 lg:w-[11rem] lg:h-[10rem] bg-white transition-all duration-150 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105"
                      >
                        <img src={Mentoring} alt="mentoring" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                        <h6 className="text-[var(--secondary-color)] font-[Inter] text-lg font-normal w-full text-center flex items-center justify-center">
                          Try mentoring
                        </h6>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Link
                        to="/leaderboards/global"
                        className="w-40 h-35 lg:w-[11rem] lg:h-[10rem] bg-white transition-all duration-150 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105"
                      >
                        <img src={Leaderboards} alt="leaderboards" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                        <h6 className="text-[var(--secondary-color)] font-[Inter] text-lg font-normal w-full text-center flex items-center justify-center">
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

            </section>

            {/* Aside Section - Image and Apply to be a Mentor */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='flex flex-col w-full lg:w-[30%] gap-8'
            >
              <figure className="hidden lg:flex justify-center max-h-[200px]">
                <img src={Teacher} alt="teacher" loading='lazy' className="" />
              </figure>

              {/* Become a Mentor Section */}
              <div className="w-full">
                <div className="w-full bg-white border border-[rgba(43,45,66,0.12)] rounded-md p-8">
                  {/* Header with Badge */}
                  <div className="flex items-start justify-between pb-4">
                    <div>
                      <h3 className="font-[Inter] font-semibold text-xl text-[var(--secondary-color)] pb-1.5 leading-[1.3]">
                        Become a Mentor
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[var(--accent-color)] bg-[rgba(217,4,41,0.08)] rounded py-1 px-2">
                          FREE TO JOIN
                        </span>
                      </div>
                    </div>
                    <img src={Mentor} alt="Mentor" className="opacity-90 w-14 h-14" />
                  </div>

                  {/* Value Proposition */}
                  <p className="font-[Inter] text-[0.9375rem] text-[var(--secondary-color)] leading-relaxed opacity-90 pb-6">
                    Guide learners, reinforce your expertise, and make a meaningful impact in the mathematics community.
                  </p>

                  {/* Benefits List */}
                  <div className="flex flex-col gap-2.5 pb-6">
                    <div className="flex items-start gap-2.5">
                      <span className="text-[var(--accent-color)] font-bold text-sm pt-0.5">✓</span>
                      <span className="font-[Inter] text-sm text-[var(--secondary-color)] opacity-80">Flexible scheduling that fits your lifestyle</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-[var(--accent-color)] font-bold text-sm pt-0.5">✓</span>
                      <span className="font-[Inter] text-sm text-[var(--secondary-color)] opacity-80">Strengthen understanding through teaching</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-[var(--accent-color)] font-bold text-sm pt-0.5">✓</span>
                      <span className="font-[Inter] text-sm text-[var(--secondary-color)] opacity-80">Build your professional portfolio</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3 max-w-[400px]">
                    <Link
                      to="/applymentor"
                      className="flex items-center justify-center font-[Inter] font-semibold text-[0.9375rem] !text-white bg-[var(--secondary-color)] rounded-md no-underline transition-all duration-200 hover:bg-[var(--raisin-black)] text-center flex-2 py-2 px-2 text-wrap"
                    >
                      Apply Now
                    </Link>
                    <Link
                      to="/applymentor"
                      className="flex items-center justify-center font-[Inter] font-medium text-[0.9375rem] !text-[var(--secondary-color)] bg-transparent border border-[rgba(43,45,66,0.2)] rounded-md no-underline transition-all duration-200 hover:border-[var(--secondary-color)] hover:bg-[rgba(43,45,66,0.02)] text-center py-2 px-2 md:flex-1"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>

        {/* Community Posts - That Leads to Forum, Blog and News Page */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <CommunityPosts />
        </motion.article>

        <footer>
          <Footer />
          <div className='w-full bg-[var(--secondary-color)] border-t border-white/10 flex justify-center py-5 text-white/60 text-xs'>
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