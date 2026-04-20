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
            <main className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] min-h-screen">

                {/*Hero Section*/}
                <EquathoraBriefsHero  setIsBriefsModalOpen={setIsBriefsModalOpen}/>

                {/* Benefits Grid */}
                <section className="flex flex-col items-center justify-center w-full py-20 px-4 sm:px-6 lg:px-8 bg-[var(--white)]">
                    <div className="flex flex-col items-center justify-center w-full max-w-7xl gap-16">
                        <div className="flex flex-col items-center justify-center text-center">
                            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-4">
                                What's Waiting For You
                            </h2>
                            <p className="text-sm sm:text-xl md:text-2xl font-light text-[var(--secondary-color)]">
                                Exclusive benefits for our founding members
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
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
                                <div
                                    key={index}
                                    className="group relative flex flex-col items-start justify-start bg-[var(--white)] rounded-md p-8 border border-[var(--mid-main-secondary)] hover:border-[var(--accent-color)]/30 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-center justify-center p-4 bg-[var(--accent-color)]/5 rounded-md text-[var(--accent-color)] group-hover:bg-[var(--accent-color)]/10 transition-all duration-300">
                                        <benefit.icon className="text-2xl" />
                                    </div>
                                    <h3 className="flex items-start justify-start text-xl font-bold text-[var(--secondary-color)] pt-6 pb-3">{benefit.title}</h3>
                                    <p className="flex items-start justify-start text-[var(--secondary-color)]/70 leading-relaxed">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="flex flex-col items-center justify-center w-full py-20 px-4 sm:px-6 lg:px-8 bg-[var(--secondary-color)]">
                    <div className="flex flex-col items-center justify-center w-full max-w-7xl">
                        <div className="grid md:grid-cols-3 gap-8 text-center text-[var(--white)] w-full">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="text-5xl md:text-6xl font-black">50+</div>
                                <div className="text-xl opacity-90">Subscribers</div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="text-5xl md:text-6xl font-black">2026</div>
                                <div className="text-xl opacity-90">Launch Date</div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="text-5xl md:text-6xl font-black">100%</div>
                                <div className="text-xl opacity-90">Free to Join</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="flex flex-col items-center justify-center w-full py-20 px-4 sm:px-6 lg:px-8 bg-[var(--white)]">
                    <div className="flex flex-col items-center justify-center w-full max-w-4xl gap-16">
                        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] text-center">
                            Common Questions
                        </h2>

                        <div className="flex flex-col items-stretch justify-start w-full gap-6">
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
                                <div key={index} className="flex flex-col items-start justify-start bg-[var(--mid-main-secondary)] rounded-md p-8 border border-[var(--mid-main-secondary)] hover:border-[var(--accent-color)]/50 transition-all">
                                    <h3 className="text-xl font-bold text-[var(--secondary-color)] pb-3">{faq.q}</h3>
                                    <p className="text-[var(--secondary-color)]/70 leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="relative flex flex-col items-center justify-center w-full py-20 px-4 sm:px-6 lg:px-8 overflow-hidden theme-lock">
                    <div className="absolute inset-0 bg-[var(--secondary-color)]"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

                    <div className="relative flex flex-col items-center justify-center w-full max-w-4xl text-center text-[var(--white)] gap-8">
                        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold">
                            Stay In The Loop
                        </h2>
                        <p className="flex items-center justify-center text-sm sm:text-xl md:text-2xl font-light w-full max-w-2xl">
                            Join 50+ students, teachers, and math enthusiasts receiving updates straight to their inbox.
                        </p>

                        <div className="flex flex-col items-center justify-center w-full max-w-md pt-4 gap-4">
                            <button
                                onClick={() => setIsBriefsModalOpen(true)}
                                className="flex items-center justify-center gap-3 px-12 py-5 bg-[var(--white)] text-[var(--secondary-color)] text-xl font-bold rounded-md hover:bg-gray-100 transition-all w-full cursor-pointer"
                            >
                                <span>Open Equathora Briefs Form</span>
                                <svg className="w-5 h-5" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="icon-gradient-rocket" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                            <stop offset="100%" stopColor="var(--accent-color)" />
                                        </linearGradient>
                                    </defs>
                                    <path fill="url(#icon-gradient-rocket)" d="M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.78354,407.16406c13.03118,12.9961,33.94536,11.36524,45.25,0l22.46875-22.47656V488a24.00867,24.00867,0,0,0,24.00582,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59375-46.3125,128.03125-108.40626,128.03125-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z" />
                                </svg>
                            </button>
                        </div>

                        <p className="flex items-center justify-center text-sm opacity-75 pt-4">
                            ✓ No spam ever  •  ✓ Unsubscribe anytime  •  ✓ Subscribe in 30 seconds
                        </p>
                    </div>
                </section>

                <footer>
                    <Footer />
                </footer>
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
