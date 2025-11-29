import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaSearch, FaQuestionCircle, FaBook, FaUserGraduate, FaCog, FaChevronDown, FaChevronUp, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import './HelpCenter.css';
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
        {
            question: "What's the difference between Free and Premium problems?",
            answer: "Free problems are available to all users and cover fundamental concepts. Premium problems offer more challenging content, detailed solutions, and advanced topics for subscribers who want to dive deeper."
        },
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

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <FeedbackBanner />
            <div className="help-center-container">
                <header>
                    <Navbar />
                </header>

                {/* Hero Section */}
                <section className="help-hero">
                    <div className="help-hero-content">
                        <h1>How can we help you?</h1>
                        <p>Search our knowledge base or browse categories below</p>

                        <div className="help-search-container">
                            <FaSearch className="help-search-icon" />
                            <input
                                type="search"
                                placeholder="Search for help articles, FAQs, or topics..."
                                className="help-search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="help-categories">
                    <h2 className="section-title">Browse by Category</h2>
                    <div className="categories-grid">
                        {categories.map((category, index) => (
                            <div key={index} className="category-card" style={{ '--category-color': category.color }}>
                                <div className="category-icon">{category.icon}</div>
                                <h3>{category.title}</h3>
                                <p>{category.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="help-faq">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div className="faq-container">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <div key={index} className={`faq-item ${openFaq === index ? 'active' : ''}`}>
                                    <button className="faq-question" onClick={() => toggleFaq(index)}>
                                        <span>{faq.question}</span>
                                        {openFaq === index ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                    {openFaq === index && (
                                        <div className="faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <FaQuestionCircle />
                                <p>No results found for "{searchQuery}"</p>
                                <small>Try different keywords or browse categories above</small>
                            </div>
                        )}
                    </div>
                </section>

                {/* Contact Section */}
                <section className="help-contact">
                    <div className="contact-card">
                        <h2>Still need help?</h2>
                        <p>Can't find what you're looking for? Our support team is here to help!</p>
                        <button className="contact-button">Contact Support</button>
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