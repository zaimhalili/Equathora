import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

/**
 * TopicNode — a single topic card in the Math Learning Path.
 *
 * Accepts a forwarded ref so the parent can measure DOM position
 * for dynamic SVG connector generation via getBoundingClientRect().
 *
 * Props
 * ─────
 * topic      – { id, title, description, icon: ReactIconComponent }
 * status     – "locked" | "available" | "completed"
 * index      – ordinal position (used for stagger delay)
 * onClick    – optional click handler
 */
const TopicNode = forwardRef(({ topic, status = 'locked', index = 0, onClick }, ref) => {
    const IconComponent = topic.icon;

    /* ── status-driven style tokens ── */
    const statusStyles = {
        locked: {
            card: 'opacity-50 cursor-not-allowed border-[var(--french-gray)]/40 bg-white/40 backdrop-blur-sm',
            iconBg: 'bg-[var(--french-gray)]/20',
            iconColor: 'text-[var(--mid-main-secondary)]/60',
            ring: '',
        },
        available: {
            card: 'cursor-pointer border-transparent bg-white hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105 active:scale-100 shadow-md',
            iconBg: 'bg-[var(--accent-color)]/10',
            iconColor: 'text-[var(--accent-color)]',
            ring: '',
        },
        completed: {
            card: 'cursor-pointer border-transparent bg-white hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105 active:scale-100 shadow-sm',
            iconBg: 'bg-green-500/10',
            iconColor: 'text-green-600',
            ring: '',
        },
    };

    const s = statusStyles[status] || statusStyles.locked;

    return (
        <motion.div
            ref={ref}
            className={`
        relative rounded-xl border p-5 md:p-6
        min-w-[12rem] max-w-[16rem] w-full
        transition-all duration-150 ease-out
        font-[Sansation,sans-serif]
        ${s.card} ${s.ring}
      `}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.45,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
            }}
            onClick={status !== 'locked' ? onClick : undefined}
            role={status !== 'locked' ? 'button' : undefined}
            tabIndex={status !== 'locked' ? 0 : -1}
            aria-label={`${topic.title} — ${status}`}
        >
            {/* Status badge — top-right */}
            {status === 'completed' && (
                <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-[10px] shadow-md ring-2 ring-white">
                    <FaCheckCircle size={11} />
                </span>
            )}
            {status === 'locked' && (
                <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--french-gray)] text-white text-[10px] shadow-md ring-2 ring-white/60">
                    <FaLock size={9} />
                </span>
            )}

            {/* Available indicator dot */}
            {status === 'available' && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-color)] opacity-40" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-color)] ring-2 ring-white" />
                </span>
            )}

            {/* Icon */}
            <div className={`mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-xl ${s.iconBg} transition-colors duration-150`}>
                <IconComponent className={`text-xl ${s.iconColor}`} />
            </div>

            {/* Title */}
            <h3 className="text-sm md:text-[15px] font-bold text-center text-[var(--secondary-color)] leading-tight">
                {topic.title}
            </h3>

            {/* Description */}
            <p className={`mt-2 text-[11px] md:text-xs text-center leading-snug ${status === 'locked'
                    ? 'text-[var(--mid-main-secondary)]/40'
                    : 'text-[var(--mid-main-secondary)]'
                }`}>
                {topic.description}
            </p>

            {/* Status label */}
            {status === 'completed' && (
                <div className="mt-3 flex justify-center">
                    <span className="text-[10px] font-medium text-green-600 bg-green-500/10 rounded-md px-2 py-0.5">
                        Completed
                    </span>
                </div>
            )}
            {status === 'available' && (
                <div className="mt-3 flex justify-center">
                    <span className="text-[10px] font-medium text-[var(--accent-color)] bg-[var(--accent-color)]/8 rounded-md px-2 py-0.5">
                        Start learning
                    </span>
                </div>
            )}
        </motion.div>
    );
});

TopicNode.displayName = 'TopicNode';

export default TopicNode;
