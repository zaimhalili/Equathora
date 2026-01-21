import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import YoungStudent from '../../assets/images/holdingBooks.png'
import MouseFollower from './MouseFollower';

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

// Particle system - DVD-style bouncing particles
const Particles = () => {
    const [positions, setPositions] = useState(
        Array.from({ length: 6 }, () => ({
            x: Math.random() * 90,
            y: Math.random() * 90,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 8 + 4, // 4-12px (smaller)
        }))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setPositions(prev => prev.map(p => {
                let newX = p.x + p.vx;
                let newY = p.y + p.vy;
                let newVx = p.vx;
                let newVy = p.vy;

                // Bounce off walls
                if (newX <= 0 || newX >= 98) {
                    newVx = -p.vx;
                    newX = newX <= 0 ? 0 : 98;
                }
                if (newY <= 0 || newY >= 98) {
                    newVy = -p.vy;
                    newY = newY <= 0 ? 0 : 98;
                }

                return { ...p, x: newX, y: newY, vx: newVx, vy: newVy };
            }));
        }, 50); // Slower update rate

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
            {positions.map((p, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-[var(--accent-color)] transition-all duration-[50ms] ease-linear"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        opacity: 1,
                    }}
                />
            ))}
        </div>
    );
};

const HeroSection = () => {
    const stats = [
        { value: 100, label: 'Practice Problems', suffix: '+' },
        { value: 30, label: 'Achievements', suffix: '+' },
        { value: 10, label: 'Math Topics', suffix: '+' },
    ];

    return (
        <section
            className="font-[Sansation] w-full bg-[var(--secondary-color)] relative overflow-hidden min-h-[600px] sm:min-h-[700px] md:h-[calc(100vh)] flex items-center justify-center lg:pt-20"
        >
            {/* Background decorations */}
            <div className="absolute inset-0">
                {/* Gradient orbs */}
                <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-[var(--accent-color)]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--accent-color)]/10 rounded-full blur-[100px]" />

                {/* Grid lines */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px'
                    }}
                />

                {/* Half circle decoration */}
                <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-[500px] border border-white/10 rounded-l-full" />
                <div className="absolute -left-20 bottom-20 w-40 h-40 border border-white/5 rounded-full" />
            </div>

            {/* Red Particles */}
            <Particles />

            <div className="relative z-10 w-full">
                <div className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 max-w-[1400px] pt-22 pb-[28px] sm:py-24 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-16 w-full">

                    {/* Left Content - Centered */}
                    <motion.div
                        className="flex flex-col gap-6 lg:gap-8 flex-1 text-center lg:text-left items-center lg:items-start max-w-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        {/* <motion.div
                            className="flex items-center justify-center lg:justify-start"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20 backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse"></span>
                                Practice-focused learning
                            </span>
                        </motion.div> */}

                        {/* Main Heading */}
                        <motion.h1
                            className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] text-white"
                            initial={{ opacity: 0, rotateX: 45, scale: 0.8 }}
                            animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
                            style={{ transformPerspective: 1000 }}
                        >
                            Master{' '}
                            <span className="text-[var(--accent-color)] relative inline-block">
                                mathematics
                                <motion.svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 200 8"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                >
                                    <motion.path
                                        d="M0 4 Q50 0 100 4 Q150 8 200 4"
                                        fill="none"
                                        stroke="var(--accent-color)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                    />
                                </motion.svg>
                            </span>
                            <br />with focused practice.
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            className="text-xs sm:text-sm md:text-base text-white/70 leading-relaxed max-w-lg"
                            initial={{ opacity: 0, rotateX: 30, scale: 0.9 }}
                            animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                            transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                            style={{ transformPerspective: 1000 }}
                        >
                            Build real problem-solving skills through carefully crafted challenges. No distractions, just thoughtful practice.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start items-center"
                            initial={{ opacity: 0, rotateX: 25, scale: 0.9 }}
                            animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                            transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
                            style={{ transformPerspective: 1000 }}
                        >
                            <Link
                                to="/dashboard"
                                className="group flex items-center gap-2 rounded-lg !bg-[var(--accent-color)] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-center !text-white font-semibold transition-all hover:!bg-[var(--dark-accent-color)] shadow-lg shadow-[var(--accent-color)]/30"
                            >
                                Start practicing
                                <motion.span
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <FaArrowRight className="text-xs sm:text-sm" />
                                </motion.span>
                            </Link>
                            <Link
                                to="/about"
                                className="px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base !text-white font-medium border border-white/20 rounded-lg transition-all hover:!bg-white/10"
                            >
                                Learn more
                            </Link>
                        </motion.div>

                        {/* Stats Row */}
                        <motion.div
                            className="flex gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 justify-center lg:justify-start flex-wrap"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45, duration: 0.5 }}
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    className="flex flex-col items-center lg:items-start gap-2"
                                    initial={{ opacity: 0, rotateX: 20 }}
                                    animate={{ opacity: 1, rotateX: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                                    style={{ transformPerspective: 1000 }}
                                >
                                    <span className="text-xl sm:text-2xl font-bold text-white">
                                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                    </span>
                                    <span className="text-[10px] sm:text-xs text-white/60 border-t-2 border-[var(--accent-color)] pt-2">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Student PNG with floating circle and MouseFollower */}
                    <div className="flex-1 relative flex justify-center items-center h-full">
                        {/* Invisible hover area covering the entire right side */}
                        <MouseFollower
                            intensity={25}
                            scale={1.05}
                            rotateEnabled={true}
                            translateEnabled={true}
                            className="relative z-20 w-full h-full flex items-center justify-center"
                        >
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <motion.div
                                    className="relative"
                                >
                                    {/* Full circle backdrop (darker gradient) */}
                                    <div
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] lg:w-[555px] lg:h-[555px] rounded-full backdrop-blur-sm z-0"
                                        style={{ backgroundImage: 'linear-gradient(180deg, var(--secondary-color) 0%, rgba(0,0,0,0.55) 100%)' }}
                                    />
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] lg:w-[340px] lg:h-[340px] rounded-full z-0 bg-[var(--secondary-color)]" />

                                    {/* Student image positioned inside/aligned with circle */}
                                    <div className="relative w-[300px] h-[400px] md:w-[420px] md:h-[552px] flex items-end justify-center z-10">
                                        <div className="w-full h-[400px] md:h-[450px] overflow-hidden relative" style={{ borderRadius: '0 0 180px 180px', transform: 'none', willChange: 'auto' }}>
                                            <img
                                                src={YoungStudent}
                                                alt="Student with books"
                                                className="w-full h-full object-cover object-top drop-shadow-2xl"
                                                loading="eager"
                                                style={{ transform: 'none', willChange: 'auto' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Floating badge - top right (attached to image group) */}
                                    <motion.div
                                        className="absolute top-6 right-4 lg:right-8 z-30"
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-md shadow-2xl">
                                            <div>
                                                <p className="font-bold text-xl text-[var(--secondary-color)]">50+</p>
                                                <p className="text-[10px] text-gray-500">Active learners</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Floating badge - left side (attached to image group) */}
                                    <motion.div
                                        className="absolute top-28 left-0 lg:-left-6 z-30"
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    >
                                        <div className="px-4 py-3 bg-[var(--accent-color)] rounded-md shadow-2xl text-white">
                                            <p className="text-2xl font-bold">98%</p>
                                            <p className="text-[10px] opacity-90">Success Rate</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </MouseFollower>

                        {/* Floating math symbols */}
                        <motion.div
                            className="absolute top-20 left-20 text-4xl text-white/20 font-light z-10 pointer-events-none"
                            animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        >
                            ∑
                        </motion.div>
                        <motion.div
                            className="absolute bottom-32 right-16 text-3xl text-white/15 font-light z-10 pointer-events-none"
                            animate={{ rotate: [0, -10, 10, 0], y: [0, -8, 0] }}
                            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                        >
                            π
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
