import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import { FaGithub, FaCode, FaLightbulb, FaUsers, FaRocket } from 'react-icons/fa';
import { FaChartLine, FaArrowRight, FaClock, FaFire, FaTrophy } from 'react-icons/fa';
import { FaGraduationCap, FaBolt, FaStar, FaBookOpen } from 'react-icons/fa';
import Teacher from "../assets/images/teacher.svg";
import Progress from "../assets/images/progressAbs.svg";
import Achieve from "../assets/images/achieveAbs.svg";
import Study from "../assets/images/studyAbs.svg";
import Problem from "../assets/images/problemSC.png";

// Reusable animation component for scroll-triggered sections
const ScrollReveal = ({ children, direction = 'up', delay = 0, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const variants = {
        hidden: {
            opacity: 0,
            x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
            y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 0.7,
                delay: delay,
                ease: [0.22, 1, 0.36, 1],
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const About = () => {
    const bentoGridRef = useRef(null);

    return (
        <>
            <style>
                {`
                    .bento-card {
                        --glow-x: 50%;
                        --glow-y: 50%;
                        --glow-intensity: 0;
                        position: relative;
                    }
                    
                    .bento-card::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: radial-gradient(
                            600px circle at var(--glow-x) var(--glow-y),
                            rgba(255, 255, 255, calc(var(--glow-intensity) * 0.1)),
                            transparent 40%
                        );
                        border-radius: inherit;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        pointer-events: none;
                        z-index: 1;
                    }
                    
                    .bento-card:hover::before {
                        opacity: 1;
                    }
                    
                    .bento-card::after {
                        content: '';
                        position: absolute;
                        inset: -2px;
                        background: radial-gradient(
                            400px circle at var(--glow-x) var(--glow-y),
                            rgba(var(--card-glow-color, 66, 153, 225), calc(var(--glow-intensity) * 0.4)),
                            transparent 60%
                        );
                        border-radius: inherit;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        pointer-events: none;
                        z-index: -1;
                        filter: blur(20px);
                    }
                    
                    .bento-card:hover::after {
                        opacity: 1;
                    }
                    
                    .name-card {
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    
                    .name-card:hover {
                        transform: translateY(-4px);
                    }
                `}
            </style>
            {/* <FeedbackBanner /> */}
            <div className="font-[Sansation] w-full bg-[var(--main-color)] relative overflow-hidden min-h-screen flex items-center justify-center flex-col"
            >
                <Navbar />
                <div className="absolute inset-0">
                </div>
                <main className="relative z-10 w-full flex flex-col items-center">
                    {/* Hero - Full Width Clean */}

                    <section className="w-full relative bg-[var(--main-color)] py-12 overflow-hidden flex justify-center"
                        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/gplay.png")', backgroundBlendMode: 'overlay' }}>
                        <div className="absolute inset-0 -inset-x-4">
                            {/* Subtle texture overlay for depth */}
                            <div className="absolute inset-0 opacity-[0.85]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/gplay.png")' }}></div>
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
                        </div>
                        <div className="w-full max-w-[1500px] flex flex-col items-center text-center relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col items-center"
                            >
                                <h1 className="text-3xl sm:text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] text-[var(--secondary-color)] pb-2">
                                    About{' '}
                                    <span className="text-[var(--secondary-color)] relative inline-block">
                                        Equathora
                                        <motion.svg
                                            className="absolute -bottom-1 left-0 w-full"
                                            viewBox="0 0 200 8"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ delay: 0.8, duration: 0.8 }}
                                        >
                                            <motion.path
                                                d="M0 4 Q50 0 100 4 Q150 8 200 4"
                                                fill="none"
                                                stroke="var(--secondary-color)"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ delay: 0.8, duration: 0.8 }}
                                            />
                                        </motion.svg>
                                    </span>
                                </h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="text-sm sm:text-xl md:text-2xl max-w-3xl font-light text-[var(--secondary-color)]"
                                >
                                    Where equations meet time - a comprehensive platform for mathematical excellence
                                </motion.p>


                            </motion.div>
                        </div>
                    </section>

                    {/* Origin Story */}
                    <section className="w-full flex justify-center" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/gplay.png")', backgroundBlendMode: 'overlay' }}>
                        <div className="w-full flex flex-col max-w-[1500px] px-[4vw] xl:px-[6vw] py-16 gap-12">
                            <div className="flex flex-col" style={{ gap: '3rem' }}>
                                {/* Left Column - Name Breakdown */}
                                <ScrollReveal direction="left" className="flex-1 order-2 max-w-[1500px]">
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        <div className="flex items-center lg:w-1/2">
                                            <img src={Problem} alt="Problem Screenshot" className="cover rounded-sm" />
                                        </div>
                                        <div className="flex flex-col gap-2 h-full">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 }}
                                                className="p-6"
                                            >
                                                <div className="text-3xl font-black text-[var(--secondary-color)]">Equat-</div>
                                                <p className="text-gray-700 leading-relaxed">
                                                    From <span className="font-bold">"Equation"</span> — the foundation of mathematical thinking and problem-solving
                                                </p>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.2 }}
                                                className="p-6"
                                            >
                                                <div className="text-3xl font-black text-[var(--secondary-color)]">-hora</div>
                                                <p className="text-gray-700 leading-relaxed">
                                                    Greek <span className="font-bold">"ὥρα"</span> meaning time and hour, representing dedication to continuous learning
                                                </p>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 }}
                                                className="p-6"
                                            >
                                                <div className="text-3xl font-black text-[var(--secondary-color)]">Equathora</div>
                                                <p className="text-gray-700 leading-relaxed">
                                                    Time invested in mastering mathematical equations
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>

                                </ScrollReveal>

                                {/* Right Column - Why Red */}
                                <ScrollReveal direction="right" delay={0.2} className="flex-1">
                                    <div className="flex flex-col" style={{ gap: '1.5rem' }}>
                                        <h3 className="text-2xl font-bold text-[var(--secondary-color)]">
                                            Why <span className="text-[var(--accent-color)]">Red?</span>
                                        </h3>

                                        <div className="flex">
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 }}
                                                className="flex gap-4 flex-col"
                                            >
                                                <div className="flex items-center justify-center w-14 h-14 bg-[var(--secondary-color)] rounded-xl flex-shrink-0">
                                                    <FaBolt className="text-white text-xl" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="text-lg font-bold text-[var(--secondary-color)]" style={{ marginBottom: '0.25rem' }}>Focus</h4>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        Red naturally draws attention to critical concepts and steps in your learning path
                                                    </p>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.2 }}
                                                className="flex gap-4 flex-col"
                                            >
                                                <div className="flex items-center justify-center w-14 h-14 bg-[var(--secondary-color)] rounded-xl flex-shrink-0">
                                                    <FaFire className="text-white text-xl" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="text-lg font-bold text-[var(--secondary-color)]" style={{ marginBottom: '0.25rem' }}>Urgency</h4>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        It signals importance, from red ink in manuscripts to teacher corrections
                                                    </p>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 }}
                                                className="flex gap-4 flex-col"
                                            >
                                                <div className="flex items-center justify-center w-14 h-14 bg-[var(--secondary-color)] rounded-xl flex-shrink-0">
                                                    <FaStar className="text-white text-xl" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="text-lg font-bold text-[var(--secondary-color)]" style={{ marginBottom: '0.25rem' }}>Clarity</h4>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        Marks decisive moments of mathematical insight and understanding
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>

                                    </div>
                                </ScrollReveal>
                            </div>
                        </div>
                    </section>

                    {/* Platform strengths */}
                    <section className="w-full flex justify-center bg-gradient-to-b from-[#fafbfc] to-white py-16">
                        <div className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw]">
                            <ScrollReveal direction="up">
                                <div className="flex flex-col items-center justify-center w-full pb-12">
                                    <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-2">
                                        What Equathora Does{' '}
                                        <span className="text-[var(--secondary-color)] relative inline-block">
                                            Best
                                            <motion.svg
                                                className="absolute bottom-1 left-0 w-full"
                                                viewBox="0 0 200 8"
                                                initial={{ pathLength: 0 }}
                                                whileInView={{ pathLength: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3, duration: 0.8 }}
                                            >
                                                <motion.path
                                                    d="M0 4 Q50 0 100 4 Q150 8 200 4"
                                                    fill="none"
                                                    stroke="var(--secondary-color)"
                                                    strokeWidth="5"
                                                    strokeLinecap="round"
                                                />
                                            </motion.svg>
                                        </span>
                                    </h2>
                                    <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl text-center pt-4">
                                        Practice-first learning designed to build real mathematical confidence. The platform focuses on clarity, progression, and measurable improvement.
                                    </p>
                                </div>
                            </ScrollReveal>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { img: Study, title: 'Adaptive practice', desc: 'Problems evolve with your skill level so you always train at the right difficulty.', direction: 'left', delay: 0 },
                                    { img: Teacher, title: 'Guided solutions', desc: 'Clear explanations and structured hints help you learn the method, not just the answer.', direction: 'left', delay: 0.1 },
                                    { img: Progress, title: 'Progress insights', desc: 'Track growth, spot weak areas, and stay motivated with focused progress metrics.', direction: 'right', delay: 0.2 },
                                    { img: Achieve, title: 'Achievement flow', desc: 'Earn badges and milestones that celebrate consistency and mastery.', direction: 'right', delay: 0.3 }
                                ].map((feature, idx) => (
                                    <ScrollReveal key={idx} direction={feature.direction} delay={feature.delay}>
                                        <div className="flex flex-col items-center group">
                                            <motion.div
                                                className="w-full h-32 flex items-center justify-center pb-4"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <img
                                                    src={feature.img}
                                                    alt={feature.title}
                                                    className="w-24 h-24 object-contain drop-shadow-lg"
                                                />
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ y: -5, boxShadow: '0 20px 30px rgba(141,153,174,0.4)' }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                                className="relative flex flex-col bg-white rounded-xl border border-gray-100 shadow-lg hover:shadow-2xl duration-300 ease-out p-6 w-full min-h-[160px]"
                                            >
                                                <h3 className="text-lg font-bold text-[var(--secondary-color)] pb-2">{feature.title}</h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {feature.desc}
                                                </p>
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[var(--accent-color)]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </motion.div>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Mission - Side by Side Layout */}
                    <section className="w-full flex justify-center bg-gradient-to-b from-white to-gray-50 py-20">
                        <div className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw]">
                            <div className="flex flex-col lg:flex-row items-center gap-12">
                                {/* Left - Image */}
                                <ScrollReveal direction="left" className="lg:w-1/2">
                                    <motion.div
                                        className="relative"
                                    >
                                        <img
                                            src={Progress}
                                            alt="Progress tracking"
                                            className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
                                        />
                                    </motion.div>
                                </ScrollReveal>

                                {/* Right - Content */}
                                <ScrollReveal direction="right" className="lg:w-1/2">
                                    <div className="flex items-center gap-3 pb-6">
                                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--secondary-color)]">
                                            Our <span className="text-[var(--accent-color)]">Mission</span>
                                        </h2>
                                    </div>
                                    <p className="text-base md:text-lg text-gray-700 leading-relaxed pb-6">
                                        Transform how students approach mathematics, not as a subject to fear, but as a <span className="font-bold text-[var(--accent-color)]">journey of discovery</span>.
                                    </p>
                                    <p className="text-base md:text-lg text-gray-700 leading-relaxed pb-6">
                                        We provide an interactive platform where learners build <span className="font-bold text-[var(--secondary-color)]">confidence through step-by-step guidance</span> and achievement-based motivation.
                                    </p>
                                    <div className="flex flex-wrap gap-3 pt-8">
                                        <motion.div
                                            className="cursor-default pointer-events-none flex items-center gap-2 bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] text-white px-5 py-3 rounded-xl shadow-lg"
                                        >
                                            <FaGraduationCap className="text-xl" />
                                            <span className="font-semibold">Student-First</span>
                                        </motion.div>
                                        <motion.div
                                            className="cursor-default pointer-events-none flex items-center gap-2 bg-white border-2 border-[var(--accent-color)] text-[var(--accent-color)] px-5 py-3 rounded-xl shadow-lg"
                                        >
                                            <FaRocket className="text-xl" />
                                            <span className="font-semibold">Growth-Oriented</span>
                                        </motion.div>
                                    </div>
                                </ScrollReveal>
                            </div>
                        </div>
                    </section>

                    {/* Features - Magic Bento Grid */}
                    <section className="w-full flex justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50 py-20 overflow-hidden">
                        <div className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw] flex flex-col justify-center items-center">
                            <ScrollReveal direction="up">
                                <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--secondary-color)] pb-16 text-center">
                                    What Makes Us <span className="text-[var(--accent-color)]">Different</span>
                                </h2>
                            </ScrollReveal>

                            {/* Bento Grid Layout */}
                            <div className="w-full flex flex-wrap" style={{ gap: '1rem' }}>
                                {/* Large feature - Math Editor */}
                                <ScrollReveal direction="left" delay={0} style={{ flex: '1 1 calc(50% - 0.5rem)', minWidth: '300px', minHeight: '360px' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="group relative bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] rounded-3xl overflow-hidden shadow-2xl cursor-pointer flex flex-col justify-between" style={{ padding: '2rem', height: '100%' }}
                                    >
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                                        <div className="relative z-10 flex flex-col justify-between" style={{ height: '100%' }}>
                                            <motion.div
                                                whileHover={{ rotate: 360, scale: 1.2 }}
                                                transition={{ duration: 0.8 }}
                                                className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex-1" style={{ marginBottom: '1rem' }}
                                            >
                                                <FaCode className="text-white text-3xl" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-black text-white" style={{ marginBottom: '0.75rem' }}>Math Editor</h3>
                                                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                                                    Natural LaTeX input with real-time preview. Write equations as easily as you think them.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute" style={{ bottom: '-2.5rem', right: '-2.5rem', width: '10rem', height: '10rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(3rem)' }}></div>
                                    </motion.div>
                                </ScrollReveal>

                                {/* Smart Hints */}
                                <ScrollReveal direction="up" delay={0.1} style={{ flex: '1 1 calc(50% - 0.5rem)', minWidth: '300px', minHeight: '180px' }}>
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[var(--accent-color)]/30 relative overflow-hidden" style={{ padding: '1.5rem', height: '100%' }}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--accent-color)]/10 to-transparent rounded-bl-full"></div>
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 12 }}
                                            className="w-12 h-12 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] rounded-xl flex items-center justify-center pb-4 relative z-10"
                                        >
                                            <FaLightbulb className="text-white text-xl" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-[var(--secondary-color)] pb-2 group-hover:text-[var(--accent-color)] transition-colors">Smart Hints</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">Progressive guidance that adapts to your level</p>
                                    </motion.div>
                                </ScrollReveal>

                                {/* Achievements */}
                                <ScrollReveal direction="right" delay={0.15} style={{ flex: '1 1 calc(33.333% - 0.67rem)', minWidth: '250px', minHeight: '180px' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="group bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden" style={{ padding: '1.5rem', height: '100%' }}
                                    >
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                                        <motion.div
                                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center pb-4 relative z-10"
                                        >
                                            <FaRocket className="text-white text-xl" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-white pb-2 relative z-10">Achievements</h3>
                                        <p className="text-white/90 text-sm leading-relaxed relative z-10">Track progress with meaningful milestones</p>
                                    </motion.div>
                                </ScrollReveal>

                                {/* Mentorship - Tall */}
                                <ScrollReveal direction="left" delay={0.2} style={{ flex: '1 1 calc(33.333% - 0.67rem)', minWidth: '250px', minHeight: '360px' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[var(--accent-color)]/50 flex flex-col justify-between relative overflow-hidden" style={{ padding: '1.5rem', height: '100%' }}
                                    >
                                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-[var(--accent-color)]/5 to-transparent rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                                        <div className="relative z-10">
                                            <motion.div
                                                whileHover={{ y: -5 }}
                                                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center pb-6 shadow-lg"
                                            >
                                                <FaUsers className="text-white text-2xl" />
                                            </motion.div>
                                            <h3 className="text-2xl font-bold text-[var(--secondary-color)] pb-3 group-hover:text-[var(--accent-color)] transition-colors">Mentorship</h3>
                                            <p className="text-gray-600 leading-relaxed">Expert support when you need it most. Real guidance from experienced math educators.</p>
                                        </div>
                                    </motion.div>
                                </ScrollReveal>

                                {/* 200+ Problems */}
                                <ScrollReveal direction="up" delay={0.25} style={{ flex: '1 1 calc(33.333% - 0.67rem)', minWidth: '250px', minHeight: '180px' }}>
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        className="group bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden" style={{ padding: '1.5rem', height: '100%' }}
                                    >
                                        <div className="absolute top-0 right-0 text-white/10 text-9xl font-black">200+</div>
                                        <motion.div
                                            whileHover={{ scale: 1.15, rotate: -12 }}
                                            className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center pb-4 relative z-10"
                                        >
                                            <FaChartLine className="text-white text-xl" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-white pb-2 relative z-10">200+ Problems</h3>
                                        <p className="text-white/90 text-sm leading-relaxed relative z-10">Curated library across many topics</p>
                                    </motion.div>
                                </ScrollReveal>

                                {/* Leaderboards */}
                                <ScrollReveal direction="right" delay={0.3} style={{ flex: '1 1 calc(33.333% - 0.67rem)', minWidth: '250px', minHeight: '180px' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-green-400 relative overflow-hidden" style={{ padding: '1.5rem', height: '100%' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300"></div>
                                        <motion.div
                                            whileHover={{ rotate: 360, scale: 1.2 }}
                                            transition={{ duration: 0.6 }}
                                            className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center pb-4 relative z-10 shadow-md"
                                        >
                                            <FaTrophy className="text-white text-xl" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-[var(--secondary-color)] pb-2 group-hover:text-green-600 transition-colors relative z-10">Leaderboards</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed relative z-10">Compete globally, grow together</p>
                                    </motion.div>
                                </ScrollReveal>

                                {/* Progress Analytics */}
                                <ScrollReveal direction="left" delay={0.35} style={{ flex: '1 1 calc(33.333% - 0.67rem)', minWidth: '250px', minHeight: '180px' }}>
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        className="group bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden" style={{ padding: '1.5rem', height: '100%' }}
                                    >
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                                        <motion.div
                                            whileHover={{ scale: 1.15, rotate: 15 }}
                                            className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center pb-4 relative z-10"
                                        >
                                            <FaChartLine className="text-white text-xl" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-white pb-2 relative z-10">Progress Analytics</h3>
                                        <p className="text-white/90 text-sm leading-relaxed relative z-10">Deep insights into your learning journey</p>
                                    </motion.div>
                                </ScrollReveal>

                                {/* Study Streaks */}
                                <ScrollReveal direction="up" delay={0.4} style={{ flex: '1 1 calc(33.333% - 0.67rem)', minWidth: '250px', minHeight: '180px' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-400 relative overflow-hidden" style={{ padding: '1.5rem', height: '100%' }}
                                    >
                                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-tl-full"></div>
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: -15 }}
                                            className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center pb-4 relative z-10 shadow-md"
                                        >
                                            <FaFire className="text-white text-xl" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-[var(--secondary-color)] pb-2 group-hover:text-orange-600 transition-colors relative z-10">Study Streaks</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed relative z-10">Build consistency with daily challenges</p>
                                    </motion.div>
                                </ScrollReveal>

                                {/* Real-time Feedback */}
                                <ScrollReveal direction="right" delay={0.45} style={{ flex: '1 1 calc(33.333% - 0.67rem)', minWidth: '250px', minHeight: '180px' }}>
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-400 relative overflow-hidden" style={{ padding: '1.5rem', height: '100%' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                                        <motion.div
                                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center pb-4 relative z-10 shadow-md"
                                        >
                                            <FaClock className="text-white text-xl" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-[var(--secondary-color)] pb-2 group-hover:text-blue-600 transition-colors relative z-10">Real-time Feedback</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed relative z-10">Instant validation as you solve</p>
                                    </motion.div>
                                </ScrollReveal>
                            </div>
                        </div>
                    </section>

                    {/* CTA - Immersive Full Width */}
                    <section className="w-full bg-[var(--secondary-color)] py-12 relative overflow-hidden flex justify-center">

                        <div className="relative z-10 w-full max-w-[1500px]  px-[4vw] xl:px-[6vw]">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                                {/* Left Content */}
                                <ScrollReveal direction="left" className="lg:w-1/2 text-white">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <div className="flex justify-center items-center py-2 bg-white/20 backdrop-blur-sm rounded-full">
                                            <span className="text-sm font-bold text-white">Join 300+ Students</span>
                                        </div>
                                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black pb-6 leading-tight">
                                            Ready to Master <br />
                                            <span className="text-[linear-gradient(360deg,var(--accent-color),var(dark-accent-color)]">Mathematics?</span>
                                        </h2>
                                        <p className="text-lg md:text-xl text-white/90 pb-8 leading-relaxed">
                                            Start solving problems today, track your progress, and unlock your mathematical potential with personalized learning paths.
                                        </p>
                                        <div className="flex flex-wrap gap-4 pb-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span className="text-sm text-white/80">Free Forever</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span className="text-sm text-white/80">No Credit Card</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span className="text-sm text-white/80">200+ Problems</span>
                                            </div>
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Link
                                                to="/signup"
                                                className="inline-flex items-center gap-3 !bg-[var(--dark-accent-color)] !text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 group"
                                            >
                                                Get Started Free
                                                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                </ScrollReveal>

                                {/* Right Illustration */}
                                <ScrollReveal direction="right" className="lg:w-1/2 flex justify-center">
                                    <motion.div
                                        className="relative"
                                    >
                                        <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
                                        <img
                                            src={Achieve}
                                            alt="Achievement"
                                            className="relative z-10 w-full max-w-md h-auto object-contain drop-shadow-2xl"
                                        />
                                    </motion.div>
                                </ScrollReveal>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}

export default About;
