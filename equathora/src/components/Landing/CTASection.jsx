import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';

const CTASection = () => {
    const containerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 100 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const floatX = useTransform(x, [-400, 400], [20, -20]);
    const floatY = useTransform(y, [-400, 400], [20, -20]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                mouseX.set(e.clientX - rect.left - rect.width / 2);
                mouseY.set(e.clientY - rect.top - rect.height / 2);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <section
            ref={containerRef}
            className="w-full bg-white relative overflow-hidden flex justify-center px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16 md:py-20 lg:py-24 gap-10"
        >

            <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 md:gap-12">

                {/* Left side - Content */}
                <div className="flex-1 flex flex-col gap-6 sm:gap-7 text-center lg:text-left items-center lg:items-start w-full">

                    <motion.h2
                        className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                    >
                        Ready to build{' '}
                        <span className="text-[var(--secondary-color)] relative inline-block">
                            confidence
                            <motion.svg
                                className="absolute -bottom-1 left-0 w-full"
                                viewBox="0 0 200 8"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                            >
                                <motion.path
                                    d="M0 4 Q50 0 100 4 Q150 8 200 4"
                                    fill="none"
                                    stroke="var(--secondary-color)"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                />
                            </motion.svg>
                        </span>?
                    </motion.h2>

                    <motion.p
                        className="text-sm sm:text-xl md:text-2xl max-w-3xl font-light"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                    >
                        Pick a track, solve at your own pace, and watch your math intuition grow. No ads. No fluff. Just thoughtful practice.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start pt-3 sm:pt-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                    >
                        <Link
                                to="/login"
                                className="group flex items-center gap-2 rounded-full !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-center !text-white font-semibold transition-all ease-in hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] shadow-lg shadow-[var(--raisin-black)]/30 active:translate-y-1"
                            >
                                Start practicing
                                <motion.span
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <FaArrowRight className="text-xs sm:text-sm" />
                                </motion.span>
                            </Link>
                    </motion.div>

                    <motion.p
                        className="text-[var(--secondary-color)] text-sm font-light"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        ✓ Free to start &nbsp;&nbsp; ✓ No credit card required
                    </motion.p>
                </div>

                {/* Right side - Decorative card */}
                <motion.div
                    className="flex-1 relative flex justify-center items-center max-lg:hidden"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: 'spring' }}
                >
                    <motion.div
                        className="relative"
                        style={{ x: floatX, y: floatY }}
                    >
                        {/* Main card */}
                        <div className="w-80 h-96 rounded-3xl bg-gradient-to-br from-[var(--secondary-color)] to-[#1a1a2e] p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                            {/* Glow effect */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent-color)]/20 rounded-full blur-[60px]" />

                            {/* Card dots */}
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[var(--accent-color)]"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>

                            {/* Placeholder lines */}
                            <div className="flex flex-col gap-3">
                                <div className="h-3 w-3/4 bg-white/10 rounded-full"></div>
                                <div className="h-3 w-1/2 bg-white/10 rounded-full"></div>
                                <div className="h-3 w-2/3 bg-white/10 rounded-full"></div>
                            </div>

                            {/* Chart bars */}
                            <div className="flex-1 flex items-end gap-3 pt-8">
                                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex-1 rounded-t-lg bg-gradient-to-t from-[var(--accent-color)] to-[var(--accent-color)]/60"
                                        style={{ height: `${height}%` }}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${height}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Floating badge */}
                        <motion.div
                            className="absolute -bottom-6 -left-6 px-5 py-4 rounded-2xl bg-white shadow-2xl border border-gray-100"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] flex items-center justify-center text-green-900 text-xl font-extrabold">
                                    <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Problems solved</p>
                                    <p className="font-bold text-[var(--secondary-color)]">124+</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Math symbol */}
                        <motion.div
                            className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            ∑
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
