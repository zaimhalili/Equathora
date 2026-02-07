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
        commonIssue: '',
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
            commonIssue: formData.commonIssue,
            title: formData.title.slice(0, 100).trim(),
            description: formData.description.slice(0, 2000).trim(),
            email: formData.email.slice(0, 100).trim(),
            page: formData.page,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`
        };

        try {
            // Send feedback to FormSubmit.co using AJAX endpoint with hash
            const response = await fetch('https://formsubmit.co/ajax/14558baaab9f5a1e34822be7e3151850', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `[Equathora Feedback] ${sanitizedData.feedbackType}: ${sanitizedData.title}`,
                    _captcha: 'false',
                    _template: 'table',
                    'Feedback Type': sanitizedData.feedbackType,
                    'Common Issue': sanitizedData.commonIssue || 'None specified',
                    'Title': sanitizedData.title,
                    'Description': sanitizedData.description,
                    'User Email': sanitizedData.email || 'Not provided',
                    'Page': sanitizedData.page,
                    'Timestamp': sanitizedData.timestamp,
                    'Browser': sanitizedData.userAgent,
                    'Screen Resolution': sanitizedData.screenResolution
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            // Also store in localStorage as backup
            const existingFeedback = JSON.parse(localStorage.getItem('equathoraFeedback') || '[]');
            existingFeedback.push(sanitizedData);
            localStorage.setItem('equathoraFeedback', JSON.stringify(existingFeedback));

            // Log to console for development
            console.log('✅ Feedback sent successfully!');
            console.log('📝 Feedback Data:', sanitizedData);

            setSubmitSuccess(true);
            setFormData({
                feedbackType: 'bug',
                commonIssue: '',
                title: '',
                description: '',
                email: '',
                page: window.location.pathname
            });

            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please check your Sansationnet connection and try again.');
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

    const commonIssues = {
        bug: [
            'Page not loading correctly',
            'Button/Link not working',
            'Math input not functioning',
            'Performance/Speed issue',
            'Mobile compatibility problem'
        ],
        visual: [
            'Text hard to read',
            'Colors not matching',
            'Layout broken on mobile',
            'Icons not displaying',
            'Spacing/Alignment issue'
        ],
        feature: [
            'Better problem filtering',
            'More hint options',
            'Keyboard shortcuts',
            'Export/Print functionality'
        ],
        other: [
            'Content suggestion',
            'Documentation improvement',
            'Accessibility concern',
            'Other'
        ]
    };

    return (
        <>
            <FeedbackBanner />
            <header>
                <Navbar />
            </header>

            <main className="min-h-screen bg-gradient-to-b from-[var(--mid-main-secondary)] to-[var(--main-color)] py-8 px-4 sm:px-6 md:px-8 w-full flex justify-center">
                <div className="max-w-3xl">
                    <div className="bg-white rounded-md shadow-xl p-6 sm:p-8 md:p-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--secondary-color)] font-[Sansation] pb-4">
                            Share Your Feedback
                        </h1>
                        <p className="text-[var(--secondary-color)] opacity-80 font-[Sansation] pb-4 text-sm sm:text-base">
                            Help us make Equathora better! Your feedback is valuable and helps us improve the platform for everyone.
                        </p>

                        {submitSuccess ? (
                            <div className="bg-green-50 border-2 border-green-500 rounded-md p-6 text-center">
                                <div className="text-4xl pb-4">✅</div>
                                <h2 className="text-2xl font-bold text-green-700 pb-2">Thank You!</h2>
                                <p className="text-green-600">Your feedback has been submitted successfully. Redirecting to homepage...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Feedback Type Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--secondary-color)] pb-3 font-[Sansation]">
                                        What type of feedback do you have? <span className="text-[var(--accent-color)]">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {feedbackTypes.map((type) => (
                                            <label
                                                key={type.value}
                                                className={`flex items-center gap-3 p-4 border-2 rounded-md cursor-pointer transition-all duration-200 ${formData.feedbackType === type.value
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

                                {/* Common Issues Radio Buttons */}
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--secondary-color)] pt-4 pb-3 font-[Sansation]">
                                        Common issues (optional)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {commonIssues[formData.feedbackType].map((issue) => (
                                            <label
                                                key={issue}
                                                className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer transition-all duration-150 text-sm ${formData.commonIssue === issue
                                                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--secondary-color)] font-medium'
                                                    : 'border-[var(--french-gray)] hover:border-[var(--mid-main-secondary)] text-[var(--secondary-color)]'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="commonIssue"
                                                    value={issue}
                                                    checked={formData.commonIssue === issue}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-[var(--accent-color)] border-[var(--french-gray)] focus:ring-[var(--accent-color)]"
                                                />
                                                <span className="font-[Sansation]">{issue}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="pt-4 block text-sm font-semibold text-[var(--secondary-color)] pb-2 font-[Sansation]">
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
                                        className="w-full px-4 py-3 border-2 border-[var(--french-gray)] rounded-md focus:outline-none focus:border-[var(--accent-color)] transition-colors duration-200 font-[Sansation] text-black"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-semibold text-[var(--secondary-color)] pt-4 pb-2 font-[Sansation]">
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
                                        className="w-full px-4 py-3 border-2 border-[var(--french-gray)] rounded-md focus:outline-none focus:border-[var(--accent-color)] transition-colors duration-200 font-[Sansation] resize-none text-black"
                                    />
                                    <div className="text-xs text-gray-500 pt-1 text-right">
                                        {formData.description.length}/2000 characters
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-[var(--secondary-color)] pb-2 font-[Sansation]">
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
                                        className="w-full px-4 py-3 border-2 text-black border-[var(--french-gray)] rounded-md focus:outline-none focus:border-[var(--accent-color)] transition-colors duration-200 font-[Sansation]"
                                    />
                                    <p className="text-xs text-gray-500 pt-1">
                                        Provide your email if you'd like us to follow up with you.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 border-2 border-[var(--accent-color)] rounded-md font-bold text-white bg-[var(--accent-color)] hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Information Boxes */}
                    <div className="pt-6 flex flex-col gap-5">
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-md p-4">
                            <h3 className="font-bold text-blue-900 pb-2 font-[Sansation]">Privacy Notice</h3>
                            <p className="text-sm text-blue-800 font-[Sansation]">
                                Your feedback is important to us. We collect this information solely to improve Equathora.
                                Your email address (if provided) will only be used to follow up on your feedback and will never be shared with third parties.
                            </p>
                        </div>

                        <div className="bg-green-50 border-l-4 border-green-500 rounded-md p-4">
                            <h3 className="font-bold text-green-900 mb-2 font-[Sansation]">📧 Instant Delivery</h3>
                            <p className="text-sm text-green-800 font-[Sansation]">
                                Your feedback will be sent directly to our team via email. We read every submission and typically respond within 24-48 hours.
                                Thank you for helping us improve Equathora!
                            </p>
                        </div>
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
