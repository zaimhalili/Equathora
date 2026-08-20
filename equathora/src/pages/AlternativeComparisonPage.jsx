import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaArrowRight,
    FaCheck,
    FaExternalLinkAlt,
    FaLightbulb,
    FaRegClock,
} from 'react-icons/fa';
import NavigationBar from '@/components/Landing/NavigationBar.jsx';
import Footer from '@/components/Footer.jsx';
import workspacePreview from '@/assets/images/SigmaStepLight.png';
import { updateOpenGraphMetadata } from '@/lib/seoMetadata';
import './AlternativeComparisonPage.css';

const AlternativeComparisonPage = ({ page }) => {
    const firstProblem = page.problems[0];

    useEffect(() => {
        updateOpenGraphMetadata(document, `/${page.slug}`);
    }, [page.slug]);

    return (
        <main className={`alternative-page alternative-page--${page.slug}`}>
            <NavigationBar />

            <section className="alternative-hero" aria-labelledby={`${page.slug}-title`}>
                <div className="alternative-hero-copy">
                    <p className="alternative-overline">{page.eyebrow}</p>
                    <h1 id={`${page.slug}-title`}>{page.title}</h1>
                    <p className="alternative-intro">{page.introduction}</p>
                    <div className="alternative-hero-actions">
                        <Link className="alternative-primary-action" to={`/problems/${firstProblem.slug}`}>
                            Try a guided problem <FaArrowRight aria-hidden="true" />
                        </Link>
                        <a
                            className="alternative-source-link"
                            href={page.source.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {page.source.label} <FaExternalLinkAlt aria-hidden="true" />
                        </a>
                    </div>
                    <p className="alternative-account-note">
                        Browse freely. An account is required when you enter the guided workspace so your progress can be saved.
                    </p>
                </div>

                <figure className="alternative-workspace-card">
                    <div className="alternative-workspace-heading">
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

            <nav className="alternative-jump-nav" aria-label="Comparison page sections">
                <span>{page.decisionLabel}</span>
                <div>
                    <a href="#comparison">Compare</a>
                    <a href="#equathora-fit">Choose Equathora</a>
                    <a href="#practice">Try problems</a>
                </div>
            </nav>

            <section className="alternative-comparison" id="comparison" aria-labelledby={`${page.slug}-comparison-title`}>
                <div className="alternative-section-heading">
                    <p className="alternative-overline">A fair side-by-side</p>
                    <h2 id={`${page.slug}-comparison-title`}>{page.comparisonTitle}</h2>
                    <p>{page.comparisonIntroduction}</p>
                </div>

                <div className="alternative-table" role="table" aria-label={`Equathora and ${page.competitor} comparison`}>
                    <div className="alternative-table-head" role="row">
                        <span role="columnheader">Compare by</span>
                        <span role="columnheader">{page.competitor}</span>
                        <span role="columnheader">Equathora</span>
                    </div>
                    {page.comparisonRows.map((row) => (
                        <div className="alternative-table-row" role="row" key={row.question}>
                            <strong role="rowheader">{row.question}</strong>
                            <p role="cell">
                                <span className="alternative-mobile-label">{page.competitor}</span>
                                {row.competitor}
                            </p>
                            <p role="cell">
                                <span className="alternative-mobile-label">Equathora</span>
                                {row.equathora}
                            </p>
                        </div>
                    ))}
                </div>
                <p className="alternative-source-note">{page.sourceNote}</p>
            </section>

            <section className="alternative-fit" id="equathora-fit" aria-labelledby={`${page.slug}-fit-title`}>
                <div className="alternative-fit-lead">
                    <p className="alternative-overline">{page.fitEyebrow}</p>
                    <h2 id={`${page.slug}-fit-title`}>{page.fitTitle}</h2>
                    <p>{page.fitDescription}</p>
                </div>
                <ul>
                    {page.fitPoints.map((point) => (
                        <li key={point.title}>
                            <FaCheck aria-hidden="true" />
                            <span><strong>{point.title}</strong> {point.text}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="alternative-competitor-fit" aria-labelledby={`${page.slug}-competitor-fit-title`}>
                <div>
                    <p className="alternative-overline">{page.competitorFitEyebrow}</p>
                    <h2 id={`${page.slug}-competitor-fit-title`}>{page.competitorFitTitle}</h2>
                </div>
                <p>{page.competitorFitDescription}</p>
            </section>

            <section className="alternative-practice" id="practice" aria-labelledby={`${page.slug}-practice-title`}>
                <div className="alternative-section-heading">
                    <p className="alternative-overline">{page.practiceEyebrow}</p>
                    <h2 id={`${page.slug}-practice-title`}>{page.practiceTitle}</h2>
                    <p>{page.practiceDescription}</p>
                </div>

                <div className="alternative-problem-grid">
                    {page.problems.map((problem, index) => (
                        <article className={`alternative-problem-card ${index === 0 ? 'is-featured' : ''}`} key={problem.slug}>
                            <div className="alternative-problem-meta">
                                <span>Grade {problem.grade}</span>
                                <span className={`alternative-difficulty is-${problem.difficulty.toLowerCase()}`}>
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

            <section className="alternative-final-cta" aria-labelledby={`${page.slug}-final-title`}>
                <div>
                    <p className="alternative-overline">{page.finalEyebrow}</p>
                    <h2 id={`${page.slug}-final-title`}>{page.finalTitle}</h2>
                </div>
                <Link className="alternative-primary-action" to={`/problems/${firstProblem.slug}`}>
                    Try a guided problem <FaArrowRight aria-hidden="true" />
                </Link>
            </section>

            <Footer />
        </main>
    );
};

export default AlternativeComparisonPage;
