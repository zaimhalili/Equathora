import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBolt } from 'react-icons/fa';

const MotionDiv = motion.div;

const ProblemSolvedPopup = ({ xp, onClose }) => {
    const [show, setShow] = useState(true);
    const [displayedXp, setDisplayedXp] = useState(0);
    const AUTO_DISMISS_MS = 60000;

    useEffect(() => {
        if (typeof xp !== 'number' || !Number.isFinite(xp)) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setDisplayedXp(Math.abs(xp));
            return undefined;
        }

        const duration = 2000;
        let animationFrame;
        let startedAt;

        const animateCount = (timestamp) => {
            if (startedAt === undefined) startedAt = timestamp;

            const progress = Math.min((timestamp - startedAt) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setDisplayedXp(Math.round(Math.abs(xp) * easedProgress));

            if (progress < 1) {
                animationFrame = window.requestAnimationFrame(animateCount);
            }
        };

        setDisplayedXp(0);
        animationFrame = window.requestAnimationFrame(animateCount);
        return () => window.cancelAnimationFrame(animationFrame);
    }, [xp]);

    useEffect(() => {
        const timer = window.setTimeout(() => setShow(false), AUTO_DISMISS_MS);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (show) return undefined;

        const timer = window.setTimeout(() => onClose?.(), 200);
        return () => window.clearTimeout(timer);
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <MotionDiv
                    initial={{ scale: 0.9, opacity: 0, y: -250 }}
                    animate={{ scale: 1, opacity: 1, y: 60 }}
                    exit={{ scale: 0.9, opacity: 0, y: 80 }}
                    transition={{ type: 'spring', damping: 18, stiffness: 300 }}
                    className="fixed left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000]"
                    role="status"
                    aria-live="polite"
                >
                    <div className="w-fit flex items-center gap-3 bg-(--white) border-(--main-color) border-2 rounded-2xl px-4 py-3 shadow-xs">
                        <FaBolt className="shrink-0 text-xl text-amber-500" />
                        {/* <div className="min-w-0 flex-1">
                            <h2 className="text-md font-semibold text-(--secondary-color)">
                                Problem solved!
                            </h2>
                            <p className="text-sm text-(--secondary-color)/70">
                                Added to your completed problems.
                            </p>
                        </div> */}
                        {typeof xp === 'number' && Number.isFinite(xp) ? (
                            <>
                                <span
                                    className="shrink-0 font-bold text-(--secondary-color) text-xl"
                                    aria-hidden="true"
                                >
                                    {`${xp >= 0 ? '+ ' : '−'}${displayedXp.toLocaleString()} XP`}
                                </span>
                                <span className="sr-only">
                                    {`${xp >= 0 ? 'Plus' : 'Minus'} ${Math.abs(xp).toLocaleString()} XP earned`}
                                </span>
                            </>
                        ) : (
                            <span className="shrink-0 font-bold text-(--secondary-color) text-xl">
                                XP update unavailable
                            </span>
                        )}
                        {/* <button
                            type="button"
                            onClick={() => setShow(false)}
                            className="shrink-0 p-1 text-(--secondary-color)/60 hover:text-(--secondary-color) transition-colors"
                            aria-label="Dismiss XP reward"
                        >
                            <FaTimes />
                        </button> */}
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};

export default ProblemSolvedPopup;
