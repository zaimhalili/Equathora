import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './legal.css';

const TermsOfService = () => (
    <>
        <Navbar />
        <main className="legal-page">
            <div className="legal-content">
                <h1>Terms of Service</h1>
                <p>Last updated: August 1, 2026</p>
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing or using Equathora, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the platform.</p>
                <h2>2. User Accounts</h2>
                <ul>
                    <li>You must provide accurate and complete information when creating an account.</li>
                    <li>You are responsible for maintaining the confidentiality of your login credentials and any activity that occurs under your account.</li>
                    <li>You must notify us immediately if you suspect your account has been compromised.</li>
                </ul>
                <h2>3. Service Features and Premium Access</h2>
                <ul>
                    <li>Equathora offers free and premium subscription features, including Sigma AI guidance, step-by-step problem solving, advanced analytics, and priority support.</li>
                    <li>Premium features are subject to payment and may be provided through a third-party billing provider such as Stripe. We do not store your payment card details.</li>
                    <li>Subscription access continues until canceled in accordance with the billing terms of our payment provider and your account settings.</li>
                </ul>
                <h2>4. AI Assistance and Content</h2>
                <ul>
                    <li>Equathora may provide AI-powered assistance through its Sigma AI feature, which analyzes user input, math steps, and problem descriptions to offer guidance.</li>
                    <li>AI responses are for educational purposes only and do not constitute professional advice.</li>
                    <li>We do not guarantee the accuracy or completeness of AI-generated responses, and you remain responsible for verifying any results.</li>
                </ul>
                <h2>5. Acceptable Use</h2>
                <ul>
                    <li>Do not use Equathora for unlawful, abusive, or harmful activities.</li>
                    <li>Do not attempt to interfere with the platform, bypass security controls, or access other users' accounts or data.</li>
                    <li>Respect community norms and do not submit offensive, harassing, or inappropriate content.</li>
                </ul>
                <h2>6. Third-Party Services</h2>
                <ul>
                    <li>Equathora relies on third-party services including Supabase for authentication and data storage, Stripe for billing, Google OAuth for login, and AI service providers for Sigma AI functionality.</li>
                    <li>These services are governed by their own privacy policies and terms of use.</li>
                </ul>
                <h2>7. Intellectual Property</h2>
                <ul>
                    <li>All Equathora content, design, code, and branding is owned by us or our licensors.</li>
                    <li>Users may not copy, reproduce, distribute, or create derivative works from Equathora content without permission.</li>
                </ul>
                <h2>8. Termination</h2>
                <ul>
                    <li>We may suspend or terminate your access for violations of these terms, abuse of the service, or if required by law.</li>
                    <li>We may also remove any content that violates our policies.</li>
                </ul>
                <h2>9. Disclaimers and Limitation of Liability</h2>
                <p>Equathora is provided "as is" without warranties of any kind. We are not liable for indirect, incidental, or consequential damages arising from your use of the platform.</p>
                <h2>10. Changes to Terms</h2>
                <p>We may update these Terms of Service at any time. Continued use of Equathora after changes means you accept the revised terms.</p>
                <h2>11. Contact</h2>
                <p>If you have questions about these terms, contact us at <strong>equathora@gmail.com</strong>.</p>
            </div>
        </main>
        <Footer />
    </>
);

export default TermsOfService;
