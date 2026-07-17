import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaClock, FaLightbulb } from 'react-icons/fa';
import QuestionMark from '../../assets/images/questionMark.svg';
import { WEEKLY_CHALLENGE, getWeeklyChallengeProblemPath } from '../../data/weeklyChallenge';

const FirstProblemPrompt = () => (
    <section
        aria-labelledby="first-problem-title"
        className="relative !mt-8 !mb-8 overflow-hidden rounded-2xl border border-[rgba(43,45,66,0.12)] bg-[var(--white)] shadow-[0_18px_48px_rgba(43,45,66,0.12)]"
    >
        <div className="grid items-center gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_190px] lg:px-10 lg:py-10">
            <div className="max-w-[620px] text-left font-[Sansation]">
                <p className="mb-3 text-sm font-semibold text-[var(--accent-color)]">
                    Your first practice session
                </p>
                <h2
                    id="first-problem-title"
                    className="max-w-[17ch] text-3xl font-extrabold leading-tight text-[var(--secondary-color)] sm:text-4xl"
                >
                    Start with one algebra problem.
                </h2>
                <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-[var(--secondary-color)] opacity-80 sm:text-lg">
                    Work at your own pace, use hints when you need them, and get immediate feedback when you submit.
                </p>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--secondary-color)] opacity-80">
                    <span className="inline-flex items-center gap-2">
                        <FaClock aria-hidden="true" className="text-[var(--accent-color)]" />
                        About {WEEKLY_CHALLENGE.estimatedMinutes} minutes
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <FaLightbulb aria-hidden="true" className="text-[var(--accent-color)]" />
                        Hints included
                    </span>
                </div>

                <Link
                    to={getWeeklyChallengeProblemPath()}
                    className="mt-7 inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-[var(--accent-color)] px-6 py-3 font-semibold !text-white no-underline shadow-[0_10px_24px_rgba(215,4,39,0.22)] transition-[transform,box-shadow,background-color] duration-150 hover:-translate-y-0.5 hover:bg-[var(--dark-accent-color)] hover:shadow-[0_14px_30px_rgba(215,4,39,0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-color)] active:translate-y-0 active:shadow-[0_8px_18px_rgba(215,4,39,0.2)]"
                >
                    Solve your first problem
                    <FaArrowRight aria-hidden="true" />
                </Link>
            </div>

            <div className="hidden aspect-square items-center justify-center rounded-2xl bg-[var(--main-color)] p-6 lg:flex" aria-hidden="true">
                <img src={QuestionMark} alt="" className="h-full w-full object-contain" />
            </div>
        </div>
    </section>
);

export default FirstProblemPrompt;
