import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import YoungStudent from '../../assets/images/hBooks.png';
import MouseFollower from './MouseFollower';

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
    return (
        <section
            className="font-[Sansation] w-full bg-[var(--main-color)] relative overflow-hidden flex items-center justify-center"
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
                <div className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 max-w-[1500px] pt-36 pb-16 sm:pt-28 lg:pt-24 xl:pt-32 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 w-full min-h-[calc(100vh-4rem)]">

                    {/* Left Content - Centered */}
                    <motion.div
                        className="flex flex-col gap-6 lg:gap-8 flex-1 text-center lg:text-left items-center lg:items-start max-w-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >

                        {/* Main Heading */}
                        <motion.h1
                            className="font-[Lexend] text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-7xl font-black leading-[1.02] tracking-[-0.045em] text-[var(--secondary-color)] max-w-[11ch]"
                            initial={{ opacity: 0, rotateX: 45, scale: 0.8 }}
                            animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
                            style={{ transformPerspective: 1000 }}
                        >
                            Practice math{' '}
                            <span className="text-[var(--accent-color)] relative inline-block">
                                until it clicks.
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
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            className="text-base sm:text-lg md:text-xl text-[var(--secondary-color)]/75 leading-relaxed max-w-xl"
                            initial={{ opacity: 0, rotateX: 30, scale: 0.9 }}
                            animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                            transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                            style={{ transformPerspective: 1000 }}
                        >
                            Work through guided problems, get instant feedback, and track your progress topic by topic.
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
                                className="group flex min-h-12 items-center gap-3 rounded-xl !bg-[var(--accent-color)] px-7 py-3 text-base text-center !text-white font-bold shadow-lg shadow-[var(--raisin-black)]/20 transition-[background-color,transform,box-shadow] duration-200 hover:!bg-[var(--dark-accent-color)] hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-color)]/30 focus-visible:ring-offset-2 active:translate-y-0"
                            >
                                Start a practice session
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
                                <span className="transition-transform duration-300">Learn about Equathora</span>
                                <FaArrowRight className="text-xs sm:text-sm opacity-100 group-hover:translate-x-4 group-hover:opacity-0 transition-all duration-300" />
                            </Link>
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
                                        backdrop-blur-sm"
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
