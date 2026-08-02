import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

const UpgradedPopup = ({ onClose }) => {
    const [show, setShow] = useState(true);

    useBodyScrollLock(show);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 300);
    };

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[var(--raisin-black)]/40 backdrop-blur-sm z-[9998]"
                        onClick={handleClose}
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
                        <div className="bg-[var(--white)] rounded-md shadow-2xl p-8 sm:p-12 max-w-md w-[90vw] border border-[var(--mid-main-secondary)] text-center relative overflow-hidden">
                            {/* Crown / Star Icon with spring rotation */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                                className="flex justify-center pb-6"
                            >
                                <div className="relative">
                                    <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="icon-gradient-pro-popup" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                                <stop offset="100%" stopColor="var(--accent-color)" />
                                            </linearGradient>
                                        </defs>
                                        <path fill="url(#icon-gradient-pro-popup)" d="M309 106.9l122.1 122.1c12.5 12.5 32.8 12.5 45.3 0l50.7-50.7c18.7-18.7 18.7-49 0-67.7l-71-71c-18.7-18.7-49-18.7-67.7 0l-50.7 50.7c-12.5 12.5-12.5 32.8 0 45.3zM253.2 240.8L120.3 373.7c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-18.7-18.7-18.7-49 0-67.7l71-71c18.7-18.7 49-18.7 67.7 0l50.7 50.7c12.5 12.5 12.5 32.8 0 45.3zM545.9 33.9c-22.6-22.6-59.3-22.6-81.9 0L383 114.9 461.1 193l80.9-80.9c22.6-22.6 22.6-59.3 0-81.9zM316.1 418.1l-68-68 45.3-45.3 68 68-45.3 45.3z" />
                                    </svg>

                                    {/* Pulse blur ring */}
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: [0, 1.5, 0],
                                            opacity: [0, 1, 0],
                                        }}
                                        transition={{
                                            duration: 1.8,
                                            repeat: Infinity,
                                            ease: "easeOut"
                                        }}
                                        className="absolute inset-0 rounded-full bg-[var(--accent-color)]/25 blur-xl"
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
                                <h2 className="text-3xl sm:text-4xl font-black text-[var(--secondary-color)] pb-3">
                                    Welcome to Pro!
                                </h2>
                                <p className="text-base sm:text-lg text-[var(--secondary-color)]/70 pb-6 leading-relaxed">
                                    Your account has been upgraded. Unlimited AI breakdowns and practice problems are now unlocked.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleClose}
                                    className="w-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] text-[var(--white)] py-3 rounded-md text-base font-bold shadow-md cursor-pointer"
                                >
                                    Start Solving
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UpgradedPopup;