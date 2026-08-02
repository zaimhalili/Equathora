import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import EquathoraBriefsSuccessModal from './EquathoraBriefsSuccessModal.jsx';
import news_bro from '../../assets/images/News-cuate.svg';
import { supabase } from '@/lib/supabaseClient.js';

const FRIENDLY_SAVE_ERROR = 'Something did not work. Please try again shortly.';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;

const INPUT_BASE_CLASSES =
    'text-sm text-[var(--secondary-color)] w-full px-5 py-3.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 focus:border-[var(--accent-color)] transition-all bg-[var(--main-color)]';

const INPUT_ERROR_CLASSES = 'border-[var(--accent-color)] bg-[var(--accent-color)]/5';
const INPUT_NORMAL_CLASSES =
    'border-[var(--mid-main-secondary)] bg-[var(--white)] placeholder:text-[var(--mid-main-secondary)]';

function validateForm({ name, email, hasSession }) {
    const errors = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
        errors.name = 'Full name is required.';
    } else if (trimmedName.length < MIN_NAME_LENGTH) {
        errors.name = 'Please enter your name.';
    }

    if (!hasSession) {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            errors.email = 'Email address is required.';
        } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            errors.email = 'Please enter a valid email address.';
        }
    }

    return errors;
}

const EquathoraBriefsModal = ({ onClose, isOpen, onSave, userData }) => {
    useBodyScrollLock(isOpen);

    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [saveError, setSaveError] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    useEffect(() => {
        let isMounted = true;

        supabase.auth.getSession().then(({ data }) => {
            if (isMounted) setSession(data.session);
        });

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (isMounted) setSession(newSession);
        });

        return () => {
            isMounted = false;
            subscription?.subscription?.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        setFormData({
            name: userData?.name || '',
            email: session?.user?.email || userData?.email || ''
        });
        setErrors({});
        setSaveError('');
        setIsSubscribed(false);
    }, [isOpen, session, userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveError('');

        const validationErrors = validateForm({
            name: formData.name,
            email: formData.email,
            hasSession: !!session
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            await Promise.resolve(
                onSave({
                    name: formData.name.trim(),
                    email: session
                        ? session.user.email.toLowerCase()
                        : formData.email.trim().toLowerCase(),
                    user_id: session?.user?.id ?? null
                })
            );
            setIsSubscribed(true);
        } catch (err) {
            console.error('Subscription modal error:', err);
            setSaveError(FRIENDLY_SAVE_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                        className="relative bg-[var(--white)] rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[var(--mid-main-secondary)]"
                    >
                        {isSubscribed ? (
                            <div>
                                <EquathoraBriefsSuccessModal onClose={onClose} />
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Close Button */}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-[var(--mid-main-secondary)] hover:text-[var(--secondary-color)] transition-colors p-1.5 rounded-full cursor-pointer active:scale-95 z-50"
                                    aria-label="Close modal"
                                >
                                    <FaTimes size={16} />
                                </button>

                                {/* Main Form */}
                                <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 items-center p-5">
                                    {/* Left Column - Illustration */}
                                    <div className="hidden md:flex flex-col items-center justify-end bg-[var(--white)] pr-6">
                                        <img
                                            src={news_bro}
                                            alt="Reading illustration"
                                            className="w-auto object-contain"
                                        />
                                    </div>

                                    {/* Right Column - Form */}
                                    <div className="flex flex-col">
                                        <h2 className="font-[Sansation] uppercase tracking-wider pb-2">
                                            <span className="block text-xl font-bold text-[var(--secondary-color)]">Join</span>
                                            <span className="block text-4xl font-extrabold !text-[var(--accent-color)] leading-tight">Equathora Briefs</span>
                                        </h2>

                                        <p className="text-sm text-[var(--mid-main-secondary)] pb-3 max-w-sm">
                                            Get product updates, new challenge drops, and launch announcements. No spam.
                                        </p>

                                        {saveError && (
                                            <div className="bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 text-[var(--dark-accent-color)] px-4 py-3 rounded-md text-sm">
                                                {saveError}
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-2 pt-6">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`${INPUT_BASE_CLASSES} ${errors.name ? INPUT_ERROR_CLASSES : INPUT_NORMAL_CLASSES}`}
                                                placeholder="Enter your full name *"
                                                aria-invalid={!!errors.name}
                                                aria-describedby={errors.name ? 'name-error' : undefined}
                                            />
                                            {errors.name && (
                                                <p id="name-error" className="pt-1.5 text-xs text-[var(--dark-accent-color)] pl-1">
                                                    {errors.name}
                                                </p>
                                            )}

                                            {session ? (
                                                <>
                                                    <p className="text-xs text-[var(--mid-main-secondary)] pl-1 pt-1">
                                                        This is the email you'll use to subscribe
                                                    </p>
                                                    <div className={`${INPUT_BASE_CLASSES} border-[var(--mid-main-secondary)] bg-[var(--main-color)] cursor-default`}>
                                                        {session.user.email}
                                                    </div>
                                                </>
                                            ) : (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={`${INPUT_BASE_CLASSES} ${errors.email ? INPUT_ERROR_CLASSES : INPUT_NORMAL_CLASSES}`}
                                                    placeholder="Enter your email *"
                                                    aria-invalid={!!errors.email}
                                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                                />
                                            )}
                                            {errors.email && (
                                                <p id="email-error" className="pt-1.5 text-xs text-[var(--dark-accent-color)] pl-1">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-3 pt-5">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                disabled={isLoading}
                                                className="flex-1 px-6 py-3 border border-[var(--mid-main-secondary)] text-[var(--secondary-color)] font-semibold rounded-md hover:bg-[rgba(0,0,0,0.15)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex-1 px-6 py-3 !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-white font-semibold rounded-md hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-95"
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