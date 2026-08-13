import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaExternalLinkAlt, FaLightbulb, FaRegClock } from 'react-icons/fa';
import NavigationBar from '@/components/Landing/NavigationBar.jsx';
import Footer from '@/components/Footer.jsx';
import workspacePreview from '@/assets/images/SigmaStepLight.png';
import { khanAcademyAlternativeProblems } from '@/data/khanAcademyAlternativeProblems';
import { updateOpenGraphMetadata } from '@/lib/seoMetadata';
import './KhanAcademyAlternative.css';

const firstProblem = khanAcademyAlternativeProblems[0];

const comparisonRows = [
    {
        question: 'What do you want to study?',
        khan: 'A broad library across math and many other school subjects',
        equathora: 'A focused workspace for mathematics practice',
    },
    {
        question: 'How do you want to learn?',
        khan: 'Lessons, videos, articles, and practice',
        equathora: 'One guided problem at a time, with a multi-step math editor',
    },
    {
        question: 'What happens when you get stuck?',
        khan: 'Course resources and practice support',
        equathora: 'Three progressive hints, similar questions, and a worked solution after success',
    },
    {
        question: 'How is progress recorded?',
        khan: 'Course and skill progress across its curriculum',
        equathora: 'Attempts, accuracy, streaks, solved history, and progress by math topic',
    },
    {
        question: 'What does access cost?',
        khan: 'Free for learners and teachers',
        equathora: 'Free to start; no paid checkout is live',
    },
];

const KhanAcademyAlternative = () => {
    useEffect(() => {
        updateOpenGraphMetadata(document, '/khan-academy-alternative');
    }, []);

    return (
        <main className="khan-alternative-page">
            <NavigationBar />

            <section className="khan-alternative-hero" aria-labelledby="khan-alternative-title">
                <div className="khan-alternative-hero-copy">
                    <p className="khan-alternative-overline">Khan Academy alternative for math practice</p>
                    <h1 id="khan-alternative-title">Choose the way you want to practice math.</h1>
                    <p className="khan-alternative-intro">
                        Khan Academy is the stronger choice for a broad, fully free lesson library.
                        Equathora is a narrower alternative for learners who want to open a math
                        problem, work through it step by step, and keep a topic-by-topic record.
                    </p>
                    <div className="khan-alternative-hero-actions">
                        <Link className="khan-alternative-primary-action" to={`/problems/${firstProblem.slug}`}>
                            Try a guided problem <FaArrowRight aria-hidden="true" />
                        </Link>
                        <a
                            className="khan-alternative-source-link"
                            href="https://www.khanacademy.org/about"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Khan Academy's overview <FaExternalLinkAlt aria-hidden="true" />
                        </a>
                    </div>
                    <p className="khan-alternative-account-note">
                        Browse freely. An account is required when you enter the guided workspace so your progress can be saved.
                    </p>
                </div>

                <figure className="khan-alternative-workspace-card">
                    <div className="khan-alternative-workspace-heading">
                        <span>Inside an Equathora problem</span>
                        <strong>Think in steps, then submit</strong>
                    </div>
                    <img
                        src={workspacePreview}
                        alt="Equathora problem workspace with progressive hints and a multi-step math editor"
                    />
                    <figcaption>
                        <span><FaLightbulb aria-hidden="true" /> Progressive hints</span>
                        <span><FaRegClock aria-hidden="true" /> Immediate feedback</span>
                    </figcaption>
                </figure>
            </section>

            <nav className="khan-alternative-jump-nav" aria-label="Comparison page sections">
                <span>Decide by learning style</span>
                <div>
                    <a href="#comparison">Compare</a>
                    <a href="#equathora-fit">Choose Equathora</a>
                    <a href="#practice">Try problems</a>
                </div>
            </nav>

            <section className="khan-alternative-comparison" id="comparison" aria-labelledby="comparison-title">
                <div className="khan-alternative-section-heading">
                    <p className="khan-alternative-overline">A fair side-by-side</p>
                    <h2 id="comparison-title">Broad lessons or a focused practice workspace?</h2>
                    <p>
                        These products overlap in math practice, but they are not substitutes for every learner.
                        The useful question is which format matches the session you want today.
                    </p>
                </div>

                <div className="khan-alternative-table" role="table" aria-label="Equathora and Khan Academy comparison">
                    <div className="khan-alternative-table-head" role="row">
                        <span role="columnheader">Compare by</span>
                        <span role="columnheader">Khan Academy</span>
                        <span role="columnheader">Equathora</span>
                    </div>
                    {comparisonRows.map((row) => (
                        <div className="khan-alternative-table-row" role="row" key={row.question}>
                            <strong role="rowheader">{row.question}</strong>
                            <p role="cell">{row.khan}</p>
                            <p role="cell">{row.equathora}</p>
                        </div>
                    ))}
                </div>
                <p className="khan-alternative-source-note">
                    Khan Academy details are based on its official About page and learner catalog, checked August 2026.
                    Product access and features can change.
                </p>
            </section>

            <section className="khan-alternative-fit" id="equathora-fit" aria-labelledby="equathora-fit-title">
                <div className="khan-alternative-fit-lead">
                    <p className="khan-alternative-overline">When Equathora fits</p>
                    <h2 id="equathora-fit-title">You already know the topic. Now you need reps.</h2>
                    <p>
                        Equathora works best as a quiet practice desk: keep the prompt visible,
                        write each line in the browser, use hints only when needed, and get a clear accepted or wrong result.
                    </p>
                </div>
                <ul>
                    <li><FaCheck aria-hidden="true" /><span><strong>Stay inside one problem.</strong> The prompt, editor, hints, sketch pad, and solution live in one workspace.</span></li>
                    <li><FaCheck aria-hidden="true" /><span><strong>Show your working.</strong> Add lines as you solve instead of entering only a final answer.</span></li>
                    <li><FaCheck aria-hidden="true" /><span><strong>See the session count.</strong> Attempts and accepted answers feed your topic progress and solved history.</span></li>
                </ul>
            </section>

            <section className="khan-alternative-keep-khan" aria-labelledby="keep-khan-title">
                <div>
                    <p className="khan-alternative-overline">When Khan Academy fits</p>
                    <h2 id="keep-khan-title">Keep Khan Academy when you need the lesson first.</h2>
                </div>
                <p>
                    Khan Academy has a much broader, fully free library with instructional videos,
                    articles, practice, and courses beyond mathematics. Equathora does not currently
                    offer a verified video library, sequenced curriculum, or classroom toolkit.
                </p>
            </section>

            <section className="khan-alternative-practice" id="practice" aria-labelledby="practice-title">
                <div className="khan-alternative-section-heading">
                    <p className="khan-alternative-overline">Try the difference</p>
                    <h2 id="practice-title">Start with a real Equathora problem.</h2>
                    <p>
                        Choose a topic that feels familiar. Grade and difficulty are shown before you enter the workspace.
                    </p>
                </div>

                <div className="khan-alternative-problem-grid">
                    {khanAcademyAlternativeProblems.map((problem, index) => (
                        <article className={`khan-alternative-problem-card ${index === 0 ? 'is-featured' : ''}`} key={problem.slug}>
                            <div className="khan-alternative-problem-meta">
                                <span>Grade {problem.grade}</span>
                                <span className={`khan-alternative-difficulty is-${problem.difficulty.toLowerCase()}`}>
                                    {problem.difficulty}
                                </span>
                            </div>
                            <p>{problem.topic}</p>
                            <h3>{problem.title}</h3>
                            <Link to={`/problems/${problem.slug}`}>
                                Open problem<span className="sr-only">: {problem.title}</span>
                                <FaArrowRight aria-hidden="true" />
                            </Link>
                        </article>
                    ))}
                </div>
            </section>

            <section className="khan-alternative-final-cta" aria-labelledby="khan-alternative-final-title">
                <div>
                    <p className="khan-alternative-overline">One problem, then decide</p>
                    <h2 id="khan-alternative-final-title">See if focused practice works for you.</h2>
                </div>
                <Link className="khan-alternative-primary-action" to={`/problems/${firstProblem.slug}`}>
                    Try a guided problem <FaArrowRight aria-hidden="true" />
                </Link>
            </section>

            <Footer />
        </main>
    );
};

export default KhanAcademyAlternative;
