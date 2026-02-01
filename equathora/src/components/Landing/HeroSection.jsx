import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import YoungStudent from '../../assets/images/hBooks.png';
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
        { value: 200, label: 'Practice Problems', suffix: '+' },
        { value: 30, label: 'Achievements', suffix: '+' },
        { value: 15, label: 'Math Topics', suffix: '+' },
    ];

    return (
        <section
            className="font-[Sansation] w-full bg-[var(--main-color)] relative overflow-hidden min-h-screen flex items-center justify-center"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/gplay.png")', backgroundBlendMode: 'overlay', opacity: 0.98 }}
        >
            {/* Background decorations */}
            <div className="absolute inset-0">
                {/* Subtle texture overlay for depth */}
                <div className="absolute inset-0 opacity-[0.85]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/gplay.png")' }}></div>
                {/* Gradient orbs */}
                {/* <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-[var(--accent-color)]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--accent-color)]/10 rounded-full blur-[100px]" /> */}

                {/* Grid lines */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 10px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 10px)
                        `,
                        backgroundSize: '80px 80px'
                    }}
                />

                {/* Half circle decoration */}
                <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-[500px] border border-[var(--secondary-color)]/10 rounded-l-full" />
                <div className="absolute -left-20 bottom-20 w-40 h-40 border border-[var(--secondary-color)]/5 rounded-full" />
            </div>

            {/* Red Particles */}
            <Particles />

            <div className="relative z-10 w-full flex justify-center">
                <div className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 max-w-[1400px] pt-40 pb-[28px] sm:pt-24 md:pt-30 lg:pt-20 flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-11 lg:gap-16 xl:gap-16 w-full min-h-screen">

                    {/* Left Content - Centered */}
                    <motion.div
                        className="flex flex-col gap-6 lg:gap-8 flex-1 text-center lg:text-left items-center lg:items-start max-w-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >

                        {/* Main Heading */}
                        <motion.h1
                            className="text-3xl sm:text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] text-[var(--secondary-color)]"
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
                            className="text-xs sm:text-sm md:text-base text-[var(--secondary-color)]/70 leading-relaxed max-w-lg"
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
                                to="/learn"
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
                            <Link
                                to="/about"
                                className="group relative text-sm sm:text-base !text-[var(--secondary-color)] font-medium transition-all flex items-center gap-2 min-w-[140px]"
                            >
                                <FaArrowRight className="text-xs sm:text-sm opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                <span className="transition-transform duration-300">Learn more</span>
                                <FaArrowRight className="text-xs sm:text-sm opacity-100 group-hover:translate-x-4 group-hover:opacity-0 transition-all duration-300" />
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
                                    <span className="text-xl sm:text-2xl font-bold text-[var(--secondary-color)]">
                                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                    </span>
                                    <span className="text-[10px] sm:text-xs text-[var(--secondary-color)]/60 border-t-2 border-[var(--accent-color)] pt-2">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Student PNG with floating circle and MouseFollower */}
                    <div className="flex-1 relative flex justify-center items-center h-full">
                        {/* MouseFollower wraps everything for parallax effect */}
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
                                {/* Circle container with image clipped inside */}
                                <div
                                    className="
                                        relative
                                        w-[320px]
                                        sm:w-[380px]
                                        md:w-[460px]
                                        lg:w-[560px]
                                        aspect-square
                                        rounded-full
                                        overflow-hidden
                                        z-10
                                        bg-gradient-to-b
                                        from-transparent
                                        to-[var(--french-gray)]/50
                                        backdrop-blur-sm
                                    "
                                >
                                    {/* Inner subtle circle */}
                                    <div className="absolute inset-[18%] rounded-full bg-[var(--main-color)]/80 z-0" />

                                    {/* Student image – clipped by the circle */}
                                    <img
                                        src={YoungStudent}
                                        alt="Student with books"
                                        className="
                                            absolute
                                            inset-0
                                            w-full
                                            h-full
                                            object-cover
                                            object-top
                                            drop-shadow-2xl
                                            brightness-90
                                            z-10
                                            saturation-95
                                        "
                                        loading="eager"
                                    />
                                </div>

                                {/* Floating badges - OUTSIDE overflow:hidden but INSIDE MouseFollower */}
                                {/* Floating badge – top right */}
                                <motion.div
                                    className="absolute top-[10%] right-[-3%] z-30"
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <div className="flex items-center gap-2 px-3 py-2 bg-[var(--secondary-color)] rounded-md shadow-2xl">
                                        <div>
                                            <p className="font-bold text-xl text-[var(--main-color)]">50+</p>
                                            <p className="text-[10px] text-gray-300">Active learners</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating badge – left */}
                                <motion.div
                                    className="absolute top-[38%] left-[-5%] z-30"
                                    animate={{ y: [0, 8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                >
                                    <div className="px-4 py-3 bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] rounded-md shadow-2xl text-white">
                                        <p className="text-2xl font-bold">98%</p>
                                        <p className="text-[10px] opacity-90 ">Success Rate</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </MouseFollower>

                        {/* Floating math symbols */}
                        <motion.div
                            className="absolute top-20 left-20 text-4xl text-[var(--secondary-color)]/20 font-light z-10 pointer-events-none"
                            animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        >
                            ∑
                        </motion.div>
                        <motion.div
                            className="absolute bottom-32 right-16 text-3xl text-[var(--secondary-color)]/15 font-light z-10 pointer-events-none"
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
