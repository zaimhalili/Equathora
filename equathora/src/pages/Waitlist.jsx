import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { FaUsers, FaArrowRight, FaCheckCircle, FaBolt, FaStar, FaCrown, FaRocket, FaShieldAlt } from 'react-icons/fa';

const Waitlist = () => {

    return (
        <>
            <main className="w-full bg-[var(--main-color)] min-h-screen">
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                    <Navbar />
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 -left-20 w-72 h-72 bg-[var(--accent-color)]/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[var(--secondary-color)]/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                        <div className="flex flex-col items-center justify-center w-full max-w-7xl gap-8">
                            {/* Badge */}
                            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-full text-sm font-semibold shadow-lg animate-bounce">
                                <FaBolt />
                                <span>50+ Already Joined</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="flex flex-col items-center justify-center text-5xl md:text-7xl font-black text-[var(--secondary-color)] leading-tight">
                                <span>Master Math.</span>
                                <span className="text-[var(--accent-color)]">Get Early Access.</span>
                            </h1>

                            {/* Subheadline */}
                            <p className="flex items-center justify-center text-center text-xl md:text-2xl text-[var(--secondary-color)]/80 w-full max-w-3xl leading-relaxed">
                                Join the waitlist for exclusive early access to premium features, personalized learning paths, and the future of mathematical education.
                            </p>

                            {/* CTA Button */}
                            <div className="flex flex-col items-center justify-center w-full max-w-md pt-4 gap-4">
                                <button
                                    onClick={() => window.open('https://forms.gle/YOUR_GOOGLE_FORM_ID', '_blank')}
                                    className="flex items-center justify-center gap-3 px-12 py-5 bg-[var(--accent-color)] hover:bg-[var(--dark-accent-color)] text-white text-xl font-bold rounded-xl transition-all w-full"
                                >
                                    <span>Join the Waitlist</span>
                                    <FaArrowRight />
                                </button>
                                <p className="flex items-center justify-center text-sm text-[var(--secondary-color)]/60 text-center">
                                    Free forever • No credit card required • Unsubscribe anytime
                                </p>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-[var(--secondary-color)]/70">
                                <div className="flex items-center justify-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    <span>Early bird perks</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    <span>Priority support</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    <span>Founder badge</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="flex flex-col items-center justify-center w-full py-20 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="flex flex-col items-center justify-center w-full max-w-7xl gap-16">
                        <div className="flex flex-col items-center justify-center text-center">
                            <h2 className="text-4xl md:text-5xl font-bold text-[var(--secondary-color)] pb-4">
                                What's Waiting For You
                            </h2>
                            <p className="text-xl text-[var(--secondary-color)]/70">
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
                                    title: 'Premium Features Free',
                                    description: 'Get 6 months of premium features absolutely free when we launch.'
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
                                    className="group relative flex flex-col items-start justify-start bg-white rounded-2xl p-8 border border-gray-200 hover:border-[var(--accent-color)]/30 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-center justify-center p-4 bg-[var(--accent-color)]/5 rounded-xl text-[var(--accent-color)] group-hover:bg-[var(--accent-color)]/10 transition-all duration-300">
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
                        <div className="grid md:grid-cols-3 gap-8 text-center text-white w-full">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="text-5xl md:text-6xl font-black">50+</div>
                                <div className="text-xl opacity-90">On Waitlist</div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="text-5xl md:text-6xl font-black">Q1 2026</div>
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
                <section className="flex flex-col items-center justify-center w-full py-20 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="flex flex-col items-center justify-center w-full max-w-4xl gap-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--secondary-color)] text-center">
                            Common Questions
                        </h2>

                        <div className="flex flex-col items-stretch justify-start w-full gap-6">
                            {[
                                {
                                    q: 'When will the platform launch?',
                                    a: 'We\'re targeting Q1 2026 for the full launch with user accounts and cloud sync. Beta access is available now.'
                                },
                                {
                                    q: 'Is there any cost to join?',
                                    a: 'Absolutely not! Joining the waitlist is 100% free with no credit card required and no strings attached.'
                                },
                                {
                                    q: 'What do I get as an early member?',
                                    a: 'Founding member badge, 6 months free premium, early feature access, priority support, and the ability to shape our product.'
                                },
                                {
                                    q: 'Can I start using Equathora now?',
                                    a: 'Yes! Our beta version is live. You can start solving problems right now at /dashboard while waiting for the full launch.'
                                },
                                {
                                    q: 'How will you use my email?',
                                    a: 'Only to notify you about launch updates and exclusive offers. We never spam or share your data. Unsubscribe anytime.'
                                }
                            ].map((faq, index) => (
                                <div key={index} className="flex flex-col items-start justify-start bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-[var(--accent-color)]/50 transition-all">
                                    <h3 className="text-xl font-bold text-[var(--secondary-color)] pb-3">{faq.q}</h3>
                                    <p className="text-[var(--secondary-color)]/70 leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="relative flex flex-col items-center justify-center w-full py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="absolute inset-0 bg-[var(--secondary-color)]"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

                    <div className="relative flex flex-col items-center justify-center w-full max-w-4xl text-center text-white gap-8">
                        <h2 className="text-4xl md:text-6xl font-black">
                            Don't Miss Out
                        </h2>
                        <p className="flex items-center justify-center text-xl md:text-2xl opacity-90 w-full max-w-2xl">
                            Join 50+ students, teachers, and math enthusiasts already on the list. Spots are filling fast!
                        </p>

                        <div className="flex flex-col items-center justify-center w-full max-w-md pt-4 gap-4">
                            <button
                                onClick={() => window.open('https://forms.gle/YOUR_GOOGLE_FORM_ID', '_blank')}
                                className="flex items-center justify-center gap-3 px-12 py-5 bg-white text-[var(--secondary-color)] text-xl font-bold rounded-xl hover:bg-gray-100 transition-all w-full"
                            >
                                <span>Secure My Spot</span>
                                <FaRocket />
                            </button>
                        </div>

                        <p className="flex items-center justify-center text-sm opacity-75 pt-4">
                            ✓ No spam ever  •  ✓ Unsubscribe anytime  •  ✓ Join in 30 seconds
                        </p>
                    </div>
                </section>

                <footer>
                    <Footer />
                </footer>
            </main>
        </>
    );
};

export default Waitlist;
