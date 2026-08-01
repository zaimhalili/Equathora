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
                <p>Last updated: August 1, 2026</p>
                <p>
                    This Privacy Policy explains how Equathora collects, uses, and protects your information when you use our platform.
                </p>
                <h2>Information We Collect</h2>
                <ul>
                    <li>Account information such as email address, username, and profile details.</li>
                    <li>Authentication and session data managed by Supabase.</li>
                    <li>Usage data including page visits, feature usage, and analytics.</li>
                    <li>Subscription and billing metadata for Premium access.</li>
                    <li>Content you submit such as problem steps, solutions, feedback, and chat messages.</li>
                    <li>AI interaction data used to deliver Sigma AI assistance and improve service quality.</li>
                </ul>
                <h2>How We Use Your Information</h2>
                <ul>
                    <li>To operate and improve Equathora, including providing AI guidance, practice tools, and analytics dashboards.</li>
                    <li>To manage your account, authentication, and subscription status.</li>
                    <li>To communicate important updates, notifications, and support messages.</li>
                    <li>To protect the platform from abuse, fraud, or other security issues.</li>
                    <li>To comply with applicable laws and respond to legal requests.</li>
                </ul>
                <h2>How We Share Your Information</h2>
                <ul>
                    <li>We do not sell your personal information.</li>
                    <li>We may share data with service providers who support the platform, such as Supabase, Stripe, Vercel, and AI service providers.</li>
                    <li>We may share information with payment processors for billing and subscription management.</li>
                    <li>We may disclose information if required by law or to protect our rights and safety.</li>
                </ul>
                <h2>Third-Party Services</h2>
                <ul>
                    <li>Supabase provides authentication, user management, and database hosting.</li>
                    <li>Stripe powers payment processing and billing, but Equathora does not store your full payment card details.</li>
                    <li>Google OAuth enables sign-in with Google accounts.</li>
                    <li>Sigma AI and related AI services may process user-provided prompts, math steps, and chat data on our behalf.</li>
                </ul>
                <h2>Your Rights</h2>
                <ul>
                    <li>You can access and update your account information at any time.</li>
                    <li>You may request a copy of the personal data we hold about you.</li>
                    <li>You may request correction or deletion of your personal data.</li>
                    <li>You may request deletion of your Equathora account by contacting <strong>equathora@gmail.com</strong>.</li>
                    <li>Where applicable, you may withdraw consent for optional communications.
                    </li>
                </ul>
                <h2>Data Retention</h2>
                <p>We retain your information as needed to provide services, comply with legal obligations, and improve the platform.</p>
                <h2>Contact</h2>
                <p>
                    If you have questions about this Privacy Policy or wish to exercise your privacy rights, contact us at <strong>equathora@gmail.com</strong>.
                </p>
            </div>
        </main>
        <Footer />
    </>
);

export default PrivacyPolicy;
