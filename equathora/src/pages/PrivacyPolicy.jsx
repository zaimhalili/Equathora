import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './legal.css';

const PrivacyPolicy = () => (
    <>
        <Navbar />
        <main className="legal-page">
            <div className="legal-content">
                <h1>Privacy Policy</h1>
                <p>Last updated: December 30, 2025</p>
                <p>
                    This Privacy Policy explains how Equathora collects, uses, and protects your information when you use our platform.
                </p>
                <h2>Information We Collect</h2>
                <ul>
                    <li>Email address, username, and password for account creation</li>
                    <li>Profile information you provide</li>
                    <li>Usage data and analytics</li>
                    <li>Any content you submit (e.g., posts, feedback, solutions)</li>
                </ul>
                <h2>How We Use Your Information</h2>
                <ul>
                    <li>To provide and improve our services</li>
                    <li>To communicate with you about your account or updates</li>
                    <li>To ensure platform security and integrity</li>
                    <li>To comply with legal obligations</li>
                </ul>
                <h2>How We Share Your Information</h2>
                <ul>
                    <li>We do not sell your personal information</li>
                    <li>We may share data with service providers for platform operation</li>
                    <li>We may disclose information if required by law</li>
                </ul>
                <h2>Your Rights</h2>
                <ul>
                    <li>You can access and update your account information at any time.</li>
                    <li>You may request a copy of the personal data we hold about you.</li>
                    <li>You may request the correction or deletion of your personal data.</li>
                    <li>You may request the permanent deletion of your Equathora account and associated data by contacting <strong>equathora@gmail.com</strong>.</li>
                    <li>Where applicable, you may withdraw consent for optional communications at any time.</li>
                </ul>
                <h2>Contact</h2>
                <p>
                    If you have any questions about this Privacy Policy, or would like to
                    access, correct, or delete your personal data or request the deletion of
                    your Equathora account, please contact us at <strong>equathora@gmail.com</strong>.
                </p>
            </div>
        </main>
        <Footer />
    </>
);

export default PrivacyPolicy;
