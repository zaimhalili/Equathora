import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Autumn from '../assets/images/autumn.jpg';
import { FaFire, FaCheckCircle, FaTrophy, FaChartLine } from 'react-icons/fa';

const Profile = () => {
  const { profile } = useParams();

  const [showAccuracy, setShowAccuracy] = useState(false);

  // Mock user data - will be replaced with real data from backend
  const [userData] = useState({
    name: 'Alex Thompson',
    username: 'alexthompson',
    title: 'Problem Solver ∑',
    status: 'Online',
    stats: {
      problemsSolved: 127,
      accuracy: 89,
      currentStreak: 15,
      reputation: 2450,
      globalRank: 3573765,
      easy: { solved: 6, total: 143, accuracy: 92 },
      medium: { solved: 10, total: 189, accuracy: 85 },
      hard: { solved: 5, total: 44, accuracy: 78 }
    },
    mathTopics: ['Algebra', 'Geometry', 'Calculus I', 'Number Theory', 'Probability', 'Graphs', 'Calculus II'],
    problemsSolved: ['I loved her', 'Pretty Eyes', 'Just once more', 'Where are you?', 'Smile please', 'Unreal situation', 'Obvious choice', 'Tough Decisions', 'First time', 'I make my choices']
  });

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
      <main className='bg-[var(--french-gray)] px-3 pt-5 pb-20 flex justify-center'>
        <section className='bg-[var(--main-color)] min-h-screen rounded-xl shadow-2xl shadow-gray-500 px-5 md:px-8 lg:px-12 py-4 flex flex-col gap-3 w-full max-w-5xl'>
          {/* First Section: profile picture, name, username, rank, 'edit profile' button */}
          <div className='flex flex-col gap-4'>
            <div className='flex gap-4 items-center'>
              <img src={Autumn} alt="Profile Picture" className='rounded-md h-20 w-20 md:h-24 md:w-24' />
              <div className='text-[var(--secondary-color)] font-[Inter] flex flex-col justify-between gap-1'>
                <div>
                  <h5 className='font-bold text-xl md:text-2xl'>{userData.name}</h5>
                  <h5 className='font-light text-md md:text-lg'>{userData.username}</h5>
                </div>
                <h6 className='text-md md:text-lg'>Rank <span className='font-bold'>{userData.stats.gloabalRank}</span></h6>
              </div>
            </div>


            <button type="button" className='w-full md:max-w-xs py-2 md:py-3 bg-[var(--accent-color)] font-bold text-white rounded-md cursor-pointer hover:bg-[var(--dark-accent-color)] transition-all duration-300'>Edit Profile</button>
            <hr className='border-t-2 border-[var(--french-gray)]' />
          </div>

          {/* Community Stats */}
          <div className='text-[var(--secondary-color)] flex flex-col gap-4'>
            <h5 className='font-bold text-xl md:text-2xl'>Community Stats</h5>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
            <div className='flex gap-3 items-center'>
              {/* Streak Icon */}
              <div className='text-orange-500 text-2xl md:text-3xl'><FaFire /></div>
              <div className='flex flex-col'>
                <p className='text-sm md:text-base'>Streak <span className='font-bold'>{userData.stats.currentStreak}</span></p>
              </div>
            </div>

            <div className='flex gap-3 items-center'>
              {/* Solution Icon */}
              <div className='text-green-500 text-2xl md:text-3xl'><FaCheckCircle /></div>
              <div className='flex flex-col'>
                <p className='text-sm md:text-base'>Solved <span className='font-bold'>{userData.stats.problemsSolved}</span></p>
              </div>
            </div>

            <div className='flex gap-3 items-center'>
              {/* Reputation Icon */}
              <div className='text-yellow-500 text-2xl md:text-3xl'><FaTrophy /></div>
              <div className='flex flex-col'>
                <p className='text-sm md:text-base'>Reputation <span className='font-bold'>{userData.stats.reputation}</span></p>
              </div>
            </div>

            <div className='flex gap-3 items-center'>
              {/* Accuracy Icon */}
              <div className='text-blue-500 text-2xl md:text-3xl'><FaChartLine /></div>
              <div className='flex flex-col'>
                <p className='text-sm md:text-base'>Accuracy <span className='font-bold'>{userData.stats.accuracy}%</span></p>
              </div>
            </div>
            </div>
            <hr className='border-t-2 border-[var(--french-gray)]' />
          </div>

          {/* Topics */}
          <div className='text-[var(--secondary-color)] flex flex-col gap-4'>
            <h5 className='font-bold text-xl md:text-2xl'>Topics</h5>
            <div className='flex gap-2 md:gap-3 flex-wrap'>
              {userData.mathTopics.map((topic, i) => (
                <p key={i} className='rounded-2xl bg-[var(--french-gray)] px-3 py-1 max-h-8 hover:scale-105 duration-150 transition-all'>{topic}</p>
              )
              )}
            </div>

            <hr className='border-t-2 border-[var(--french-gray)]' />
          </div>

          {/* Stats */}
          <div className='text-[var(--secondary-color)] flex flex-col gap-4'>
            <h5 className='font-bold text-xl md:text-2xl'>Statistics</h5>
            <div className='flex flex-col md:flex-row justify-between items-center md:items-start gap-4'>
              {/* Circular Progress Indicator */}
              <div
                className='relative flex flex-col w-full md:w-auto justify-center items-center cursor-pointer group'
                onMouseEnter={() => setShowAccuracy(true)}
                onMouseLeave={() => setShowAccuracy(false)}
              >
                {/* SVG Circle Progress */}
                <svg className='w-40 h-40 md:w-48 md:h-48 transform -rotate-90'>orm -rotate-90' viewBox="0 0 160 160">
                  {/* Background circle segments */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e5e7eb"
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray="140 10"
                    strokeLinecap="round"
                  />

                  {/* Easy progress (green) - left third */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#10b981"
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray={`${(userData.stats.easy.solved / userData.stats.easy.total) * 140} ${440 - (userData.stats.easy.solved / userData.stats.easy.total) * 140}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />

                  {/* Medium progress (yellow) - top third */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#f59e0b"
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray={`${(userData.stats.medium.solved / userData.stats.medium.total) * 140} ${440 - (userData.stats.medium.solved / userData.stats.medium.total) * 140}`}
                    strokeDashoffset="-150"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />

                  {/* Hard progress (red) - right third */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#ef4444"
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray={`${(userData.stats.hard.solved / userData.stats.hard.total) * 140} ${440 - (userData.stats.hard.solved / userData.stats.hard.total) * 140}`}
                    strokeDashoffset="-300"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>

                {/* Center Text */}
                <div className='absolute inset-0 flex flex-col justify-center items-center font-medium text-center pointer-events-none'>
                  <div className={`transition-all duration-300 ${showAccuracy ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} absolute`}>
                    <p className='text-xl'><span className='text-4xl font-bold'>{totalSolved}</span>/{totalProblems}</p>
                    <div className='flex justify-center gap-1 items-center'>
                      <FaCheckCircle className='text-green-500' />
                      <p>Solved</p>
                    </div>
                  </div>
                  <div className={`transition-all duration-300 ${showAccuracy ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} absolute`}>
                    <p className='text-3xl font-bold text-[var(--mid-main-secondary)]'>{userData.stats.accuracy}%</p>
                    <p className='text-xs font-medium text-[var(--mid-main-secondary)]'>Accuracy</p>
                  </div>
                </div>

                {/* Tooltip */}
                <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[var(--secondary-color)] text-white px-3 py-1 rounded-md text-xs whitespace-nowrap pointer-events-none'>
                  Hover to see accuracy
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className='w-full md:w-auto flex md:flex-col gap-2 md:gap-3 justify-center'>
                <div className='bg-[var(--french-gray)] rounded-lg text-center flex flex-col font-bold py-2 px-3 md:px-4 flex-1 md:flex-none md:min-w-[100px]'>
                  <p className='text-teal-700 text-sm md:text-base'>Easy:</p>
                  <p className='text-sm md:text-base'>{userData.stats.easy.solved}/{userData.stats.easy.total}</p>
                </div>

                <div className='bg-[var(--french-gray)] rounded-lg text-center flex flex-col font-bold py-2 px-3 md:px-4 flex-1 md:flex-none md:min-w-[100px]'>
                  <p className='text-yellow-700 text-sm md:text-base'>Medium:</p>
                  <p className='text-sm md:text-base'>{userData.stats.medium.solved}/{userData.stats.medium.total}</p>
                </div>

                <div className='bg-[var(--french-gray)] rounded-lg text-center flex flex-col font-bold py-2 px-3 md:px-4 flex-1 md:flex-none md:min-w-[100px]'>
                  <p className='text-[var(--dark-accent-color)] text-sm md:text-base'>Hard:</p>
                  <p className='text-sm md:text-base'>{userData.stats.hard.solved}/{userData.stats.hard.total}</p>
                </div>
              </div>
            </div>

            <hr className='border-t-2 border-[var(--french-gray)]' />
          </div>

          {/* Solved Problems List */}
          <div className='text-[var(--secondary-color)] flex flex-col gap-4'>
            <h5 className='font-bold text-xl md:text-2xl'>Solved Problems</h5>
            <div className='flex flex-col'>
              {userData.problemsSolved.map((problem, i) => (
                <Link
                  key={i}
                  to="/*"
                  className={`w-full px-5 py-5 hover:scale-99 transition-all  duration-300 bg-[var(--french-gray)] rounded-sm text-md text-[var(--secondary-color)] ${i % 2 === 0 ? 'bg-[var(--dark-accent-color)]' : 'bg-[var(--main-color)]'}`}>{problem}</Link>
              )
              )}
            </div>
          </div>
        </section>


      </main>
      <Footer />
    </div>
  );
};

export default Profile;