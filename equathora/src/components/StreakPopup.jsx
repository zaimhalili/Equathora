import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StreakPopup = ({ streak, onClose }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

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
                        onClick={() => {
                            setShow(false);
                            setTimeout(onClose, 300);
                        }}
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: -50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 50 }}
                        transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 300
                        }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]"
                    >
                        <div className="bg-white rounded-md shadow-2xl p-8 sm:p-12 max-w-md w-[90vw] border-4 border-[var(--accent-color)]">
                            {/* Fire icon with animation */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                                className="flex justify-center mb-6"
                            >
                                <div className="relative">
                                    <svg className="w-24 h-24 sm:w-32 sm:h-32" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="icon-gradient-fire-popup" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                                <stop offset="100%" stopColor="var(--accent-color)" />
                                            </linearGradient>
                                        </defs>
                                        <path fill="url(#icon-gradient-fire-popup)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
                                    </svg>
                                    {/* Particle effects */}
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: [0, 1.5, 0],
                                            opacity: [0, 1, 0],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeOut"
                                        }}
                                        className="absolute inset-0 rounded-full bg-[var(--accent-color)]/20 blur-xl"
                                    />
                                </div>
                            </motion.div>

                            {/* Text content */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-center"
                            >
                                <h2 className="text-3xl sm:text-4xl font-black text-[var(--secondary-color)] mb-3">
                                    {streak} Day Streak!
                                </h2>
                                <p className="text-base sm:text-lg text-gray-600 mb-4">
                                    You're on fire! Keep solving daily to maintain your streak.
                                </p>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                    className="inline-block bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] text-white px-6 py-2 rounded-full text-sm font-bold"
                                >
                                    Keep it up!
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default StreakPopup;
