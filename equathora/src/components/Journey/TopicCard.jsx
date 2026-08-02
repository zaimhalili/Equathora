// TopicCard.jsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaStar, FaCrown } from "react-icons/fa";
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
    attemptedSet = new Set(),
    recommendedIds = new Set(),
    isPremiumUser = false
}) => {
    const [open, setOpen] = useState(false);

    const isAccessible = (problem) => !problem?.is_premium || isPremiumUser;

    const statedProblems = useMemo(
        () => annotateProblemStates(problems || [], completedSet, attemptedSet),
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

    // How many of this topic's problems match the student's current level.
    // Shown as a hint, not used to hide anything — the full list stays visible.
    const recommendedCount = useMemo(
        () => statedProblems.filter(p => recommendedIds.has(p.id)).length,
        [statedProblems, recommendedIds]
    );

    // Store just the id so we don't hold a stale problem object if `problems`
    // is ever replaced with a new array reference (e.g. fresh data comes in).
    const [selectedId, setSelectedId] = useState(statedProblems[0]?.id);

    const selected = useMemo(() => {
        const found = statedProblems.find(p => p.id === selectedId);
        if (found) return found;

        // Fall back to whatever the student should focus on next: prefer a
        // recommended-level, ACCESSIBLE problem that's current/unlocked,
        // then any accessible current/in-progress problem, then finally
        // fall back to anything at all (including locked premium) so the
        // panel is never empty — the CTA below is what actually gates it.
        return (
            statedProblems.find(p => recommendedIds.has(p.id) && p.state === "current" && isAccessible(p)) ??
            statedProblems.find(p => p.state === "current" && isAccessible(p)) ??
            statedProblems.find(p => p.state === "progress" && isAccessible(p)) ??
            statedProblems.find(p => p.state === "current") ??
            statedProblems.find(p => p.state === "progress") ??
            statedProblems[0]
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statedProblems, selectedId, recommendedIds, isPremiumUser]);

    const progress = statedProblems.length > 0
        ? (solvedCount / statedProblems.length) * 100
        : 0;

    const selectedSlug = selected
        ? (selected.slug || generateProblemSlug(selected.title, selected.id))
        : null;

    const selectedLocked = selected ? !isAccessible(selected) : false;

    return (
        <div className="w-full rounded-2xl bg-[var(--main-color)] backdrop-blur-md p-5 shadow-lg flex flex-col gap-3 font-[Sansation,sans-serif]">
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full text-left"
            >
                <div className="flex-1">
                    <div className="flex items-center justify-between pb-1">
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

                    <div className="flex items-center justify-between pb-3 flex-wrap gap-2">
                        <span className="text-xs text-[var(--secondary-color)] opacity-70">
                            {statedProblems.length} problem{statedProblems.length === 1 ? "" : "s"}
                        </span>

                        {recommendedCount > 0 && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                                <FaStar size={11} />
                                {recommendedCount} matched to your level
                            </span>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="h-4 rounded-md bg-[var(--secondary-color)]/30 overflow-hidden">
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

                                        const isRecommended = recommendedIds.has(problem.id);
                                        const isLockedByPremium = !isAccessible(problem);

                                        return (
                                            <button
                                                key={problem.id}
                                                onClick={() => setSelectedId(problem.id)}
                                                title={
                                                    isLockedByPremium
                                                        ? "Premium problem - upgrade to unlock"
                                                        : isRecommended
                                                            ? "Matched to your level"
                                                            : undefined
                                                }
                                                className={`relative h-11 w-11 rounded-full flex items-center justify-center transition-all ${style}
                                                ${selected?.id === problem.id
                                                        ? "scale-110 ring-4 ring-white/80"
                                                        : isRecommended
                                                            ? "outline-4 outline-emerald-600 hover:scale-110"
                                                            : "hover:scale-110"
                                                    }`}
                                            >
                                                <Icon size={16} />
                                                {isLockedByPremium ? (
                                                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-500 flex items-center justify-center">
                                                        <FaCrown size={7} className="text-white" />
                                                    </span>
                                                ) : isRecommended && problem.state !== "solved" && (
                                                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-400 flex items-center justify-center">
                                                        <FaStar size={7} className="text-white" />
                                                    </span>
                                                )}
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

                                <div className="flex items-center justify-between gap-2 pb-3">
                                    <h4 className="text-xl font-bold">
                                        {selected?.title}
                                    </h4>
                                    {selected && selectedLocked && (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 whitespace-nowrap">
                                            <FaCrown size={10} />
                                            Premium
                                        </span>
                                    )}
                                    {selected && !selectedLocked && recommendedIds.has(selected.id) && (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 whitespace-nowrap">
                                            <FaStar size={10} />
                                            Matched to you
                                        </span>
                                    )}
                                </div>

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

                                {selectedLocked ? (
                                    <Link
                                        to="/premium"
                                        className="mt-5 rounded-xl py-3 flex items-center justify-center gap-2 font-semibold !text-white bg-gradient-to-b from-amber-600 to-amber-400 hover:to-amber-500 transition-all active:scale-95"
                                    >
                                        <FaCrown size={14} />
                                        Upgrade to Unlock
                                    </Link>
                                ) : (
                                    <Link
                                        to={selectedSlug ? `/problems/${selectedSlug}` : "#"}
                                        className="mt-5 rounded-xl py-3 flex items-center justify-center gap-2 font-semibold !text-white bg-[linear-gradient(0deg,var(--accent-color),var(--dark-accent-color))] hover:bg-[linear-gradient(0deg,var(--dark-accent-color),var(--dark-accent-color))] transition-all active:scale-95"
                                    >
                                        Start Problem
                                        <FaArrowRight />
                                    </Link>
                                )}

                            </article>

                        </section>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default TopicCard;