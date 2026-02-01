import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { FaUsers, FaArrowRight, FaCheckCircle, FaBolt } from 'react-icons/fa';
import { FaStar, FaCrown, FaRocket, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
                            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--dark-accent-color)] to-[var(--accent-color)] text-white rounded-full text-sm font-semibold shadow-lg animate-bounce">
                                <svg className="w-4 h-4" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="icon-gradient-bolt" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                            <stop offset="100%" stopColor="var(--accent-color)" />
                                        </linearGradient>
                                    </defs>
                                    <path fill="white" d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.7 20.8l-32 416C-.9 445.2 9.9 456 22.8 456.4c4.1.1 8.2-.3 12.1-1.6L266 420.1c10.2-3.3 17.5-12.6 17.5-23.2 0-6.6-2.7-12.8-7.4-17.3L150 256l119.3-99.3c11.3-9.4 14.8-25.6 7.8-38.8z" />
                                </svg>
                                <span>50+ Already Joined</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="flex flex-col items-center justify-center text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] font-[Sansation] leading-tight text-center">
                                <span>Master Math.</span>
                                <span className="text-[var(--accent-color)] relative inline-block">
                                    Get Early Access.
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
                            </h1>

                            {/* Subheadline */}
                            <p className="flex items-center justify-center text-center text-sm sm:text-xl md:text-2xl text-[var(--secondary-color)] font-light w-full max-w-3xl leading-relaxed">
                                Join the waitlist for exclusive early access to premium features, personalized learning paths, and the future of mathematical education.
                            </p>

                            {/* CTA Button */}
                            <div className="flex flex-col items-center justify-center w-full max-w-md pt-4 gap-4">
                                <button
                                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdLLApMvE_dJdllHd0U4YxFFQ6K7YasS4I-xO1mDG9SFCariw/viewform', '_blank')}
                                    className="flex items-center justify-center gap-3 px-12 py-5 bg-[var(--accent-color)] hover:bg-[var(--dark-accent-color)] text-white text-xl font-bold rounded-xl transition-all w-full cursor-pointer"
                                >
                                    <span>Join the Waitlist</span>
                                    <svg className="w-5 h-5" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="icon-gradient-arrow-1" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                                <stop offset="100%" stopColor="var(--accent-color)" />
                                            </linearGradient>
                                        </defs>
                                        <path fill="white" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                                    </svg>
                                </button>
                                <p className="flex items-center justify-center text-sm text-[var(--secondary-color)]/60 text-center">
                                    Early access spots are limited • No credit card required • Unsubscribe anytime
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
                <section className="flex flex-col items-center justify-center w-full py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
                                    a: 'Absolutely not! Joining the waitlist is 100% free with no credit card required and no strings attached.'
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
                        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold">
                            Don't Miss Out
                        </h2>
                        <p className="flex items-center justify-center text-sm sm:text-xl md:text-2xl font-light w-full max-w-2xl">
                            Join 50+ students, teachers, and math enthusiasts already on the list. Spots are filling fast!
                        </p>

                        <div className="flex flex-col items-center justify-center w-full max-w-md pt-4 gap-4">
                            <button
                                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdLLApMvE_dJdllHd0U4YxFFQ6K7YasS4I-xO1mDG9SFCariw/viewform', '_blank')}
                                className="flex items-center justify-center gap-3 px-12 py-5 bg-white text-[var(--secondary-color)] text-xl font-bold rounded-xl hover:bg-gray-100 transition-all w-full cursor-pointer"
                            >
                                <span>Secure My Spot</span>
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
