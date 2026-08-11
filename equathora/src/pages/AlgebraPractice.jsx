import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import NavigationBar from '@/components/Landing/NavigationBar.jsx';
import Footer from '@/components/Footer.jsx';
import Idea from '@/assets/images/Mathematics-bro.svg';
import { formatTopicLabel } from '@/lib/utils';
import { algebraGradeGroups, algebraPracticeProblems } from '@/data/algebraPracticeProblems';
import './AlgebraPractice.css';

const firstProblem = algebraPracticeProblems[0];

const AlgebraPractice = () => (
    <main className="algebra-page">
        <NavigationBar />

        <section className="algebra-hero" aria-labelledby="algebra-page-title">
            <div className="algebra-hero-copy">
                <p className="algebra-eyebrow">Algebra practice problems</p>
                <h1 id="algebra-page-title">Practice Algebra, one problem at a time.</h1>
                <p className="algebra-intro">
                    Choose a real Equathora exercise by grade and difficulty. Work in the guided editor,
                    use hints when you need them, and get immediate answer feedback.
                </p>
                <div className="algebra-hero-actions">
                    <Link className="algebra-primary-action" to={`/problems/${firstProblem.slug}`}>
                        Start with an easy problem <FaArrowRight aria-hidden="true" />
                    </Link>
                    <Link className="algebra-catalog-link" to="/learn">
                        Browse the full math catalog
                    </Link>
                </div>
                <div className="algebra-proof" aria-label="Page contents">
                    <span><strong>18</strong> real exercises</span>
                    <span><strong>5</strong> grade levels</span>
                    <span>Beginner to hard</span>
                </div>
            </div>

            <figure className="algebra-hero-visual">
                <img
                    src={Idea}
                    alt="Student working through a mathematics exercise"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    width="520"
                    height="520"
                />
                <figcaption>
                    <span className="algebra-annotation">x + 4 = 12</span>
                    <span><FaCheck aria-hidden="true" /> Immediate feedback</span>
                </figcaption>
            </figure>
        </section>

        <nav className="algebra-grade-nav" aria-label="Choose an Algebra grade">
            <span>Find your level</span>
            <div>
                {algebraGradeGroups.map(({ grade }) => (
                    <a key={grade} href={`#grade-${grade}`}>Grade {grade}</a>
                ))}
            </div>
        </nav>

        <section className="algebra-problem-library" aria-labelledby="choose-grade-title">
            <div className="algebra-section-heading">
                <p className="algebra-eyebrow">Real problems from Equathora</p>
                <h2 id="choose-grade-title">Choose your grade</h2>
                <p>Each link opens the guided problem workspace, where your prompt and hints stay close while you solve.</p>
            </div>

            <div className="algebra-grade-groups">
                {algebraGradeGroups.map(({ grade, problems }) => (
                    <section className="algebra-grade-group" id={`grade-${grade}`} key={grade}>
                        <header className="algebra-grade-heading">
                            <div>
                                <p>Build from the level that fits</p>
                                <h3>Grade {grade}</h3>
                            </div>
                            <span>{problems.length} {problems.length === 1 ? 'exercise' : 'exercises'}</span>
                        </header>

                        <div className="algebra-card-grid">
                            {problems.map((problem) => (
                                <article className="algebra-problem-card" key={problem.slug}>
                                    <div className="algebra-card-meta">
                                        <span className={`algebra-difficulty algebra-difficulty-${problem.difficulty.toLowerCase()}`}>
                                            {problem.difficulty}
                                        </span>
                                        <span>Grade {problem.grade}</span>
                                    </div>
                                    <p>{formatTopicLabel(problem.topic)}</p>
                                    <h4>{problem.title}</h4>
                                    <Link to={`/problems/${problem.slug}`}>
                                        Open guided problem<span className="sr-only">: {problem.title}</span> <FaArrowRight aria-hidden="true" />
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </section>

        <section className="algebra-how" aria-labelledby="how-practice-works">
            <div>
                <p className="algebra-eyebrow">A focused practice loop</p>
                <h2 id="how-practice-works">How practice works</h2>
            </div>
            <ol>
                <li><span>1</span><div><h3>Pick a problem</h3><p>Start at your grade and choose a difficulty that feels right.</p></div></li>
                <li><span>2</span><div><h3>Work through it</h3><p>Keep the prompt, step editor, and progressive hints in one workspace.</p></div></li>
                <li><span>3</span><div><h3>Learn from feedback</h3><p>Submit your expression and see immediately whether your answer works.</p></div></li>
            </ol>
        </section>

        <Footer />
        <div className="algebra-illustration-credit">
            <a href="https://storyset.com/education" target="_blank" rel="noopener noreferrer">
                Education illustration by Storyset
            </a>
        </div>
    </main>
);

export default AlgebraPractice;
