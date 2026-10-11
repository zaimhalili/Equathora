import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReputationBadge from '../components/ReputationBadge';
import EditProfileModal from '../components/EditProfileModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaCheckCircle, FaChartLine } from 'react-icons/fa';
import ProfileExportButtons from '../components/ProfileExportButtons';
import { generateProblemSlug } from '../lib/slugify';
import { formatTopicLabel } from '../lib/utils';
import { FaLandmark } from 'react-icons/fa';
import { useProfileData } from '../hooks/useProfileData';

const Profile = () => {
  const Motion = motion;
  const { profile } = useParams();
  const [showAccuracy, setShowAccuracy] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { userData, loading, viewingOwnProfile, handleProfileSave } = useProfileData(profile);

  useEffect(() => {
    setIsEditModalOpen(false);
  }, [profile]);

  if (loading || !userData) {
    return <LoadingSpinner message="Loading profile..." />;
  }
  const difficultyStats = Array.isArray(userData.stats.difficulties) ? userData.stats.difficulties : [];
  const totalProblems = Number.isFinite(userData.stats.totalProblems)
    ? userData.stats.totalProblems
    : difficultyStats.reduce((sum, difficulty) => sum + Number(difficulty.total || 0), 0);
  const totalSolved = Number.isFinite(userData.stats.problemsSolved)
    ? userData.stats.problemsSolved
    : difficultyStats.reduce((sum, difficulty) => sum + Number(difficulty.solved || 0), 0);

  const circleRadius = 80;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const segmentCount = Math.max(difficultyStats.length, 1);
  const segmentLength = circleCircumference / segmentCount;
  const segmentGap = 4;


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className='bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed flex justify-center'>
        <div className='w-full max-w-[1500px] px-[4vw] xl:px-[6vw] pt-5 pb-20'>
          {/* Two Column Layout */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>

            {/* Left Column - Combined Profile, Stats, and Topics */}
            <Motion.div
              className='lg:col-span-1 flex flex-col gap-4'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Combined Card */}
              <div className='bg-(--main-color) rounded-xl shadow-lg p-6 flex flex-col gap-6'>
                {/* Profile Header Section */}
                <div className='flex flex-col gap-5'>
                  <div className='flex gap-4 items-center pb-4'>
                    <img
                      src={userData.avatar_url && userData.avatar_url.trim() !== ''
                        ? userData.avatar_url
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=d90429&color=fff&size=128&bold=true`}
                      alt="Profile Picture"
                      className='rounded-xl h-20 w-20 md:h-24 md:w-24 object-cover'
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=d90429&color=fff&size=128&bold=true`;
                      }}
                    />
                    <div className='text-(--secondary-color)  flex flex-col justify-between gap-1'>
                      <div>
                        <h5 className='font-bold text-xl md:text-2xl truncate max-w-[11ch] text-overflow: ellipsis'>{userData.name}</h5>
                        <h5 className='font-light text-md md:text-lg'>@{userData.username}</h5>
                      </div>
                      <h6 className='text-md md:text-lg'>Rank <span className='font-bold'>{userData.stats.globalRank}</span></h6>
                    </div>
                  </div>
                  {userData.bio && (
                    <p className='text-sm text-(--secondary-color) italic'>{userData.bio}</p>
                  )}
                  {userData.location && (
                    <p className='text-xs text-(--mid-main-secondary) flex gap-1'>
                      <FaLandmark></FaLandmark> {userData.location}</p>
                  )}
                  {userData.website && (
                    <a
                      href={userData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className='text-xs text-(--accent-color) hover:underline'
                    >
                      Ã°Å¸â€â€” {userData.website}
                    </a>
                  )}
                  {viewingOwnProfile && (
                    <button
                      type="button"
                      className='w-full py-2 md:py-3 bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] font-bold text-white rounded-xl transition-all duration-300 cursor-pointer active:scale-95 hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))]'
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <hr className='border-t-2 border-(--mid-main-secondary)' />

                {/* Community Stats Section */}
                <div className='flex flex-col gap-5'>
                  <h5 className='font-bold text-xl md:text-2xl text-(--secondary-color) pb-4'>Community Stats</h5>
                  <div className='flex flex-col gap-4'>
                    <div className='flex gap-3 items-center'>
                      <svg className="w-6 h-6" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="icon-gradient-fire-sidebar" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--dark-accent-color)" />
                            <stop offset="100%" stopColor="var(--accent-color)" />
                          </linearGradient>
                        </defs>
                        <path fill="url(#icon-gradient-fire-sidebar)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
                      </svg>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-(--secondary-color)'>Streak <span className='font-bold'>{userData.stats.currentStreak}</span></p>
                      </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <div className='text-[#10b981] text-2xl md:text-3xl'><FaCheckCircle /></div>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-(--secondary-color)'>Solved <span className='font-bold'>{totalSolved}</span></p>
                      </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <div className='text-blue-500 text-2xl md:text-3xl'><FaChartLine /></div>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-(--secondary-color)'>Accuracy <span className='font-bold'>{userData.stats.accuracy === null ? 'N/A' : `${userData.stats.accuracy}%`}</span></p>
                        <span className='text-xs text-(--mid-main-secondary)'>
                          {userData.stats.accuracyDetail.total > 0
                            ? `${userData.stats.accuracyDetail.correct} correct Ã‚Â· ${userData.stats.accuracyDetail.wrong} wrong`
                            : 'No attempts tracked'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ReputationBadge
                    value={userData.stats.reputation}
                    currentStreak={userData.stats.currentStreak}
                    longestStreak={userData.stats.longestStreak}
                    problemsSolved={totalSolved}
                  />
                </div>

                <hr className='border-t-2 border-(--mid-main-secondary)' />

                {/* Topics Section */}
                <div className='flex flex-col gap-5'>
                  <div className='flex items-center justify-between gap-3 flex-wrap'>
                    <h5 className='font-bold text-xl md:text-2xl text-(--secondary-color)'>Topics</h5>
                    {viewingOwnProfile && <ProfileExportButtons />}
                  </div>
                  <div className='flex gap-2 md:gap-3 flex-wrap'>
                    {userData.mathTopics.length > 0 ? (
                      userData.mathTopics.map((topic, i) => (
                        <p key={i} className='rounded-xl bg-(--french-gray) px-3 py-1 max-h-8 hover:scale-105 duration-150 transition-all text-(--secondary-color) cursor-default'>{formatTopicLabel(topic)}</p>
                      ))
                    ) : (
                      <p className='text-sm text-(--french-gray) italic'>No topic data yet. Solve a few problems and your strongest topics will appear here.</p>
                    )}
                  </div>
                </div>
              </div>
            </Motion.div>

            {/* Right Column - Stacked cards */}
            <div className='lg:col-span-2 flex flex-col gap-4'>
              {/* Statistics Card */}
              <Motion.div
                className='bg-(--main-color) rounded-xl shadow-lg p-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h5 className='font-bold text-xl md:text-2xl text-(--secondary-color) pb-4'>Statistics</h5>
                <div className='flex flex-wrap items-center gap-2 pb-3'>
                  {difficultyStats.map((difficulty, index) => (
                    <div
                      key={`difficulty-top-${difficulty.key}-${index}`}
                      className='inline-flex items-center gap-1.5 px-2 py-1 rounded-xl text-[11px] font-semibold bg-(--white)'
                    >
                      <span className='inline-block w-2 h-2 rounded-full' style={{ backgroundColor: difficulty.color }} />
                      <span>{difficulty.label}</span>
                      <span className='opacity-75'>{difficulty.solved}/{difficulty.total}</span>
                    </div>
                  ))}
                </div>
                <div className='flex justify-center items-center'>
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
                        stroke="rgba(148,163,184,0.28)"
                        strokeWidth="12"
                        fill="none"
                      />

                      {difficultyStats.map((difficulty, index) => (
                        <circle
                          key={`track-${difficulty.key}-${index}`}
                          cx="100"
                          cy="100"
                          r="80"
                          stroke="rgba(148,163,184,0.35)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${Math.max(segmentLength - segmentGap, 0)} ${circleCircumference}`}
                          strokeDashoffset={`${-(segmentLength * index)}`}
                          strokeLinecap="round"
                        />
                      ))}

                      {difficultyStats.map((difficulty, index) => {
                        const solvedRatio = difficulty.total > 0 ? difficulty.solved / difficulty.total : 0;
                        const solvedLength = Math.max((segmentLength - segmentGap) * solvedRatio, 0);

                        return (
                          <circle
                            key={`solved-${difficulty.key}-${index}`}
                            cx="100"
                            cy="100"
                            r="80"
                            stroke={difficulty.color}
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${solvedLength} ${circleCircumference}`}
                            strokeDashoffset={`${-(segmentLength * index)}`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        );
                      })}
                    </svg>

                    {/* Center Text */}
                    <div className='absolute inset-0 flex flex-col justify-center items-center font-medium text-center pointer-events-none'>
                      <div className={`transition-all duration-300 ${showAccuracy ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} absolute`}>
                        <p className='text-xl text-(--secondary-color)'><span className='text-4xl font-bold'>{totalSolved}</span>/{totalProblems}</p>
                        <div className='flex justify-center gap-1 items-center'>
                          <FaCheckCircle className='text-[#16a34a]' />
                          <p className='text-(--secondary-color) text-md'>Solved</p>
                        </div>
                      </div>
                      <div className={`transition-all duration-300 ${showAccuracy ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} absolute`}>
                        <p className='text-3xl font-bold text-(--secondary-color)'>{userData.stats.accuracy === null ? 'N/A' : `${userData.stats.accuracy}%`}</p>
                        <p className='text-md font-medium text-(--secondary-color)'>Accuracy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Motion.div>

              {/* Solved Problems Card */}
              <Motion.div
                className='bg-(--main-color) rounded-xl shadow-lg p-6 flex flex-col'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h5 className='font-bold text-xl md:text-2xl text-(--secondary-color) pb-4'>Solved Problems</h5>
                <div className='flex flex-col gap-1 text-(--secondary-color) hover:text-[var(--raisin-black)]'>
                  {userData.problemsSolved.map((problem, i) => (
                    <Motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Link
                        to={`/problems/${problem.slug || generateProblemSlug(problem.title, problem.id)}`}
                        className={`w-full px-5 py-4 transition-all hover:-translate-x-1 text-(--secondary-color) duration-150 rounded-xl text-md block ${i % 2 === 0 ? 'bg-(--french-gray)' : 'bg-(--main-color)'}`}>{problem.title}</Link>
                    </Motion.div>
                  ))}
                </div>
              </Motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default Profile;