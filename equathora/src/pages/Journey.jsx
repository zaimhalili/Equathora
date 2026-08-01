// Journey.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getStudentProfile, getStudentTopics } from '../lib/databaseService';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import JourneyImg from '../assets/images/Journey-pana.svg';
import { getProblemsAll } from '@/lib/problemService';
import { annotateProblemStates } from '@/lib/problemProgress';
import DailyTrack from '@/components/Journey/DailyTrack';
import TopicCard from '@/components/Journey/TopicCard';
import { useResetDiagnostic } from '@/hooks/useResetDiagnostic';
import { useSubscription } from '@/hooks/SubscriptionContext.jsx';
import { FaSpinner } from 'react-icons/fa';
import { useUserStats } from '../context/UserStatsContext';

const Journey = () => {
    const { resetDiagnosticTest, loading: isResetting } = useResetDiagnostic();
    const { premium, loading: subLoading } = useSubscription();

    const [completedSet, setCompletedSet] = useState(new Set());
    const [attemptedSet, setAttemptedSet] = useState(new Set());
    const [loading, setLoading] = useState(true);

    const [studentProfile, setStudentProfile] = useState(null);
    const [studentTopics, setStudentTopics] = useState([]);
    const [allProblems, setAllProblems] = useState([]);

    const { stats } = useUserStats();

    const SUBJECT_ORDER = [
        "Algebra",
        "Geometry",
        "Functions",
        "Probability & Combinatorics",
        "Applied Mathematics"
    ];

    const DIFFICULTY_ORDER = {
        Beginner: 0,
        Easy: 1,
        Standard: 2,
        Intermediate: 3,
        Medium: 4,
        Challenging: 5,
        Hard: 6,
        Advanced: 7
    };

    // Which difficulties count as "recommended" for a given level. This no
    // longer FILTERS out other problems — it only tags them, so topics still
    // show their full problem list instead of a thin slice.
    const LEVEL_TO_DIFFICULTIES = {
        beginner: ["Beginner", "Easy", "Standard"],
        intermediate: ["Easy", "Standard", "Intermediate", "Medium"],
        advanced: ["Intermediate", "Medium", "Challenging", "Hard"],
        competitive: ["Medium", "Challenging", "Hard", "Advanced"]
    };

    // How many problems get pulled into TODAY's Daily Mission queue.
    // This is the only place weekly_commitment now limits anything —
    // Learning Paths / TopicCards always show the full set per topic.
    const DAILY_TARGET_BY_COMMITMENT = {
        "under-1": 2,
        "1-3": 3,
        "3-6": 4,
        "6+": 6
    };
    const DEFAULT_DAILY_TARGET = 3;

    // A problem only counts as something we can hand to a user right now
    // if it's either free, or the user actually has premium. Centralized
    // here (and mirrored in nextRecommendedProblem.js) so Journey's Daily
    // Mission queue and the site-wide Navbar/Sidebar "Daily Problem" link
    // never disagree about what's actually accessible.
    function isProblemAccessible(problem, hasPremium) {
        return !problem?.is_premium || hasPremium;
    }

    function getSelectedSubjects(studentTopics) {
        const selectedSubjects = new Set([
            "Applied Mathematics"
        ]);

        (studentTopics || []).forEach(({ topic }) => {
            switch (topic) {
                case "algebra":
                    selectedSubjects.add("Algebra");
                    break;
                case "geometry":
                    selectedSubjects.add("Geometry");
                    break;
                case "calculus":
                    selectedSubjects.add("Functions");
                    break;
                case "number_theory":
                case "combinatorics":
                    selectedSubjects.add("Probability & Combinatorics");
                    break;
                default:
                    break;
            }
        });

        return selectedSubjects;
    }

    function buildJourney(problems) {
        const journey = {};

        for (const p of problems || []) {
            const subject = p.subject;
            const topic = p.topic;

            if (!journey[subject]) journey[subject] = {};
            if (!journey[subject][topic]) journey[subject][topic] = [];

            journey[subject][topic].push(p);
        }

        for (const subject of Object.keys(journey)) {
            for (const topic of Object.keys(journey[subject])) {
                journey[subject][topic].sort(
                    (a, b) =>
                        (DIFFICULTY_ORDER[a.difficulty] ?? 999) -
                        (DIFFICULTY_ORDER[b.difficulty] ?? 999)
                );
            }
        }

        return journey;
    }

    useEffect(() => {
        async function load() {
            try {
                const [
                    problems,
                    profile,
                    topics
                ] = await Promise.all([
                    getProblemsAll(),
                    getStudentProfile(),
                    getStudentTopics()
                ]);

                setStudentProfile(profile || null);
                setStudentTopics(topics || []);
                setAllProblems(problems || []);
            } catch (err) {
                console.error("[Journey] load() failed:", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // Full set of problems for the student's selected subjects — NOT sliced.
    // This is what feeds the Learning Paths / TopicCards, so every topic
    // shows its complete list of problems instead of a thin global slice.
    // Premium problems ARE included here on purpose: Learning Paths is a
    // browsing surface, so free users should still see (locked) premium
    // problems and know they exist — TopicCard handles the locked styling.
    const journeyProblems = useMemo(() => {
        if (!studentTopics.length || allProblems.length === 0) return [];

        const selectedSubjects = getSelectedSubjects(studentTopics);
        return allProblems.filter(problem => selectedSubjects.has(problem.subject));
    }, [studentTopics, allProblems]);

    const allowedDifficulties = useMemo(() => {
        return LEVEL_TO_DIFFICULTIES[(studentProfile?.level ?? "").toLowerCase()] ?? [];
    }, [studentProfile]);

    // Ids of problems that match the student's current level. Used only to
    // highlight/prioritize — never to hide problems from a topic.
    const recommendedIds = useMemo(() => {
        const ids = new Set();
        if (!allowedDifficulties.length) return ids;

        for (const problem of journeyProblems) {
            if (allowedDifficulties.includes(problem.difficulty)) {
                ids.add(problem.id);
            }
        }
        return ids;
    }, [journeyProblems, allowedDifficulties]);

    const personalizedJourney = useMemo(() => {
        return buildJourney(journeyProblems);
    }, [journeyProblems]);

    const dailyTargetCount = useMemo(() => {
        return DAILY_TARGET_BY_COMMITMENT[studentProfile?.weekly_commitment] ?? DEFAULT_DAILY_TARGET;
    }, [studentProfile]);

    // Full candidate pool for today's mission: uncompleted, ACCESSIBLE
    // problems that match the student's level, sorted by their stated
    // challenge preference. recommendedQueue is just the top N of this
    // list (N = dailyTargetCount); totalRecommendedCount is the full
    // candidate pool size, so DailyTrack can show "+N more waiting"
    // accurately. Premium-only problems are excluded here unless the
    // student actually has premium — the Daily Mission is meant to be a
    // free, frictionless habit loop, not a paywall funnel.
    const completedProblemIds = stats.completedProblemIds || [];
    const attemptedProblemIds = stats.attemptedProblemIds || [];
    const streakData = stats.streakData || { current_streak: 0, longest_streak: 0 };
    const todayProgress = stats.userProgress || null;

    useEffect(() => {
        setCompletedSet(new Set(completedProblemIds.map((id) => String(id))));
        setAttemptedSet(new Set(attemptedProblemIds.map((id) => String(id))));
    }, [completedProblemIds, attemptedProblemIds]);

    const recommendedCandidates = useMemo(() => {
        if (!personalizedJourney || Object.keys(personalizedJourney).length === 0) {
            return [];
        }

        const candidates = [];
        const seen = new Set();

        for (const subject of SUBJECT_ORDER) {
            const topics = personalizedJourney[subject];
            if (!topics) continue;

            for (const topicProblems of Object.values(topics)) {
                const annotated = annotateProblemStates(
                    topicProblems || [],
                    completedSet,
                    attemptedSet
                );

                for (const prob of annotated) {
                    const isUncompleted = prob.state === "current" || prob.state === "unlocked";
                    const isRecommendedLevel =
                        !allowedDifficulties.length || allowedDifficulties.includes(prob.difficulty);
                    const isAccessible = isProblemAccessible(prob, premium);

                    if (isUncompleted && isRecommendedLevel && isAccessible && !seen.has(prob.id)) {
                        seen.add(prob.id);
                        candidates.push(prob);
                    }
                }
            }
        }

        switch (studentProfile?.preferred_challenge) {
            case "easy":
                candidates.sort(
                    (a, b) => (DIFFICULTY_ORDER[a.difficulty] ?? 999) - (DIFFICULTY_ORDER[b.difficulty] ?? 999)
                );
                break;
            case "challenging":
            case "extreme":
                candidates.sort(
                    (a, b) => (DIFFICULTY_ORDER[b.difficulty] ?? 999) - (DIFFICULTY_ORDER[a.difficulty] ?? 999)
                );
                break;
            default:
                break;
        }

        return candidates;
    }, [personalizedJourney, completedSet, attemptedSet, allowedDifficulties, studentProfile, premium]);

    const recommendedQueue = useMemo(
        () => recommendedCandidates.slice(0, dailyTargetCount),
        [recommendedCandidates, dailyTargetCount]
    );

    const currentStreak = streakData?.current_streak ?? streakData?.streak_count ?? stats.currentStreak ?? 0;

    return (
        <>
            <Navbar />
            <div className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen">
                <div className="flex items-center justify-center w-full">
                    <div className="flex flex-col justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] py-4 lg:pt-6 w-full gap-6">

                        {/* Header */}
                        <motion.div
                            className="flex flex-col-reverse justify-center w-full md:flex-row md:justify-between gap-3 text-center"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex flex-col md:w-2/3 justify-center">
                                <h1 className="text-4xl text-center md:text-left pb-2 cursor-default font-[Sansation] font-extrabold">
                                    Your Math Journey
                                </h1>
                                <p className="text-md text-center md:text-left lg:text-lg font-normal leading-[1.2] lg:w-[80%] cursor-default text-[var(--secondary-color)]">
                                    Follow structured learning paths designed to build your mathematical skills progressively. Each track guides you through concepts with increasing complexity.
                                </p>
                            </div>

                            <div className="md:w-1/3 flex justify-center">
                                <img src={JourneyImg} alt="Journey" className="w-full sm:max-w-50 md:max-w-full md:w-stretch rounded-full" />
                            </div>
                        </motion.div>

                        {/* Dynamic Progress & Streak Motivation Banner */}
                        {currentStreak > 0 && (
                            <motion.div
                                className="w-full bg-gradient-to-r from-amber-500/10 via-orange-500/20 to-red-500/20 border border-amber-500/30 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center gap-4 text-center sm:text-left">
                                    <div className="text-4xl md:text-5xl animate-bounce">
                                        <svg className="h-10" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="icon-gradient-fire-sidebar" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                                    <stop offset="100%" stopColor="var(--accent-color)" />
                                                </linearGradient>
                                            </defs>
                                            <path fill="url(#icon-gradient-fire-sidebar)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-extrabold text-amber-600">
                                            {currentStreak >= 15
                                                ? `You've achieved a ${currentStreak}-day streak. You're on fire! 💥`
                                                : `You're on a ${currentStreak}-day streak! Keep the momentum going!`}
                                        </h3>
                                        <p className="text-sm text-[var(--secondary-color)]">
                                            Consistency is the key to mastering high-level math. Solve today's suggested targets to extend your streak!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Daily Mission Component */}
                        <DailyTrack
                            streak={streakData}
                            todayProgress={todayProgress}
                            recommendedQueue={recommendedQueue}
                            weeklyCommitment={studentProfile?.weekly_commitment}
                            totalRecommendedCount={recommendedCandidates.length}
                            isPremiumUser={premium}
                        />

                        {/* Learning Paths / Dropdowns */}
                        <section id="learning-paths" className="flex flex-col w-full pt-6">
                            {loading ? (
                                <div className="py-12 flex justify-center items-center animate-spin">
                                    <FaSpinner className='text-2xl' />
                                </div>
                            ) : Object.keys(personalizedJourney).length === 0 ? (
                                <p className="text-center text-lg text-[var(--secondary-color)] py-8">
                                    No recommended problems yet — check back soon, or update your goals below.
                                </p>
                            ) : (
                                Object.keys(personalizedJourney)
                                    .sort((a, b) => {
                                        const aIndex = SUBJECT_ORDER.indexOf(a);
                                        const bIndex = SUBJECT_ORDER.indexOf(b);
                                        return (aIndex === -1 ? SUBJECT_ORDER.length : aIndex) -
                                            (bIndex === -1 ? SUBJECT_ORDER.length : bIndex);
                                    })
                                    .map(subject => (
                                        <motion.div
                                            key={subject}
                                            className="pb-8 flex flex-col gap-4"
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <h2 className="text-3xl font-bold rounded-md flex items-center justify-center">
                                                {subject}
                                            </h2>

                                            {Object.entries(personalizedJourney[subject]).map(
                                                ([topic, problems]) => (
                                                    <TopicCard
                                                        key={topic}
                                                        topic={topic}
                                                        problems={problems}
                                                        completedSet={completedSet}
                                                        attemptedSet={attemptedSet}
                                                        recommendedIds={recommendedIds}
                                                        isPremiumUser={premium}
                                                    />
                                                )
                                            )}
                                        </motion.div>
                                    ))
                            )}
                        </section>

                        {/* Retake Diagnostic / Reset Goals CTA */}
                        <div className="flex flex-col items-center justify-center py-6 w-full gap-3 border-t border-[var(--secondary-color)]/20 mt-4">
                            <p className="text-sm text-[var(--secondary-color)] text-center">
                                Want to adjust your focus areas or reset your recommended skill level?
                            </p>
                            <button
                                type="button"
                                disabled={isResetting}
                                onClick={async () => {
                                    try {
                                        await resetDiagnosticTest();
                                    } catch (e) {
                                        // Handled in hook
                                    }
                                }}
                                className="py-2 md:py-3 bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] font-bold !text-white rounded-md transition-all duration-300 cursor-pointer active:scale-95 hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] w-full text-center max-w-fit px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isResetting ? 'Resetting...' : 'Retake Skill Assessment'}
                            </button>
                        </div>

                    </div>
                </div >
            </div >
            <Footer />
        </>
    );
};

export default Journey;