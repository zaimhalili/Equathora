import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { FaUsers, FaCheckCircle, FaBolt } from 'react-icons/fa';
import { FaStar, FaCrown, FaRocket, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import EquathoraBriefsModal from '@/components/EquathoraBriefs/EquathoraBriefsModal.jsx';
import { subscribeToEquathoraBriefs } from '@/lib/equathoraBriefsService.js';
import { useAuth } from '@/hooks/useAuth.js';
import EquathoraBriefsHero from "@/components/EquathoraBriefs/EquathoraBriefsHero.jsx";

const EquathoraBriefsPage = () => {
    const [isBriefsModalOpen, setIsBriefsModalOpen] = useState(false);
    const { user } = useAuth() || {};

    const handleEquathoraBriefsSave = async (formData) => {
        try {
            await subscribeToEquathoraBriefs(formData);
        } catch (err) {
            console.error('Subscribe error:', err);
            throw err;
        }
    };

    return (
        <>
            <main className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] min-h-screen font-[Sansation]">
                <EquathoraBriefsHero setIsBriefsModalOpen={setIsBriefsModalOpen} />

                {/* Benefits Section */}
                <section className="flex flex-col items-center justify-center w-full py-20 px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center w-full max-w-7xl gap-16"
                    >
                        <div className="flex flex-col items-center justify-center text-center">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--secondary-color)] pb-4">
                                Why Join The Briefs?
                            </h2>
                            <p className="text-base md:text-xl font-light text-[var(--secondary-color)]/80 max-w-2xl">
                                Unlock exclusive benefits and be the first to know what's happening.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                            {[
                                {
                                    icon: FaCrown,
                                    title: 'Founding Member Status',
                                    description: 'Get a special founder badge and lifetime recognition in our community.'
                                },
                                {
                                    icon: FaBolt,
                                    title: 'Early Access',
                                    description: 'Be first to try new features, content, and learning paths before public release.'
                                },
                                {
                                    icon: FaStar,
                                    title: 'Early Feature Drops',
                                    description: 'Get first access to new lessons, challenges, and tools before they roll out to everyone.'
                                },
                                {
                                    icon: FaRocket,
                                    title: 'Shape the Product',
                                    description: 'Your feedback directly influences our roadmap and feature development.'
                                },
                                {
                                    icon: FaShieldAlt,
                                    title: 'Priority Support',
                                    description: 'Skip the queue with dedicated support access and faster response times.'
                                },
                                {
                                    icon: FaUsers,
                                    title: 'Exclusive Community',
                                    description: 'Join a private community of early adopters and power users.'
                                }
                            ].map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="group relative flex flex-col items-start justify-start bg-[var(--white)] rounded-xl p-8 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden border border-[var(--mid-main-secondary)]/20"
                                >
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--main-color)] rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                                    <div className="relative flex items-center justify-center w-14 h-14 bg-[var(--main-color)] rounded-lg text-[var(--accent-color)] group-hover:bg-[var(--accent-color)] group-hover:text-[var(--white)] transition-colors duration-300">
                                        <benefit.icon className="text-2xl" />
                                    </div>
                                    <h3 className="relative text-xl font-bold text-[var(--secondary-color)] pt-6 pb-3">{benefit.title}</h3>
                                    <p className="relative text-[var(--secondary-color)]/70 leading-relaxed text-sm md:text-base">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Interactive Stats Section */}
                <section className="flex flex-col items-center justify-center w-full py-16 px-4 sm:px-6 lg:px-8 bg-[var(--white)] relative overflow-hidden border-y border-[var(--mid-main-secondary)]/20">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--main-color)1px,transparent_1px),linear-gradient(180deg,var(--main-color)1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                            {[
                                { value: "50+", label: "Active Subscribers", delay: 0.1 },
                                { value: "2026", label: "Launch Date", delay: 0.2 },
                                { value: "100%", label: "Free to Join", delay: 0.3 }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: stat.delay, type: 'spring' }}
                                    className="flex flex-col items-center justify-center p-8 bg-[var(--secondary-color)] rounded-2xl shadow-xl text-[var(--white)] transform hover:-translate-y-2 transition-transform duration-300"
                                >
                                    <span className="text-5xl md:text-6xl font-black text-[var(--accent-color)]">{stat.value}</span>
                                    <span className="text-lg md:text-xl font-semibold mt-2">{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* FAQ Section (Accessible Accordion) */}
                <section className="flex flex-col items-center justify-center w-full py-20 px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center justify-center w-full max-w-4xl gap-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--secondary-color)] text-center">
                            Common Questions
                        </h2>

                        <div className="flex flex-col w-full gap-4">
                            {[
                                {
                                    q: 'When will the platform launch?',
                                    a: 'We\'re targeting 2026 for the full launch with user accounts and cloud sync. Beta access is available now.'
                                },
                                {
                                    q: 'Is there any cost to join?',
                                    a: 'Absolutely not! Subscribing is 100% free with no credit card required and no strings attached.'
                                },
                                {
                                    q: 'What do I get as an early member?',
                                    a: 'Founding member badge, early feature access, priority support, and the ability to shape our product.'
                                },
                                {
                                    q: 'Can I start using Equathora now?',
                                    a: 'Yes! Our beta version is live. You can start solving problems right now at /dashboard while waiting for the full launch.'
                                },
                                {
                                    q: 'How will you use my email?',
                                    a: 'Only to send curated updates and major product news. We never spam or share your data. Unsubscribe anytime.'
                                }
                            ].map((faq, index) => (
                                <details key={index} className="group bg-[var(--white)] rounded-xl border border-[var(--mid-main-secondary)]/20 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                                    <summary className="flex cursor-pointer items-center justify-between p-6 text-[var(--secondary-color)] font-bold text-lg md:text-xl list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] rounded-xl">
                                        <span>{faq.q}</span>
                                        <span className="transition-transform duration-300 group-open:rotate-180 text-[var(--accent-color)]">
                                            <FaBolt />
                                        </span>
                                    </summary>
                                    <div className="px-6 pb-6 text-[var(--secondary-color)]/80 text-base md:text-lg leading-relaxed animate-fade-in">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Final Interactive CTA */}
                <section className="relative flex flex-col items-center justify-center w-full py-24 px-4 sm:px-6 lg:px-8 overflow-hidden theme-lock bg-[var(--secondary-color)] mt-auto">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-color)]/20 rounded-full blur-[120px] pointer-events-none"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative z-10 flex flex-col items-center justify-center w-full max-w-3xl text-center text-[var(--white)] gap-8 bg-[var(--white)]/5 p-10 md:p-14 rounded-3xl backdrop-blur-md border border-[var(--white)]/10 shadow-2xl"
                    >
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                            Ready to make an impact?
                        </h2>
                        <p className="text-base md:text-xl font-light max-w-2xl text-[var(--white)]/90">
                            Join our community of math enthusiasts receiving updates straight to their inbox. Be part of the journey.
                        </p>

                        <button
                            onClick={() => setIsBriefsModalOpen(true)}
                            aria-label="Subscribe to Equathora Briefs"
                            className="mt-4 flex items-center justify-center gap-3 px-10 py-4 bg-[var(--accent-color)] text-[var(--white)] text-lg md:text-xl font-bold rounded-lg hover:bg-[var(--dark-accent-color)] transition-all shadow-[0_0_20px_rgba(215,4,39,0.4)] hover:shadow-[0_0_30px_rgba(215,4,39,0.6)] hover:-translate-y-1 w-full sm:w-auto"
                        >
                            <FaRocket />
                            <span>Subscribe to Briefs Now</span>
                        </button>

                        <div className="flex flex-wrap items-center justify-center gap-4 pt-6 text-sm text-[var(--white)]/60 font-medium">
                            <span className="flex items-center gap-1.5"><FaCheckCircle className="text-[var(--accent-color)]" /> No spam</span>
                            <span className="flex items-center gap-1.5"><FaCheckCircle className="text-[var(--accent-color)]" /> Unsubscribe anytime</span>
                            <span className="flex items-center gap-1.5"><FaCheckCircle className="text-[var(--accent-color)]" /> 30-sec signup</span>
                        </div>
                    </motion.div>
                </section>

                <Footer />
            </main>

            <EquathoraBriefsModal
                isOpen={isBriefsModalOpen}
                onClose={() => setIsBriefsModalOpen(false)}
                onSave={handleEquathoraBriefsSave}
                userData={user ? { name: user.user_metadata?.full_name || '', email: user.email } : null}
            />
        </>
    );
};

export default EquathoraBriefsPage;
