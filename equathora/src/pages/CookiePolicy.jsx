import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../pages/legal.css';

const CookiePolicy = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-[var(--main-color)]">
                <div className="legal-container">
                    <div className="legal-header">
                        <h1>Cookie Policy</h1>
                        <p className="legal-updated">Last Updated: January 5, 2026</p>
                    </div>

                    <div className="legal-content">
                        <section className="legal-section">
                            <h2>What Are Cookies?</h2>
                            <p>
                                Cookies are small text files that are stored on your device when you visit our website.
                                They help us provide you with a better experience by remembering your preferences and
                                keeping you signed in.
                            </p>
                        </section>

                        <section className="legal-section">
                            <h2>How We Use Cookies</h2>
                            <p>We use cookies for the following purposes:</p>

                            <h3>1. Essential Cookies (Required)</h3>
                            <p>
                                These cookies are necessary for the website to function properly. They enable core
                                functionality such as:
                            </p>
                            <ul>
                                <li><strong>Authentication:</strong> Keeping you signed in to your account</li>
                                <li><strong>Security:</strong> Protecting your account from unauthorized access</li>
                                <li><strong>Session Management:</strong> Maintaining your session across pages</li>
                            </ul>
                            <p>
                                We use <strong>Supabase</strong> for authentication, which stores session tokens in cookies.
                                These cookies are essential and cannot be disabled if you want to use Equathora.
                            </p>

                            <h3>2. Analytics Cookies (Optional)</h3>
                            <p>
                                We use <strong>Vercel Analytics</strong> and <strong>Vercel Speed Insights</strong> to
                                understand how our website is used and improve performance. These cookies help us:
                            </p>
                            <ul>
                                <li>Track page views and navigation patterns</li>
                                <li>Measure website performance and speed</li>
                                <li>Identify and fix technical issues</li>
                                <li>Understand which features are most popular</li>
                            </ul>
                            <p>
                                These cookies do not collect personally identifiable information and are only used for
                                aggregated statistics.
                            </p>

                            <h3>3. Preference Cookies (Optional)</h3>
                            <p>
                                These cookies remember your preferences and settings, such as:
                            </p>
                            <ul>
                                <li>Your problem-solving progress (localStorage)</li>
                                <li>UI preferences and display settings</li>
                                <li>Your cookie consent choice</li>
                            </ul>
                        </section>

                        <section className="legal-section">
                            <h2>Cookies We Use</h2>
                            <div className="cookie-table">
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
                                            <td><code>sb-access-token</code></td>
                                            <td>Supabase authentication session</td>
                                            <td>Essential</td>
                                            <td>1 hour</td>
                                        </tr>
                                        <tr>
                                            <td><code>sb-refresh-token</code></td>
                                            <td>Refresh authentication session</td>
                                            <td>Essential</td>
                                            <td>30 days</td>
                                        </tr>
                                        <tr>
                                            <td><code>equathora_cookie_consent</code></td>
                                            <td>Remember your cookie preference</td>
                                            <td>Preference</td>
                                            <td>1 year</td>
                                        </tr>
                                        <tr>
                                            <td><code>localStorage items</code></td>
                                            <td>Store your progress and preferences</td>
                                            <td>Preference</td>
                                            <td>No expiration</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="legal-section">
                            <h2>Third-Party Services</h2>
                            <p>
                                We use the following third-party services that may set their own cookies:
                            </p>
                            <ul>
                                <li>
                                    <strong>Supabase:</strong> Our authentication and database provider.
                                    View their privacy policy at{' '}
                                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                                        supabase.com/privacy
                                    </a>
                                </li>
                                <li>
                                    <strong>Vercel Analytics:</strong> Website analytics and performance monitoring.
                                    View their privacy policy at{' '}
                                    <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                                        vercel.com/legal/privacy-policy
                                    </a>
                                </li>
                                <li>
                                    <strong>Google OAuth:</strong> When you sign in with Google, Google may set cookies.
                                    View Google's policy at{' '}
                                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                                        policies.google.com/privacy
                                    </a>
                                </li>
                            </ul>
                        </section>

                        <section className="legal-section">
                            <h2>Managing Your Cookie Preferences</h2>
                            <p>
                                You can control and manage cookies in several ways:
                            </p>

                            <h3>On Equathora</h3>
                            <ul>
                                <li>
                                    Change your consent by clicking the cookie icon in the footer or clearing your
                                    browser's localStorage for our site
                                </li>
                                <li>
                                    Essential cookies cannot be disabled as they are required for the website to function
                                </li>
                            </ul>

                            <h3>In Your Browser</h3>
                            <p>
                                Most browsers allow you to view, manage, and delete cookies. Here's how:
                            </p>
                            <ul>
                                <li>
                                    <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
                                </li>
                                <li>
                                    <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
                                </li>
                                <li>
                                    <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
                                </li>
                                <li>
                                    <strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies
                                </li>
                            </ul>
                            <p>
                                <strong>Note:</strong> Blocking all cookies will prevent you from signing in and using Equathora.
                            </p>
                        </section>

                        <section className="legal-section">
                            <h2>Changes to This Policy</h2>
                            <p>
                                We may update this Cookie Policy from time to time. We will notify you of any significant
                                changes by posting the new policy on this page and updating the "Last Updated" date.
                            </p>
                        </section>

                        <section className="legal-section">
                            <h2>Contact Us</h2>
                            <p>
                                If you have questions about our use of cookies, please contact us:
                            </p>
                            <ul>
                                <li>Email: support@equathora.com</li>
                                <li>Feedback Form: <Link to="/feedback">equathora.com/feedback</Link></li>
                            </ul>
                        </section>

                        <div className="legal-footer-links">
                            <Link to="/privacy" className="legal-footer-link">Privacy Policy</Link>
                            <Link to="/terms" className="legal-footer-link">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CookiePolicy;
