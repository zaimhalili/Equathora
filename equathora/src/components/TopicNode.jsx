import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * TopicNode — a uniform-sized topic card in the Math Learning Path.
 *
 * Props
 * ─────
 * topic        – { id, title, description, icon, prerequisites }
 * status       – "locked" | "available" | "completed"
 * index        – ordinal position (stagger delay)
 * onClick      – click handler (opens concept)
 * allTopics    – full topic array (resolving prerequisite names)
 * problemCount – number of problems available for this topic
 * problems     – array of { id, title, slug } for this topic's problems
 */
const TopicNode = forwardRef(({
    topic,
    status = 'locked',
    index = 0,
    onClick,
    allTopics = [],
    problemCount = 0,
    problems = [],
}, ref) => {
    const IconComponent = topic.icon;
    const [hovered, setHovered] = useState(false);

    // Resolve prerequisite names
    const prereqNames = topic.prerequisites.map((pid) => {
        const found = allTopics.find((t) => t.id === pid);
        return found ? found.title : pid;
    });

    /* ── status-driven style tokens ── */
    const statusStyles = {
        locked: {
            card: 'bg-white/60 border-[var(--mid-main-secondary)]/20 shadow-sm',
            iconBg: 'bg-[var(--french-gray)]/10',
            useGradientIcon: false,
        },
        available: {
            card: 'bg-white border-transparent shadow-md',
            iconBg: 'bg-[var(--accent-color)]/8',
            useGradientIcon: true,
        },
        completed: {
            card: 'bg-white border-transparent shadow-md',
            iconBg: 'bg-green-500/8',
            useGradientIcon: true,
        },
    };

    const s = statusStyles[status] || statusStyles.locked;

    // Problem dots — max 6 dots shown, rest as "+N"
    const dotsToShow = Math.min(problemCount, 6);
    const overflowCount = problemCount > 6 ? problemCount - 6 : 0;

    return (
        <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* ── Hover tooltip ── */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 pb-3 z-50 w-64 pointer-events-auto"
                    >
                        <div className="bg-white rounded-xl shadow-xl border border-[var(--mid-main-secondary)]/15 p-4 font-[Sansation,sans-serif]">
                            {/* Header */}
                            <h4 className="text-sm font-bold text-[var(--secondary-color)] pb-1">
                                {topic.title}
                            </h4>
                            <p className="text-xs text-[var(--mid-main-secondary)] leading-relaxed pb-3">
                                {topic.description}
                            </p>

                            {/* Problem count info */}
                            {problemCount > 0 && (
                                <p className="text-xs font-semibold text-[var(--secondary-color)] pb-2">
                                    {problemCount} problem{problemCount !== 1 ? 's' : ''} available
                                </p>
                            )}

                            {/* Problem links (first 4) */}
                            {problems.length > 0 && (
                                <div className="flex flex-col gap-1.5 pb-3 max-h-28 overflow-y-auto">
                                    {problems.slice(0, 4).map((p) => (
                                        <Link
                                            key={p.id}
                                            to={`/problems/${p.slug || p.id}`}
                                            className="flex items-center gap-2 text-xs text-[var(--secondary-color)] hover:text-[var(--accent-color)] transition-colors no-underline group"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-[var(--dark-accent-color)] to-[var(--accent-color)] flex-shrink-0" />
                                            <span className="truncate group-hover:underline">{p.title}</span>
                                        </Link>
                                    ))}
                                    {problems.length > 4 && (
                                        <span className="text-[10px] text-[var(--mid-main-secondary)] pl-3.5">
                                            +{problems.length - 4} more
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Prerequisites for locked */}
                            {status === 'locked' && prereqNames.length > 0 && (
                                <div className="pb-2.5 pt-2 border-t border-[var(--mid-main-secondary)]/15">
                                    <p className="text-[10px] font-semibold text-[var(--mid-main-secondary)] uppercase tracking-wide pb-1">
                                        Requires
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {prereqNames.map((name) => (
                                            <span
                                                key={name}
                                                className="text-[10px] bg-[var(--french-gray)]/15 text-[var(--secondary-color)] rounded-md px-2 py-0.5 font-medium"
                                            >
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-color)]">
                                <span>{status === 'completed' ? 'Review concept' : 'Open concept'}</span>
                                <FaArrowRight className="text-[9px]" />
                            </div>
                        </div>
                        {/* Arrow */}
                        <div className="flex justify-center">
                            <div className="w-3 h-3 bg-white border-r border-b border-[var(--mid-main-secondary)]/15 rotate-45 -pt-1.5" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                ref={ref}
                className={`
                    relative rounded-xl border overflow-hidden
                    w-[13rem] h-[15rem]
                    transition-all duration-150 ease-out cursor-pointer
                    font-[Sansation,sans-serif]
                    flex flex-col items-center justify-center px-4 py-5
                    hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105 active:scale-100
                    ${s.card}
                    ${status === 'locked' ? 'opacity-60 hover:opacity-85' : ''}
                `}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                }}
                onClick={onClick}
                role="button"
                tabIndex={0}
                aria-label={`${topic.title} — ${status}`}
            >
                {/* Status badge — top-right */}
                {status === 'completed' && (
                    <span className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                        <FaCheckCircle size={11} />
                    </span>
                )}
                {status === 'locked' && (
                    <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--french-gray)]/40 text-[var(--mid-main-secondary)]">
                        <FaLock size={9} />
                    </span>
                )}

                {/* Gradient icon */}
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.iconBg} pb-3`}>
                    {s.useGradientIcon ? (
                        <svg width="0" height="0" className="absolute">
                            <defs>
                                <linearGradient id={`grad-${topic.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                    <stop offset="100%" stopColor="var(--accent-color)" />
                                </linearGradient>
                            </defs>
                        </svg>
                    ) : null}
                    <IconComponent
                        className="text-2xl"
                        style={s.useGradientIcon
                            ? { fill: `url(#grad-${topic.id})` }
                            : { color: 'var(--mid-main-secondary)' }
                        }
                    />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-center text-[var(--secondary-color)] leading-snug pb-1">
                    {topic.title}
                </h3>

                {/* Category label */}
                <p className="text-xs text-[var(--mid-main-secondary)] text-center pb-3">
                    {topic.category}
                </p>

                {/* Problem count circles */}
                {problemCount > 0 && (
                    <div className="flex items-center gap-1 flex-wrap justify-center">
                        {Array.from({ length: dotsToShow }).map((_, i) => (
                            <div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                    background: 'linear-gradient(to bottom, var(--dark-accent-color), var(--accent-color))',
                                }}
                            />
                        ))}
                        {overflowCount > 0 && (
                            <span className="text-[10px] font-semibold text-[var(--mid-main-secondary)] ml-0.5">
                                +{overflowCount}
                            </span>
                        )}
                    </div>
                )}
                {problemCount === 0 && (
                    <span className="text-[10px] text-[var(--mid-main-secondary)] italic">
                        No problems yet
                    </span>
                )}
            </motion.div>
        </div>
    );
});

TopicNode.displayName = 'TopicNode';

export default TopicNode;
