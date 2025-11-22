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
      hard: { solved: 15, total: 44, accuracy: 78 }
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
      <main className='bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] px-3 md:px-[30px] [@media(min-width:1600px)]:px-[12vw] pt-5 pb-20'>
        <div className='mx-auto'>
          {/* Two Column Layout */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            {/* Left Column - Combined Profile, Stats, and Topics */}
            <div className='lg:col-span-1 flex flex-col gap-4'>
              {/* Combined Card */}
              <div className='bg-[var(--main-color)] rounded-xl shadow-lg p-6 flex flex-col gap-6'>
                {/* Profile Header Section */}
                <div className='flex flex-col gap-5'>
                  <div className='flex gap-4 items-center mb-4'>
                    <img src={Autumn} alt="Profile Picture" className='rounded-md h-20 w-20 md:h-24 md:w-24' />
                    <div className='text-[var(--secondary-color)] font-[Inter] flex flex-col justify-between gap-1'>
                      <div>
                        <h5 className='font-bold text-xl md:text-2xl'>{userData.name}</h5>
                        <h5 className='font-light text-md md:text-lg'>{userData.username}</h5>
                      </div>
                      <h6 className='text-md md:text-lg'>Rank <span className='font-bold'>{userData.stats.globalRank}</span></h6>
                    </div>
                  </div>
                  <button type="button" className='w-full py-2 md:py-3 bg-[var(--accent-color)] font-bold text-white rounded-md cursor-pointer hover:bg-[var(--dark-accent-color)] transition-all duration-300'>Edit Profile</button>
                </div>

                <hr className='border-t-2 border-[var(--french-gray)]' />

                {/* Community Stats Section */}
                <div className='flex flex-col gap-5'>
                  <h5 className='font-bold text-xl md:text-2xl text-[var(--secondary-color)] mb-4'>Community Stats</h5>
                  <div className='flex flex-col gap-4'>
                    <div className='flex gap-3 items-center'>
                      <div className='text-orange-500 text-2xl md:text-3xl'><FaFire /></div>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-[var(--secondary-color)]'>Streak <span className='font-bold'>{userData.stats.currentStreak}</span></p>
                      </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <div className='text-[#10b981] text-2xl md:text-3xl'><FaCheckCircle /></div>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-[var(--secondary-color)]'>Solved <span className='font-bold'>{userData.stats.problemsSolved}</span></p>
                      </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <div className='text-yellow-500 text-2xl md:text-3xl'><FaTrophy /></div>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-[var(--secondary-color)]'>Reputation <span className='font-bold'>{userData.stats.reputation}</span></p>
                      </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <div className='text-blue-500 text-2xl md:text-3xl'><FaChartLine /></div>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-[var(--secondary-color)]'>Accuracy <span className='font-bold'>{userData.stats.accuracy}%</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className='border-t-2 border-[var(--french-gray)]' />

                {/* Topics Section */}
                <div className='flex flex-col gap-5'>
                  <h5 className='font-bold text-xl md:text-2xl text-[var(--secondary-color)] mb-4'>Topics</h5>
                  <div className='flex gap-2 md:gap-3 flex-wrap'>
                    {userData.mathTopics.map((topic, i) => (
                      <p key={i} className='rounded-2xl bg-[var(--french-gray)] px-3 py-1 max-h-8 hover:scale-105 duration-150 transition-all text-[var(--secondary-color)] cursor-default'>{topic}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stacked cards */}
            <div className='lg:col-span-2 flex flex-col gap-4'>
              {/* Statistics Card */}
              <div className='bg-[var(--main-color)] rounded-xl shadow-lg p-6'>
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
              </div>

              {/* Solved Problems Card */}
              <div className='bg-[var(--main-color)] rounded-xl shadow-lg p-6 flex flex-col gap-5'>
                <h5 className='font-bold text-xl md:text-2xl text-[var(--secondary-color)] mb-4'>Solved Problems</h5>
                <div className='flex flex-col gap-1 text-[var(--secondary-color)] hover:text-black'>
                  {userData.problemsSolved.map((problem, i) => (
                    <Link
                      key={i}
                      to="/*"
                      className={`w-full px-5 py-4 hover:scale-99 transition-all text-[var(--secondary-color)] duration-300 rounded-md text-md ${i % 2 === 0 ? 'bg-[var(--french-gray)]' : 'bg-[var(--main-color)]'}`}>{problem}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;