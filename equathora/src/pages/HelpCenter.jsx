import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaSearch, FaQuestionCircle, FaBook, FaUserGraduate, FaCog, FaChevronDown, FaChevronUp, FaLightbulb, FaShieldAlt, FaEnvelope } from 'react-icons/fa';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const categories = [
        {
            icon: <FaBook />,
            title: "Getting Started",
            description: "Learn the basics of using Equathora",
            color: "#22c55e"
        },
        {
            icon: <FaUserGraduate />,
            title: "Learning Guide",
            description: "Tips for effective problem-solving",
            color: "#3b82f6"
        },
        {
            icon: <FaCog />,
            title: "Account & Settings",
            description: "Manage your profile and preferences",
            color: "#8b5cf6"
        },
        {
            icon: <FaShieldAlt />,
            title: "Privacy & Security",
            description: "Your data protection and safety",
            color: "#ef4444"
        },
        {
            icon: <FaLightbulb />,
            title: "Tips & Tricks",
            description: "Advanced features and shortcuts",
            color: "#f59e0b"
        },
        {
            icon: <FaQuestionCircle />,
            title: "Troubleshooting",
            description: "Common issues and solutions",
            color: "#06b6d4"
        }
    ];

    const faqs = [
        {
            question: "How do I start solving problems on Equathora?",
            answer: "Simply navigate to the 'Learn' page from the menu, browse through available problem sets, and click on any problem to start solving. You can filter problems by difficulty, topic, or completion status."
        },
        {
            question: "What is the timer for and can I disable it?",
            answer: "The timer helps you track how long you spend on each problem, which is useful for improving your speed. You can pause or reset it at any time, and it doesn't affect your score or completion status."
        },
        {
            question: "How do hints work?",
            answer: "Each problem may have multiple hints available. Click the 'Show Hints' button to reveal them progressively. Using hints won't prevent you from completing the problem, but try solving it first for the best learning experience!"
        },
        {
            question: "Can I save problems to come back to later?",
            answer: "Yes! Click the star icon (☆) on any problem to add it to your favorites. You can then filter by favorites on the Learn page to quickly access problems you want to revisit."
        },
        // Premium FAQ hidden for MVP
        // {
        //     question: "What's the difference between Free and Premium problems?",
        //     answer: "Free problems are available to all users and cover fundamental concepts. Premium problems offer more challenging content, detailed solutions, and advanced topics for subscribers who want to dive deeper."
        // },
        {
            question: "How does the leaderboard work?",
            answer: "The leaderboard ranks users based on their total points earned from solving problems. Points are awarded based on problem difficulty and completion speed. You can view global rankings or compete with friends!"
        },
        {
            question: "Can I use Equathora offline?",
            answer: "Currently, Equathora requires an internet connection to sync your progress and access problems. However, we're working on an offline mode for future releases."
        },
        {
            question: "How do I report a problem with incorrect content?",
            answer: "If you find an error in a problem, use the flag/report button on the problem page. Our team reviews all reports and updates content accordingly. We appreciate your help in maintaining quality!"
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
            <div className="w-full min-h-screen bg-[var(--main-color)] font-[Inter]">
                <header>
                    <Navbar />
                </header>

                {/* Hero Section */}
                <section className="w-full bg-gradient-to-br from-[var(--secondary-color)] to-[#3a3d52] text-white px-[4vw] xl:px-[12vw] py-16">
                    <div className="w-full flex flex-col items-center text-center gap-6">
                        <h1 className="text-4xl md:text-5xl font-bold font-[DynaPuff]">How can we help you?</h1>
                        <p className="text-lg text-gray-300 max-w-2xl">Find answers quickly or reach out to our support team</p>

                        <div className="w-full max-w-2xl relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="search"
                                placeholder="Try 'timer', 'hints', 'leaderboard'..."
                                className="w-full pl-12 pr-4 py-4 rounded-lg text-[var(--secondary-color)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] shadow-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {searchQuery && (
                            <p className="text-sm text-gray-300">
                                Showing results for: <span className="font-semibold text-white">{searchQuery}</span>
                            </p>
                        )}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="w-full px-[4vw] xl:px-[12vw] py-12">
                    <h2 className="text-2xl font-bold text-[var(--secondary-color)] pb-6 text-center">Frequently Asked Questions</h2>
                    <div className="max-w-4xl mx-auto flex flex-col gap-3">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                    <button
                                        className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <span className="font-semibold text-[var(--secondary-color)] pr-4">{faq.question}</span>
                                        {openFaq === index ?
                                            <FaChevronUp className="text-[var(--accent-color)] flex-shrink-0" /> :
                                            <FaChevronDown className="text-gray-400 flex-shrink-0" />
                                        }
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-5 pb-5 pt-0 text-gray-700 leading-relaxed border-t border-gray-100">
                                            <p className="pt-4">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 flex flex-col items-center text-center gap-4">
                                <FaQuestionCircle className="text-5xl text-gray-300" />
                                <div>
                                    <p className="text-lg font-semibold text-[var(--secondary-color)] pb-2">No results found</p>
                                    <p className="text-sm text-gray-600">Try searching with different keywords like:</p>
                                    <div className="flex flex-wrap gap-2 justify-center pt-3">
                                        {['problem', 'hint', 'timer', 'leaderboard', 'favorite'].map(keyword => (
                                            <button
                                                key={keyword}
                                                onClick={() => setSearchQuery(keyword)}
                                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-[var(--secondary-color)] transition-colors"
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

                {/* Contact Section */}
                <section className="w-full px-[4vw] xl:px-[12vw] py-12">
                    <div className="max-w-2xl mx-auto bg-gradient-to-br from-[var(--secondary-color)] to-[#3a3d52] rounded-lg p-10 text-center text-white">
                        <FaEnvelope className="text-5xl mx-auto mb-4 opacity-80" />
                        <h2 className="text-2xl font-bold pb-3">Still need help?</h2>
                        <p className="text-gray-300 pb-6">Can't find what you're looking for? Our support team is here to help!</p>
                        <a
                            href="mailto:support@equathora.com"
                            className="inline-block px-8 py-3 bg-[var(--accent-color)] hover:bg-[var(--dark-accent-color)] text-white rounded font-semibold transition-colors duration-200 no-underline"
                        >
                            Contact Support
                        </a>
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