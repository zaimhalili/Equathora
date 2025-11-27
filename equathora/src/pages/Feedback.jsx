import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import { FaBug, FaPalette, FaLightbulb, FaCommentAlt } from 'react-icons/fa';

const Feedback = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        feedbackType: 'bug',
        title: '',
        description: '',
        email: '',
        page: window.location.pathname
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Sanitize inputs to prevent XSS
        const sanitizedData = {
            feedbackType: formData.feedbackType,
            title: formData.title.slice(0, 100).trim(),
            description: formData.description.slice(0, 2000).trim(),
            email: formData.email.slice(0, 100).trim(),
            page: formData.page,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        try {
            // TODO: Replace with your actual backend endpoint
            // For MVP, you can use services like:
            // - FormSpree (https://formspree.io/)
            // - EmailJS (https://www.emailjs.com/)
            // - Web3Forms (https://web3forms.com/)
            // - Or your own ASP.NET endpoint

            const response = await fetch('YOUR_BACKEND_ENDPOINT_HERE', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sanitizedData)
            });

            if (response.ok) {
                setSubmitSuccess(true);
                setFormData({
                    feedbackType: 'bug',
                    title: '',
                    description: '',
                    email: '',
                    page: window.location.pathname
                });

                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const feedbackTypes = [
        { value: 'bug', label: 'Bug Report', icon: FaBug, color: 'text-red-600' },
        { value: 'visual', label: 'Visual/UI Improvement', icon: FaPalette, color: 'text-purple-600' },
        { value: 'feature', label: 'Feature Request', icon: FaLightbulb, color: 'text-yellow-600' },
        { value: 'other', label: 'General Feedback', icon: FaCommentAlt, color: 'text-blue-600' }
    ];

    return (
        <>
            <FeedbackBanner />
            <header>
                <Navbar />
            </header>

            <main className="min-h-screen bg-gradient-to-b from-[var(--mid-main-secondary)] to-[var(--main-color)] py-8 px-4 sm:px-6 md:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--secondary-color)] font-[Public_Sans] mb-4">
                            Share Your Feedback
                        </h1>
                        <p className="text-[var(--secondary-color)] opacity-80 font-[Inter] mb-8 text-sm sm:text-base">
                            Help us make Equathora better! Your feedback is valuable and helps us improve the platform for everyone.
                        </p>

                        {submitSuccess ? (
                            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
                                <div className="text-4xl mb-4">✅</div>
                                <h2 className="text-2xl font-bold text-green-700 mb-2">Thank You!</h2>
                                <p className="text-green-600">Your feedback has been submitted successfully. Redirecting to homepage...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Feedback Type Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--secondary-color)] mb-3 font-[Inter]">
                                        What type of feedback do you have?
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {feedbackTypes.map((type) => (
                                            <label
                                                key={type.value}
                                                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${formData.feedbackType === type.value
                                                        ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5'
                                                        : 'border-[var(--french-gray)] hover:border-[var(--mid-main-secondary)]'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="feedbackType"
                                                    value={type.value}
                                                    checked={formData.feedbackType === type.value}
                                                    onChange={handleChange}
                                                    className="hidden"
                                                />
                                                <type.icon className={`text-xl ${type.color}`} />
                                                <span className="font-medium text-[var(--secondary-color)] text-sm">{type.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-semibold text-[var(--secondary-color)] mb-2 font-[Inter]">
                                        Title <span className="text-[var(--accent-color)]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        maxLength={100}
                                        placeholder="Brief summary of your feedback"
                                        className="w-full px-4 py-3 border-2 border-[var(--french-gray)] rounded-lg focus:outline-none focus:border-[var(--accent-color)] transition-colors duration-200 font-[Inter]"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-semibold text-[var(--secondary-color)] mb-2 font-[Inter]">
                                        Description <span className="text-[var(--accent-color)]">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        maxLength={2000}
                                        rows={6}
                                        placeholder="Please provide detailed information about your feedback..."
                                        className="w-full px-4 py-3 border-2 border-[var(--french-gray)] rounded-lg focus:outline-none focus:border-[var(--accent-color)] transition-colors duration-200 font-[Inter] resize-none"
                                    />
                                    <div className="text-xs text-gray-500 mt-1 text-right">
                                        {formData.description.length}/2000 characters
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-[var(--secondary-color)] mb-2 font-[Inter]">
                                        Email (optional)
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        maxLength={100}
                                        placeholder="your.email@example.com"
                                        className="w-full px-4 py-3 border-2 border-[var(--french-gray)] rounded-lg focus:outline-none focus:border-[var(--accent-color)] transition-colors duration-200 font-[Inter]"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Provide your email if you'd like us to follow up with you.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="flex-1 px-6 py-3 border-2 border-[var(--french-gray)] rounded-lg font-semibold text-[var(--secondary-color)] bg-white hover:bg-[var(--french-gray)] transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 border-2 border-[var(--accent-color)] rounded-lg font-bold text-white bg-[var(--accent-color)] hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Information Box */}
                    <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                        <h3 className="font-bold text-blue-900 mb-2 font-[Public_Sans]">Privacy Notice</h3>
                        <p className="text-sm text-blue-800 font-[Inter]">
                            Your feedback is important to us. We collect this information solely to improve Equathora.
                            Your email address (if provided) will only be used to follow up on your feedback and will never be shared with third parties.
                        </p>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </>
    );
};

export default Feedback;
