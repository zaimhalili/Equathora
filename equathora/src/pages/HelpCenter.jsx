import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaSearch, FaQuestionCircle, FaBook, FaUserGraduate, FaCog, FaChevronDown, FaChevronUp, FaLightbulb, FaShieldAlt, FaEnvelope, FaRocket, FaStar, FaHeart, FaFire, FaClock, FaTrophy } from 'react-icons/fa';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    const quickLinks = [
        {
            icon: <FaRocket className="text-2xl" />,
            title: "Getting Started",
            description: "New to Equathora? Start here!",
            color: "from-blue-500 to-cyan-500",
            emoji: "🚀"
        },
        {
            icon: <FaLightbulb className="text-2xl" />,
            title: "Problem Solving",
            description: "Learn how to tackle problems",
            color: "from-yellow-500 to-orange-500",
            emoji: "💡"
        },
        {
            icon: <FaTrophy className="text-2xl" />,
            title: "Achievements",
            description: "Track your progress & badges",
            color: "from-purple-500 to-pink-500",
            emoji: "🏆"
        },
        {
            icon: <FaHeart className="text-2xl" />,
            title: "Account Help",
            description: "Profile & settings support",
            color: "from-red-500 to-rose-500",
            emoji: "❤️"
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

    // More flexible search - splits query into words and checks if any word matches
    const filteredFaqs = faqs.filter(faq => {
        if (!searchQuery.trim()) return true;
        const words = searchQuery.toLowerCase().split(' ').filter(w => w.length > 2);
        if (words.length === 0) return faq.question.toLowerCase().includes(searchQuery.toLowerCase());
        return words.some(word =>
            faq.question.toLowerCase().includes(word) ||
            faq.answer.toLowerCase().includes(word)
        );
    });

    return (
        <>
            <FeedbackBanner />
            <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 font-[Inter]">
                <header>
                    <Navbar />
                </header>

                {/* Hero Section with Illustration */}
                <section className="w-full relative overflow-hidden">
                    {/* Animated background shapes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-10 blur-2xl"></div>
                        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-400 rounded-full opacity-10 blur-2xl"></div>
                        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-pink-400 rounded-full opacity-10 blur-2xl"></div>
                    </div>

                    <div className="relative px-[4vw] xl:px-[12vw] py-16">
                        <div className="w-full flex flex-col lg:flex-row items-center gap-10">
                            {/* Left: Content */}
                            <div className="flex-1 flex flex-col gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-4xl">👋</span>
                                    <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-color)] font-[DynaPuff]">
                                        Help Center
                                    </h1>
                                </div>
                                <p className="text-lg text-gray-600">
                                    We're here to help you succeed! Find answers, tutorials, and support.
                                </p>

                                <div className="w-full relative">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                                    <input
                                        type="search"
                                        placeholder="Search for anything... timer, hints, badges, problems..."
                                        className="w-full pl-14 pr-4 py-4 rounded-xl text-[var(--secondary-color)] text-base border-2 border-gray-200 focus:outline-none focus:border-[var(--accent-color)] shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Right: Illustration */}
                            <div className="flex-1 flex justify-center lg:justify-end">
                                <div className="relative">
                                    <img
                                        src="https://illustrations.popsy.co/amber/question-mark.svg"
                                        alt="Help illustration"
                                        className="w-64 lg:w-80"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Links Cards */}
                <section className="w-full px-[4vw] xl:px-[12vw] py-8">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickLinks.map((link, index) => (
                            <div
                                key={index}
                                className="relative bg-white rounded-xl p-6 flex flex-col gap-3 border-2 border-transparent hover:border-gray-200 transition-all duration-200 group overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-5 group-hover:opacity-10 transition-opacity duration-200`}></div>
                                <div className="relative">
                                    <div className="text-4xl pb-2">{link.emoji}</div>
                                    <h3 className="text-lg font-bold text-[var(--secondary-color)]">{link.title}</h3>
                                    <p className="text-sm text-gray-600 pt-1">{link.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Fun Stats Banner */}
                <section className="w-full px-[4vw] xl:px-[12vw] py-6">
                    <div className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-8 flex flex-wrap justify-around items-center gap-6 text-white">
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <FaFire className="text-2xl" />
                                <span className="text-3xl font-bold">500+</span>
                            </div>
                            <span className="text-sm opacity-90">Answers provided</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <FaHeart className="text-2xl" />
                                <span className="text-3xl font-bold">98%</span>
                            </div>
                            <span className="text-sm opacity-90">Satisfaction rate</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <FaClock className="text-2xl" />
                                <span className="text-3xl font-bold">&lt;3h</span>
                            </div>
                            <span className="text-sm opacity-90">Response time</span>
                        </div>
                    </div>
                </section>

                {/* FAQ Section with Icons */}
                <section className="w-full px-[4vw] xl:px-[12vw] py-10">
                    <div className="flex flex-col items-center gap-3 pb-8">
                        <h2 className="text-3xl font-bold text-[var(--secondary-color)] font-[DynaPuff] text-center">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600 text-center">Everything you need to know about Equathora</p>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden"
                                >
                                    <button
                                        className="w-full p-6 flex items-start gap-4 text-left"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <div className={`${faq.color} text-2xl flex-shrink-0 pt-1`}>
                                            {faq.icon}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between gap-4">
                                            <span className="font-semibold text-[var(--secondary-color)] text-lg">
                                                {faq.question}
                                            </span>
                                            <div className="flex-shrink-0">
                                                {openFaq === index ?
                                                    <FaChevronUp className="text-[var(--accent-color)] text-lg" /> :
                                                    <FaChevronDown className="text-gray-400 text-lg" />
                                                }
                                            </div>
                                        </div>
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 pb-6 pl-[72px]">
                                            <div className="border-l-4 border-gray-200 pl-4">
                                                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl border-2 border-gray-100 p-12 flex flex-col items-center text-center gap-4">
                                <div className="text-6xl">🔍</div>
                                <div>
                                    <p className="text-xl font-bold text-[var(--secondary-color)] pb-2">No results found</p>
                                    <p className="text-gray-600 pb-4">Try searching with different keywords:</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {['problem', 'hint', 'timer', 'leaderboard', 'favorite', 'badge'].map(keyword => (
                                            <button
                                                key={keyword}
                                                onClick={() => setSearchQuery(keyword)}
                                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-semibold"
                                            >
                                                {keyword}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Contact Section with Illustration */}
                <section className="w-full px-[4vw] xl:px-[12vw] py-12">
                    <div className="w-full bg-gradient-to-br from-[var(--secondary-color)] to-[#3a3d52] rounded-2xl overflow-hidden">
                        <div className="flex flex-col lg:flex-row items-center">
                            <div className="flex-1 p-10 flex flex-col gap-6 text-white">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">💌</span>
                                    <h2 className="text-3xl font-bold font-[DynaPuff]">Still Need Help?</h2>
                                </div>
                                <p className="text-gray-300 text-lg">
                                    Can't find your answer? Our support team responds within 3 hours (usually) !
                                </p>
                                <a
                                    href="mailto:support@equathora.com"
                                    className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--accent-color)] to-pink-600 text-white rounded-xl font-bold text-lg no-underline w-fit"
                                >
                                    Contact Support →
                                </a>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <FaClock />
                                        <span>Fast response</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaHeart />
                                        <span>Friendly team</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaStar />
                                        <span>Expert help</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex justify-center p-10">
                                <img
                                    src="https://illustrations.popsy.co/amber/customer-support.svg"
                                    alt="Support illustration"
                                    className="w-64"
                                />
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