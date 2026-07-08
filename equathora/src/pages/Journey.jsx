import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    getCompletedProblems,
    getUserSubmissions,
    getStudentProfile,
    getStudentTopics
} from '../lib/databaseService';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import JourneyImg from '../assets/images/Journey-pana.svg';
import { getProblemsAll } from '@/lib/problemService';
import DailyTrack from '@/components/Journey/DailyTrack';
import TopicCard from '@/components/Journey/TopicCard';

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

// Maps the broad category chosen during onboarding (student_topics.topic)
// to the actual subject bucket used in the problem set (problem.subject).
const TOPIC_TO_SUBJECT = {
    algebra: "Algebra",
    geometry: "Geometry",
    calculus: "Functions",
    probability: "Probability & Combinatorics",
    combinatorics: "Probability & Combinatorics",
    number_theory: "Probability & Combinatorics"
};

const Journey = () => {
    const [journey, setJourney] = useState({});
    const [completedSet, setCompletedSet] = useState(new Set());
    const [attemptedSet, setAttemptedSet] = useState(new Set());
    const [loading, setLoading] = useState(true);

    const [studentProfile, setStudentProfile] = useState(null);
    const [studentTopics, setStudentTopics] = useState([]);
    const [recommendedProblems, setRecommendedProblems] = useState([]);
    const [allProblems, setAllProblems] = useState([]);

    function buildJourney(problems) {
        const journey = {};

        for (const p of problems) {
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
                const [problems, completedProblems, submissions, profile, topics] =
                    await Promise.all([
                        getProblemsAll(),
                        getCompletedProblems(),
                        getUserSubmissions(),
                        getStudentProfile(),
                        getStudentTopics()
                    ]);

                setStudentProfile(profile?.[0] || null);
                setStudentTopics(topics || []);
                setAllProblems(problems);
                setJourney(buildJourney(problems));

                setCompletedSet(new Set(completedProblems.map(id => String(id))));
                setAttemptedSet(new Set(submissions.map(sub => String(sub.problem_id))));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // Onboarding stores broad categories (e.g. "algebra", "probability"),
    // so translate them into the subject buckets used by the problem data.
    const selectedSubjects = useMemo(() => {
        return new Set(
            studentTopics.map(t => TOPIC_TO_SUBJECT[t.topic]).filter(Boolean)
        );
    }, [studentTopics]);

    // Build the recommended problem list from the student's onboarding choices
    useEffect(() => {
        if (!studentProfile || allProblems.length === 0) return;

        let filtered = allProblems.filter(problem =>
            selectedSubjects.has(problem.subject)
        );

        const level = (studentProfile.level || '').toLowerCase();

        filtered = filtered.filter(problem => {
            const difficulty = (problem.difficulty || '').toLowerCase();

            switch (level) {
                case "beginner":
                    return ["beginner", "easy"].includes(difficulty);
                case "intermediate":
                    return ["easy", "standard", "intermediate"].includes(difficulty);
                case "advanced":
                    return ["intermediate", "medium", "challenging"].includes(difficulty);
                case "competitive":
                    return ["hard", "advanced"].includes(difficulty);
                default:
                    return true;
            }
        });

        let limit = 12;
        switch (studentProfile.weekly_commitment) {
            case "under-1": limit = 4; break;
            case "1-3": limit = 8; break;
            case "3-6": limit = 14; break;
            case "6+": limit = 20; break;
            default: limit = 12;
        }

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
            // "balanced": leave current order
        }

        filtered = filtered.filter(problem => !completedSet.has(String(problem.id)));

        setRecommendedProblems(filtered.slice(0, limit));
    }, [studentProfile, selectedSubjects, allProblems, completedSet]);

    // Journey narrowed to the subjects the student picked, and within each
    // subject only topics that actually have a recommended problem to show
    const personalizedJourney = useMemo(() => {
        if (!studentTopics.length) return journey;

        const recommendedIds = new Set(recommendedProblems.map(r => String(r.id)));
        const filtered = {};

        Object.entries(journey).forEach(([subject, topics]) => {
            if (!selectedSubjects.has(subject)) return;

            const matchingTopics = {};

            Object.entries(topics).forEach(([topicKey, problems]) => {
                const shown = problems.filter(p => recommendedIds.has(String(p.id)));
                if (shown.length > 0) {
                    matchingTopics[topicKey] = shown;
                }
            });

            if (Object.keys(matchingTopics).length > 0) {
                filtered[subject] = matchingTopics;
            }
        });

        return filtered;
    }, [journey, studentTopics, selectedSubjects, recommendedProblems]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <Navbar />
            <div className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen">
                <div className='flex items-center justify-center w-full'>
                    <div className="flex flex-col justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] py-4 lg:pt-6">
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
                            <div className='md:w-1/3 flex justify-center'>
                                <img src={JourneyImg} alt="Journey" className='w-full sm:max-w-50 md:max-w-full md:w-stretch rounded-full' />
                            </div>
                        </motion.div>

                        <DailyTrack />

                        <section className='flex flex-col w-full pt-10'>
                            {Object.keys(personalizedJourney)
                                .sort((a, b) => SUBJECT_ORDER.indexOf(a) - SUBJECT_ORDER.indexOf(b))
                                .map(subject => (
                                    <div key={subject} className="pb-8 flex flex-col gap-4">
                                        <h2 className="text-3xl font-bold rounded-md flex items-center justify-center">
                                            {subject}
                                        </h2>

                                        {Object.keys(personalizedJourney[subject]).map(topic => (
                                            <TopicCard
                                                key={topic}
                                                topic={topic}
                                                problems={personalizedJourney[subject][topic]}
                                                completedSet={completedSet}
                                                attemptedSet={attemptedSet}
                                            />
                                        ))}
                                    </div>
                                ))}
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Journey;