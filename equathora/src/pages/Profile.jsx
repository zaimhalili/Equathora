import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReputationBadge from '../components/ReputationBadge';
import Autumn from '../assets/images/autumn.jpg';
import { FaFire, FaCheckCircle, FaTrophy, FaChartLine, FaUser, FaCalendarAlt, FaEnvelope } from 'react-icons/fa';
import { getUserProgress, getStreakData, getCompletedProblems } from '../lib/databaseService';
import { getAllProblems } from '../lib/problemService';
import { supabase } from '../lib/supabaseClient';
import ProfileExportButtons from '../components/ProfileExportButtons';

const Profile = () => {
  const { profile } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAccuracy, setShowAccuracy] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        // Fetch all user data
        const [userProgress, streakData, completedIds, allProblems] = await Promise.all([
          getUserProgress(),
          getStreakData(),
          getCompletedProblems(),
          getAllProblems()
        ]);

        // Get user metadata
        const user = session.user;
        const displayName = user.user_metadata?.full_name || 
                           user.user_metadata?.name || 
                           user.email?.split('@')[0] || 
                           'Student';
        const username = user.user_metadata?.preferred_username || 
                        user.email?.split('@')[0] || 
                        'student';
        
        // Calculate stats
        const solved = userProgress?.solved_problems?.length || 0;
        const correctAnswers = userProgress?.correct_answers || 0;
        const wrongSubmissions = userProgress?.wrong_submissions || 0;
        const totalAttempts = userProgress?.total_attempts || 0;
        const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

        // Get completed problem details
        const completedProblems = allProblems.filter(p => completedIds.includes(String(p.id)));
        
        // Calculate difficulty breakdowns
        const easyProblems = allProblems.filter(p => p.difficulty === 'Easy');
        const mediumProblems = allProblems.filter(p => p.difficulty === 'Medium');
        const hardProblems = allProblems.filter(p => p.difficulty === 'Hard');

        const easySolved = completedProblems.filter(p => p.difficulty === 'Easy').length;
        const mediumSolved = completedProblems.filter(p => p.difficulty === 'Medium').length;
        const hardSolved = completedProblems.filter(p => p.difficulty === 'Hard').length;

        // Get join date
        const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        }) : 'Recently';

        setUserData({
          name: displayName,
          username: username,
          email: user.email,
          avatar: user.user_metadata?.avatar_url || null,
          joinDate: joinDate,
          title: 'Problem Solver ∑',
          status: 'Online',
          stats: {
            problemsSolved: solved,
            accuracy: accuracy,
            accuracyDetail: {
              correct: correctAnswers,
              wrong: wrongSubmissions,
              total: totalAttempts
            },
            currentStreak: streakData?.current_streak || 0,
            longestStreak: streakData?.longest_streak || 0,
            reputation: userProgress?.reputation || 0,
            globalRank: 1,
            easy: { solved: easySolved, total: easyProblems.length, accuracy: easySolved > 0 ? Math.round((easySolved / easyProblems.length) * 100) : 0 },
            medium: { solved: mediumSolved, total: mediumProblems.length, accuracy: mediumSolved > 0 ? Math.round((mediumSolved / mediumProblems.length) * 100) : 0 },
            hard: { solved: hardSolved, total: hardProblems.length, accuracy: hardSolved > 0 ? Math.round((hardSolved / hardProblems.length) * 100) : 0 }
          },
          mathTopics: [...new Set(completedProblems.map(p => p.topic).filter(Boolean))],
          problemsSolved: completedProblems.slice(-10).reverse()
        });

      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-color)]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg text-[var(--secondary-color)]">Please log in to view your profile</p>
        </div>
        <Footer />
      </div>
    );
  }

  const totalProblems = userData.stats.easy.total + userData.stats.medium.total + userData.stats.hard.total;
  const totalSolved = userData.stats.easy.solved + userData.stats.medium.solved + userData.stats.hard.solved;

  const getCircleProgress = (solved, total) => {
    const percentage = (solved / total) * 100;
    const circumference = 2 * Math.PI * 40; // radius = 40
    const offset = circumference - (percentage / 100) * circumference;
    return { percentage, offset, circumference };
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className='bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] px-3 md:px-[30px] [@media(min-width:1600px)]:px-[12vw] pt-5 pb-20'>
        <div className='mx-auto px-[4vw] xl:px-[6vw] max-w-[1500px]'>
          {/* Two Column Layout */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            {/* Left Column - Combined Profile, Stats, and Topics */}
            <motion.div
              className='lg:col-span-1 flex flex-col gap-4'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Combined Card */}
              <div className='bg-[var(--main-color)] rounded-xl shadow-lg p-6 flex flex-col gap-6'>
                {/* Profile Header Section */}
                <div className='flex flex-col gap-5'>
                  <div className='flex gap-4 items-center mb-4'>
                    {userData.avatar ? (
                      <img src={userData.avatar} alt="Profile Picture" className='rounded-full h-20 w-20 md:h-24 md:w-24 object-cover border-4 border-[var(--accent-color)]' />
                    ) : (
                      <div className='rounded-full h-20 w-20 md:h-24 md:w-24 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] flex items-center justify-center border-4 border-[var(--accent-color)]'>
                        <FaUser className='text-white text-3xl md:text-4xl' />
                      </div>
                    )}
                    <div className='text-[var(--secondary-color)] font-[Inter] flex flex-col justify-between gap-1'>
                      <div>
                        <h5 className='font-bold text-xl md:text-2xl'>{userData.name}</h5>
                        <h5 className='font-light text-md md:text-lg text-[var(--french-gray)]'>@{userData.username}</h5>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-[var(--french-gray)]'>
                        <FaCalendarAlt className='text-xs' />
                        <span>Joined {userData.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Info Pills */}
                  <div className='flex flex-wrap gap-2'>
                    <div className='flex items-center gap-1 px-3 py-1 bg-[rgba(217,4,41,0.1)] rounded-full text-sm'>
                      <FaTrophy className='text-[var(--accent-color)]' />
                      <span className='text-[var(--secondary-color)] font-semibold'>Rank #{userData.stats.globalRank}</span>
                    </div>
                    <div className='flex items-center gap-1 px-3 py-1 bg-[rgba(16,185,129,0.1)] rounded-full text-sm'>
                      <span className='text-green-600 text-xs'>●</span>
                      <span className='text-[var(--secondary-color)] font-medium'>{userData.status}</span>
                    </div>
                  </div>
                  
                  <button type="button" className='w-full py-2 md:py-3 bg-[var(--accent-color)] font-bold text-white rounded-md hover:bg-[var(--dark-accent-color)] transition-all duration-300' onClick={() => {
                    alert("This feature is not available yet")
                  }}>Edit Profile</button>
                </div>

                <hr className='border-t-2 border-[var(--french-gray)]' />

                {/* Community Stats Section */}
                <div className='flex flex-col gap-5'>
                  <h5 className='font-bold text-xl md:text-2xl text-[var(--secondary-color)] mb-2'>Community Stats</h5>
                  <div className='flex flex-col gap-4'>
                    <div className='flex gap-3 items-center'>
                      <div className='text-orange-500 text-2xl md:text-3xl'><FaFire /></div>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-[var(--secondary-color)]'>Current Streak <span className='font-bold'>{userData.stats.currentStreak} days</span></p>
                        <span className='text-xs text-[var(--french-gray)]'>Best: {userData.stats.longestStreak} days</span>
                      </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <div className='text-[#10b981] text-2xl md:text-3xl'><FaCheckCircle /></div>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-[var(--secondary-color)]'>Problems Solved <span className='font-bold'>{totalSolved}</span></p>
                        <span className='text-xs text-[var(--french-gray)]'>Out of {totalProblems} total</span>
                      </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <div className='text-blue-500 text-2xl md:text-3xl'><FaChartLine /></div>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-[var(--secondary-color)]'>Accuracy <span className='font-bold'>{userData.stats.accuracy}%</span></p>
                        <span className='text-xs text-[var(--french-gray)]'>{userData.stats.accuracyDetail.correct} correct · {userData.stats.accuracyDetail.wrong} wrong</span>
                      </div>
                    </div>
                  </div>

                  <ReputationBadge
                    value={userData.stats.reputation}
                    currentStreak={userData.stats.currentStreak}
                    longestStreak={userStats.longestStreak}
                    problemsSolved={totalSolved}
                  />
                </div>

                <hr className='border-t-2 border-[var(--french-gray)]' />

                {/* Topics Section */}
                <div className='flex flex-col gap-5'>
                  <div className='flex items-center justify-between gap-3 flex-wrap'>
                    <h5 className='font-bold text-xl md:text-2xl text-[var(--secondary-color)]'>Topics</h5>
                    <ProfileExportButtons />
                  </div>
                  <div className='flex gap-2 md:gap-3 flex-wrap'>
                    {userData.mathTopics.map((topic, i) => (
                      <p key={i} className='rounded-2xl bg-[var(--french-gray)] px-3 py-1 max-h-8 hover:scale-105 duration-150 transition-all text-[var(--secondary-color)] cursor-default'>{topic}</p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Stacked cards */}
            <div className='lg:col-span-2 flex flex-col gap-4'>
              {/* Statistics Card */}
              <motion.div
                className='bg-[var(--main-color)] rounded-xl shadow-lg p-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h5 className='font-bold text-xl md:text-2xl text-[var(--secondary-color)] mb-4'>Statistics</h5>
                <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                  {/* Circular Progress Indicator */}
                  <div
                    className='relative flex flex-col w-full md:flex-1 justify-center items-center cursor-pointer group'
                    onMouseEnter={() => setShowAccuracy(true)}
                    onMouseLeave={() => setShowAccuracy(false)}
                  >
                    {/* SVG Circle Progress */}
                    <svg className='w-48 h-48 md:w-56 md:h-56 transform -rotate-90' viewBox="0 0 200 200">
                      {/* Full background circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                      />

                      {/* Easy segment (green) - 0 to 120 degrees */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        stroke="#10b981"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(userData.stats.easy.solved / userData.stats.easy.total) * 167} ${502 - (userData.stats.easy.solved / userData.stats.easy.total) * 167}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />

                      {/* Medium segment (yellow) - 125 to 245 degrees */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        stroke="#a16207"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(userData.stats.medium.solved / userData.stats.medium.total) * 167} ${502 - (userData.stats.medium.solved / userData.stats.medium.total) * 167}`}
                        strokeDashoffset="-172"
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />

                      {/* Hard segment (red) - 250 to 370 degrees */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        stroke="var(--dark-accent-color)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(userData.stats.hard.solved / userData.stats.hard.total) * 167} ${502 - (userData.stats.hard.solved / userData.stats.hard.total) * 167}`}
                        strokeDashoffset="-344"
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>

                    {/* Center Text */}
                    <div className='absolute inset-0 flex flex-col justify-center items-center font-medium text-center pointer-events-none'>
                      <div className={`transition-all duration-300 ${showAccuracy ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} absolute`}>
                        <p className='text-xl text-[var(--secondary-color)]'><span className='text-4xl font-bold'>{totalSolved}</span>/{totalProblems}</p>
                        <div className='flex justify-center gap-1 items-center'>
                          <FaCheckCircle className='text-[#10b981]' />
                          <p className='text-[var(--secondary-color)] text-md'>Solved</p>
                        </div>
                      </div>
                      <div className={`transition-all duration-300 ${showAccuracy ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} absolute`}>
                        <p className='text-3xl font-bold text-[var(--secondary-color)]'>{userData.stats.accuracy}%</p>
                        <p className='text-md font-medium text-[var(--secondary-color)]'>Accuracy</p>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Breakdown */}
                  <div className='w-full md:w-auto flex md:flex-col gap-2 md:gap-3 justify-center'>
                    <div className='bg-[var(--french-gray)] rounded-lg text-center flex flex-col font-bold py-2 px-3 md:px-4 flex-1 md:flex-none md:min-w-[100px]'>
                      <p className='text-teal-700 text-sm md:text-base'>Easy:</p>
                      <p className='text-sm md:text-base text-[var(--secondary-color)]'>{userData.stats.easy.solved}/{userData.stats.easy.total}</p>
                    </div>

                    <div className='bg-[var(--french-gray)] rounded-lg text-center flex flex-col font-bold py-2 px-3 md:px-4 flex-1 md:flex-none md:min-w-[100px]'>
                      <p className='text-yellow-700 text-sm md:text-base'>Medium:</p>
                      <p className='text-sm md:text-base text-[var(--secondary-color)]'>{userData.stats.medium.solved}/{userData.stats.medium.total}</p>
                    </div>

                    <div className='bg-[var(--french-gray)] rounded-lg text-center flex flex-col font-bold py-2 px-3 md:px-4 flex-1 md:flex-none md:min-w-[100px]'>
                      <p className='text-[var(--dark-accent-color)] text-sm md:text-base'>Hard:</p>
                      <p className='text-sm md:text-base text-[var(--secondary-color)]'>{userData.stats.hard.solved}/{userData.stats.hard.total}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Solved Problems Card */}
              <motion.div
                className='bg-[var(--main-color)] rounded-xl shadow-lg p-6 flex flex-col gap-5'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h5 className='font-bold text-xl md:text-2xl text-[var(--secondary-color)] mb-4'>Solved Problems</h5>
                <div className='flex flex-col gap-1 text-[var(--secondary-color)] hover:text-black'>
                  {userData.problemsSolved.map((problem, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Link
                        to={`/problems/${problem.groupId}/${problem.id}`}
                        className={`w-full px-5 py-4 transition-all hover:-translate-x-1 text-[var(--secondary-color)] duration-150 rounded-md text-md block ${i % 2 === 0 ? 'bg-[var(--french-gray)]' : 'bg-[var(--main-color)]'}`}>{problem.title}</Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;