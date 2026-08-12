import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaCompass } from 'react-icons/fa';
import NavigationBar from '@/components/Landing/NavigationBar.jsx';
import Footer from '@/components/Footer.jsx';
import { quadraticPracticeGroups, quadraticPracticeProblems } from '@/data/quadraticPracticeProblems';
import './QuadraticPractice.css';

const firstProblem = quadraticPracticeProblems[0];

const QuadraticPractice = () => (
    <main className="quadratic-page">
        <NavigationBar />

        <section className="quadratic-hero" aria-labelledby="quadratic-page-title">
            <div className="quadratic-hero-copy">
                <p className="quadratic-eyebrow">Quadratic equations practice problems</p>
                <h1 id="quadratic-page-title">Find the roots. See what they mean.</h1>
                <p className="quadratic-intro">
                    Practice 14 guided quadratic equation problems, from factoring a trinomial
                    to modeling area, motion, and revenue. Use progressive hints when you need
                    them, then submit your expression for immediate feedback.
                </p>
                <div className="quadratic-hero-actions">
                    <Link className="quadratic-primary-action" to={`/problems/${firstProblem.slug}`}>
                        Start with factoring <FaArrowRight aria-hidden="true" />
                    </Link>
                    <Link className="quadratic-catalog-link" to="/learn?topic=quadratic_equations">
                        Browse all quadratic problems
                    </Link>
                </div>
                <dl className="quadratic-proof" aria-label="Quadratic practice page contents">
                    <div><dt>Problems</dt><dd>14</dd></div>
                    <div><dt>Grade</dt><dd>10</dd></div>
                    <div><dt>Difficulty</dt><dd>Easy to hard</dd></div>
                </dl>
            </div>

            <figure className="quadratic-graph-card" aria-label="Quadratic graph with roots at negative three and two">
                <div className="quadratic-equation-label">
                    <span>Factor and solve</span>
                    <strong>x² + x − 6 = 0</strong>
                </div>
                <svg viewBox="0 0 520 390" role="img" aria-labelledby="quadratic-graph-title quadratic-graph-desc">
                    <title id="quadratic-graph-title">Graph of x squared plus x minus six</title>
                    <desc id="quadratic-graph-desc">An upward-opening parabola crosses the horizontal axis at negative three and two.</desc>
                    <defs>
                        <pattern id="quadratic-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(43,45,66,0.09)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="520" height="390" fill="url(#quadratic-grid)" />
                    <line x1="52" y1="220" x2="480" y2="220" className="quadratic-axis" />
                    <line x1="260" y1="34" x2="260" y2="352" className="quadratic-axis" />
                    <path d="M 78 52 C 152 266, 228 336, 310 306 C 378 282, 430 182, 467 58" className="quadratic-curve" />
                    <circle cx="164" cy="220" r="7" className="quadratic-root" />
                    <circle cx="377" cy="220" r="7" className="quadratic-root" />
                    <text x="144" y="250">−3</text>
                    <text x="370" y="250">2</text>
                </svg>
                <figcaption>
                    <span><FaCheck aria-hidden="true" /> (x + 3)(x − 2) = 0</span>
                    <strong>x = −3 or x = 2</strong>
                </figcaption>
            </figure>
        </section>

        <nav className="quadratic-skill-nav" aria-label="Choose a quadratic equation skill">
            <span>Choose a route</span>
            <div>
                {quadraticPracticeGroups.map(({ id, title }) => (
                    <a key={id} href={`#${id}`}>{title}</a>
                ))}
            </div>
        </nav>

        <section className="quadratic-library" aria-labelledby="quadratic-library-title">
            <div className="quadratic-section-heading">
                <p className="quadratic-eyebrow">Real Equathora exercises</p>
                <h2 id="quadratic-library-title">Build from clean equations to real constraints.</h2>
                <p>
                    Start by finding roots from factors. Then form the equation yourself and decide
                    which solution fits the geometry, motion, or business question in front of you.
                    Every link opens a guided problem with the prompt, progressive hints, and answer feedback.
                </p>
            </div>

            <div className="quadratic-groups">
                {quadraticPracticeGroups.map(({ id, label, title, description, problems }, groupIndex) => (
                    <section className="quadratic-group" id={id} key={id}>
                        <header className="quadratic-group-heading">
                            <span>0{groupIndex + 1}</span>
                            <div>
                                <p>{label}</p>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </div>
                        </header>

                        <div className="quadratic-card-grid">
                            {problems.map((problem) => (
                                <article className="quadratic-problem-card" key={problem.slug}>
                                    <div className="quadratic-card-meta">
                                        <span>{problem.skill}</span>
                                        <span>Grade {problem.grade}</span>
                                    </div>
                                    <h4>{problem.title}</h4>
                                    <div className="quadratic-card-footer">
                                        <span className={`quadratic-difficulty quadratic-difficulty-${problem.difficulty.toLowerCase()}`}>
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

        <section className="quadratic-method" aria-labelledby="quadratic-method-title">
            <div className="quadratic-method-copy">
                <p className="quadratic-eyebrow">A four-line routine</p>
                <h2 id="quadratic-method-title">Solve the equation before judging the answer.</h2>
                <p>
                    Quadratic word problems often produce two mathematical roots. The final step is
                    checking which root can represent the length, time, or price in the prompt.
                </p>
            </div>
            <ol>
                <li><span>1</span><div><h3>Write the equation in standard form</h3><p>Move every term to one side so the equation reads ax² + bx + c = 0.</p></div></li>
                <li><span>2</span><div><h3>Choose a solving method</h3><p>Factor when the integers are friendly. Otherwise use completing the square or the quadratic formula.</p></div></li>
                <li><span>3</span><div><h3>Find every root</h3><p>A quadratic can have two, one, or no real solutions. Keep both candidates until you check the context.</p></div></li>
                <li><span>4</span><div><h3>Read the roots in the problem</h3><p>Reject a negative length or impossible time, then state the answer with its units.</p></div></li>
            </ol>
        </section>

        <section className="quadratic-faq" aria-labelledby="quadratic-faq-title">
            <div>
                <p className="quadratic-eyebrow">Before you begin</p>
                <h2 id="quadratic-faq-title">Quadratic equation practice questions</h2>
            </div>
            <div className="quadratic-faq-list">
                <details open>
                    <summary>What should I practice first?</summary>
                    <p>Start with the four factoring problems. They make the connection between factors, zeros, and graph intersections visible before the applications add more steps.</p>
                </details>
                <details>
                    <summary>How do I know whether a quadratic factors?</summary>
                    <p>For x² + bx + c, look for two numbers whose product is c and whose sum is b. If no integer pair works, another method may be faster.</p>
                </details>
                <details>
                    <summary>Why can a quadratic have two answers?</summary>
                    <p>An upward or downward opening parabola can cross the horizontal axis twice. Each crossing is a value that makes the quadratic equal zero.</p>
                </details>
                <details>
                    <summary>Do I need an account?</summary>
                    <p>You can browse the practice set first. Equathora asks you to sign in before the guided workspace so your attempts and progress can be saved.</p>
                </details>
            </div>
        </section>

        <section className="quadratic-final-cta" aria-labelledby="quadratic-final-title">
            <FaCompass aria-hidden="true" />
            <div>
                <p className="quadratic-eyebrow">Start with a clean factorization</p>
                <h2 id="quadratic-final-title">Two roots are one problem away.</h2>
            </div>
            <Link className="quadratic-primary-action" to={`/problems/${firstProblem.slug}`}>
                Start practicing <FaArrowRight aria-hidden="true" />
            </Link>
        </section>

        <Footer />
    </main>
);

export default QuadraticPractice;
