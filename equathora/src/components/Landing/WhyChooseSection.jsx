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
        <section className="w-full bg-white relative overflow-hidden flex justify-center">
            {/* Background scrolling text - FASTER */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <motion.div
                    className="text-[12vw] font-bold text-[var(--french-gray)]/25 whitespace-nowrap select-none"
                    animate={{ x: [0, 1000] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    PRACTICE LEARN GROW PRACTICE LEARN GROW
                </motion.div>
            </div>

            {/* Decorations */}
            <div className="absolute top-20 right-20 w-32 h-32 border border-gray-100 rounded-full" />
            <div className="absolute bottom-20 left-10 w-20 h-20 border border-[var(--accent-color)]/10 rounded-full" />

            <div className="max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32y-7 sm:py-14 md:py-16 lg:py-18 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 items-center">

                    {/* Left side - Content (Centered) */}
                    <div className="flex-1 flex flex-col gap-6 sm:gap-7 md:gap-8 text-center lg:text-left items-center lg:items-start w-full">
                        {/* Section header */}
                        <motion.div
                            className="flex flex-col gap-3 sm:gap-4 items-center lg:items-start"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="flex items-center gap-2 text-[var(--accent-color)] text-xs sm:text-sm font-semibold uppercase tracking-wider">
                                Premium experience
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--secondary-color)] leading-tight px-4 lg:px-0">
                                Why choose Equathora?
                            </h2>
                            <p className="text-[var(--mid-main-secondary)] leading-relaxed max-w-lg text-sm sm:text-base px-4 lg:px-0">
                                We focus on what matters: helping you build lasting problem-solving skills through thoughtful practice.
                            </p>
                        </motion.div>

                        {/* Benefits list */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                        >
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit}
                                    className="flex items-center gap-2 sm:gap-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ delay: 0.08 * index, duration: 0.35, ease: "easeOut" }}
                                >
                                    <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[var(--accent-color)] text-white flex-shrink-0">
                                        <FaCheck className="text-[10px] sm:text-xs" />
                                    </span>
                                    <span className="text-[var(--secondary-color)] font-medium text-sm sm:text-base">{benefit}</span>
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
                                className="group inline-flex items-center gap-2 rounded-full !bg-[var(--secondary-color)] px-5 sm:px-6 py-2.5 sm:py-3 !text-white text-sm sm:text-base font-semibold transition-all hover:!bg-[var(--accent-color)] shadow-lg"
                            >
                                Explore problems
                                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right side - Images with 3D tilt effect on hover */}
                    <motion.div
                        className="flex-1 relative min-h-[350px] sm:min-h-[400px] md:min-h-[450px] max-lg:hidden"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="relative flex justify-center items-center">
                            {/* Main image with tilt on hover - MALE */}
                            <motion.div
                                className="relative z-20 cursor-pointer"
                                whileHover={{
                                    rotateY: 0,
                                    rotateX: 0,
                                    scale: 1.05,
                                }}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                                    e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 30}deg) rotateX(${-y * 30}deg) scale(1.05)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <img
                                    src={Math}
                                    alt="Male student learning"
                                    className="w-[280px] lg:w-[340px] lg:h-[340px] h-[280px] rounded-3xl shadow-2xl object-cover"
                                    loading="lazy"
                                />
                            </motion.div>

                            {/* Secondary image - offset with tilt - MALE */}
                            <motion.div
                                className="absolute -bottom-8 -left-8 lg:-left-16 z-10 cursor-pointer"
                                whileHover={{
                                    rotateY: 0,
                                    rotateX: 0,
                                    scale: 1.05,
                                }}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                                    e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 25}deg) rotateX(${-y * 25}deg) scale(1.05)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <img
                                    src={Stack}
                                    alt="Male student taking notes"
                                    className="w-[160px] lg:w-[200px] h-[160px] lg:h-[200px] rounded-2xl shadow-xl object-cover border-4 border-white"
                                    loading="lazy"
                                />
                            </motion.div>

                            {/* Background decorative circle */}
                            {/* <motion.div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border-2 border-[var(--accent-color)]/10 z-0"
                                // animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            /> */}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
