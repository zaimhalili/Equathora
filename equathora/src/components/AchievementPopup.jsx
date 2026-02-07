import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RARITY_COLORS = {
    Common: { bg: 'from-green-400 to-green-600', ring: 'ring-green-400/40', text: 'text-green-600' },
    Uncommon: { bg: 'from-blue-400 to-blue-600', ring: 'ring-blue-400/40', text: 'text-blue-600' },
    Rare: { bg: 'from-purple-400 to-purple-600', ring: 'ring-purple-400/40', text: 'text-purple-600' },
    Epic: { bg: 'from-orange-400 to-orange-600', ring: 'ring-orange-400/40', text: 'text-orange-600' },
    Legendary: { bg: 'from-yellow-400 to-yellow-600', ring: 'ring-yellow-400/40', text: 'text-yellow-600' },
};

const AchievementPopup = ({ achievements = [], onClose, onDismissOne }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [show, setShow] = useState(true);

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
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
                        onClick={handleDismissAll}
                    />

                    {/* Popup */}
                    <motion.div
                        key={current.id}
                        initial={{ scale: 0.5, opacity: 0, y: -50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 50 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]"
                    >
                        <div className="bg-white rounded-md shadow-2xl max-w-sm w-[90vw] overflow-hidden border-4 border-[var(--accent-color)]">
                            {/* Header bar */}
                            <div className={`flex items-center justify-center gap-2 bg-gradient-to-r ${rarity.bg} px-4 py-3`}>
                                <svg className="w-5 h-5 text-white" viewBox="0 0 576 512" fill="currentColor">
                                    <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-26.1c-20.9 0-37.9-17-37.9-37.9c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-68.8-38.8-97.6-89.2C70.5 183.8 56.1 143.2 48.9 112zm384.2 0c-7.2 31.2-21.6 71.8-38.8 101.4c-28.8 50.4-72.7 78.2-97.6 89.2c22.7-40.3 42.8-100.5 51.9-190.6h84.4z" />
                                </svg>
                                <span className="text-white text-sm font-bold uppercase tracking-wider">Achievement Unlocked!</span>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col items-center gap-4 px-6 py-8">
                                {/* Icon with glow */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                                    className="relative"
                                >
                                    <div
                                        className={`flex items-center justify-center w-20 h-20 rounded-full ring-4 ${rarity.ring} text-4xl`}
                                        style={{ backgroundColor: current.color + '22', color: current.color }}
                                    >
                                        {current.icon}
                                    </div>
                                    {/* Glow pulse */}
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0, 1.6, 0], opacity: [0, 0.6, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                                        className="absolute inset-0 rounded-full blur-xl"
                                        style={{ backgroundColor: current.color + '33' }}
                                    />
                                </motion.div>

                                {/* Achievement details */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col items-center gap-1 text-center"
                                >
                                    <h2 className="text-2xl font-black text-[var(--secondary-color)]">
                                        {current.title}
                                    </h2>
                                    <p className="text-sm text-gray-500">{current.description}</p>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${rarity.text}`}>
                                        {current.rarity}
                                    </span>
                                </motion.div>

                                {/* Counter */}
                                {achievements.length > 1 && (
                                    <p className="text-xs text-gray-400">
                                        {currentIndex + 1} / {achievements.length}
                                    </p>
                                )}

                                {/* Action buttons */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: 'spring' }}
                                    className="flex gap-3"
                                >
                                    {achievements.length > 1 && !isLast && (
                                        <button
                                            onClick={handleDismissAll}
                                            className="bg-gray-200 text-gray-600 px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-300 transition-colors"
                                        >
                                            Skip All
                                        </button>
                                    )}
                                    <button
                                        onClick={handleNext}
                                        className="bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] text-white px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                                    >
                                        {isLast ? 'Awesome!' : 'Next'}
                                    </button>
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
