import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import MouseFollower, { FloatingElement, ParallaxLayer } from './MouseFollower';

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
        'Connect with effective methods',
        'Increase your learning skills',
        'Track progress automatically',
        'Learn at your own pace',
    ];

    return (
        <section className="w-full bg-white relative overflow-hidden">
            {/* Background text decoration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <motion.div
                    className="text-[15vw] font-bold text-[var(--french-gray)]/5 whitespace-nowrap select-none"
                    animate={{ x: [0, -100, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    providing amazing online courses bringing you outstanding online learning
                </motion.div>
            </div>

            <div className="max-w-[1400px] px-[4vw] xl:px-[6vw] py-24 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    
                    {/* Left side - Content */}
                    <div className="flex-1 flex flex-col gap-8">
                        {/* Section header */}
                        <motion.div
                            className="flex flex-col gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-2 text-[var(--accent-color)] text-sm font-semibold uppercase tracking-wider">
                                <span className="w-8 h-[2px] bg-[var(--accent-color)]"></span>
                                Premium learning experience
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[var(--secondary-color)] leading-tight">
                                Providing amazing online courses.
                            </h2>
                            <p className="text-[var(--mid-main-secondary)] leading-relaxed max-w-lg">
                                Master the skills that matter to you. Web-based training you can consume at your own pace. Courses are interactive and engaging.
                            </p>
                        </motion.div>

                        {/* Benefits list */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                                >
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)]">
                                        <FaCheck className="text-xs" />
                                    </span>
                                    <span className="text-[var(--secondary-color)] font-medium">{benefit}</span>
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
                                className="group inline-flex items-center gap-2 rounded-full bg-[var(--secondary-color)] px-8 py-3.5 text-white font-medium transition-all hover:bg-[var(--accent-color)] hover:shadow-lg"
                            >
                                Explore courses
                                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right side - Images composition */}
                    <motion.div
                        className="flex-1 relative"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="relative flex gap-4">
                            {/* Main image */}
                            <MouseFollower intensity={5} className="flex-1">
                                <motion.div
                                    className="rounded-3xl overflow-hidden shadow-xl"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=350&h=450&fit=crop"
                                        alt="Student with laptop"
                                        className="w-full h-[400px] object-cover"
                                        loading="lazy"
                                    />
                                </motion.div>
                            </MouseFollower>

                            {/* Secondary image */}
                            <MouseFollower intensity={7} className="flex-1 mt-12">
                                <motion.div
                                    className="rounded-3xl overflow-hidden shadow-xl"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=350&h=350&fit=crop"
                                        alt="Online learning"
                                        className="w-full h-[320px] object-cover"
                                        loading="lazy"
                                    />
                                </motion.div>
                            </MouseFollower>

                            {/* Stats floating card */}
                            <FloatingElement
                                className="absolute -bottom-8 left-1/2 -translate-x-1/2"
                                floatRange={10}
                                duration={4}
                                cursorIntensity={15}
                            >
                                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 min-w-[200px]">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-5xl font-bold text-[var(--accent-color)]">
                                            <AnimatedCounter end={99} suffix="%" />
                                        </span>
                                        <span className="text-sm text-[var(--mid-main-secondary)] text-center">
                                            Students complete<br />course successfully
                                        </span>
                                    </div>
                                </div>
                            </FloatingElement>

                            {/* Decorative ring */}
                            <ParallaxLayer depth={1} className="absolute -top-8 -right-8 pointer-events-none">
                                <motion.div
                                    className="w-24 h-24 rounded-full border-4 border-[var(--accent-color)]/20"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                />
                            </ParallaxLayer>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
