import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './About.css';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

const About = () => {
    return (
        <>
            <FeedbackBanner />
            <Navbar />
            <main className="about-page">
                {/* Hero Section */}
                <section className="about-hero">
                    <div className="about-hero-content">
                        <h1 className="about-hero-title">
                            About <span className="highlight">Equathora</span>
                        </h1>
                        <p className="about-hero-subtitle">
                            Empowering minds through mathematical thinking and problem-solving excellence
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="about-section mission-section">
                    <div className="about-container">
                        <div className="section-header">
                            <h2>Our Mission</h2>
                            <div className="section-divider"></div>
                        </div>
                        <div className="mission-content">
                            <p className="mission-text">
                                At Equathora, we believe that <strong>mathematical thinking is a superpower</strong> that everyone can develop.
                                Our mission is to transform the way students approach mathematics not as a subject to fear, but as a
                                journey of discovery, logic, and creative problem-solving.
                            </p>
                            <p className="mission-text">
                                We're committed to providing an engaging, interactive platform where learners can build confidence,
                                master mathematical concepts step-by-step, and unlock their full potential through guided practice
                                and achievement-based motivation.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="about-section vision-section">
                    <div className="about-container">
                        <div className="section-header">
                            <h2>Our Vision</h2>
                            <div className="section-divider"></div>
                        </div>
                        <div className="vision-grid">
                            <div className="vision-card">
                                <div className="vision-icon">🌍</div>
                                <h3>Global Accessibility</h3>
                                <p>
                                    Making high-quality mathematical education accessible to students worldwide,
                                    breaking down barriers of geography, language, and economic status.
                                </p>
                            </div>
                            <div className="vision-card">
                                <div className="vision-icon">🎯</div>
                                <h3>Personalized Learning</h3>
                                <p>
                                    Creating adaptive learning paths that recognize each student's unique pace,
                                    strengths, and areas for growth, ensuring everyone can succeed.
                                </p>
                            </div>
                            <div className="vision-card">
                                <div className="vision-icon">🚀</div>
                                <h3>Future-Ready Skills</h3>
                                <p>
                                    Equipping the next generation with critical thinking, analytical reasoning,
                                    and problem-solving skills essential for success in the modern world.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Idea Section */}
                <section className="about-section idea-section">
                    <div className="about-container">
                        <div className="section-header">
                            <h2>The Idea Behind Equathora</h2>
                            <div className="section-divider"></div>
                        </div>
                        <div className="idea-content">
                            <div className="idea-text">
                                <p>
                                    Equathora was born from a simple observation: <em>students often struggle with math not because
                                        they lack ability, but because traditional learning methods don't align with how they think</em>.
                                </p>
                                <p>
                                    We noticed that when mathematics is presented as isolated formulas and disconnected problems,
                                    learners lose sight of the bigger picture. That's why we created Equathora—a platform that
                                    combines:
                                </p>
                                <ul className="idea-list">
                                    <li><strong>Step-by-step guidance</strong> that breaks down complex problems into manageable pieces</li>
                                    <li><strong>Interactive problem-solving</strong> with immediate feedback and hints</li>
                                    <li><strong>Achievement systems</strong> that celebrate progress and build confidence</li>
                                    <li><strong>Real mentorship</strong> connections for personalized support</li>
                                    <li><strong>Community learning</strong> through leaderboards and friendly competition</li>
                                </ul>
                                <p>
                                    Our name—<strong>Equathora</strong>—combines "Equation" with "Thora" (learning in Turkish),
                                    symbolizing our commitment to making mathematical learning an enlightening journey rather than a burden.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="about-section features-section">
                    <div className="about-container">
                        <div className="section-header">
                            <h2>What Makes Us Different</h2>
                            <div className="section-divider"></div>
                        </div>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-number">01</div>
                                <h3>Interactive Math Editor</h3>
                                <p>
                                    Write mathematical expressions naturally with our advanced MathLive editor.
                                    Show your work step-by-step, just like you would on paper.
                                </p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-number">02</div>
                                <h3>Intelligent Hints System</h3>
                                <p>
                                    Stuck on a problem? Our progressive hint system guides you toward the solution
                                    without giving away the answer, helping you learn through discovery.
                                </p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-number">03</div>
                                <h3>Achievement & Progress Tracking</h3>
                                <p>
                                    Earn achievements, track your streak, and visualize your progress with detailed
                                    statistics that celebrate every milestone.
                                </p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-number">04</div>
                                <h3>Mentor Support Network</h3>
                                <p>
                                    Connect with experienced mentors who can provide personalized guidance,
                                    answer questions, and help you overcome challenging concepts.
                                </p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-number">05</div>
                                <h3>Curated Problem Library</h3>
                                <p>
                                    Access 50+ carefully designed problems across 20+ topics, organized by difficulty
                                    and concept to ensure structured learning progression.
                                </p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-number">06</div>
                                <h3>Community Leaderboards</h3>
                                <p>
                                    Challenge yourself and compete with peers through global and friends leaderboards,
                                    making learning a social and motivating experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="about-section values-section">
                    <div className="about-container">
                        <div className="section-header">
                            <h2>Our Core Values</h2>
                            <div className="section-divider"></div>
                        </div>
                        <div className="values-grid">
                            <div className="value-item">
                                <div className="value-icon">💡</div>
                                <h4>Learning Through Understanding</h4>
                                <p>We prioritize deep comprehension over rote memorization</p>
                            </div>
                            <div className="value-item">
                                <div className="value-icon">🤝</div>
                                <h4>Supportive Community</h4>
                                <p>We foster collaboration, not cutthroat competition</p>
                            </div>
                            <div className="value-item">
                                <div className="value-icon">🎨</div>
                                <h4>Engaging Experience</h4>
                                <p>We make mathematics enjoyable and visually appealing</p>
                            </div>
                            <div className="value-item">
                                <div className="value-icon">📈</div>
                                <h4>Continuous Growth</h4>
                                <p>We celebrate progress at every step of the journey</p>
                            </div>
                            <div className="value-item">
                                <div className="value-icon">🔓</div>
                                <h4>Accessible Education</h4>
                                <p>We believe quality math education should be available to all</p>
                            </div>
                            <div className="value-item">
                                <div className="value-icon">⚡</div>
                                <h4>Innovation First</h4>
                                <p>We constantly evolve to meet learners' changing needs</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Roadmap Section */}
                <section className="about-section roadmap-section" style={{ backgroundColor: 'var(--main-color)', paddingTop: '4rem', paddingBottom: '4rem' }}>
                    <div className="about-container">
                        <div className="section-header">
                            <h2>🚀 What's Next</h2>
                            <div className="section-divider"></div>
                        </div>
                        <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.1rem' }}>
                            Here's what we're building to make Equathora even better
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                            {/* Current Features */}
                            <div style={{ backgroundColor: '#d1fae5', border: '2px solid #10b981', borderRadius: '1rem', padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#065f46', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✅ Available Now
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>✓ 30+ Math Problems</li>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>✓ Interactive Math Editor</li>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>✓ Instant Feedback</li>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>✓ Progress Tracking</li>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>✓ Achievement Badges</li>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>✓ Mobile Friendly</li>
                                </ul>
                            </div>

                            {/* Coming Soon */}
                            <div style={{ backgroundColor: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '1rem', padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    🔜 Coming Soon
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>🎯 Personalized Recommendations</li>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>📚 Structured Learning Paths</li>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>👥 User Accounts & Login</li>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>🏆 Enhanced Leaderboards</li>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>💬 Discussion Forums</li>
                                    <li style={{ marginBottom: '0.75rem', color: '#374151', fontSize: '1rem' }}>🎨 Dark Mode</li>
                                </ul>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '1rem' }}>
                                Have a feature request? We'd love to hear from you!
                            </p>
                            <Link
                                to="/feedback"
                                style={{
                                    display: 'inline-block',
                                    padding: '0.75rem 2rem',
                                    backgroundColor: 'var(--accent-color)',
                                    color: 'white',
                                    borderRadius: '0.5rem',
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--dark-accent-color)'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
                            >
                                Send Feedback
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="about-cta">
                    <div className="about-container">
                        <h2>Ready to Start Your Journey?</h2>
                        <p>Join thousands of students transforming their mathematical abilities</p>
                        <div className="cta-buttons">
                            <Link to="/signup" className="cta-btn primary">Join Equathora Today</Link>
                            <Link to="/learn" className="cta-btn secondary">Explore Problems</Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default About;
