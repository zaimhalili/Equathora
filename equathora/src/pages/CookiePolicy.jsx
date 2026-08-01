import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './legal.css';

const CookiePolicy = () => (
    <>
        <Navbar />
        <main className="legal-page">
            <div className="legal-content">
                <h1>Cookie Policy</h1>
                <p>Last updated: August 1, 2026</p>
                <h2>What Are Cookies?</h2>
                <p>Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, keep you signed in, and improve your experience.</p>
                <h2>How We Use Cookies</h2>
                <p>We use cookies and similar technologies for the following purposes:</p>
                <h2>1. Essential Cookies</h2>
                <ul>
                    <li>Authentication and session management for logging in securely.</li>
                    <li>Security and fraud prevention across the platform.</li>
                    <li>Maintaining subscription and payment session state.</li>
                </ul>
                <p>Equathora uses Supabase for authentication and session management, which may store essential cookies for account access and session persistence.</p>
                <h2>2. Analytics Cookies</h2>
                <ul>
                    <li>Measure page visits, feature usage, and performance.</li>
                    <li>Help us identify technical issues and improve the service.</li>
                    <li>Support usage analytics for our website and product experience.</li>
                </ul>
                <h2>3. Preference Cookies</h2>
                <ul>
                    <li>Store your cookie consent preference.</li>
                    <li>Remember UI settings such as dark mode or layout preferences.</li>
                    <li>Preserve in-browser progress and workspace selections where cookies or local storage are used.</li>
                </ul>
                <h2>Cookies We Use</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Cookie Name</th>
                            <th>Purpose</th>
                            <th>Type</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>sb-access-token</td>
                            <td>Supabase authentication and session management</td>
                            <td>Essential</td>
                            <td>1 hour</td>
                        </tr>
                        <tr>
                            <td>sb-refresh-token</td>
                            <td>Supabase session refresh</td>
                            <td>Essential</td>
                            <td>30 days</td>
                        </tr>
                        <tr>
                            <td>equathora_cookie_consent</td>
                            <td>Stores your cookie preference</td>
                            <td>Preference</td>
                            <td>1 year</td>
                        </tr>
                        <tr>
                            <td>stripe_* or billing portal cookies</td>
                            <td>Secure payment session handling for Premium billing</td>
                            <td>Essential</td>
                            <td>Varies by provider</td>
                        </tr>
                    </tbody>
                </table>
                <h2>Third-Party Services</h2>
                <ul>
                    <li>Supabase - Authentication and database services (<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>).</li>
                    <li>Stripe - Payment processing and subscription billing (<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>).</li>
                    <li>Google OAuth - Sign in with Google (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>).</li>
                    <li>Vercel Analytics - Website analytics (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>).</li>
                </ul>
                <h2>Additional Tracking and Storage</h2>
                <p>We may also use browser storage such as localStorage or sessionStorage to store application settings, progress, or temporary workspace data. This is separate from cookie-based tracking.</p>
                <h2>Managing Cookies</h2>
                <p>You can control cookies through your browser settings or clear them at any time. Blocking essential cookies may prevent you from using Equathora or accessing your account.</p>
                <h2>Contact Us</h2>
                <p>Questions about cookies? Contact us at <strong>equathora@gmail.com</strong> or <Link to="/feedback">submit feedback</Link>.</p>
            </div>
        </main>
        <Footer />
    </>
);

export default CookiePolicy;
