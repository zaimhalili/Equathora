import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaLightbulb } from 'react-icons/fa';
import NavigationBar from '@/components/Landing/NavigationBar.jsx';
import Footer from '@/components/Footer.jsx';
import Idea from '@/assets/images/Mathematics-bro.svg';
import { polynomialPracticeGroups, polynomialPracticeProblems } from '@/data/polynomialPracticeProblems';
import './PolynomialPractice.css';

const firstProblem = polynomialPracticeProblems[0];

const PolynomialPractice = () => (
    <main className="polynomial-page">
        <NavigationBar />

        <section className="polynomial-hero" aria-labelledby="polynomial-page-title">
            <div className="polynomial-hero-copy">
                <p className="polynomial-eyebrow">Polynomial practice problems</p>
                <h1 id="polynomial-page-title">Practice the moves that make polynomials click.</h1>
                <p className="polynomial-intro">
                    Work through 12 guided polynomial problems covering like terms, addition,
                    subtraction, multiplication, and factoring. Start with an easy expression,
                    use a hint when you need one, and get immediate answer feedback.
                </p>
                <div className="polynomial-hero-actions">
                    <Link className="polynomial-primary-action" to={`/problems/${firstProblem.slug}`}>
                        Start the first problem <FaArrowRight aria-hidden="true" />
                    </Link>
                    <Link className="polynomial-catalog-link" to="/learn">
                        Browse all 321 exercises
                    </Link>
                </div>
                <dl className="polynomial-proof" aria-label="Polynomial practice page contents">
                    <div><dt>Problems</dt><dd>12</dd></div>
                    <div><dt>Grades</dt><dd>8–10</dd></div>
                    <div><dt>Difficulty</dt><dd>Easy to medium</dd></div>
                </dl>
            </div>

            <figure className="polynomial-hero-visual">
                <div className="polynomial-scratch-card" aria-label="Worked polynomial example">
                    <span className="polynomial-card-label">Combine like terms</span>
                    <p>(3x² + 2x − 5) + (x² − 4x + 1)</p>
                    <ol>
                        <li><span>Square terms</span><strong>3x² + x² = 4x²</strong></li>
                        <li><span>Linear terms</span><strong>2x − 4x = −2x</strong></li>
                        <li><span>Constants</span><strong>−5 + 1 = −4</strong></li>
                    </ol>
                    <div className="polynomial-answer"><FaCheck aria-hidden="true" /> 4x² − 2x − 4</div>
                </div>
                <img
                    src={Idea}
                    alt="Student working through a mathematics exercise"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    width="360"
                    height="360"
                />
            </figure>
        </section>

        <nav className="polynomial-skill-nav" aria-label="Choose a polynomial skill">
            <span>Choose a skill</span>
            <div>
                {polynomialPracticeGroups.map(({ id, title }) => (
                    <a key={id} href={`#${id}`}>{title}</a>
                ))}
            </div>
        </nav>

        <section className="polynomial-library" aria-labelledby="polynomial-library-title">
            <div className="polynomial-section-heading">
                <p className="polynomial-eyebrow">Real Equathora exercises</p>
                <h2 id="polynomial-library-title">Build from one operation to the next.</h2>
                <p>
                    These problems move from collecting like terms to multiplication and factoring.
                    Every problem opens in the guided workspace with the prompt kept in view, up to
                    three progressive hints, and feedback after you submit.
                </p>
            </div>

            <div className="polynomial-groups">
                {polynomialPracticeGroups.map(({ id, label, title, description, problems }, groupIndex) => (
                    <section className="polynomial-group" id={id} key={id}>
                        <header className="polynomial-group-heading">
                            <span>0{groupIndex + 1}</span>
                            <div>
                                <p>{label}</p>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </div>
                        </header>

                        <div className="polynomial-card-grid">
                            {problems.map((problem) => (
                                <article className="polynomial-problem-card" key={problem.slug}>
                                    <div className="polynomial-card-meta">
                                        <span>{problem.skill}</span>
                                        <span>Grade {problem.grade}</span>
                                    </div>
                                    <h4>{problem.title}</h4>
                                    <div className="polynomial-card-footer">
                                        <span className={`polynomial-difficulty polynomial-difficulty-${problem.difficulty.toLowerCase()}`}>
                                            {problem.difficulty}
                                        </span>
                                        <Link to={`/problems/${problem.slug}`}>
                                            Solve this problem<span className="sr-only">: {problem.title}</span>
                                            <FaArrowRight aria-hidden="true" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </section>

        <section className="polynomial-method" aria-labelledby="polynomial-method-title">
            <div className="polynomial-method-copy">
                <p className="polynomial-eyebrow">A reliable check</p>
                <h2 id="polynomial-method-title">Slow down at the sign, not at the finish.</h2>
                <p>
                    Most polynomial mistakes happen before the final line. Use this four-step check
                    whenever an expression starts to feel crowded.
                </p>
            </div>
            <ol>
                <li><span>1</span><div><h3>Remove parentheses carefully</h3><p>Distribute a negative sign to every term inside the group.</p></div></li>
                <li><span>2</span><div><h3>Group like terms</h3><p>Only terms with the same variables and exponents can combine.</p></div></li>
                <li><span>3</span><div><h3>Work coefficient by coefficient</h3><p>Keep the variable part unchanged while adding or subtracting the numbers.</p></div></li>
                <li><span>4</span><div><h3>Write in descending powers</h3><p>A clean order makes missing terms and sign errors easier to spot.</p></div></li>
            </ol>
        </section>

        <section className="polynomial-faq" aria-labelledby="polynomial-faq-title">
            <div>
                <p className="polynomial-eyebrow">Before you begin</p>
                <h2 id="polynomial-faq-title">Polynomial practice questions</h2>
            </div>
            <div className="polynomial-faq-list">
                <details open>
                    <summary>What should I practice first?</summary>
                    <p>Start by combining like terms. It builds the sign and exponent habits you need for every later polynomial operation.</p>
                </details>
                <details>
                    <summary>When can two terms be combined?</summary>
                    <p>Terms are like terms only when their variable parts match exactly. For example, 3x² and −5x² combine, but 3x² and 3x do not.</p>
                </details>
                <details>
                    <summary>How do I check a factored answer?</summary>
                    <p>Multiply the factors back together. If you recover the original polynomial term for term, the factorization is correct.</p>
                </details>
                <details>
                    <summary>Do I need an account?</summary>
                    <p>You can browse the exercises first. Equathora asks you to sign in before the guided workspace so your attempts and progress can be saved.</p>
                </details>
            </div>
        </section>

        <section className="polynomial-final-cta" aria-labelledby="polynomial-final-title">
            <FaLightbulb aria-hidden="true" />
            <div>
                <p className="polynomial-eyebrow">Ready to work it out?</p>
                <h2 id="polynomial-final-title">One expression is enough to start.</h2>
            </div>
            <Link className="polynomial-primary-action" to={`/problems/${firstProblem.slug}`}>
                Start practicing <FaArrowRight aria-hidden="true" />
            </Link>
        </section>

        <Footer />
        <div className="polynomial-illustration-credit">
            <a href="https://storyset.com/education" target="_blank" rel="noopener noreferrer">
                Education illustration by Storyset
            </a>
        </div>
    </main>
);

export default PolynomialPractice;
