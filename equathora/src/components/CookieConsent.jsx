import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import { getUserSettings, saveUserSettings } from '../lib/notificationService';
import './CookieConsent.css';

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
        <div className="cookie-consent-overlay">
            <div className="cookie-consent-banner">
                <div className="cookie-consent-content">
                    <div className="cookie-consent-icon">
                        <FaShieldAlt />
                    </div>
                    <div className="cookie-consent-text">
                        <h3>We use cookies</h3>
                        <p>
                            We use essential cookies to keep you signed in and provide core functionality.
                            By clicking "Accept All", you agree to our use of cookies for analytics and personalization.{' '}
                            <Link to="/cookie-policy" className="cookie-policy-link">Learn more</Link>
                        </p>
                    </div>
                </div>
                <div className="cookie-consent-buttons">
                    <button
                        onClick={handleDecline}
                        className="cookie-btn cookie-btn-decline"
                    >
                        Essential Only
                    </button>
                    <button
                        onClick={handleAccept}
                        className="cookie-btn cookie-btn-accept"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
