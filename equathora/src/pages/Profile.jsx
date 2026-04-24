import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReputationBadge from '../components/ReputationBadge';
import EditProfileModal from '../components/EditProfileModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaFire, FaCheckCircle, FaTrophy, FaChartLine } from 'react-icons/fa';
import { getAllProblems } from '../lib/problemService';
import { supabase } from '../lib/supabaseClient';
import ProfileExportButtons from '../components/ProfileExportButtons';
import { generateProblemSlug } from '../lib/slugify';
import { getCachedGlobalLeaderboard } from '../lib/leaderboardService';
import { formatTopicLabel } from '../lib/utils';
import { FaLandmark } from 'react-icons/fa';
import { FaLocationArrow } from 'react-icons/fa';

const getEffectiveStreak = (currentStreak = 0, lastActivityDate = null) => {
  if (!currentStreak || currentStreak <= 0) return 0;
  if (!lastActivityDate) return currentStreak;

  const todayUtc = new Date();
  todayUtc.setUTCHours(0, 0, 0, 0);

  const lastUtc = new Date(lastActivityDate);
  if (Number.isNaN(lastUtc.getTime())) return currentStreak;
  lastUtc.setUTCHours(0, 0, 0, 0);

  const diffDays = Math.floor((todayUtc.getTime() - lastUtc.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 1 ? currentStreak : 0;
};

const normalizeCompletedProblemId = (rawValue) => {
  if (rawValue === null || rawValue === undefined) return '';

  if (typeof rawValue === 'string' && rawValue.startsWith('{')) {
    try {
      const parsed = JSON.parse(rawValue);
      return String(parsed?.problemId ?? parsed?.id ?? '').trim();
    } catch {
      return '';
    }
  }

  return String(rawValue).trim();
};

const difficultyDisplayRank = {
  beginner: 1,
  easy: 2,
  standard: 3,
  intermediate: 4,
  medium: 5,
  challenging: 6,
  hard: 7,
  advanced: 8,
  expert: 9,
};

const difficultyPalette = [
  '#2563eb',
  '#7c3aed',
  '#0f766e',
  '#be123c',
  '#0ea5e9',
  '#f97316',
  '#6366f1'
];

const normalizeDifficultyKey = (difficulty) => String(difficulty || '').trim().toLowerCase();

const formatDifficultyLabel = (difficulty) => {
  const raw = String(difficulty || '').trim();
  if (!raw) return 'Unspecified';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const getDifficultyColor = (difficultyKey, index) => {
  // Keep colors aligned with Learn active difficulty pills.
  if (difficultyKey === 'easy') return '#16a34a';
  if (difficultyKey === 'medium') return '#d97706';
  if (difficultyKey === 'hard') return '#a3142c';
  return difficultyPalette[index % difficultyPalette.length];
};

const getDifficultyChipBackground = (difficultyKey) => {
  return 'var(--white)';
};

const calculateProfileAccuracy = (totalAttempts = 0, wrongSubmissions = 0, solvedCount = 0) => {
  if (totalAttempts > 0) {
    const correctSubmissions = totalAttempts - (wrongSubmissions || 0);
    return Math.max(0, Math.min(100, Math.round((correctSubmissions / totalAttempts) * 100)));
  }

  if (solvedCount > 0) {
    return null;
  }

  return 0;
};

const Profile = () => {
  const { profile } = useParams();
  const [showAccuracy, setShowAccuracy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingOwnProfile, setViewingOwnProfile] = useState(false);
  const fetchRequestIdRef = useRef(0);

  const handleProfileSave = useCallback((updatedData) => {
    setUserData(prevData => ({
      ...prevData,
      name: updatedData.name ?? prevData.name,
      username: updatedData.username ?? prevData.username,
      bio: updatedData.bio ?? prevData.bio,
      location: updatedData.location ?? prevData.location,
      website: updatedData.website ?? prevData.website,
      avatar_url: updatedData.avatar_url ?? prevData.avatar_url
    }));
  }, []);

  useEffect(() => {
    const requestId = ++fetchRequestIdRef.current;
    let isActive = true;

    const fetchUserData = async () => {
      setLoading(true);
      setUserData(null);
      setViewingOwnProfile(false);
      setIsEditModalOpen(false);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No session found');
          return;
        }

        const isMyProfileAlias = profile === 'myprofile' || profile === 'me';
        const targetUserId = isMyProfileAlias || !profile ? session.user.id : profile;
        const isSelf = targetUserId === session.user.id;
        if (!isActive || fetchRequestIdRef.current !== requestId) return;
        setViewingOwnProfile(isSelf);

        // Pull profile, progress, streak, and leaderboard data for the target user
        const [
          { data: profileRow },
          { data: progressRow },
          { data: streakRow },
          { data: leaderboardRow },
          { data: submissionsRow, error: submissionsError }
        ] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', targetUserId).maybeSingle(),
          supabase.from('user_progress').select('*').eq('user_id', targetUserId).maybeSingle(),
          supabase.from('user_streak_data').select('*').eq('user_id', targetUserId).maybeSingle(),
          supabase.from('leaderboard_view').select('*').eq('user_id', targetUserId).maybeSingle(),
          isSelf
            ? supabase.from('user_submissions').select('problem_id, is_correct').eq('user_id', targetUserId)
            : Promise.resolve({ data: [], error: null })
        ]);

        const { data: completedRows } = await supabase
          .from('user_completed_problems')
          .select('problem_id')
          .eq('user_id', targetUserId);

        const completedIds = Array.from(
          new Set(
            (completedRows || [])
              .map((row) => normalizeCompletedProblemId(row.problem_id))
              .filter(Boolean)
          )
        );

        const allProblems = await getAllProblems().catch(err => {
          console.error('Error fetching all problems:', err);
          return [];
        });

        // Use problems from database only (no local fallback)
        const problemList = allProblems;

        const meta = isSelf ? session.user.user_metadata : {};

        const displayName = profileRow?.full_name ?? profileRow?.username ?? meta.full_name ?? meta.name ?? session.user.email?.split('@')[0] ?? 'Student';
        const username = profileRow?.username ?? meta.preferred_username ?? session.user.email?.split('@')[0] ?? 'student';
        const avatarUrl = profileRow?.avatar_url ?? meta.avatar_url ?? meta.picture ?? meta.image ?? meta.photo_url ?? '';
        const bio = profileRow?.bio ?? meta.bio ?? '';
        const location = profileRow?.location ?? meta.location ?? '';
        const website = profileRow?.website ?? meta.website ?? '';

        // Filter completed problems by valid problem IDs (consistent with Statistics and YourTrack)
        const validProblemIds = new Set((problemList || []).map(p => String(p.id)));
        const validCompletedIds = completedIds.filter(id => validProblemIds.has(String(id)));
        const completedProblems = problemList.filter(p => validCompletedIds.includes(String(p.id)));

        // Calculate stats (scope solved to current problems list)
        const solved = completedProblems.length;
        const wrongSubmissionsRaw = Number(progressRow?.wrong_submissions ?? 0);
        const totalAttemptsRaw = Number(progressRow?.total_attempts ?? 0);
        let wrongSubmissions = Number.isFinite(wrongSubmissionsRaw) ? wrongSubmissionsRaw : 0;
        let totalAttempts = Number.isFinite(totalAttemptsRaw) ? totalAttemptsRaw : 0;
        let correctSubmissions = totalAttempts > 0
          ? Math.max(totalAttempts - wrongSubmissions, 0)
          : 0;

        // Prefer per-submission counters for own profile when aggregated counters look stale.
        const validProblemIdSet = new Set((problemList || []).map((problem) => String(problem.id)));
        const validSubmissions = (submissionsRow || []).filter((submission) =>
          validProblemIdSet.has(String(submission?.problem_id ?? ''))
        );
        const submissionAttempts = validSubmissions.length;
        const submissionWrong = validSubmissions.filter((submission) => submission?.is_correct === false).length;
        const submissionCorrect = Math.max(submissionAttempts - submissionWrong, 0);

        const hasSubmissionSignal = isSelf && !submissionsError && submissionAttempts > 0;
        const countersInconsistentWithSolved = correctSubmissions > solved;
        const countersFarFromSubmissions = hasSubmissionSignal
          ? Math.abs(totalAttempts - submissionAttempts) > Math.max(5, Math.floor(submissionAttempts * 0.5))
          : false;

        if (hasSubmissionSignal && (totalAttempts === 0 || countersInconsistentWithSolved || countersFarFromSubmissions)) {
          totalAttempts = submissionAttempts;
          wrongSubmissions = submissionWrong;
          correctSubmissions = submissionCorrect;
        } else if (isSelf && !hasSubmissionSignal && countersInconsistentWithSolved) {
          correctSubmissions = solved;
          totalAttempts = solved;
          wrongSubmissions = 0;
        }

        const accuracy = calculateProfileAccuracy(totalAttempts, wrongSubmissions, solved);

        // Use solved count from completedProblems filtered by valid IDs (consistent with YourTrack and Statistics)
        const finalSolved = solved;

        const difficultyMap = new Map();

        for (const problem of problemList) {
          const key = normalizeDifficultyKey(problem?.difficulty);
          const label = formatDifficultyLabel(problem?.difficulty);
          const existing = difficultyMap.get(key) || { key, label, solved: 0, total: 0 };
          existing.total += 1;
          if (existing.label === 'Unspecified' && label !== 'Unspecified') {
            existing.label = label;
          }
          difficultyMap.set(key, existing);
        }

        for (const problem of completedProblems) {
          const key = normalizeDifficultyKey(problem?.difficulty);
          const label = formatDifficultyLabel(problem?.difficulty);
          const existing = difficultyMap.get(key) || { key, label, solved: 0, total: 0 };
          existing.solved += 1;
          difficultyMap.set(key, existing);
        }

        const difficultyBreakdown = Array.from(difficultyMap.values())
          .sort((a, b) => {
            const rankDiff = (difficultyDisplayRank[a.key] ?? 99) - (difficultyDisplayRank[b.key] ?? 99);
            if (rankDiff !== 0) return rankDiff;
            return a.label.localeCompare(b.label);
          })
          .map((difficulty, index) => ({
            ...difficulty,
            percentage: difficulty.total > 0
              ? Math.round((difficulty.solved / difficulty.total) * 100)
              : 0,
            color: getDifficultyColor(difficulty.key, index)
          }));

        const totalProblemsCount = problemList.length;
        const effectiveCurrentStreak = getEffectiveStreak(streakRow?.current_streak || 0, streakRow?.last_activity_date || null);
        const rawReputation = Number(progressRow?.reputation ?? 0);
        const reputationValue = Number.isFinite(rawReputation) ? Math.max(rawReputation, 0) : 0;

        let resolvedGlobalRank = leaderboardRow?.rank || 0;
        if (!resolvedGlobalRank) {
          try {
            const globalLeaderboard = await getCachedGlobalLeaderboard();
            const leaderboardEntry = (globalLeaderboard || []).find(entry => entry.userId === targetUserId);
            resolvedGlobalRank = leaderboardEntry?.rank || 0;
          } catch (rankError) {
            console.warn('Could not resolve rank from global leaderboard fallback:', rankError);
          }
        }

        const newUserData = {
          name: displayName,
          username: username,
          bio,
          location,
          website,
          avatar_url: avatarUrl,
          title: 'Problem Solver ∑',
          status: isSelf ? 'Online' : 'Viewing',
          stats: {
            problemsSolved: finalSolved,
            accuracy: accuracy,
            accuracyDetail: {
              correct: correctSubmissions,
              wrong: wrongSubmissions,
              total: totalAttempts
            },
            currentStreak: effectiveCurrentStreak,
            longestStreak: streakRow?.longest_streak || 0,
            reputation: reputationValue,
            globalRank: resolvedGlobalRank,
            totalProblems: totalProblemsCount,
            difficulties: difficultyBreakdown
          },
          mathTopics: [...new Set(completedProblems.map(p => p.topic).filter(Boolean))],
          problemsSolved: completedProblems.slice(-10).reverse()
        };

        if (!isActive || fetchRequestIdRef.current !== requestId) return;
        setUserData(newUserData);

      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        if (isActive && fetchRequestIdRef.current === requestId) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isActive = false;
    };
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
            <motion.div
              className='lg:col-span-1 flex flex-col gap-4'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Combined Card */}
              <div className='bg-[var(--main-color)] rounded-md shadow-lg p-6 flex flex-col gap-6'>
                {/* Profile Header Section */}
                <div className='flex flex-col gap-5'>
                  <div className='flex gap-4 items-center pb-4'>
                    <img
                      src={userData.avatar_url && userData.avatar_url.trim() !== ''
                        ? userData.avatar_url
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=d90429&color=fff&size=128&bold=true`}
                      alt="Profile Picture"
                      className='rounded-md h-20 w-20 md:h-24 md:w-24 object-cover'
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=d90429&color=fff&size=128&bold=true`;
                      }}
                    />
                    <div className='text-[var(--secondary-color)] font-[Sansation] flex flex-col justify-between gap-1'>
                      <div>
                        <h5 className='font-bold text-xl md:text-2xl truncate max-w-[11ch] text-overflow: ellipsis'>{userData.name}</h5>
                        <h5 className='font-light text-md md:text-lg'>@{userData.username}</h5>
                      </div>
                      <h6 className='text-md md:text-lg'>Rank <span className='font-bold'>{userData.stats.globalRank}</span></h6>
                    </div>
                  </div>
                  {userData.bio && (
                    <p className='text-sm text-[var(--secondary-color)] italic'>{userData.bio}</p>
                  )}
                  {userData.location && (
                    <p className='text-xs text-[var(--mid-main-secondary)] flex gap-1'>
                      <FaLandmark></FaLandmark> {userData.location}</p>
                  )}
                  {userData.website && (
                    <a
                      href={userData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className='text-xs text-[var(--accent-color)] hover:underline'
                    >
                      🔗 {userData.website}
                    </a>
                  )}
                  {viewingOwnProfile && (
                    <button
                      type="button"
                      className='w-full py-2 md:py-3 bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] font-bold text-white rounded-md transition-all duration-300 cursor-pointer active:scale-95 hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))]'
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <hr className='border-t-2 border-[var(--mid-main-secondary)]' />

                {/* Community Stats Section */}
                <div className='flex flex-col gap-5'>
                  <h5 className='font-bold text-xl md:text-2xl text-[var(--secondary-color)] pb-4'>Community Stats</h5>
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
                        <p className='text-sm md:text-base text-[var(--secondary-color)]'>Streak <span className='font-bold'>{userData.stats.currentStreak}</span></p>
                      </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <div className='text-[#10b981] text-2xl md:text-3xl'><FaCheckCircle /></div>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-[var(--secondary-color)]'>Solved <span className='font-bold'>{totalSolved}</span></p>
                      </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <div className='text-blue-500 text-2xl md:text-3xl'><FaChartLine /></div>
                      <div className='flex flex-col'>
                        <p className='text-sm md:text-base text-[var(--secondary-color)]'>Accuracy <span className='font-bold'>{userData.stats.accuracy === null ? 'N/A' : `${userData.stats.accuracy}%`}</span></p>
                        <span className='text-xs text-[var(--mid-main-secondary)]'>
                          {userData.stats.accuracyDetail.total > 0
                            ? `${userData.stats.accuracyDetail.correct} correct · ${userData.stats.accuracyDetail.wrong} wrong`
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

                <hr className='border-t-2 border-[var(--mid-main-secondary)]' />

                {/* Topics Section */}
                <div className='flex flex-col gap-5'>
                  <div className='flex items-center justify-between gap-3 flex-wrap'>
                    <h5 className='font-bold text-xl md:text-2xl text-[var(--secondary-color)]'>Topics</h5>
                    {viewingOwnProfile && <ProfileExportButtons />}
                  </div>
                  <div className='flex gap-2 md:gap-3 flex-wrap'>
                    {userData.mathTopics.length > 0 ? (
                      userData.mathTopics.map((topic, i) => (
                        <p key={i} className='rounded-md bg-[var(--french-gray)] px-3 py-1 max-h-8 hover:scale-105 duration-150 transition-all text-[var(--secondary-color)] cursor-default'>{formatTopicLabel(topic)}</p>
                      ))
                    ) : (
                      <p className='text-sm text-[var(--french-gray)] italic'>No topic data yet. Solve a few problems and your strongest topics will appear here.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Stacked cards */}
            <div className='lg:col-span-2 flex flex-col gap-4'>
              {/* Statistics Card */}
              <motion.div
                className='bg-[var(--main-color)] rounded-md shadow-lg p-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h5 className='font-bold text-xl md:text-2xl text-[var(--secondary-color)] pb-4'>Statistics</h5>
                <div className='flex flex-wrap items-center gap-2 pb-3'>
                  {difficultyStats.map((difficulty, index) => (
                    <div
                      key={`difficulty-top-${difficulty.key}-${index}`}
                      className='inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold'
                      style={{
                        color: difficulty.color,
                        backgroundColor: getDifficultyChipBackground(difficulty.key)
                      }}
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
                        <p className='text-xl text-[var(--secondary-color)]'><span className='text-4xl font-bold'>{totalSolved}</span>/{totalProblems}</p>
                        <div className='flex justify-center gap-1 items-center'>
                          <FaCheckCircle className='text-[#16a34a]' />
                          <p className='text-[var(--secondary-color)] text-md'>Solved</p>
                        </div>
                      </div>
                      <div className={`transition-all duration-300 ${showAccuracy ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} absolute`}>
                        <p className='text-3xl font-bold text-[var(--secondary-color)]'>{userData.stats.accuracy === null ? 'N/A' : `${userData.stats.accuracy}%`}</p>
                        <p className='text-md font-medium text-[var(--secondary-color)]'>Accuracy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Solved Problems Card */}
              <motion.div
                className='bg-[var(--main-color)] rounded-md shadow-lg p-6 flex flex-col'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h5 className='font-bold text-xl md:text-2xl text-[var(--secondary-color)] pb-4'>Solved Problems</h5>
                <div className='flex flex-col gap-1 text-[var(--secondary-color)] hover:text-[var(--raisin-black)]'>
                  {userData.problemsSolved.map((problem, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Link
                        to={`/problems/${problem.slug || generateProblemSlug(problem.title, problem.id)}`}
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