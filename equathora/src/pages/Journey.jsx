import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCompletedProblems, getUserSubmissions, getStudentProfile, getStudentTopics, getUserProgress, getStreakData } from '../lib/databaseService';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import JourneyImg from '../assets/images/Journey-pana.svg';
import { getProblemsAll } from '@/lib/problemService';
import { annotateProblemStates } from '@/lib/problemProgress';
import DailyTrack from '@/components/Journey/DailyTrack';
import TopicCard from '@/components/Journey/TopicCard';
import { Link } from 'react-router-dom';
import RedButton from '@/components/ui/RedButton';

const Journey = () => {
    const [completedSet, setCompletedSet] = useState(new Set());
    const [attemptedSet, setAttemptedSet] = useState(new Set());
    const [loading, setLoading] = useState(true);

    // Student Profile
    const [studentProfile, setStudentProfile] = useState(null);
    const [studentTopics, setStudentTopics] = useState([]);
    const [recommendedProblems, setRecommendedProblems] = useState([]);
    const [allProblems, setAllProblems] = useState([]);

    // Daily Mission (streak + today's progress), feeds DailyTrack
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
        beginner: [
            "Beginner",
            "Easy",
            "Standard"
        ],

        intermediate: [
            "Easy",
            "Standard",
            "Intermediate",
            "Medium"
        ],

        advanced: [
            "Intermediate",
            "Medium",
            "Challenging",
            "Hard"
        ],

        competitive: [
            "Medium",
            "Challenging",
            "Hard",
            "Advanced"
        ]
    };

    function getSelectedSubjects(studentTopics) {
        const selectedSubjects = new Set([
            "Applied Mathematics" // show to everyone for now
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

            if (!journey[subject]) {
                journey[subject] = {};
            }

            if (!journey[subject][topic]) {
                journey[subject][topic] = [];
            }

            journey[subject][topic].push(p);
        }

        // sort difficulties inside each topic
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

    // Get student data and the list of the problems
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

                // getStudentProfile() returns a single profile object, not an array -
                // indexing it with [0] always produced undefined, so studentProfile
                // was permanently null and the recommendation effect always bailed.
                setStudentProfile(profile || null);
                setStudentTopics(topics);

                setAllProblems(problems);
                setStreakData(streak || null);
                setTodayProgress(progress || null);

                setCompletedSet(
                    new Set(completedProblems.map(id => String(id)))
                );

                setAttemptedSet(
                    new Set(
                        submissions.map(sub => String(sub.problem_id))
                    )
                );
            }
            catch (err) {
                console.error("[Journey] load() failed:", err);
            }
            finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    useEffect(() => {
        if (
            !studentProfile ||
            !studentTopics.length ||
            allProblems.length === 0
        ) {
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
    }, [
        studentProfile,
        studentTopics,
        allProblems,
        completedSet
    ]);

    const personalizedJourney = useMemo(() => {
        return buildJourney(recommendedProblems);
    }, [recommendedProblems]);

    // The "next problem" shown in DailyTrack must be the exact same problem
    // TopicCard marks as "current" below - walk subjects/topics in the same
    // order the page renders them and take the first "current" problem found.
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

    // Add a loading screen for the problem topics below not a full-screen one
    // if (loading) {
    //     return <LoadingSpinner />;
    // }

    return (
        <>
            <Navbar />
            <div className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen">
                <div className='flex items-center justify-center w-full'>
                    <div className="flex flex-col justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] py-4 lg:pt-6">
                        {/* Header */}
                        <motion.div
                            className="flex flex-col-reverse justify-center w-full md:flex-row md:justify-between gap-3 text-center"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Header */}
                            <div className="flex flex-col md:w-2/3 justify-center">
                                <h1 className="text-4xl text-center md:text-left pb-2 cursor-default font-[Sansation] font-extrabold">
                                    Your Math Journey
                                </h1>
                                <p className="text-md text-center md:text-left lg:text-lg font-normal leading-[1.2] lg:w-[80%] cursor-default text-[var(--secondary-color)]">
                                    Follow structured learning paths designed to build your mathematical skills progressively. Each track guides you through concepts with increasing complexity.
                                </p>
                            </div>
                            {/* Journey Image */}
                            <div className='md:w-1/3 flex justify-center'>
                                <img src={JourneyImg} alt="Journey" className='w-full sm:max-w-50 md:max-w-full md:w-stretch rounded-full' />
                            </div>
                        </motion.div>

                        {/* Daily Mission */}
                        <DailyTrack
                            streak={streakData}
                            todayProgress={todayProgress}
                            nextProblem={nextProblem}
                        />

                        {/* Dropdowns */}
                        <section className='flex flex-col w-full pt-10'>
                            {Object.keys(personalizedJourney).length === 0 && (
                                <p className="text-center text-lg text-[var(--secondary-color)] py-8">
                                    No recommended problems yet - check back soon, or update your goals in settings.
                                </p>
                            )}
                            {Object.keys(personalizedJourney)
                                .sort((a, b) => {
                                    const aIndex = SUBJECT_ORDER.indexOf(a);
                                    const bIndex = SUBJECT_ORDER.indexOf(b);
                                    // unknown subjects (not in SUBJECT_ORDER) sort to the end, not the front
                                    return (aIndex === -1 ? SUBJECT_ORDER.length : aIndex) -
                                        (bIndex === -1 ? SUBJECT_ORDER.length : bIndex);
                                })
                                .map(subject => (
                                    <motion.div key={subject} className="pb-8 flex flex-col gap-4"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}>

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
                                ))}
                        </section>
                        <div className="flex py-5">
                            <RedButton to={'/getStarted'} text={'Finished your path? Retake your skill test to choose something else to learn'} />

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Journey;

// I need to add the daily calendar
// Below add some of the suggested problems
// On the sides: goals, topics, maybe time of day to solve those problems
// Filter the problems based on needs/skill and also time it takes to solve them based on their level of difficulty
// Make the thing that drives their progress more visible in this page: "You have achieved a 15 day streak. You're on fire!"
// For guidance level suggest Premium if they want full guidance etc

// Leave the other data for future updates

// Add a button to retake these choice and go back to GetStarted.jsx / Add this in the settings too