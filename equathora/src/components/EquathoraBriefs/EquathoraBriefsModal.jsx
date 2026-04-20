import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaTimes, FaUser } from 'react-icons/fa';
import EquathoraBriefsSuccessModal from './EquathoraBriefsSuccessModal.jsx';
import news_bro from '../../assets/images/News-bro.svg';


const FRIENDLY_SAVE_ERROR = 'Something did not work. Please try again shortly.';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;

const EquathoraBriefsModal = ({ onClose, isOpen, onSave, userData }) => {
    useBodyScrollLock(isOpen);

    const [formData, setFormData] = useState({
        full_name: userData?.name || '',
        email: userData?.email || ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [saveError, setSaveError] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        setFormData({
            full_name: userData?.name || '',
            email: userData?.email || ''
        });
        setErrors({});
        setSaveError('');
        setIsSubscribed(false);
    }, [isOpen, userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear the field-level error as the user types
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        const trimmedName = formData.full_name.trim();
        const trimmedEmail = formData.email.trim();

        if (!trimmedName) {
            newErrors.full_name = 'Full name is required.';
        } else if (trimmedName.length < MIN_NAME_LENGTH) {
            newErrors.full_name = 'Please enter your full name.';
        }

        if (!trimmedEmail) {
            newErrors.email = 'Email address is required.';
        } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveError('');

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            await Promise.resolve(
                onSave?.({
                    full_name: formData.full_name.trim(),
                    email: formData.email.trim().toLowerCase()
                })
            );
            setIsSubscribed(true);
        } catch {
            setSaveError(FRIENDLY_SAVE_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Fix #1 & #2: AnimatePresence wraps everything; no early return before it.
        // The `isOpen` flag controls whether the modal content mounts/unmounts,
        // allowing exit animations to actually fire.
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        key="briefs-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[var(--raisin-black)]/50 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        key="briefs-modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-[var(--white)] rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[var(--french-gray)]"
                    >
                        {isSubscribed ? (
                            <div className={` `}>
                                <EquathoraBriefsSuccessModal onClose={onClose} />
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Close Button at top right */}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-[var(--mid-main-secondary)] hover:text-[var(--secondary-color)] transition-colors p-1.5 rounded-full cursor-pointer active:scale-95 z-50"
                                    aria-label="Close modal"
                                >
                                    <FaTimes size={16} />
                                </button>

                                {/* Main Form - Two Column Grid */}
                                <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 items-center p-5">

                                    {/* Left Column - Illustration */}
                                    <div className="hidden md:flex flex-col items-center justify-end bg-[var(--white)] pr-6">
                                        <img
                                            src={news_bro}
                                            alt="Reading illustration"
                                            className="w-auto object-contain"
                                        />
                                    </div>

                                    {/* Right Column - Text and Form */}
                                    <div className="flex flex-col ">

                                        <h2 className="font-[Sansation] uppercase tracking-wider mb-2">
                                            <span className="block text-xl font-bold text-[var(--secondary-color)]">Join</span>
                                            <span className="block text-4xl font-extrabold !text-[var(--accent-color)] leading-tight">Equathora Briefs</span>
                                        </h2>

                                        {/* Sub-text */}
                                        <p className="text-sm text-[var(--mid-main-secondary)] pb-5 max-w-sm">
                                            Get product updates, new challenge drops, and launch announcements. No spam.
                                        </p>

                                        {/* Error Banner */}
                                        {saveError && (
                                            <div className="bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 text-[var(--dark-accent-color)] px-4 py-3 rounded-md text-sm mb-6">
                                                {saveError}
                                            </div>
                                        )}

                                        {/* Form Fields */}
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                className={`text-sm text-[var(--secondary-color)] w-full px-5 py-3.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 focus:border-[var(--accent-color)] transition-all ${errors.full_name
                                                        ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5'
                                                        : 'border-[var(--french-gray)] bg-[var(--white)] placeholder:text-[var(--mid-main-secondary)]'
                                                    }`}
                                                placeholder="Enter your full name *"
                                                aria-invalid={!!errors.full_name}
                                                aria-describedby={errors.full_name ? 'full-name-error' : undefined}
                                            />
                                            {errors.full_name && (
                                                <p id="full-name-error" className="mt-1.5 text-xs text-[var(--dark-accent-color)] pl-1">
                                                    {errors.full_name}
                                                </p>
                                            )}

                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`text-sm text-[var(--secondary-color)] w-full px-5 py-3.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 focus:border-[var(--accent-color)] transition-all ${errors.email
                                                        ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5'
                                                        : 'border-[var(--french-gray)] bg-[var(--white)] placeholder:text-[var(--mid-main-secondary)]'
                                                    }`}
                                                placeholder="Enter your email address *"
                                                aria-invalid={!!errors.email}
                                                aria-describedby={errors.email ? 'email-error' : undefined}
                                            />
                                            {errors.email && (
                                                <p id="email-error" className="mt-1.5 text-xs text-[var(--dark-accent-color)] pl-1">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>


                                        {/* CTA Buttons */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                disabled={isLoading}
                                                className="flex-1 px-6 py-3 border border-[var(--french-gray)] text-[var(--secondary-color)] font-semibold rounded-md hover:bg-[rgba(0,0,0,0.15)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex-1 px-6 py-3 !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-[var(--white)] font-semibold rounded-md hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                                            >
                                                {isLoading ? 'Saving...' : 'Subscribe'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EquathoraBriefsModal;