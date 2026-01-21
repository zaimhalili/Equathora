import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

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
            className="w-full bg-white relative overflow-hidden"
        >
            {/* Background decorations */}
            <div className="absolute inset-0">
                {/* Gradient mesh */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--accent-color)]/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />

                {/* Lines pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.02]" preserveAspectRatio="none">
                    <defs>
                        <pattern id="ctaLines" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M0 60L60 0" stroke="var(--secondary-color)" strokeWidth="1" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#ctaLines)" />
                </svg>

                {/* Circles */}
                <div className="absolute top-20 right-20 w-40 h-40 border border-gray-100 rounded-full" />
                <div className="absolute bottom-20 left-20 w-24 h-24 border border-[var(--accent-color)]/10 rounded-full" />
            </div>

            <div className="max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-14 md:py-16 lg:py-18 relative z-10" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <div className="flex flex-col lg:flex-row items-center gap-16 sm:gap-18 md:gap-20">

                    {/* Left side - Content */}
                    <div className="flex-1 flex flex-col gap-6 sm:gap-7 text-center lg:text-left items-center lg:items-start w-full">
                        <motion.span
                            className="inline-flex items-center gap-2 text-[var(--accent-color)] text-xs font-semibold uppercase tracking-wider"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="w-6 sm:w-8 h-[2px] bg-[var(--accent-color)]"></span>
                            Start today
                        </motion.span>

                        <motion.h2
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--secondary-color)] leading-tight px-6 lg:px-0"
                            initial={{ opacity: 0, x: -60, rotateY: -10 }}
                            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
                            style={{ transformPerspective: 1000 }}
                        >
                            Ready to build{' '}
                            <span className="text-[var(--accent-color)]">confidence</span>?
                        </motion.h2>

                        <motion.p
                            className="text-xs sm:text-sm text-[var(--mid-main-secondary)] max-w-xl px-6 lg:px-0"
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
                                to="/dashboard"
                                className="group flex items-center gap-2 sm:gap-3 rounded-lg bg-[var(--secondary-color)] px-7 sm:px-9 md:px-10 py-3 sm:py-3.5 md:py-4 text-base sm:text-lg font-semibold !text-white transition-all hover:bg-[var(--accent-color)] shadow-lg"
                            >
                                Get started
                                <motion.span
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <FaArrowRight />
                                </motion.span>
                            </Link>
                        </motion.div>

                        <motion.p
                            className="text-[var(--mid-main-secondary)] text-sm"
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
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 text-xl">
                                        ✓
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Problems solved</p>
                                        <p className="font-bold text-[var(--secondary-color)]">1,247+</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Math symbol */}
                            <motion.div
                                className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-[var(--accent-color)] flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                ∑
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
