import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
    FaCheck,
    FaLock,
    FaPlay,
    FaClock,
    FaArrowRight
} from 'react-icons/fa';
import { formatTopicLabel } from '@/lib/utils';
import { generateProblemSlug } from '@/lib/slugify';
import { annotateProblemStates, getEstimatedTime, getEstimatedXp } from '@/lib/problemProgress';

const TopicCard = ({
    topic,
    problems,
    completedSet = new Set(),
    attemptedSet = new Set()
}) => {
    const [open, setOpen] = useState(false);

    const statedProblems = useMemo(
        () => annotateProblemStates(problems, completedSet, attemptedSet),
        [problems, completedSet, attemptedSet]
    );

    const solvedCount = useMemo(
        () => statedProblems.filter(p => p.state === "solved").length,
        [statedProblems]
    );

    const progressCount = useMemo(
        () => statedProblems.filter(p => p.state === "progress").length,
        [statedProblems]
    );

    const lockedCount = useMemo(
        () => statedProblems.filter(p => p.state === "locked").length,
        [statedProblems]
    );

    // Store just the id so we don't hold a stale problem object if `problems`
    // is ever replaced with a new array reference (e.g. fresh data comes in).
    const [selectedId, setSelectedId] = useState(statedProblems[0]?.id);

    const selected = useMemo(() => {
        const found = statedProblems.find(p => p.id === selectedId);
        if (found) return found;

        // Fall back to whatever the student should focus on next: the current
        // problem, then an in-progress one, then just the first in the list.
        return (
            statedProblems.find(p => p.state === "current") ??
            statedProblems.find(p => p.state === "progress") ??
            statedProblems[0]
        );
    }, [statedProblems, selectedId]);

    const progress = statedProblems.length > 0
        ? (solvedCount / statedProblems.length) * 100
        : 0;

    // Route is /problems/:slug, not an id — use the backend-provided slug if
    // present, otherwise derive the same slug format the backend uses.
    const selectedSlug = selected
        ? (selected.slug || generateProblemSlug(selected.title, selected.id))
        : null;

    return (
        <div className="w-full rounded-2xl bg-[var(--main-color)] backdrop-blur-md p-5 shadow-lg flex flex-col gap-3 font-[Sansation,sans-serif]">
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full text-left"
            >
                <div className="flex-1">
                    <div className="flex items-center justify-between pb-3">
                        <h3 className="text-xl font-bold">
                            {formatTopicLabel(topic)}
                        </h3>

                        <div className="flex items-center gap-4">
                            <span className="text-xl font-semibold">
                                {Math.round(progress)}%
                            </span>

                            {open ? (
                                <FaChevronUp className="text-lg" />
                            ) : (
                                <FaChevronDown className="text-lg" />
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-4 rounded-md bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white overflow-hidden">
                        <div
                            className="h-full rounded-md bg-[linear-gradient(0deg,var(--accent-color),var(--dark-accent-color))]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="body"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            height: "auto"
                        }}
                        exit={{
                            opacity: 0,
                            height: 0
                        }}
                        transition={{
                            duration: 0.3
                        }}
                        className='flex flex-col gap-5'
                    >
                        {/* Top Main Content */}
                        <section className="flex flex-col lg:flex-row gap-6 pt-5">

                            {/* LEFT */}
                            <article className="flex flex-col gap-5 md:gap-3 justify-between w-full lg:w-1/2">

                                {/* Circle Container */}
                                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                    {statedProblems.map(problem => {

                                        let style = "bg-[var(--white)] text-[var(--mid-main-secondary)]";
                                        let Icon = FaLock;

                                        if (problem.state === "solved") {
                                            style = "bg-[linear-gradient(0deg,var(--accent-color),var(--dark-accent-color))] text-white";
                                            Icon = FaCheck;
                                        }

                                        if (problem.state === "progress") {
                                            style = "bg-orange-500 text-white";
                                            Icon = FaClock;
                                        }

                                        if (problem.state === "current") {
                                            style = "bg-amber-500 text-white pl-1";
                                            Icon = FaPlay;
                                        }

                                        return (
                                            <button
                                                key={problem.id}
                                                onClick={() => setSelectedId(problem.id)}
                                                className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${style}
                                                ${selected?.id === problem.id
                                                        ? "scale-110 ring-4 ring-white/80"
                                                        : "hover:scale-110"
                                                    }`}
                                            >
                                                <Icon size={16} />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Legend */}
                                <div className="flex justify-between w-full flex-wrap gap-3">

                                    <div className="flex gap-2 items-center font-bold text-[var(--secondary-color)]">
                                        <div className="rounded-full flex h-7 w-7 bg-amber-500 text-white justify-center items-center pl-1">
                                            <FaPlay size={12} />
                                        </div>
                                        Next
                                    </div>

                                    <div className="flex gap-2 items-center font-bold text-[var(--secondary-color)]">
                                        <div className="rounded-full flex h-7 w-7 bg-[linear-gradient(0deg,var(--accent-color),var(--dark-accent-color))] text-white justify-center items-center">
                                            <FaCheck size={12} />
                                        </div>
                                        Completed <span className="font-normal">{solvedCount}</span>
                                    </div>

                                    <div className="flex gap-2 items-center font-bold text-[var(--secondary-color)]">
                                        <div className="rounded-full flex h-7 w-7 bg-orange-500 text-white justify-center items-center">
                                            <FaClock size={12} />
                                        </div>
                                        In Progress{" "}
                                        <span className="font-normal">
                                            {progressCount}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 items-center font-bold text-[var(--secondary-color)]">
                                        <div className="rounded-full flex h-7 w-7 bg-[var(--white)] text-[var(--mid-main-secondary)] justify-center items-center">
                                            <FaLock size={12} />
                                        </div>
                                        Not Started{" "}
                                        <span className="font-normal">
                                            {lockedCount}
                                        </span>
                                    </div>

                                </div>
                            </article>

                            {/* RIGHT */}
                            <article className="w-full lg:w-1/2 rounded-md bg-white/5 border border-white/50 p-5 flex flex-col gap-2 text-[var(--secondary-color)]">

                                <h4 className="text-xl font-bold pb-3">
                                    {selected?.title}
                                </h4>

                                <div className="text-sm">

                                    <div className="flex justify-between">
                                        <span className="opacity-80">
                                            Difficulty
                                        </span>

                                        <span className="px-2 rounded text-white text-sm font-semibold"
                                            style={{
                                                backgroundColor: `var(--${selected?.difficulty?.toLowerCase()})`
                                            }}>
                                            {selected?.difficulty}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="opacity-80">
                                            Estimated Time
                                        </span>

                                        <span>
                                            {selected?.estimated_time ?? getEstimatedTime(selected?.difficulty)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="opacity-80">
                                            XP Reward
                                        </span>

                                        <span>
                                            {selected?.xp ?? getEstimatedXp(selected?.difficulty)} XP
                                        </span>
                                    </div>

                                </div>

                                <Link
                                    to={selectedSlug ? `/problems/${selectedSlug}` : "#"}
                                    className="mt-5 rounded-xl py-3 flex items-center justify-center gap-2 font-semibold !text-white bg-[linear-gradient(0deg,var(--accent-color),var(--dark-accent-color))] hover:bg-[linear-gradient(0deg,var(--dark-accent-color),var(--dark-accent-color))] transition-all active:scale-95"
                                >
                                    Start Problem
                                    <FaArrowRight />
                                </Link>

                            </article>

                        </section>
                        {/* Achievements  */}
                        {/* <section className='w-full gap-3 p-5 rounded-md bg-white/5 border border-white/50 flex flex-col'>
                            <p className='text-xl font-bold text-[var(--secondary-color)]'>Achievements</p>
                            <article className='flex gap-3'>
                                <div className="flex flex-col w-fit bg-white/5 border border-white/50 p-3 items-center gap-3 rounded-md">
                                    <FaGem className='w-full text-5xl text-[var(--secondary-color)]' />
                                    <p className='text-[var(--secondary-color)]'>Locked</p>
                                </div>
                                <div className="flex flex-col w-fit bg-white/5 border border-white/50 p-3 items-center gap-3 rounded-md">
                                    <FaCrown className='w-full text-5xl text-[var(--secondary-color)]' />
                                    <p className='text-[var(--secondary-color)]'>Locked</p>
                                </div>
                                <div className="flex flex-col w-fit bg-white/5 border border-white/50 p-3 items-center gap-3 rounded-md">
                                    <FaBolt className='w-full text-5xl text-[var(--secondary-color)]' />
                                    <p className='text-[var(--secondary-color)]'>Locked</p>
                                </div>
                            </article>

                        </section> */}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default TopicCard;


// 3) -------- 50% Done
// Achievements for each topic: Number Theory
// 🏆 Finish all Beginner problems
// 🏆 Solve 10 in a row
// 🏆 Finish topic under 2 hours

// ✓ 2 / 3 achievements



// 1) --------- 80% Done
// Open the first section that isnt finished
// Automatically collapse completed topics (optional)