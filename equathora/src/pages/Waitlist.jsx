import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import BetaBanner from '../components/BetaBanner.jsx';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaUsers, FaArrowRight, FaBell, FaStar, FaRocket } from 'react-icons/fa';
import Studying from '../assets/images/studying.svg';

const Waitlist = () => {
    return (
        <>
            <BetaBanner />
            <FeedbackBanner />
            <main className="w-full bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] min-h-screen">
                <header>
                    <Navbar />
                </header>

                {/* Hero Section */}
                <div className='flex w-full justify-center items-center'>
                    <div className='flex flex-col justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] pt-8 lg:pt-12 gap-12 pb-16'>

                        {/* Main Content */}
                        <section className="flex flex-col lg:flex-row items-center gap-12 w-full">

                            {/* Left Side - Content */}
                            <div className='flex-1 flex flex-col gap-6 text-center lg:text-left'>
                                <div className='inline-flex items-center justify-center lg:justify-start px-4 py-1.5 bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/50 rounded-full text-[var(--accent-color)] text-xs font-semibold self-center lg:self-start w-fit'>
                                    🚀 LIMITED SPOTS AVAILABLE
                                </div>

                                <h1 className='text-4xl lg:text-5xl font-bold font-[DynaPuff] text-[var(--secondary-color)] leading-tight'>
                                    Join the <span className='text-[var(--accent-color)]'>Equathora</span> Waitlist
                                </h1>

                                <p className='text-lg text-[var(--secondary-color)]/80 font-[Inter] max-w-xl lg:max-w-none'>
                                    Be among the first to experience our full platform launch. Get early access to premium features, exclusive content, and help shape the future of math education.
                                </p>

                                {/* Stats */}
                                <div className='flex flex-wrap justify-center lg:justify-start gap-6 py-4'>
                                    <div className='flex flex-col items-center lg:items-start'>
                                        <div className='text-3xl font-bold text-[var(--accent-color)] font-[DynaPuff]'>500+</div>
                                        <div className='text-sm text-[var(--secondary-color)]/70'>On the waitlist</div>
                                    </div>
                                    <div className='flex flex-col items-center lg:items-start'>
                                        <div className='text-3xl font-bold text-[var(--accent-color)] font-[DynaPuff]'>Beta</div>
                                        <div className='text-sm text-[var(--secondary-color)]/70'>Currently live</div>
                                    </div>
                                    <div className='flex flex-col items-center lg:items-start'>
                                        <div className='text-3xl font-bold text-[var(--accent-color)] font-[DynaPuff]'>Q1 2026</div>
                                        <div className='text-sm text-[var(--secondary-color)]/70'>Full launch</div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className='flex flex-col gap-4 pt-4'>
                                    <a
                                        href='https://forms.gle/YOUR_GOOGLE_FORM_ID'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='bg-[var(--accent-color)] hover:bg-[var(--dark-accent-color)] text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 no-underline shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:shadow-[0_0_25px_rgba(217,4,41,0.5)] transition-all duration-200 w-full sm:w-auto'
                                    >
                                        <FaUsers />
                                        <span>Join the Waitlist</span>
                                        <FaArrowRight className='text-sm' />
                                    </a>

                                    <div className='flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-[var(--secondary-color)]/70 font-[Inter]'>
                                        <div className='flex items-center gap-2'>
                                            <FaCheckCircle className='text-green-500' />
                                            <span>No payment required</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <FaCheckCircle className='text-green-500' />
                                            <span>Cancel anytime</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <FaCheckCircle className='text-green-500' />
                                            <span>Early bird perks</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Image */}
                            <div className='flex-1 flex justify-center items-center'>
                                <div className='relative'>
                                    <div className='absolute inset-0 bg-[var(--accent-color)] opacity-10 blur-3xl rounded-full'></div>
                                    <img
                                        src={Studying}
                                        alt="Join Equathora"
                                        className='relative w-full max-w-md drop-shadow-2xl'
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Benefits Grid */}
                        <section className='w-full pt-8'>
                            <h2 className='text-3xl font-bold font-[DynaPuff] text-[var(--secondary-color)] text-center pb-8'>
                                What You'll Get
                            </h2>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>
                                {/* Benefit 1 */}
                                <div className='bg-white rounded-lg p-6 shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 hover:scale-105'>
                                    <div className='flex items-center gap-3 pb-4'>
                                        <div className='w-12 h-12 bg-[var(--accent-color)]/10 rounded-lg flex items-center justify-center'>
                                            <FaBell className='text-[var(--accent-color)] text-xl' />
                                        </div>
                                        <h3 className='text-xl font-semibold text-[var(--secondary-color)] font-[Inter]'>
                                            Early Access
                                        </h3>
                                    </div>
                                    <p className='text-[var(--secondary-color)]/80 font-[Inter]'>
                                        Be the first to try new features before they're released to the public. Your feedback will directly shape our platform.
                                    </p>
                                </div>

                                {/* Benefit 2 */}
                                <div className='bg-white rounded-lg p-6 shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 hover:scale-105'>
                                    <div className='flex items-center gap-3 pb-4'>
                                        <div className='w-12 h-12 bg-[var(--accent-color)]/10 rounded-lg flex items-center justify-center'>
                                            <FaStar className='text-[var(--accent-color)] text-xl' />
                                        </div>
                                        <h3 className='text-xl font-semibold text-[var(--secondary-color)] font-[Inter]'>
                                            Exclusive Perks
                                        </h3>
                                    </div>
                                    <p className='text-[var(--secondary-color)]/80 font-[Inter]'>
                                        Unlock special badges, priority support, and lifetime discounts on premium features as a founding member.
                                    </p>
                                </div>

                                {/* Benefit 3 */}
                                <div className='bg-white rounded-lg p-6 shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 hover:scale-105'>
                                    <div className='flex items-center gap-3 pb-4'>
                                        <div className='w-12 h-12 bg-[var(--accent-color)]/10 rounded-lg flex items-center justify-center'>
                                            <FaRocket className='text-[var(--accent-color)] text-xl' />
                                        </div>
                                        <h3 className='text-xl font-semibold text-[var(--secondary-color)] font-[Inter]'>
                                            Shape the Future
                                        </h3>
                                    </div>
                                    <p className='text-[var(--secondary-color)]/80 font-[Inter]'>
                                        Join our community of passionate learners and help us build the best math learning platform together.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* FAQ/Info Section */}
                        <section className='w-full bg-white rounded-lg p-8 shadow-[0_10px_10px_rgba(141,153,174,0.3)] mt-8'>
                            <h2 className='text-2xl font-bold font-[DynaPuff] text-[var(--secondary-color)] pb-6 text-center'>
                                Frequently Asked Questions
                            </h2>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <h3 className='font-semibold text-[var(--secondary-color)] font-[Inter] pb-2'>
                                        When will the full platform launch?
                                    </h3>
                                    <p className='text-[var(--secondary-color)]/80 font-[Inter] text-sm'>
                                        We're aiming for Q1 2026. Waitlist members will be notified first and get priority access during our phased rollout.
                                    </p>
                                </div>

                                <div>
                                    <h3 className='font-semibold text-[var(--secondary-color)] font-[Inter] pb-2'>
                                        Is there any cost to join?
                                    </h3>
                                    <p className='text-[var(--secondary-color)]/80 font-[Inter] text-sm'>
                                        No! Joining the waitlist is completely free with no commitment required. You can opt out at any time.
                                    </p>
                                </div>

                                <div>
                                    <h3 className='font-semibold text-[var(--secondary-color)] font-[Inter] pb-2'>
                                        What's included in early access?
                                    </h3>
                                    <p className='text-[var(--secondary-color)]/80 font-[Inter] text-sm'>
                                        Early access members get first look at new problem sets, advanced features, personalized learning paths, and exclusive achievements.
                                    </p>
                                </div>

                                <div>
                                    <h3 className='font-semibold text-[var(--secondary-color)] font-[Inter] pb-2'>
                                        Can I still use the platform now?
                                    </h3>
                                    <p className='text-[var(--secondary-color)]/80 font-[Inter] text-sm'>
                                        Yes! Our beta version is live right now. <Link to="/dashboard" className='text-[var(--accent-color)] font-semibold hover:underline'>Start solving problems</Link> while you wait for the full launch.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Final CTA */}
                        <section className='w-full text-center pt-8'>
                            <div className='bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] rounded-lg p-12 text-white relative overflow-hidden'>
                                <div className='absolute inset-0 opacity-10' style={{
                                    backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
                                    backgroundSize: '50px 50px'
                                }}></div>

                                <div className='relative z-10'>
                                    <h2 className='text-3xl font-bold font-[DynaPuff] pb-4'>
                                        Ready to Join?
                                    </h2>
                                    <p className='text-lg pb-6 max-w-2xl mx-auto'>
                                        Secure your spot now and be part of something special. It takes less than a minute!
                                    </p>
                                    <a
                                        href='https://forms.gle/YOUR_GOOGLE_FORM_ID'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center gap-3 bg-white text-[var(--accent-color)] px-8 py-4 rounded-lg font-semibold text-lg no-underline shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105'
                                    >
                                        <FaUsers />
                                        <span>Join the Waitlist Now</span>
                                        <FaArrowRight className='text-sm' />
                                    </a>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

                <footer>
                    <Footer />
                </footer>
            </main>
        </>
    );
};

export default Waitlist;
