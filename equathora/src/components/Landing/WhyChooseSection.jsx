import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import Stack from "../../assets/images/stackBooks.jpeg";
import Math from "../../assets/images/mathFormulas.jpg";

// Animated counter component
const AnimatedCounter = ({ end, duration = 2, suffix = '', prefix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [isInView, end, duration]);

    return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

const WhyChooseSection = () => {
    const benefits = [
        'Structured problem sets',
        'Detailed step-by-step solutions',
        'Progress tracking & streaks',
        'Distraction-free environment',
    ];

    return (
        <section className="w-full bg-gradient-to-b from-white to-[var(--main-color)] relative overflow-hidden flex justify-center" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/batthern.png")' }}>
            {/* Background scrolling text - FASTER */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                <motion.div
                    className="text-[40vw] lg:text-[12vw] font-bold text-[var(--french-gray)]/15 whitespace-nowrap select-none"
                    animate={{ x: [0, 1200] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    PRACTICE LEARN GROW PRACTICE LEARN GROW PRACTICE LEARN GROW PRACTICE LEARN GROW PRACTICE LEARN GROW PRACTICE LEARN GROW
                </motion.div>
            </div>


            <div className="max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16 md:py-20 lg:py-24 mx-auto relative z-10">
                <div className="flex flex-col items-center text-center gap-8 sm:gap-10 md:gap-12">

                    {/* Content - Centered */}
                    <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 text-center items-center w-full max-w-3xl">
                        {/* Section header */}
                        <motion.div
                            className="flex flex-col gap-3 sm:gap-4 items-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="flex items-center gap-2 text-[var(--accent-color)] text-xs sm:text-sm font-semibold uppercase tracking-wider">
                                Why Equathora?
                            </span>
                            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-[var(--secondary-color)] leading-tight">
                                Real learning, real progress
                            </h2>
                            <p className="text-[var(--secondary-color)] leading-relaxed max-w-2xl text-base sm:text-lg">
                                Build problem-solving skills that last. Practice with purpose, track your growth, and master mathematics through thoughtful challenges.
                            </p>
                        </motion.div>

                        {/* Benefits list */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full max-w-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                        >
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit}
                                    className="flex items-center gap-3 text-left sm:justify-start"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ delay: 0.08 * index, duration: 0.35, ease: "easeOut" }}
                                >
                                    <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--accent-color)] text-white flex-shrink-0">
                                        <FaCheck className="text-xs sm:text-sm" />
                                    </span>
                                    <span className="text-[var(--secondary-color)] font-medium text-base sm:text-lg">{benefit}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <Link
                                to="/learn"
                                className="group inline-flex items-center gap-2 rounded-full !bg-[var(--secondary-color)] px-6 sm:px-8 py-3 sm:py-4 !text-white text-base sm:text-lg font-semibold transition-all hover:!bg-[var(--accent-color)] shadow-lg"
                            >
                                Explore problems
                                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
