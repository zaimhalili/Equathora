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
                <p>Last updated: January 5, 2026</p>
                <h2>What Are Cookies?</h2>
                <p>Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and keeping you signed in.</p>
                <h2>How We Use Cookies</h2>
                <p>We use cookies for the following purposes:</p>
                <h2>1. Essential Cookies</h2>
                <ul>
                    <li>Authentication: Keeping you signed in to your account</li>
                    <li>Security: Protecting your account from unauthorized access</li>
                    <li>Session Management: Maintaining your session across pages</li>
                </ul>
                <p>We use Supabase for authentication, which stores session tokens in cookies. These cookies are essential and cannot be disabled.</p>
                <h2>2. Analytics Cookies</h2>
                <ul>
                    <li>Track page visits and user Interactions</li>
                    <li>Measure website performance and loading times</li>
                    <li>Identify areas for improvement</li>
                </ul>
                <h2>3. Preference Cookies</h2>
                <ul>
                    <li>Your problem-solving progress (localStorage)</li>
                    <li>UI preferences and display settings</li>
                    <li>Your cookie consent choice</li>
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
                            <td>Supabase authentication session</td>
                            <td>Essential</td>
                            <td>1 hour</td>
                        </tr>
                        <tr>
                            <td>sb-refresh-token</td>
                            <td>Refresh authentication session</td>
                            <td>Essential</td>
                            <td>30 days</td>
                        </tr>
                        <tr>
                            <td>equathora_cookie_consent</td>
                            <td>Remember your cookie preference</td>
                            <td>Preference</td>
                            <td>1 year</td>
                        </tr>
                    </tbody>
                </table>
                <h2>Third-Party Services</h2>
                <ul>
                    <li>Supabase - Authentication and database (<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
                    <li>Vercel Analytics - Website analytics (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
                    <li>Google OAuth - Sign in with Google (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
                </ul>
                <h2>Managing Cookies</h2>
                <p>You can control cookies through your browser settings. Note that blocking essential cookies will prevent you from using Equathora.</p>
                <h2>Contact Us</h2>
                <p>Questions about cookies? Contact us at support@equathora.com or <Link to="/feedback">submit feedback</Link>.</p>
            </div>
        </main>
        <Footer />
    </>
);

export default CookiePolicy;
