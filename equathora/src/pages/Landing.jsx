import React, { useState, useEffect } from 'react';
import Logo from '../assets/images/logo.png';
import Studying from '../assets/images/studying.svg';
import { Link } from 'react-router-dom';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import Footer from '../components/Footer.jsx';
import { FaRocket, FaChartLine, FaUsers, FaBookOpen, FaCheckCircle, FaTrophy, FaLightbulb, FaFire, FaArrowRight } from 'react-icons/fa';

const Landing = () => {
    return (
        <>
            <FeedbackBanner />
            <div className="min-h-screen bg-white text-[var(--secondary-color)]">
                {/* Navigation */}
                <nav className="border-b border-gray-200 bg-white/70 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                        <Link to="/" className="flex items-center gap-3">
                            <img src={Logo} alt="Equathora" className="h-12 w-12" loading="lazy" />
                            <span className="font-[DynaPuff] text-2xl font-semibold">equathora</span>
                        </Link>
                        <div className="flex items-center gap-4 text-sm font-semibold">
                            <Link to="/about" className="hidden sm:inline-block hover:text-[var(--accent-color)]">About</Link>
                            <Link to="/helpCenter" className="hidden sm:inline-block hover:text-[var(--accent-color)]">Help</Link>
                            <Link
                                to="/dashboard"
                                className="rounded-md border-2 border-[var(--accent-color)] px-5 py-2 text-[var(--accent-color)] transition-all hover:bg-[var(--accent-color)] hover:text-white"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <section className="w-full bg-gray-50 border-b border-gray-100">
                    <div className="max-w-6xl px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-16" style={{ margin: '0 auto' }}>
                        <div className="flex flex-col gap-8 flex-1 text-center md:text-left">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-color)]">Built for students</p>
                            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                                Turn logic into your
                                <span className="block text-[var(--accent-color)]">superpower.</span>
                            </h1>
                            <p className="text-base text-gray-600 sm:text-lg">
                                Equathora helps you master math through focused practice, gentle guidance, and a calm learning experience inspired by platforms like Exercism.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
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
                            </div>
                            <div className="flex justify-between gap-8 pt-4">
                                {[
                                    { label: 'Problems', value: '50+' },
                                    { label: 'Achievements', value: '30+' },
                                    { label: 'Topics', value: '20+' },
                                ].map((item) => (
                                    <div key={item.label} className="flex flex-col text-center md:text-left">
                                        <p className="text-2xl font-bold text-[var(--accent-color)]">{item.value}</p>
                                        <p className="text-sm text-gray-500">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center items-center flex-1">
                            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                <img src={Studying} alt="Student learning" className="w-full max-w-md" loading="lazy" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="w-full bg-white border-b border-gray-100">
                    <div className="max-w-6xl px-8 py-20" style={{ margin: '0 auto' }}>
                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col gap-4 text-center">
                                <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to excel</h2>
                                <p className="text-gray-600 text-lg">Powerful features designed to accelerate your math learning journey</p>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-6">
                                {[
                                    {
                                        icon: '🎯',
                                        title: 'Guided practice',
                                        text: 'Solve curated problem sets with structured hints and clear explanations. Every problem is carefully designed to build your understanding step by step.',
                                    },
                                    {
                                        icon: '📈',
                                        title: 'Progress tracking',
                                        text: 'Track streaks, achievements, and improvement without noisy distractions. Visualize your growth with detailed statistics and performance insights.',
                                    },
                                    {
                                        icon: '🤝',
                                        title: 'Community learning',
                                        text: 'Learn alongside friends, compare leaderboards, and stay motivated. Join a supportive community of learners working towards similar goals.',
                                    },
                                ].map((card) => (
                                    <article key={card.title} className="flex-1 flex flex-col rounded-2xl border border-gray-200 bg-gray-50 p-8 gap-4">
                                        <span className="text-4xl">{card.icon}</span>
                                        <h3 className="text-xl font-semibold">{card.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">{card.text}</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Equathora */}
                <section className="w-full bg-gray-50 border-b border-gray-100">
                    <div className="max-w-6xl px-8 py-20" style={{ margin: '0 auto' }}>
                        <div className="flex flex-col gap-16">
                            <div className="flex flex-col gap-4 text-center">
                                <h2 className="text-3xl font-bold sm:text-4xl">Why choose Equathora?</h2>
                                <p className="text-gray-600 text-lg">Built differently for better results</p>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-12">
                                <div className="flex-1 flex flex-col gap-6">
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-2xl font-bold text-[var(--accent-color)]">Structured Learning Path</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Unlike scattered practice problems, Equathora offers organized tracks that guide you from fundamentals to advanced concepts. Each problem builds on previous knowledge, ensuring solid understanding.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-2xl font-bold text-[var(--accent-color)]">Instant Feedback</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Get immediate validation of your solutions with detailed explanations. Learn from mistakes in real-time and understand the reasoning behind every answer.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-6">
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-2xl font-bold text-[var(--accent-color)]">Gamified Experience</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Earn achievements, maintain streaks, and climb leaderboards. Turn the challenge of learning math into an engaging and rewarding experience that keeps you motivated.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-2xl font-bold text-[var(--accent-color)]">Clean & Focused</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            No ads, no clutter, no distractions. Just you and the problems. A minimalist interface that lets you focus entirely on learning and improving your skills.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="w-full bg-white border-b border-gray-100">
                    <div className="max-w-6xl px-8 py-20" style={{ margin: '0 auto' }}>
                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col gap-4 text-center">
                                <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
                                <p className="text-gray-600 text-lg">Simple steps to start your learning journey</p>
                            </div>
                            <div className="flex flex-col gap-8">
                                {[
                                    {
                                        step: '01',
                                        title: 'Choose your track',
                                        description: 'Browse through various math topics and select a track that matches your current level and learning goals. From basic algebra to advanced calculus.',
                                    },
                                    {
                                        step: '02',
                                        title: 'Solve problems',
                                        description: 'Work through carefully crafted problems at your own pace. Use hints when stuck, and receive detailed explanations for every solution.',
                                    },
                                    {
                                        step: '03',
                                        title: 'Track progress',
                                        description: 'Monitor your improvement with statistics, achievements, and leaderboards. Celebrate milestones and maintain your learning streak.',
                                    },
                                    {
                                        step: '04',
                                        title: 'Master concepts',
                                        description: 'Build solid understanding through repetition and progressive difficulty. Watch your confidence grow as math becomes your superpower.',
                                    },
                                ].map((item) => (
                                    <div key={item.step} className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="flex-shrink-0">
                                            <span className="text-5xl font-bold text-[var(--accent-color)] opacity-30">{item.step}</span>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-2">
                                            <h3 className="text-2xl font-bold">{item.title}</h3>
                                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="w-full bg-[var(--accent-color)]">
                    <div className="max-w-6xl px-8 py-20" style={{ margin: '0 auto' }}>
                        <div className="flex flex-col items-center gap-8 text-center">
                            <h2 className="text-3xl font-bold sm:text-4xl text-white">Ready to build confidence?</h2>
                            <p className="max-w-2xl text-white text-lg opacity-90">
                                Pick a track, solve at your own pace, and watch your math intuition grow. No ads. No fluff. Just thoughtful practice.
                            </p>
                            <Link
                                to="/dashboard"
                                className="rounded-md bg-white px-10 py-4 text-lg font-semibold text-[var(--accent-color)] transition-colors hover:bg-gray-100"
                            >
                                Start for free
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full border-t border-gray-200 bg-white">
                    <div className="max-w-6xl px-8 py-8" style={{ margin: '0 auto' }}>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <img src={Logo} alt="Equathora" className="h-8 w-8" loading="lazy" />
                                <span className="font-[DynaPuff] text-lg text-[var(--secondary-color)]">equathora</span>
                            </div>
                            <div className="flex gap-6">
                                <Link to="/about" className="hover:text-[var(--accent-color)]">About</Link>
                                <Link to="/helpCenter" className="hover:text-[var(--accent-color)]">Help</Link>
                                <Link to="/feedback" className="hover:text-[var(--accent-color)]">Feedback</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Landing;