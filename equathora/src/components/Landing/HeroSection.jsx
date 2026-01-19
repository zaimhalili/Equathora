import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import YoungStudent from '../../assets/images/yng_student.png'

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

// Particle system - RED particles, fewer, faster
const Particles = () => {
    const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 3,
        duration: Math.random() * 4 + 3, // Faster: 3-7s instead of 10-25s
        delay: Math.random() * 2,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-[var(--accent-color)]"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [-30, 30, -30],
                        x: [-20, 20, -20],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
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
            className="font-[Inter] w-full bg-[var(--secondary-color)] relative overflow-hidden min-h-[600px] sm:min-h-[700px] md:h-[calc(100vh-80px)] flex items-center justify-center"
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
                <div className="px-4 sm:px-6 md:px-[4vw] xl:px-[6vw] max-w-[1400px] py-8 sm:py-12 md:py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 mx-auto">

                    {/* Left Content - Centered */}
                    <motion.div
                        className="flex flex-col gap-8 flex-1 text-center lg:text-left items-center lg:items-start max-w-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <motion.div
                            className="flex items-center justify-center lg:justify-start"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20 backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse"></span>
                                Practice-focused learning
                            </span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.5 }}
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
                            className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed max-w-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                        >
                            Build real problem-solving skills through carefully crafted challenges. No distractions, just thoughtful practice.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                        >
                            <Link
                                to="/dashboard"
                                className="group flex items-center gap-2 rounded-full !bg-[var(--accent-color)] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-center !text-white font-semibold transition-all hover:!bg-[var(--dark-accent-color)] shadow-lg shadow-[var(--accent-color)]/30"
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
                                className="px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base !text-white font-medium border border-white/20 rounded-full transition-all hover:!bg-white/10"
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
                                    className="flex flex-col items-center lg:items-start"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                                >
                                    <span className="text-xl sm:text-2xl font-bold text-[var(--accent-color)]">
                                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                    </span>
                                    <span className="text-[10px] sm:text-xs text-white/60">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Student PNG with rounded bottom */}
                    <motion.div
                        className="flex-1 relative flex justify-center items-center h-full max-lg:hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Student with rounded bottom */}
                        <div className="relative z-20">
                            <div className="relative w-[400px] h-[500px]">
                                {/* Bottom half circle backdrop */}
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-sm border-2 border-white/10"
                                    style={{
                                        bottom: 0,
                                        width: '400px',
                                        height: '200px',
                                        borderRadius: '0 0 200px 200px',
                                        borderTop: 'none'
                                    }}
                                />

                                {/* Main student image - full top, rounded bottom */}
                                <motion.div
                                    className="absolute inset-0 overflow-hidden"
                                    style={{
                                        borderRadius: '0 0 200px 200px'
                                    }}
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
                                        src={YoungStudent}
                                        alt="Student with books"
                                        className="w-full h-full object-cover object-top drop-shadow-2xl"
                                        loading="eager"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Floating badge - top right */}
                        <motion.div
                            className="absolute top-16 right-4 lg:right-8 z-30"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-2xl shadow-2xl">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 text-sm">
                                    ✓
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500">Active learners</p>
                                    <p className="font-bold text-sm text-[var(--secondary-color)]">2,500+</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating badge - left side */}
                        <motion.div
                            className="absolute top-32 left-0 lg:-left-8 z-30"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <div className="px-4 py-3 bg-[var(--accent-color)] rounded-2xl shadow-2xl text-white">
                                <p className="text-2xl font-bold">98%</p>
                                <p className="text-[10px] opacity-90">Success Rate</p>
                            </div>
                        </motion.div>

                        {/* Decorative circle behind */}
                        <motion.div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full border-2 border-white/10 z-10"
                        />
                        <motion.div
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full border border-[var(--accent-color)]/20 z-10"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Floating math symbols */}
                        <motion.div
                            className="absolute top-20 left-20 text-4xl text-white/20 font-light z-10"
                            animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        >
                            ∑
                        </motion.div>
                        <motion.div
                            className="absolute bottom-32 right-16 text-3xl text-white/15 font-light z-10"
                            animate={{ rotate: [0, -10, 10, 0], y: [0, -8, 0] }}
                            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                        >
                            π
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
