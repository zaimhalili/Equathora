import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already given consent
        const consent = localStorage.getItem('equathora_cookie_consent');
        if (!consent) {
            // Show banner after 1 second delay for better UX
            setTimeout(() => setShowBanner(true), 1000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('equathora_cookie_consent', 'accepted');
        localStorage.setItem('equathora_cookie_consent_date', new Date().toISOString());
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem('equathora_cookie_consent', 'declined');
        localStorage.setItem('equathora_cookie_consent_date', new Date().toISOString());
        setShowBanner(false);
        // Still set essential cookies (Supabase auth requires them)
        console.log('User declined optional cookies. Only essential cookies will be used.');
    };

    if (!showBanner) return null;

    return (
        <div className="cookie-consent-overlay">
            <div className="cookie-consent-banner">
                <div className="cookie-consent-content">
                    <div className="cookie-consent-icon">
                        🍪
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
