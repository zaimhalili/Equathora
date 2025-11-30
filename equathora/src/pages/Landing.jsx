import React, { useState, useEffect } from 'react';
import Logo from '../assets/logo/TransparentFullLogo.png';
import Studying from '../assets/images/studying.svg';
import Journey from '../assets/images/journey.svg';
import Achievements from '../assets/images/achievements.svg';
import Progress from '../assets/images/Progress.svg';
import Teacher from '../assets/images/teacher.svg';
import Race from '../assets/images/race.svg';
import JourneyImg from '../assets/images/journey.jpg';
import Choice from '../assets/images/choice.svg';
import LearningBooks from '../assets/images/learningBooks.svg';
import { Link } from 'react-router-dom';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import Footer from '../components/Footer.jsx';
import { motion } from 'framer-motion';
import GradientText from '../components/ui/GradientText.jsx';
import { FaRocket, FaChartLine, FaUsers, FaBookOpen, FaCheckCircle, FaTrophy, FaLightbulb, FaFire, FaArrowRight } from 'react-icons/fa';

const Landing = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const testimonials = [
        {
            quote: "Equathora transformed how I approach math problems. The structured paths and instant feedback helped me improve my calculus grade from C to A.",
            author: "Sarah Chen",
            role: "Engineering Student"
        },
        {
            quote: "The achievement system keeps me motivated every day. I've solved over 100 problems in just two months and finally feel confident with algebra.",
            author: "Marcus Johnson",
            role: "High School Senior"
        },
        {
            quote: "As a teacher, I recommend Equathora to all my students. The explanations are clear, and the progression is perfectly paced.",
            author: "Dr. Emily Rodriguez",
            role: "Math Professor"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <FeedbackBanner />
            <div className="min-h-screen bg-white text-[var(--secondary-color)]">
                {/* Navigation */}
                <nav className="w-full border-b border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm">
                    <div className="w-full flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
                        <Link to="/" className="flex items-center gap-3 w-40">
                            <img src={Logo} alt="" />
                        </Link>
                        <div className="flex items-center gap-3 md:gap-4 text-sm font-semibold">
                            <Link to="/about" className="hidden sm:inline-block hover:text-[var(--accent-color)] transition-colors">About</Link>
                            <Link to="/helpCenter" className="hidden sm:inline-block hover:text-[var(--accent-color)] transition-colors">Help</Link>
                            <Link
                                to="/dashboard"
                                className="rounded-md border-2 border-[var(--accent-color)] px-4 md:px-5 py-2 text-[var(--accent-color)] transition-all hover:bg-[var(--accent-color)] hover:text-white shadow-sm hover:shadow-md"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <section className="w-full bg-gray-50 border-b border-gray-100">
                    <div className="max-w-6xl px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-16" style={{ margin: '0 auto' }}>
                        <motion.div
                            className="flex flex-col gap-8 flex-1 text-center md:text-left"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.p
                                className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-color)]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Built for students
                            </motion.p>
                            <motion.h1
                                className="text-4xl font-extrabold leading-tight sm:text-5xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Turn logic into your
                                <span className="block text-[var(--accent-color)]">superpower.</span>
                            </motion.h1>
                            <motion.p
                                className="text-base text-gray-600 sm:text-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Equathora helps you master math through focused practice, gentle guidance, and a calm learning experience inspired by platforms like Exercism.
                            </motion.p>
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link
                                    to="/dashboard"
                                    className="rounded-md bg-[var(--accent-color)] px-8 py-3 text-center text-white transition-colors hover:bg-[var(--dark-accent-color)]"
                                >
                                    Start solving
                                </Link>
                                <Link
                                    to="/about"
                                    className="rounded-md border border-gray-300 px-8 py-3 text-center text-gray-700 transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                                >
                                    How it works
                                </Link>
                            </motion.div>
                            <motion.div
                                className="flex justify-between gap-8 pt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                {[
                                    { label: 'Problems', value: '50+' },
                                    { label: 'Achievements', value: '30+' },
                                    { label: 'Topics', value: '20+' },
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        className="flex flex-col text-center md:text-left"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <p className="text-2xl font-bold text-[var(--accent-color)]">{item.value}</p>
                                        <p className="text-sm text-gray-500">{item.label}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="flex justify-center items-center flex-1"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <motion.div
                                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <img src={Studying} alt="Student learning" className="w-full max-w-md" loading="lazy" />
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Features */}
                <section className="w-full bg-white border-b border-gray-100 relative overflow-hidden">
                    {/* Floating Background Images */}
                    <div className="absolute inset-0 pointer-events-none opacity-5">
                        <img src={Journey} alt="" className="absolute top-10 left-10 w-32 h-32 animate-float" style={{ animationDelay: '0s' }} />
                        <img src={Achievements} alt="" className="absolute top-1/4 right-20 w-40 h-40 animate-float" style={{ animationDelay: '1s' }} />
                        <img src={Progress} alt="" className="absolute bottom-20 left-1/4 w-36 h-36 animate-float" style={{ animationDelay: '2s' }} />
                    </div>

                    <div className="max-w-6xl px-8 py-24 relative z-10" style={{ margin: '0 auto' }}>
                        <div className="flex flex-col gap-16">
                            <motion.div
                                className="flex flex-col gap-4 text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <GradientText
                                    className="text-3xl font-bold sm:text-5xl"
                                    colors={['#d90429', '#2b2d42', '#d90429']}
                                    animationSpeed={6}
                                >
                                    Everything you need to excel
                                </GradientText>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">Powerful features designed to accelerate your math learning journey</p>
                            </motion.div>

                            {/* Main Feature Showcase */}
                            <div className="flex flex-col lg:flex-row gap-12 items-center">
                                <motion.div
                                    className="flex-1 flex flex-col gap-8"
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7 }}
                                >
                                    {[
                                        {
                                            icon: FaBookOpen,
                                            title: 'Guided practice',
                                            text: 'Solve curated problem sets with structured hints and clear explanations. Every problem is carefully designed to build your understanding step by step.',
                                        },
                                        {
                                            icon: FaChartLine,
                                            title: 'Progress tracking',
                                            text: 'Track streaks, achievements, and improvement without noisy distractions. Visualize your growth with detailed statistics and performance insights.',
                                        },
                                        {
                                            icon: FaUsers,
                                            title: 'Community learning',
                                            text: 'Learn alongside friends, compare leaderboards, and stay motivated. Join a supportive community of learners working towards similar goals.',
                                        },
                                    ].map((card, index) => (
                                        <motion.article
                                            key={card.title}
                                            className="flex flex-row gap-5 p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:shadow-lg transition-all hover:border-[var(--accent-color)] hover:bg-white"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1, duration: 0.5 }}
                                            whileHover={{ scale: 1.02, x: 10 }}
                                        >
                                            <motion.div
                                                className="flex items-center justify-center w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] text-white text-2xl"
                                                whileHover={{ rotate: 360, scale: 1.1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <card.icon />
                                            </motion.div>
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-xl font-semibold">{card.title}</h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">{card.text}</p>
                                            </div>
                                        </motion.article>
                                    ))}
                                </motion.div>

                                {/* Visual Element */}
                                <motion.div
                                    className="flex-1 flex justify-center items-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <motion.div
                                        className="relative"
                                        whileHover={{ scale: 1.05, rotate: 3 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] opacity-10 blur-3xl rounded-full"></div>
                                        <img src={Teacher} alt="Learning illustration" className="relative w-full max-w-md drop-shadow-2xl" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Additional Features Grid */}
                            <motion.div
                                className="flex flex-col md:flex-row gap-6"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                {[
                                    {
                                        icon: FaLightbulb,
                                        title: 'Hints & Solutions',
                                        text: 'Get unstuck with progressive hints and detailed step-by-step solutions.',
                                        bg: 'from-yellow-400 to-orange-500'
                                    },
                                    {
                                        icon: FaTrophy,
                                        title: 'Achievements',
                                        text: 'Unlock badges and milestones as you progress through your learning journey.',
                                        bg: 'from-purple-400 to-pink-500'
                                    },
                                    {
                                        icon: FaFire,
                                        title: 'Daily Streaks',
                                        text: 'Build consistent learning habits and maintain your momentum.',
                                        bg: 'from-red-400 to-orange-500'
                                    },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={feature.title}
                                        className="flex-1 flex flex-col gap-3 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-md transition-all"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.15 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                    >
                                        <motion.div
                                            className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.bg} text-white text-xl`}
                                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <feature.icon />
                                        </motion.div>
                                        <h4 className="text-lg font-bold text-[var(--secondary-color)]">{feature.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{feature.text}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Equathora */}
                <section className="w-full bg-gray-50 border-b border-gray-100 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--accent-color)] to-transparent opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[var(--secondary-color)] to-transparent opacity-5 rounded-full blur-3xl"></div>

                    <div className="max-w-6xl px-8 py-24 relative z-10" style={{ margin: '0 auto' }}>
                        <div className="flex flex-col gap-16">
                            <motion.div
                                className="flex flex-col gap-4 text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <GradientText
                                    className="text-3xl font-bold sm:text-4xl"
                                    colors={['#d90429', '#2b2d42', '#d90429']}
                                    animationSpeed={6}
                                >
                                    Why choose Equathora?
                                </GradientText>
                                <p className="text-gray-600 text-lg">Built differently for better results</p>
                            </motion.div>

                            <div className="flex flex-col lg:flex-row items-center gap-12">
                                {/* Image section */}
                                <motion.div
                                    className="flex-1 flex justify-center"
                                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <motion.div
                                        className="relative"
                                        whileHover={{ scale: 1.05, rotate: 2 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] opacity-10 blur-2xl rounded-3xl"></div>
                                        <img src={JourneyImg} alt="Learning journey" className="relative w-full max-w-lg drop-shadow-xl rounded-2xl shadow-2xl object-cover" />
                                    </motion.div>
                                </motion.div>

                                {/* Features grid */}
                                <motion.div
                                    className="flex-1 flex flex-col gap-6"
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7 }}
                                >
                                    {[
                                        {
                                            icon: FaRocket,
                                            title: 'Structured Learning Path',
                                            text: 'Unlike scattered practice problems, Equathora offers organized tracks that guide you from fundamentals to advanced concepts.',
                                        },
                                        {
                                            icon: FaCheckCircle,
                                            title: 'Instant Feedback',
                                            text: 'Get immediate validation of your solutions with detailed explanations. Learn from mistakes in real-time.',
                                        },
                                        {
                                            icon: FaTrophy,
                                            title: 'Gamified Experience',
                                            text: 'Earn achievements, maintain streaks, and climb leaderboards. Turn learning into an engaging experience.',
                                        },
                                        {
                                            icon: FaLightbulb,
                                            title: 'Clean & Focused',
                                            text: 'No ads, no clutter, no distractions. A minimalist interface that lets you focus entirely on learning.',
                                        },
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item.title}
                                            className="flex flex-row gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-[var(--accent-color)] hover:shadow-lg transition-all"
                                            initial={{ opacity: 0, x: 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ x: 5, scale: 1.02 }}
                                        >
                                            <motion.div
                                                className="flex items-center justify-center w-12 h-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] text-white text-xl"
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <item.icon />
                                            </motion.div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-lg font-bold text-[var(--secondary-color)]">{item.title}</h3>
                                                <p className="text-gray-600 leading-relaxed text-sm">{item.text}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="w-full bg-white border-b border-gray-100 relative overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.div
                            className="absolute top-20 right-10 w-32 h-32 opacity-5"
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 10, 0]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <img src={Journey} alt="" className="w-full h-full" />
                        </motion.div>
                        <motion.div
                            className="absolute bottom-20 left-10 w-40 h-40 opacity-5"
                            animate={{
                                y: [0, 20, 0],
                                rotate: [0, -10, 0]
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <img src={Achievements} alt="" className="w-full h-full" />
                        </motion.div>
                    </div>

                    <div className="max-w-6xl px-8 py-24 relative z-10" style={{ margin: '0 auto' }}>
                        <div className="flex flex-col gap-16">
                            <motion.div
                                className="flex flex-col gap-4 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <GradientText
                                    className="text-3xl font-bold sm:text-5xl"
                                    colors={['#d90429', '#2b2d42', '#d90429']}
                                    animationSpeed={6}
                                >
                                    How it works
                                </GradientText>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">Simple steps to start your learning journey</p>
                            </motion.div>

                            <div className="flex flex-col gap-12">
                                {[
                                    {
                                        step: '01',
                                        title: 'Choose your track',
                                        description: 'Browse through various math topics and select a track that matches your current level and learning goals. From basic algebra to advanced calculus.',
                                        image: Choice,
                                        direction: 'left'
                                    },
                                    {
                                        step: '02',
                                        title: 'Solve problems',
                                        description: 'Work through carefully crafted problems at your own pace. Use hints when stuck, and receive detailed explanations for every solution.',
                                        image: LearningBooks,
                                        direction: 'right'
                                    },
                                    {
                                        step: '03',
                                        title: 'Track progress',
                                        description: 'Monitor your improvement with statistics, achievements, and leaderboards. Celebrate milestones and maintain your learning streak.',
                                        image: Progress,
                                        direction: 'left'
                                    },
                                    {
                                        step: '04',
                                        title: 'Master concepts',
                                        description: 'Build solid understanding through repetition and progressive difficulty. Watch your confidence grow as math becomes your superpower.',
                                        image: Race,
                                        direction: 'right'
                                    },
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.step}
                                        className={`flex flex-col ${item.direction === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center`}
                                        initial={{ opacity: 0, x: item.direction === 'left' ? -50 : 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.7, delay: index * 0.1 }}
                                    >
                                        {/* Image Side */}
                                        <motion.div
                                            className="flex-1 flex justify-center"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] opacity-10 blur-2xl rounded-full"></div>
                                                <div className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow">
                                                    <img src={item.image} alt={item.title} className="w-80 h-80 object-contain" />
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Content Side */}
                                        <div className="flex-1 flex flex-col gap-6">
                                            <div className="flex items-center gap-4">
                                                <motion.div
                                                    className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] shadow-lg"
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{ duration: 0.8 }}
                                                >
                                                    <span className="text-2xl font-bold text-white">{item.step}</span>
                                                </motion.div>
                                                <h3 className="text-3xl font-bold text-[var(--secondary-color)]">{item.title}</h3>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>

                                            {/* Feature highlights */}
                                            <motion.div
                                                className="flex flex-wrap gap-2"
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                {[
                                                    item.step === '01' && ['Multiple Topics', 'Skill Levels', 'Curated Content'],
                                                    item.step === '02' && ['Step-by-Step', 'Hints Available', 'Detailed Solutions'],
                                                    item.step === '03' && ['Statistics', 'Achievements', 'Leaderboards'],
                                                    item.step === '04' && ['Practice', 'Build Confidence', 'Grow Skills']
                                                ].filter(Boolean)[0].map((tag) => (
                                                    <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Carousel */}
                <section className="w-full bg-gray-50 border-b border-gray-100 overflow-hidden">
                    <div className="max-w-6xl px-8 py-20" style={{ margin: '0 auto' }}>
                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col gap-4 text-center">
                                <h2 className="text-3xl font-bold sm:text-4xl" style={{
                                    background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--dark-accent-color) 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    Loved by learners worldwide
                                </h2>
                                <p className="text-gray-600 text-lg">See what our community has to say</p>
                            </div>

                            <div className="relative flex items-center justify-center min-h-[280px]">
                                {testimonials.map((testimonial, index) => (
                                    <div
                                        key={index}
                                        className="absolute w-full transition-all duration-700 ease-in-out"
                                        style={{
                                            opacity: currentTestimonial === index ? 1 : 0,
                                            transform: currentTestimonial === index ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.9)',
                                            pointerEvents: currentTestimonial === index ? 'auto' : 'none'
                                        }}
                                    >
                                        <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow max-w-3xl" style={{ margin: '0 auto' }}>
                                            <p className="text-xl text-center text-gray-700 leading-relaxed italic">"{testimonial.quote}"</p>
                                            <div className="flex flex-col items-center gap-1">
                                                <p className="font-bold text-[var(--secondary-color)]">{testimonial.author}</p>
                                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center gap-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentTestimonial(index)}
                                        className="w-3 h-3 rounded-full transition-all"
                                        style={{
                                            backgroundColor: currentTestimonial === index ? 'var(--accent-color)' : '#d1d5db'
                                        }}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="w-full relative overflow-hidden" style={{
                    background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--dark-accent-color) 100%)',
                }}>
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}></div>
                    <div className="max-w-6xl px-8 py-20 relative" style={{ margin: '0 auto' }}>
                        <motion.div
                            className="flex flex-col items-center gap-8 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.h2
                                className="text-3xl font-bold sm:text-5xl text-white"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                Ready to build confidence?
                            </motion.h2>
                            <motion.p
                                className="max-w-2xl text-white text-lg opacity-95 leading-relaxed"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 0.95 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                Pick a track, solve at your own pace, and watch your math intuition grow. No ads. No fluff. Just thoughtful practice.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-3 rounded-xl bg-white px-10 py-4 text-lg font-semibold text-[var(--accent-color)] transition-all hover:bg-gray-100 hover:gap-4 shadow-xl hover:shadow-2xl"
                                >
                                    Start for free
                                    <FaArrowRight />
                                </Link>
                            </motion.div>
                            <motion.p
                                className="text-white text-sm opacity-75"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 0.75 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                            >
                                No credit card required • Free forever
                            </motion.p>
                        </motion.div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
};

export default Landing;