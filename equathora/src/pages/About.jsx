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
                        <div className="w-full flex flex-col max-w-[1500px] px-[4vw] xl:px-[6vw] md:pb-16 gap-12">
                            <div className="flex flex-col gap-12">
                                {/* Left Column - Name Breakdown */}
                                <ScrollReveal direction="left" className="flex-1 order-2 max-w-[1500px]">
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        <div className="flex items-center">
                                            <img src={Problem} alt="Problem Screenshot" className="object-contain rounded-md h-full" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 }}
                                                className="p-6"
                                            >
                                                <div className="text-3xl font-black text-[var(--secondary-color)]">Equat-</div>
                                                <p className="text-sm sm:text-xl md:text-2xl max-w-3xl font-light text-[var(--secondary-color)]">
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
                                                <p className="text-sm sm:text-xl md:text-2xl max-w-3xl font-light text-[var(--secondary-color)]">
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
                                                <p className="text-sm sm:text-xl md:text-2xl max-w-3xl font-light text-[var(--secondary-color)]">
                                                    Time invested in mastering mathematical equations
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>

                                </ScrollReveal>

                                {/* Right Column - Why Red */}
                                <ScrollReveal direction="right" delay={0.2} className="flex-1">
                                    <div className="flex flex-col gap-6">
                                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--secondary-color)]">
                                            Why <span className="text-transparent bg-clip-text bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]">Red?</span>
                                        </h3>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 }}
                                                className="flex gap-4 md:flex-col"
                                            >
                                                <div className="flex items-center justify-center w-14 md:h-14  rounded-md flex-shrink-0">
                                                    <svg className="w-5 h-5" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                                        <defs>
                                                            <linearGradient id="icon-gradient-bolt" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                                                <stop offset="100%" stopColor="var(--accent-color)" />
                                                            </linearGradient>
                                                        </defs>
                                                        <path fill="url(#icon-gradient-bolt)" d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z" />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col border-l-4 border-(--accent-color) md:border-none pl-4 md:pl-0">
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
                                                className="flex gap-4 md:flex-col"
                                            >
                                                <div className="flex items-center justify-center w-14 md:h-14  rounded-md flex-shrink-0">
                                                    <svg className="w-5 h-5" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                                        <defs>
                                                            <linearGradient id="icon-gradient-fire" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                                                <stop offset="100%" stopColor="var(--accent-color)" />
                                                            </linearGradient>
                                                        </defs>
                                                        <path fill="url(#icon-gradient-fire)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col border-l-4 border-(--accent-color) md:border-none pl-4 md:pl-0">
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
                                                className="flex gap-4 md:flex-col"
                                            >
                                                <div className="flex items-center justify-center w-14 md:h-14  rounded-md flex-shrink-0">
                                                    <svg className="w-5 h-5" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                                        <defs>
                                                            <linearGradient id="icon-gradient-star" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                                                <stop offset="100%" stopColor="var(--accent-color)" />
                                                            </linearGradient>
                                                        </defs>
                                                        <path fill="url(#icon-gradient-star)" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col border-l-4 border-(--accent-color) md:border-none pl-4 md:pl-0">
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
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--secondary-color)] pb-4">
                                        What Equathora {' '}
                                        <span className="text-[var(--secondary-color)] relative inline-block">
                                            Does Best
                                            <motion.svg
                                                className="absolute -bottom-0 left-0 w-full"
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
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                />
                                            </motion.svg>
                                        </span>
                                    </h2>
                                    <p className="text-sm sm:text-xl md:text-2xl font-light text-[var(--secondary-color)] max-w-3xl text-center">
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
                                                className="w-full h-32 flex items-center justify-center"
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
                                                className="relative flex flex-col bg-white rounded-md border border-gray-100 shadow-lg hover:shadow-2xl duration-300 ease-out p-6 w-full min-h-[160px]"
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
                                            Our <span className="text-transparent bg-clip-text bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]">Mission</span>
                                        </h2>
                                    </div>
                                    <p className="text-sm sm:text-xl md:text-2xl font-light text-[var(--secondary-color)]">
                                        Transform how students approach mathematics, not as a subject to fear, but as a <span className="font-bold text-transparent bg-clip-text bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]">journey of discovery</span>.
                                    </p>
                                    <p className="text-sm sm:text-xl md:text-2xl font-light text-[var(--secondary-color)]">
                                        We provide an interactive platform where learners build <span className="font-bold text-[var(--secondary-color)]">confidence through step-by-step guidance</span> and achievement-based motivation.
                                    </p>
                                    <div className="flex flex-wrap gap-3 pt-8">
                                        <motion.div
                                            className="cursor-default pointer-events-none flex items-center gap-2 bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-white px-5 py-3 rounded-md shadow-lg"
                                        >
                                            <FaGraduationCap className="text-xl" />
                                            <span className="font-semibold">Student-First</span>
                                        </motion.div>
                                        <motion.div
                                            className="cursor-default pointer-events-none flex items-center gap-2 bg-white border-2 border-[var(--accent-color)] text-[var(--accent-color)] px-5 py-3 rounded-md shadow-lg"
                                        >
                                            <FaRocket className="text-xl" />
                                            <span className="font-semibold text-transparent bg-clip-text bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]">Growth-Oriented</span>
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
                                    What Makes Us <span className="text-transparent bg-clip-text bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]">Different</span>
                                </h2>
                            </ScrollReveal>

                            {/* Bento Grid Layout */}
                            <div className="w-full flex flex-wrap gap-4">
                                {/* Row 1: Math Editor + Smart Hints */}
                                <ScrollReveal direction="left" delay={0} className="w-full md:w-[calc(50%-0.5rem)] min-h-[360px]">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="group relative bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] rounded-md overflow-hidden shadow-2xl cursor-pointer flex flex-col justify-between p-8 h-full"
                                    >
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                                        <div className="relative z-10 flex flex-col justify-between h-full">
                                            <motion.div
                                                whileHover={{ rotate: 360, scale: 1.2 }}
                                                transition={{ type: 'spring', stiffness: 300, duration: 0.8 }}
                                                className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-md"
                                            >
                                                <FaCode className="text-white text-3xl" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-black text-white">Math Editor</h3>
                                                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                                                    Natural LaTeX input with real-time preview. Write equations as easily as you think them.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </ScrollReveal>

                                <ScrollReveal direction="up" delay={0.1} className="w-full md:w-[calc(50%-0.5rem)] min-h-[360px]">
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        className="group bg-white rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[var(--accent-color)]/30 relative overflow-hidden p-8 h-full flex flex-col justify-between"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--accent-color)]/10 to-transparent rounded-bl-full"></div>
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 12 }}
                                            className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] rounded-md relative z-10"
                                        >
                                            <FaLightbulb className="text-white text-3xl" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-black text-[var(--secondary-color)] group-hover:text-[var(--accent-color)] transition-colors">Smart Hints</h3>
                                            <p className="text-sm md:text-base text-gray-600 leading-relaxed">Progressive guidance that adapts to your level</p>
                                        </div>
                                    </motion.div>
                                </ScrollReveal>

                                {/* Row 2: Achievements + Mentorship + (Leaderboards + Progress Analytics) */}
                                <ScrollReveal direction="right" delay={0.15} className="w-full md:w-[calc(33.333%-0.67rem)] min-h-[360px]">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="group bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden p-8 h-full flex flex-col justify-between"
                                    >
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                                        <motion.div
                                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                                            transition={{ duration: 0.5 }}
                                            className="flex items-center justify-center w-16 h-16 bg-white/30 backdrop-blur-sm rounded-md relative z-10"
                                        >
                                            <FaRocket className="text-white text-3xl" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-black text-white relative z-10">Achievements</h3>
                                            <p className="text-white/90 text-sm md:text-base leading-relaxed relative z-10">Track progress with meaningful milestones</p>
                                        </div>
                                    </motion.div>
                                </ScrollReveal>

                                <ScrollReveal direction="left" delay={0.2} className="w-full md:w-[calc(33.333%-0.67rem)] min-h-[360px]">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="group bg-white rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[var(--accent-color)]/50 flex flex-col justify-between relative overflow-hidden p-8 h-full"
                                    >
                                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-[var(--accent-color)]/5 to-transparent rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                                        <motion.div
                                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                                            transition={{ duration: 0.5 }}
                                            className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md relative z-10 shadow-lg"
                                        >
                                            <FaUsers className="text-white text-3xl" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-black text-[var(--secondary-color)] group-hover:text-[var(--accent-color)] transition-colors">Mentorship</h3>
                                            <p className="text-sm md:text-base text-gray-600 leading-relaxed">Expert support when you need it most. Real guidance from experienced math educators.</p>
                                        </div>
                                    </motion.div>
                                </ScrollReveal>

                                {/* Leaderboards + Progress Analytics column */}
                                <div className="w-full md:w-[calc(33.333%-0.67rem)] flex flex-col gap-4 min-h-[360px]">
                                    <ScrollReveal direction="right" delay={0.3} className="flex-1">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="group bg-white rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-green-400 relative overflow-hidden p-8 h-full flex flex-col justify-between"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300"></div>
                                            <motion.div
                                                whileHover={{ rotate: 360, scale: 1.2 }}
                                                transition={{ duration: 0.6 }}
                                                className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md relative z-10 shadow-md"
                                            >
                                                <FaTrophy className="text-white text-3xl" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-black text-[var(--secondary-color)] group-hover:text-green-600 transition-colors relative z-10">Leaderboards</h3>
                                                <p className="text-sm md:text-base text-gray-600 leading-relaxed relative z-10">Compete globally, grow together</p>
                                            </div>
                                        </motion.div>
                                    </ScrollReveal>

                                    <ScrollReveal direction="left" delay={0.35} className="flex-1">
                                        <motion.div
                                            whileHover={{ y: -8 }}
                                            className="group bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden p-8 h-full flex flex-col justify-between"
                                        >
                                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                                            <motion.div
                                                whileHover={{ scale: 1.15, rotate: 15 }}
                                                className="flex items-center justify-center w-16 h-16 bg-white/30 backdrop-blur-sm rounded-md relative z-10"
                                            >
                                                <FaChartLine className="text-white text-3xl" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-black text-white relative z-10">Progress Analytics</h3>
                                                <p className="text-white/90 text-sm md:text-base leading-relaxed relative z-10">Deep insights into your learning journey</p>
                                            </div>
                                        </motion.div>
                                    </ScrollReveal>
                                </div>

                                {/* Row 3: 200+ Problems + (Study Streaks + Real-time Feedback) */}
                                <ScrollReveal direction="up" delay={0.25} className="w-full md:w-[calc(50%-0.5rem)] min-h-[360px]">
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        className="group bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden p-8 h-full flex flex-col justify-between"
                                    >
                                        <div className="absolute top-0 right-0 text-white/10 text-[200px] font-black">200+</div>
                                        <motion.div
                                            whileHover={{ scale: 1.15, rotate: -12 }}
                                            className="flex items-center justify-center w-16 h-16 bg-white/30 backdrop-blur-sm rounded-md relative z-10"
                                        >
                                            <FaChartLine className="text-white text-3xl" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-black text-white relative z-10">200+ Problems</h3>
                                            <p className="text-white/90 text-sm md:text-base leading-relaxed relative z-10">Curated library across many topics</p>
                                        </div>
                                    </motion.div>
                                </ScrollReveal>

                                {/* Study Streaks + Real-time Feedback column */}
                                <div className="w-full md:w-[calc(50%-0.5rem)] flex flex-col gap-4 min-h-[360px]">
                                    <ScrollReveal direction="up" delay={0.4} className="flex-1">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="group bg-white rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-400 relative overflow-hidden p-8 h-full flex flex-col justify-between"
                                        >
                                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-tl-full"></div>
                                            <motion.div
                                                whileHover={{ scale: 1.2, rotate: -15 }}
                                                className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-md relative z-10 shadow-md"
                                            >
                                                <FaFire className="text-white text-3xl" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-black text-[var(--secondary-color)] group-hover:text-orange-600 transition-colors relative z-10">Study Streaks</h3>
                                                <p className="text-sm md:text-base text-gray-600 leading-relaxed relative z-10">Build consistency with daily challenges</p>
                                            </div>
                                        </motion.div>
                                    </ScrollReveal>

                                    <ScrollReveal direction="right" delay={0.45} className="flex-1">
                                        <motion.div
                                            whileHover={{ y: -8 }}
                                            className="group bg-white rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-400 relative overflow-hidden p-8 h-full flex flex-col justify-between"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                                            <motion.div
                                                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                                transition={{ duration: 0.5 }}
                                                className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md relative z-10 shadow-md"
                                            >
                                                <FaClock className="text-white text-3xl" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-black text-[var(--secondary-color)] group-hover:text-blue-600 transition-colors relative z-10">Real-time Feedback</h3>
                                                <p className="text-sm md:text-base text-gray-600 leading-relaxed relative z-10">Instant validation as you solve</p>
                                            </div>
                                        </motion.div>
                                    </ScrollReveal>
                                </div>
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
                                        <div className="flex justify-center items-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-center bg-white/20 backdrop-blur-sm rounded-full">
                                            <span className="text-sm font-bold text-white">Join 300+ Students</span>
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white py-6">
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
                                                to="/learn"
                                                className="group flex items-center gap-2 rounded-full !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-center !text-white font-semibold transition-all ease-in hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] shadow-lg shadow-[var(--raisin-black)]/30 active:translate-y-1 w-fit"
                                            >
                                                Get Started Free
                                                <motion.span
                                                    animate={{ x: [0, 4, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                >
                                                    <FaArrowRight className="text-xs sm:text-sm" />
                                                </motion.span>
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
