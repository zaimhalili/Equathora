import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaQuestionCircle, FaChevronDown } from 'react-icons/fa';
import { FaChevronUp, FaLightbulb, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { FaStar, FaClock, FaTrophy, FaArrowRight, FaUsers, FaComments, FaHeadset } from 'react-icons/fa';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

const HelpCenter = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const quickLinks = [
        {
            icon: <FaRocket className="text-2xl" />,
            title: "Getting Started",
            description: "New to Equathora? Start here!",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <FaLightbulb className="text-2xl" />,
            title: "Problem Solving",
            description: "Learn how to tackle problems",
            color: "from-yellow-500 to-orange-500"
        },
        {
            icon: <FaTrophy className="text-2xl" />,
            title: "Achievements",
            description: "Track your progress & badges",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: <FaHeadset className="text-2xl" />,
            title: "Account Help",
            description: "Profile & settings support",
            color: "from-red-500 to-rose-500"
        }
    ];

    const faqs = [
        {
            question: "How do I start solving problems on Equathora?",
            answer: "Simply navigate to the 'Learn' page from the menu, browse through available problem sets, and click on any problem to start solving. You can filter problems by difficulty, topic, or completion status.",
            icon: <FaRocket />,
            color: "text-blue-500"
        },
        {
            question: "What is the timer for and can I disable it?",
            answer: "The timer helps you track how long you spend on each problem, which is useful for improving your speed. You can pause or reset it at any time, and it doesn't affect your score or completion status.",
            icon: <FaClock />,
            color: "text-orange-500"
        },
        {
            question: "How do hints work?",
            answer: "Each problem may have multiple hints available. Click the 'Show Hints' button to reveal them progressively. Using hints won't prevent you from completing the problem, but try solving it first for the best learning experience!",
            icon: <FaLightbulb />,
            color: "text-yellow-500"
        },
        {
            question: "Can I save problems to come back to later?",
            answer: "Yes! Click the star icon (☆) on any problem to add it to your favorites. You can then filter by favorites on the Learn page to quickly access problems you want to revisit.",
            icon: <FaStar />,
            color: "text-purple-500"
        },
        {
            question: "How does the leaderboard work?",
            answer: "The leaderboard ranks users based on their total points earned from solving problems. Points are awarded based on problem difficulty and completion speed. You can view global rankings or compete with friends!",
            icon: <FaTrophy />,
            color: "text-green-500"
        },
        {
            question: "Can I use Equathora offline?",
            answer: "Currently, Equathora requires an internet connection to sync your progress and access problems. However, we're working on an offline mode for future releases.",
            icon: <FaQuestionCircle />,
            color: "text-cyan-500"
        },
        {
            question: "How do I report a problem with incorrect content?",
            answer: "If you find an error in a problem, use the flag/report button on the problem page. Our team reviews all reports and updates content accordingly. We appreciate your help in maintaining quality!",
            icon: <FaShieldAlt />,
            color: "text-red-500"
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <>
            <FeedbackBanner />
            <div className="w-full min-h-screen bg-[var(--main-color)] font-[Sansation] text-[var(--secondary-color)]">
                <header>
                    <Navbar />
                </header>

                {/* Hero Section with Illustration */}
                <section className="w-full relative overflow-hidden flex justify-center bg-[linear-gradient(180deg,var(--secondary-color),var(--accent-color)130%)] text-[var(--white)] theme-lock">
                    {/* Animated background shapes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--accent-color)] rounded-full opacity-25 blur-2xl"></div>
                        <div className="absolute top-40 right-20 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>
                        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-[var(--white)] rounded-full opacity-10 blur-2xl"></div>
                    </div>

                    <div className="relative px-[4vw] xl:px-[6vw] py-12 max-w-[1500px] w-full">
                        <div className="w-full flex flex-col lg:flex-row items-center gap-8">
                            {/* Left: Content */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--white)]/10 border border-[var(--white)]/30 text-xs font-semibold w-fit">
                                    <FaHeadset />
                                    SUPPORT CENTER
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-md bg-[var(--white)]/15 flex items-center justify-center text-xl">
                                        <FaQuestionCircle />
                                    </div>
                                    <h1 className="text-4xl font-bold text-[var(--white)] font-[Sansation]">
                                        Help Center
                                    </h1>
                                </div>
                                <p className="text-base text-gray-200 max-w-xl">
                                    We're here to help you succeed with clear answers, practical tutorials, and responsive support.
                                </p>
                            </div>

                            {/* Right: Illustration */}
                            <div className="flex-1 flex justify-center lg:justify-end">
                                <div className="relative">
                                    <img
                                        src="https://illustrations.popsy.co/amber/question-mark.svg"
                                        alt="Help illustration"
                                        className="w-40 lg:w-48 drop-shadow-2xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Links Cards */}
                <section className="w-full flex justify-center">
                    <div className="px-[4vw] xl:px-[6vw] py-6 max-w-[1500px] w-full">
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickLinks.map((link, index) => (
                                <div
                                    key={index}
                                    className="relative bg-[var(--white)] rounded-md p-4 flex flex-col gap-2 shadow-sm hover:shadow-lg transition-all duration-200 group overflow-hidden border border-gray-100"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-5 group-hover:opacity-10 transition-opacity duration-200`}></div>
                                    <div className="relative">
                                        <div className={`w-11 h-11 rounded-md bg-gradient-to-br ${link.color} text-[var(--white)] flex items-center justify-center pb-3 shadow-md`}>
                                            {link.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--secondary-color)]">{link.title}</h3>
                                        <p className="text-sm text-[var(--mid-main-secondary)] pt-0.5">{link.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Fun Stats Banner */}
                <section className="w-full flex justify-center theme-lock">
                    <div className="px-[4vw] xl:px-[6vw] py-4 max-w-[1500px] w-full">
                        <div className="w-full bg-[linear-gradient(180deg,var(--secondary-color),var(--accent-color)130%)] rounded-md p-6 flex flex-wrap justify-around items-center gap-4 text-[var(--white)] shadow-sm">
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-2">
                                    <FaComments className="text-xl" />
                                    <span className="text-2xl font-bold">500+</span>
                                </div>
                                <span className="text-sm opacity-90">Answers provided</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-2">
                                    <FaUsers className="text-xl" />
                                    <span className="text-2xl font-bold">98%</span>
                                </div>
                                <span className="text-sm opacity-90">Satisfaction rate</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-2">
                                    <FaClock className="text-xl" />
                                    <span className="text-2xl font-bold">&lt;3h</span>
                                </div>
                                <span className="text-sm opacity-90">Response time</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section with Icons */}
                <section className="w-full flex justify-center">
                    <div className="px-[4vw] xl:px-[6vw] py-8 max-w-[1500px] w-full">
                        <div className="flex flex-col items-center gap-2 pb-6">
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] font-[Sansation] text-center">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-[var(--mid-main-secondary)] text-center text-base">Everything you need to know about Equathora</p>
                        </div>

                        <div className="w-full flex flex-col gap-3">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-[var(--white)] rounded-md shadow-sm border border-gray-100 overflow-hidden"
                                >
                                    <button
                                        className="w-full p-4 flex items-start gap-3 text-left cursor-pointer"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <div className={`${faq.color} text-xl flex-shrink-0 pt-1`}>
                                            {faq.icon}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between gap-3">
                                            <span className="font-semibold text-[var(--secondary-color)] text-base">
                                                {faq.question}
                                            </span>
                                            <div className="flex-shrink-0">
                                                {openFaq === index ?
                                                    <FaChevronUp className="text-[var(--accent-color)] text-base" /> :
                                                    <FaChevronDown className="text-gray-400 text-base" />
                                                }
                                            </div>
                                        </div>
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-4 pb-4 pl-[60px]">
                                            <div className="border-l-4 border-gray-200 pl-3">
                                                <p className="text-[var(--mid-main-secondary)] leading-relaxed text-sm">{faq.answer}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                            }
                        </div>
                    </div>
                </section>

                {/* Contact Section with Illustration */}
                <section className="w-full flex justify-center theme-lock">
                    <div className="px-[4vw] xl:px-[6vw] py-8 max-w-[1500px] w-full">
                        <div className="w-full bg-[linear-gradient(180deg,var(--secondary-color),var(--accent-color)130%)] rounded-md overflow-hidden shadow-sm">
                            <div className="flex flex-col lg:flex-row items-center">
                                <div className="flex-1 p-8 flex flex-col gap-4 text-[var(--white)]">
                                    <div className="flex items-center gap-2">
                                        <FaHeadset className="text-2xl" />
                                        <h2 className="text-2xl font-bold font-[Sansation]">Still Need Help?</h2>
                                    </div>
                                    <p className="text-gray-200 text-base">
                                        Can't find your answer? Our support team responds within 3 hours (usually) !
                                    </p>
                                    <a
                                        href="mailto:equathora@gmail.com"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--main-color)] !text-[var(--accent-color)] rounded-md font-bold text-base no-underline w-fit hover:bg-gray-200 transition-colors"
                                    >
                                        <span>Contact Support</span>
                                        <FaArrowRight className="text-sm" />
                                    </a>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-200">
                                        <div className="flex items-center gap-2">
                                            <FaClock />
                                            <span>Fast response</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaUsers />
                                            <span>Friendly team</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaStar />
                                            <span>Expert help</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 flex justify-center p-8">
                                    <img
                                        src="https://illustrations.popsy.co/amber/customer-support.svg"
                                        alt="Support illustration"
                                        className="w-40"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer>
                    <Footer />
                </footer>
            </div>
        </>
    );
};

export default HelpCenter;