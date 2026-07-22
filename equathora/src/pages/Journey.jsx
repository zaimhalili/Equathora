import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    getCompletedProblems,
    getUserSubmissions,
    getStudentProfile,
    getStudentTopics,
    getUserProgress,
    getStreakData
} from '../lib/databaseService';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import JourneyImg from '../assets/images/Journey-pana.svg';
import { getProblemsAll } from '@/lib/problemService';
import { annotateProblemStates } from '@/lib/problemProgress';
import DailyTrack from '@/components/Journey/DailyTrack';
import TopicCard from '@/components/Journey/TopicCard';
import RedButton from '@/components/ui/RedButton';

const Journey = () => {
    const [completedSet, setCompletedSet] = useState(new Set());
    const [attemptedSet, setAttemptedSet] = useState(new Set());
    const [loading, setLoading] = useState(true);

    // Student Profile & Problems
    const [studentProfile, setStudentProfile] = useState(null);
    const [studentTopics, setStudentTopics] = useState([]);
    const [recommendedProblems, setRecommendedProblems] = useState([]);
    const [allProblems, setAllProblems] = useState([]);

    // Daily Mission & Streak
    const [streakData, setStreakData] = useState(null);
    const [todayProgress, setTodayProgress] = useState(null);

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

    const LEVEL_TO_DIFFICULTIES = {
        beginner: ["Beginner", "Easy", "Standard"],
        intermediate: ["Easy", "Standard", "Intermediate", "Medium"],
        advanced: ["Intermediate", "Medium", "Challenging", "Hard"],
        competitive: ["Medium", "Challenging", "Hard", "Advanced"]
    };

    function getSelectedSubjects(studentTopics) {
        const selectedSubjects = new Set([
            "Applied Mathematics" // Default for all students
        ]);

        studentTopics.forEach(({ topic }) => {
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

        for (const p of problems) {
            const subject = p.subject;
            const topic = p.topic;

            if (!journey[subject]) journey[subject] = {};
            if (!journey[subject][topic]) journey[subject][topic] = [];

            journey[subject][topic].push(p);
        }

        // Sort problems by difficulty inside each topic
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

    // Fetch student data & problems
    useEffect(() => {
        async function load() {
            try {
                const [
                    problems,
                    completedProblems,
                    submissions,
                    profile,
                    topics,
                    streak,
                    progress
                ] = await Promise.all([
                    getProblemsAll(),
                    getCompletedProblems(),
                    getUserSubmissions(),
                    getStudentProfile(),
                    getStudentTopics(),
                    getStreakData(),
                    getUserProgress()
                ]);

                setStudentProfile(profile || null);
                setStudentTopics(topics || []);
                setAllProblems(problems || []);
                setStreakData(streak || null);
                setTodayProgress(progress || null);

                setCompletedSet(
                    new Set(completedProblems.map(id => String(id)))
                );

                setAttemptedSet(
                    new Set(submissions.map(sub => String(sub.problem_id)))
                );
            } catch (err) {
                console.error("[Journey] load() failed:", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // Filter recommended problems based on student settings
    useEffect(() => {
        if (!studentProfile || !studentTopics.length || allProblems.length === 0) {
            return;
        }

        const selectedSubjects = getSelectedSubjects(studentTopics);

        let filtered = allProblems.filter(problem =>
            selectedSubjects.has(problem.subject)
        );

        const allowedDifficulties =
            LEVEL_TO_DIFFICULTIES[(studentProfile.level ?? "").toLowerCase()] ?? [];

        filtered = filtered.filter(problem =>
            allowedDifficulties.includes(problem.difficulty)
        );

        filtered = filtered.filter(problem =>
            !completedSet.has(String(problem.id))
        );

        switch (studentProfile.preferred_challenge) {
            case "easy":
                filtered.sort(
                    (a, b) =>
                        (DIFFICULTY_ORDER[a.difficulty] ?? 999) -
                        (DIFFICULTY_ORDER[b.difficulty] ?? 999)
                );
                break;

            case "challenging":
            case "extreme":
                filtered.sort(
                    (a, b) =>
                        (DIFFICULTY_ORDER[b.difficulty] ?? 999) -
                        (DIFFICULTY_ORDER[a.difficulty] ?? 999)
                );
                break;

            default:
                break;
        }

        let limit = 12;

        switch (studentProfile.weekly_commitment) {
            case "under-1":
                limit = 4;
                break;
            case "1-3":
                limit = 8;
                break;
            case "3-6":
                limit = 14;
                break;
            case "6+":
                limit = 20;
                break;
            default:
                break;
        }

        setRecommendedProblems(filtered.slice(0, limit));
    }, [studentProfile, studentTopics, allProblems, completedSet]);

    const personalizedJourney = useMemo(() => {
        return buildJourney(recommendedProblems);
    }, [recommendedProblems]);

    // Next problem computation for DailyTrack
    const nextProblem = useMemo(() => {
        for (const subject of SUBJECT_ORDER) {
            const topics = personalizedJourney[subject];
            if (!topics) continue;

            for (const topicProblems of Object.values(topics)) {
                const annotated = annotateProblemStates(topicProblems, completedSet, attemptedSet);
                const current = annotated.find(p => p.state === "current");
                if (current) return current;
            }
        }

        return null;
    }, [personalizedJourney, completedSet, attemptedSet]);

    const currentStreak = streakData?.current_streak ?? streakData?.streak_count ?? 0;

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

                        {/* Feature 1: Dynamic Progress & Streak Motivation Banner */}
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
                                    </svg></div>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-extrabold text-amber-600">
                                            {currentStreak >= 15
                                                ? `You've achieved a ${currentStreak}-day streak. You're on fire! 💥`
                                                : `You're on a ${currentStreak}-day streak! Keep the momentum going!`}
                                        </h3>
                                        <p className="text-sm text-[var(--secondary-color)]">
                                            Consistency is the key to mastering high-level math. Solve today's target to extend your streak!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Daily Mission */}
                        <DailyTrack
                            streak={streakData}
                            todayProgress={todayProgress}
                            nextProblem={nextProblem}
                        />

                        {/* Learning Paths / Dropdowns */}
                        <section className="flex flex-col w-full pt-6">
                            {loading ? (
                                <div className="py-12 flex justify-center">
                                    <p>Loading...</p>
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
                            <RedButton
                                to={'/getStarted'}
                                text={'Retake Skill Assessment'}
                            />
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Journey;