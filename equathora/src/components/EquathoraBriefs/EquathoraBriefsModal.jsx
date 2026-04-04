import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaTimes, FaUser } from 'react-icons/fa';
import TransparentFullLogo from '@/assets/logo/TransparentFullLogo.png';
import EquathoraBriefsSuccessModal from './EquathoraBriefsSuccessModal.jsx';

const EquathoraBriefsModal = ({ onClose, isOpen, onSave, userData }) => {
    useBodyScrollLock(isOpen);

    const [formData, setFormData] = useState({
        full_name: userData?.name || '',
        email: userData?.email || ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        setFormData({
            full_name: userData?.name || '',
            email: userData?.email || ''
        });
        setError('');
        setIsSubscribed(false);
    }, [isOpen, userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await Promise.resolve(onSave?.(formData));
            setIsSubscribed(true);
        } catch (saveError) {
            setError(saveError?.message || 'Could not save your signup. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-md shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {isSubscribed ? (
                        <EquathoraBriefsSuccessModal onClose={onClose} />
                    ) : (
                        <>
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                                <h2 className="text-2xl font-bold text-[var(--secondary-color)] font-[Sansation]">Join Equathora Briefs</h2>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-md cursor-pointer active:scale-95"
                                    aria-label="Close modal"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="flex justify-center">
                                    <img src={TransparentFullLogo} alt="Equathora" className="h-14 w-auto" />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                        {error}
                                    </div>
                                )}

                                <p className="text-sm text-gray-600">
                                    Get product updates, new challenge drops, and launch announcements. No spam.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="flex text-sm font-semibold text-[var(--secondary-color)] pb-2 items-end">
                                            <FaUser className="h-5 w-5 pr-2" />
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                            required
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex text-sm font-semibold text-[var(--secondary-color)] pb-2 items-end">
                                            <FaEnvelope className="h-5 w-5 pr-2" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-[rgba(0,0,0,0.15)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
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
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EquathoraBriefsModal;