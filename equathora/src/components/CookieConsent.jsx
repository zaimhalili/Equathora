import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserSettings, saveUserSettings } from '../lib/notificationService';
import { motion } from 'framer-motion';


const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [userSettings, setUserSettings] = useState(null);

    useEffect(() => {
        let cancelled = false;
        let bannerTimer = null;

        const loadConsent = async () => {
            try {
                const settings = await getUserSettings();
                if (cancelled) return;

                const storedConsent = settings?.cookie_consent || 'none';
                setUserSettings(settings);

                if (storedConsent === 'none') {
                    const legacyConsent = localStorage.getItem('equathora_cookie_consent');
                    const legacyDate = localStorage.getItem('equathora_cookie_consent_date') || '';

                    if (legacyConsent === 'accepted' || legacyConsent === 'declined') {
                        const migratedSettings = {
                            ...settings,
                            cookie_consent: legacyConsent,
                            cookie_consent_date: legacyDate || new Date().toISOString(),
                        };

                        const saved = await saveUserSettings(migratedSettings);
                        if (cancelled) return;

                        if (saved) {
                            setUserSettings(migratedSettings);
                            return;
                        }
                    }

                    bannerTimer = window.setTimeout(() => {
                        if (!cancelled) {
                            setShowBanner(true);
                        }
                    }, 1000);
                }
            } catch (error) {
                console.error('Error loading cookie consent:', error);
            }
        };

        void loadConsent();

        return () => {
            cancelled = true;
            if (bannerTimer) {
                window.clearTimeout(bannerTimer);
            }
        };
    }, []);

    const persistConsent = async (nextConsent) => {
        try {
            const nextSettings = {
                ...(userSettings || {}),
                cookie_consent: nextConsent,
                cookie_consent_date: new Date().toISOString(),
            };

            const saved = await saveUserSettings(nextSettings);
            if (!saved) {
                throw new Error('Unable to save cookie consent to the database.');
            }

            setUserSettings(nextSettings);
            setShowBanner(false);
        } catch (error) {
            console.error('Error saving cookie consent:', error);
        }
    };

    const handleAccept = () => {
        void persistConsent('accepted');
    };

    const handleDecline = () => {
        void persistConsent('declined');
        // Still set essential cookies (Supabase auth requires them)
        console.log('User declined optional cookies. Only essential cookies will be used.');
    };

    if (!showBanner) return null;

    return (
        <motion.div className="z-50 fixed bottom-5 right-5 "
            initial={{ opacity: 0, y: "100%"}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="cookie-consent-banner w-100 max-w-100 flex flex-col bg-[var(--white)] border-[var(--main-color)] border-2 rounded-2xl px-3 py-4 gap-6 shadow-xs overflow-hidden">
                <p className='text-md'>
                    We use optional cookies for analytics and advertising. Choose either purpose separately, or learn more in our{' '}
                    <Link to="/cookie-policy" className="!underline underline-offset-3">Cookie Policy.</Link>
                </p>
                <div className="w-full flex gap-3">
                    <button
                        onClick={handleDecline}
                        className="bg-[var(--main-color)] rounded-md flex-1 py-1 text-center text-[var(--secondary-color)]/70 hover:brightness-95 hover:text-[var(--secondary-color)] transition-all text-md font-medium"
                    >
                        Reject optional
                    </button>
                    <button
                        onClick={handleAccept}
                        className="bg-[var(--main-color)] rounded-md flex-1 py-1 text-center text-[var(--secondary-color)]/70 hover:brightness-95 hover:text-[var(--secondary-color)] transition-all text-md font-medium"
                    >
                        Allow all
                    </button>
                </div>
            </div>
        </motion.div >
    );
};

export default CookieConsent;
