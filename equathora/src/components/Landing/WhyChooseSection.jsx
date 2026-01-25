import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
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
                    className="text-[40vw] lg:text-[32vw] font-bold text-[var(--french-gray)]/15 whitespace-nowrap select-none"
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
                            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-[var(--secondary-color)] leading-tight">
                                Real learning, real{' '}
                                <span className="text-[var(--secondary-color)] relative inline-block">
                                    progress
                                    <motion.svg
                                        className="absolute -bottom-1 left-0 w-full rotate-1"
                                        viewBox="0 0 200 8"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                    >
                                        <motion.path
                                            d="M0 4 Q50 0 100 4 Q150 8 200 4"
                                            fill="none"
                                            stroke="var(--secondary-color)"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ delay: 0.8, duration: 0.8 }}
                                        />
                                    </motion.svg>
                                </span>
                            </h2>
                            <p className="text-sm sm:text-xl md:text-2xl max-w-3xl font-light">
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
                                    <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="icon-gradient-check" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="var(--accent-color-dark)" />
                                                    <stop offset="100%" stopColor="var(--accent-color)" />
                                                </linearGradient>
                                            </defs>
                                            <path fill="url(#icon-gradient-check)" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                                        </svg>
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
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="icon-gradient-arrow" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="white" />
                                            <stop offset="100%" stopColor="white" />
                                        </linearGradient>
                                    </defs>
                                    <path fill="url(#icon-gradient-arrow)" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                                </svg>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
