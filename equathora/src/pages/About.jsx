import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import { FaGithub, FaCode, FaLightbulb, FaUsers, FaRocket, FaChartLine } from 'react-icons/fa';

const About = () => {
    return (
        <>
            <FeedbackBanner />
            <div className="w-full bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] min-h-screen">
                <Navbar />
                <main className="w-full">
                    {/* Hero - Full Width Clean */}
                    <section className="w-full px-[4vw] xl:px-[12vw] py-20">
                        <div className="w-full flex flex-col items-center text-center">
                            <h1 className="text-5xl md:text-6xl font-bold font-[DynaPuff] pb-4">
                                <span className="bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">About Equathora</span>
                            </h1>
                            <p className="text-lg text-gray-600 font-[Inter] max-w-2xl leading-relaxed">
                                Where equations meet time,a platform built for mathematical mastery in 2025
                            </p>
                        </div>
                    </section>

                    {/* Stats - Horizontal Bar */}
                    <section className="w-full bg-gradient-to-r from-[var(--secondary-color)] via-[var(--secondary-color)] to-[var(--accent-color)]/20 py-12">
                        <div className="w-full px-[4vw] xl:px-[12vw] flex flex-wrap justify-around items-center gap-8">
                            <div className="flex flex-col items-center">
                                <div className="text-4xl font-bold text-white">30+</div>
                                <div className="text-sm text-white/70">Curated Problems</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-4xl font-bold text-white">20+</div>
                                <div className="text-sm text-white/70">Topics Covered</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-4xl font-bold text-white">2025</div>
                                <div className="text-sm text-white/70">Year Launched</div>
                            </div>
                        </div>
                    </section>

                    {/* Story - Two Column Layout */}
                    <section className="w-full px-[4vw] xl:px-[12vw] py-20">
                        <div className="w-full flex flex-col lg:flex-row gap-16">
                            {/* Left Column */}
                            <div className="lg:w-1/2">
                                <div className="flex items-center gap-3 pb-6">
                                    <FaLightbulb className="text-3xl text-[var(--accent-color)]" />
                                    <h2 className="text-3xl font-bold text-[var(--secondary-color)] font-[Inter]">
                                        The Name
                                    </h2>
                                </div>
                                <div className="space-y-6 text-gray-700">
                                    <div className="border-l-2 border-gray-300 pl-6">
                                        <div className="text-xl font-bold text-[var(--accent-color)] pb-2">Equat-</div>
                                        <p className="text-base leading-relaxed">From "Equation"-the foundation of mathematical thinking and problem-solving</p>
                                    </div>
                                    <div className="border-l-2 border-gray-300 pl-6">
                                        <div className="text-xl font-bold text-[var(--accent-color)] pb-2">-hora</div>
                                        <p className="text-base leading-relaxed">Greek "ὥρα" meaning time and hour-representing your dedication to learning</p>
                                    </div>
                                    <div className="border-l-2 border-[var(--accent-color)] pl-6">
                                        <div className="text-2xl font-bold bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] bg-clip-text text-transparent pb-2">Equathora</div>
                                        <p className="text-base leading-relaxed font-medium">Time invested in mastering mathematical equations</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="lg:w-1/2">
                                <h2 className="text-3xl font-bold text-[var(--secondary-color)] font-[Inter] pb-6">
                                    Why <span className="text-[var(--accent-color)]">Red</span>?
                                </h2>
                                <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                                    <p>
                                        Every math teacher has a <span className="font-semibold text-[var(--accent-color)]">red pen</span>. Not to punish mistakes, but to illuminate the path forward. Red marks showed where learning happened.
                                    </p>
                                    <p>
                                        Textbooks marked important theorems in red. Corrections came in red. Red commanded attention and clarity. It became the color of mathematical discovery itself.
                                    </p>
                                    <p className="font-medium text-[var(--secondary-color)] border-l-2 border-[var(--accent-color)] pl-4">
                                        Red represents guidance, emphasis, and the bold moments of understanding.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Developer - Split Screen */}
                    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-20">
                        <div className="w-full px-[4vw] xl:px-[12vw]">
                            <h2 className="text-3xl font-bold text-[var(--secondary-color)] font-[Inter] pb-12">
                                Built by a Developer Who Understands Learning
                            </h2>
                            <div className="w-full flex flex-col lg:flex-row gap-12">
                                {/* Developer Info */}
                                <div className="lg:w-1/3">
                                    <div className="flex items-center gap-4 pb-6">
                                        <div className="w-16 h-16 bg-[var(--secondary-color)] rounded-full flex items-center justify-center text-3xl">
                                            👨‍💻
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-[var(--secondary-color)]">Zaim Halili</h3>
                                            <p className="text-gray-600">Full-Stack Developer</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed pb-6">
                                        Built Equathora to bridge the gap between traditional math education and modern learning needs.
                                    </p>
                                    <a
                                        href="https://github.com/zaimhalili"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--secondary-color)] text-white rounded font-semibold text-sm hover:bg-[var(--secondary-color)]/90 transition-all duration-200"
                                    >
                                        <FaGithub className="text-lg" />
                                        <span>View on GitHub</span>
                                    </a>
                                </div>

                                {/* Tech Stack Grid */}
                                <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-4">
                                        <FaCode className="text-3xl text-[var(--accent-color)] flex-shrink-0 pt-1" />
                                        <div>
                                            <h4 className="font-bold text-[var(--secondary-color)] text-lg pb-2">Frontend</h4>
                                            <p className="text-gray-600">React for dynamic UI, Tailwind CSS for modern styling</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <FaRocket className="text-3xl text-[var(--accent-color)] flex-shrink-0 pt-1" />
                                        <div>
                                            <h4 className="font-bold text-[var(--secondary-color)] text-lg pb-2">Backend</h4>
                                            <p className="text-gray-600">ASP.NET Core for robust server-side logic</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <FaLightbulb className="text-3xl text-[var(--accent-color)] flex-shrink-0 pt-1" />
                                        <div>
                                            <h4 className="font-bold text-[var(--secondary-color)] text-lg pb-2">Math Engine</h4>
                                            <p className="text-gray-600">MathLive for real-time LaTeX rendering</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <FaUsers className="text-3xl text-[var(--accent-color)] flex-shrink-0 pt-1" />
                                        <div>
                                            <h4 className="font-bold text-[var(--secondary-color)] text-lg pb-2">Community</h4>
                                            <p className="text-gray-600">Achievements, mentorship, leaderboards</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Mission - Full Width Text Block */}
                    <section className="w-full px-[4vw] xl:px-[12vw] py-20">
                        <div className="w-full flex flex-col items-center text-center">
                            <h2 className="text-3xl font-bold text-[var(--secondary-color)] font-[Inter] pb-6">
                                Our Mission
                            </h2>
                            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                                Transform how students approach mathematics,not as a subject to fear, but as a journey of discovery. We provide an interactive platform where learners build confidence through step-by-step guidance and achievement-based motivation.
                            </p>
                        </div>
                    </section>

                    {/* Features - Bento Grid Style */}
                    <section className="w-full bg-gradient-to-b from-white to-gray-50 px-[4vw] xl:px-[12vw] py-20">
                        <h2 className="text-3xl font-bold text-[var(--secondary-color)] font-[Inter] pb-12 text-center">
                            What Makes Us Different
                        </h2>
                        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { icon: '✏️', title: 'Math Editor', desc: 'Natural LaTeX input with real-time preview' },
                                { icon: '💡', title: 'Smart Hints', desc: 'Progressive guidance that adapts to your level' },
                                { icon: '🏆', title: 'Achievements', desc: 'Track progress with meaningful milestones' },
                                { icon: '👥', title: 'Mentorship', desc: 'Expert support when you need it most' },
                                { icon: '📚', title: '50+ Problems', desc: 'Curated library across 20+ topics' },
                                { icon: '🎯', title: 'Leaderboards', desc: 'Compete globally, grow together' }
                            ].map((feature, idx) => (
                                <div key={idx} className="p-8 bg-white border border-gray-200 hover:border-[var(--accent-color)] hover:shadow-[0_4px_16px_rgba(217,4,41,0.1)] transition-all duration-200">
                                    <div className="text-5xl pb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-[var(--secondary-color)] pb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA - Centered Simple */}
                    <section className="w-full px-[4vw] xl:px-[12vw] py-20">
                        <div className="w-full flex flex-col items-center text-center">
                            <h2 className="text-4xl font-bold text-[var(--secondary-color)] font-[Inter] pb-4">
                                Ready to Start Learning?
                            </h2>
                            <p className="text-lg text-gray-600 pb-8 max-w-2xl">
                                Join students mastering mathematics through interactive problem-solving
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/signup"
                                    className="px-8 py-4 bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] text-white rounded font-semibold hover:shadow-[0_4px_16px_rgba(217,4,41,0.3)] transition-all duration-200 no-underline text-center"
                                >
                                    Get Started Free
                                </Link>
                                <Link
                                    to="/learn"
                                    className="px-8 py-4 bg-white text-[var(--secondary-color)] border-2 border-[var(--accent-color)] rounded font-semibold hover:bg-gradient-to-r hover:from-[var(--accent-color)] hover:to-[var(--secondary-color)] hover:text-white hover:border-transparent transition-all duration-200 no-underline text-center"
                                >
                                    Explore Problems
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default About;
