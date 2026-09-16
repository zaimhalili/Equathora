import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import { FaTrophy } from 'react-icons/fa';

const RARITY_COLORS = {
    Common: {
        bg: 'linear-gradient(135deg, var(--common-start), var(--common-end))',
        ring: 'var(--common-border)',
        text: 'var(--common-border)',
    },
    Uncommon: {
        bg: 'linear-gradient(135deg, var(--uncommon-start), var(--uncommon-end))',
        ring: 'var(--uncommon-border)',
        text: 'var(--uncommon-border)',
    },
    Rare: {
        bg: 'linear-gradient(135deg, var(--rare-start), var(--rare-end))',
        ring: 'var(--rare-border)',
        text: 'var(--rare-border)',
    },
    Epic: {
        bg: 'linear-gradient(135deg, var(--epic-start), var(--epic-end))',
        ring: 'var(--epic-border)',
        text: 'var(--epic-border)',
    },
    Legendary: {
        bg: 'linear-gradient(135deg, var(--legendary-start), var(--legendary-end))',
        ring: 'var(--legendary-border)',
        text: 'var(--legendary-border)',
    },
};

const AchievementPopup = ({ achievements = [], onClose, onDismissOne }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [show, setShow] = useState(true);

    useBodyScrollLock(show && achievements.length > 0);

    const current = achievements[currentIndex];
    const isLast = currentIndex >= achievements.length - 1;

    useEffect(() => {
        if (!current) {
            setShow(false);
            setTimeout(onClose, 300);
        }
    }, [current, onClose]);

    const handleNext = () => {
        if (onDismissOne && current) onDismissOne(current.id);
        if (isLast) {
            setShow(false);
            setTimeout(onClose, 300);
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleDismissAll = () => {
        if (onDismissOne) {
            achievements.forEach(a => onDismissOne(a.id));
        }
        setShow(false);
        setTimeout(onClose, 300);
    };

    if (!current) return null;

    const rarity = RARITY_COLORS[current.rarity] || RARITY_COLORS.Common;

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Popup */}
                    <motion.div
                        key={current.id}
                        initial={{ scale: 0.9, opacity: 0, y: -180 }}
                        animate={{ scale: 1, opacity: 1, y: 25 }}
                        exit={{ scale: 0.9, opacity: 0, y: 80 }}
                        transition={{ type: 'spring', damping: 18, stiffness: 300 }}
                        className="fixed left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]"
                    >
                        <div className="bg-[var(--white)] rounded-xl shadow-2xl max-w-sm w-[90vw] overflow-hidden border-[var(--main-color)] border-2">
                            {/* Content */}
                            <div className="flex items-center gap-4 p-3 bg-[var(--white)] shadow-xs">
                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                                    className="relative"
                                >
                                    <div
                                        className="flex items-center justify-center w-15 h-15 rounded-full ring-4 text-3xl"
                                        style={{
                                            background: rarity.bg,
                                            borderColor: rarity.ring,
                                            boxShadow: `0 0 0 4px ${rarity.ring}55`,
                                            color: 'white',
                                        }}
                                    >
                                        {current.icon}
                                    </div>
                                </motion.div>

                                {/* Achievement details */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col"
                                >
                                    <h2 className="text-md font-medium text-[var(--secondary-color)] flex justify-between">
                                        {current.title}
                                        {/* Counter */}
                                        {achievements.length > 1 && (
                                            <p className="text-xs text-[var(--secondary-color)]/70 flex items-center">
                                                {currentIndex + 1} / {achievements.length}
                                            </p>
                                        )}
                                    </h2>
                                    <p className="text-sm text-[var(--secondary-color)]/70 overflow-hidden">{current.description}</p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AchievementPopup;
