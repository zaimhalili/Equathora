import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaDumbbell, FaCheck, FaLock } from 'react-icons/fa';
import { getUserProgress, getStreakData, getCompletedProblems, getUserSubmissions } from '../lib/databaseService';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { formatTopicLabel } from '@/lib/utils';
import LoadingSpinner from '../components/LoadingSpinner';
import JourneyImg from '../assets/images/Journey-pana.svg';
import { getProblemsAll } from '@/lib/problemService';
import DailyTrack from '@/components/Journey/DailyTrack';
import TopicCard from '@/components/Journey/TopicCard';

const Journey = () => {
    const [journey, setJourney] = useState({});
    const [completedSet, setCompletedSet] = useState(new Set());
    const [attemptedSet, setAttemptedSet] = useState(new Set());
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        async function load() {
            try {
                const [
                    problems,
                    completedProblems,
                    submissions
                ] = await Promise.all([
                    getProblemsAll(),
                    getCompletedProblems(),
                    getUserSubmissions()
                ]);

                const grouped = buildJourney(problems);

                setJourney(grouped);

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
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <Navbar />
            <div className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen">
                <div className='flex items-center justify-center w-full'>
                    {/* Header */}
                    <div className="flex flex-col justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] py-4 lg:pt-6">
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

                        <DailyTrack />

                        {/* Dropdowns */}
                        <section className='flex flex-col w-full pt-10'>
                            {Object.keys(journey)
                                .sort(
                                    (a, b) =>
                                        SUBJECT_ORDER.indexOf(a) - SUBJECT_ORDER.indexOf(b)
                                )
                                .map(subject => (
                                    <div key={subject} className="pb-8 flex flex-col gap-4">

                                        <h2 className="text-3xl font-bold rounded-md flex items-center justify-center">
                                            {subject}
                                        </h2>

                                        {Object.keys(journey[subject]).map(topic => (
                                            // Topic Card
                                            <TopicCard
                                                key={topic}
                                                topic={topic}
                                                problems={journey[subject][topic]}
                                                completedSet={completedSet}
                                                attemptedSet={attemptedSet}
                                            />
                                        ))}

                                    </div>
                                ))
                            }
                        </section>


                    </div>


                </div>

            </div >
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
