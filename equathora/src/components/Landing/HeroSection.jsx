import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaArrowRight } from 'react-icons/fa';
import MouseFollower, { FloatingElement, ParallaxLayer } from './MouseFollower';
import FloatingShapes from './FloatingShapes';

const HeroSection = () => {
    const stats = [
        { value: '100+', label: 'Problems', suffix: '' },
        { value: '30+', label: 'Achievements', suffix: '' },
        { value: '5+', label: 'Topics', suffix: '' },
    ];

    return (
        <section className="font-[Inter] w-full bg-white relative overflow-hidden min-h-[90vh] flex items-center">
            {/* Floating Background Shapes */}
            <FloatingShapes variant="hero" />
            
            {/* Subtle grid pattern */}
            <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'linear-gradient(var(--secondary-color) 1px, transparent 1px), linear-gradient(90deg, var(--secondary-color) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="relative z-10 w-full">
                <div className="px-[4vw] xl:px-[6vw] max-w-[1400px] py-8 lg:py-16 gap-12 flex flex-col lg:flex-row items-center justify-between mx-auto">
                    
                    {/* Left Content */}
                    <motion.div
                        className="flex flex-col gap-6 flex-1 text-center lg:text-left max-w-xl"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <motion.div
                            className="flex items-center gap-2 justify-center lg:justify-start"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse"></span>
                                Built for students
                            </span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-[var(--secondary-color)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                        >
                            Best platform for{' '}
                            <span className="text-[var(--accent-color)] relative">
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
                            {' '}learning.
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            className="text-lg text-[var(--mid-main-secondary)] leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                        >
                            Master math through focused practice, step-by-step guidance, and a distraction-free environment designed for your success.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-wrap gap-4 justify-center lg:justify-start items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                        >
                            <Link
                                to="/dashboard"
                                className="group flex items-center gap-2 rounded-full bg-[var(--accent-color)] px-8 py-3.5 text-center !text-white font-medium transition-all hover:bg-[var(--dark-accent-color)] hover:shadow-lg hover:shadow-[var(--accent-color)]/25 hover:scale-105"
                            >
                                Get started
                                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                to="/about"
                                className="group flex items-center gap-3 px-6 py-3.5 text-[var(--secondary-color)] font-medium transition-all hover:text-[var(--accent-color)]"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm group-hover:border-[var(--accent-color)] group-hover:shadow-md transition-all">
                                    <FaPlay className="text-xs text-[var(--accent-color)] ml-0.5" />
                                </span>
                                How it works
                            </Link>
                        </motion.div>

                        {/* Stats Row */}
                        <motion.div
                            className="flex gap-8 pt-6 justify-center lg:justify-start"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45, duration: 0.5 }}
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    className="flex flex-col"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                                >
                                    <span className="text-3xl font-bold text-[var(--accent-color)]">
                                        {stat.value}
                                    </span>
                                    <span className="text-sm text-[var(--mid-main-secondary)]">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Image Composition */}
                    <motion.div
                        className="flex-1 relative flex justify-center items-center min-h-[400px] lg:min-h-[500px]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Main Hero Image with Mouse Follow */}
                        <MouseFollower 
                            intensity={8} 
                            className="relative z-10"
                            scale={1.02}
                        >
                            <div className="relative">
                                {/* Main image container */}
                                <motion.div
                                    className="relative rounded-3xl overflow-hidden shadow-2xl"
                                    whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
                                        alt="Students learning together"
                                        className="w-full max-w-md object-cover rounded-3xl"
                                        loading="lazy"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--secondary-color)]/20 to-transparent"></div>
                                </motion.div>

                                {/* Floating badge - top left */}
                                <FloatingElement
                                    className="absolute -top-4 -left-4 z-20"
                                    floatRange={8}
                                    duration={3}
                                    cursorIntensity={15}
                                >
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-lg border border-gray-100">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <span className="text-sm font-semibold text-[var(--secondary-color)]">Live Practice</span>
                                    </div>
                                </FloatingElement>

                                {/* Floating badge - bottom right */}
                                <FloatingElement
                                    className="absolute -bottom-6 -right-6 z-20"
                                    floatRange={10}
                                    duration={4}
                                    delay={1}
                                    cursorIntensity={20}
                                >
                                    <div className="flex flex-col items-center gap-1 px-5 py-3 bg-[var(--accent-color)] rounded-2xl shadow-lg text-white">
                                        <span className="text-2xl font-bold">98%</span>
                                        <span className="text-xs opacity-90">Success Rate</span>
                                    </div>
                                </FloatingElement>
                            </div>
                        </MouseFollower>

                        {/* Secondary floating image */}
                        <ParallaxLayer depth={1.5} className="absolute -bottom-8 -left-16 z-5 hidden lg:block">
                            <motion.div
                                className="rounded-2xl overflow-hidden shadow-xl border-4 border-white"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&h=150&fit=crop"
                                    alt="Student studying"
                                    className="w-36 h-28 object-cover"
                                    loading="lazy"
                                />
                            </motion.div>
                        </ParallaxLayer>

                        {/* Decorative elements */}
                        <ParallaxLayer depth={2} className="absolute top-0 right-0 z-0">
                            <motion.div
                                className="w-72 h-72 rounded-full bg-[var(--accent-color)]/10 blur-3xl"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 8, repeat: Infinity }}
                            />
                        </ParallaxLayer>

                        {/* Small accent dots */}
                        <motion.div
                            className="absolute top-10 right-10 w-3 h-3 rounded-full bg-[var(--accent-color)]"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute bottom-20 right-32 w-2 h-2 rounded-full bg-[var(--french-gray)]"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
