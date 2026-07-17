import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaChevronDown } from 'react-icons/fa';

const proofItems = [
    {
        number: '01',
        title: 'Browse before signing up',
        description: 'Filter the public problem library by topic and difficulty before you create an account.',
    },
    {
        number: '02',
        title: 'Work each step in the browser',
        description: 'Open hints, add lines of math, and keep the problem beside your working as you solve.',
    },
    {
        number: '03',
        title: 'Get a clear result and keep progress',
        description: 'Submit your final step for correct or incorrect feedback. Signed-in attempts and completed problems feed your progress.',
    },
];

const faqs = [
    {
        question: 'What does Equathora cost?',
        answer: 'Equathora is free to start. There is no paid checkout on the site today, and signup does not ask for payment details.',
    },
    {
        question: 'Can I look through the problems first?',
        answer: 'Yes. The problem library is public to browse. Opening a solving workspace asks you to sign in so your attempts can be saved.',
    },
    {
        question: 'How does the solving workspace give feedback?',
        answer: 'Write your work across one or more math lines, then submit the final step. Equathora checks the answer and shows a correct or incorrect result.',
    },
    {
        question: 'What gets saved when I practice?',
        answer: 'Signed-in practice records your attempts and completed problems so Equathora can show your progress over time.',
    },
    {
        question: 'Do I need to install anything?',
        answer: 'No. The problem library and step-by-step math editor run in your browser.',
    },
];

const CTASection = () => {
    return (
        <section
            id="access-and-answers"
            aria-labelledby="access-and-answers-title"
            className="w-full bg-[var(--white)] px-6 py-16 sm:px-12 sm:py-20 lg:px-24 lg:py-24 xl:px-32"
        >
            <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-16">
                <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                    <div className="theme-lock overflow-hidden rounded-2xl bg-[var(--secondary-color)] p-7 text-white shadow-[0_24px_70px_rgba(32,34,49,0.18)] sm:p-10 lg:sticky lg:top-24">
                        <p className="mb-4 text-sm font-bold text-white/65">Current access</p>
                        <h2
                            id="access-and-answers-title"
                            className="max-w-[12ch] font-[Lexend] text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl"
                        >
                            Free to start.
                        </h2>
                        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-white/75 sm:text-lg">
                            Create an account with a username, email, and password. Equathora does not ask for payment details at signup, and no paid checkout is live today.
                        </p>

                        <Link
                            to="/signup"
                            className="mt-8 inline-flex min-h-11 items-center gap-3 rounded-full bg-[var(--accent-color)] px-6 py-3 text-base font-bold text-white shadow-[0_12px_30px_rgba(215,4,39,0.28)] transition-colors duration-150 hover:bg-[var(--dark-accent-color)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:bg-[var(--dark-accent-color)]"
                        >
                            Create a free account
                            <FaArrowRight aria-hidden="true" className="text-sm" />
                        </Link>

                        <div className="mt-6 flex items-center gap-3 border-t border-white/15 pt-6 text-sm text-white/70">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white" aria-hidden="true">
                                <FaCheck className="text-xs" />
                            </span>
                            No credit card or checkout at signup
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="max-w-2xl">
                            <p className="text-sm font-bold text-[var(--accent-color)]">Product proof</p>
                            <h3 className="mt-3 font-[Lexend] text-3xl font-extrabold leading-tight tracking-[-0.03em] text-[var(--secondary-color)] sm:text-4xl">
                                See what happens before you commit.
                            </h3>
                            <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-[var(--secondary-color)]/70 sm:text-lg">
                                The core practice flow is visible in the product: browse, work through a problem, submit, and keep your progress.
                            </p>
                        </div>

                        <ol className="flex flex-col border-y border-[var(--mid-main-secondary)]/30">
                            {proofItems.map((item) => (
                                <li
                                    key={item.number}
                                    className="grid gap-3 border-b border-[var(--mid-main-secondary)]/30 py-6 last:border-b-0 sm:grid-cols-[48px_1fr] sm:gap-5"
                                >
                                    <span className="font-[Lexend] text-sm font-bold tabular-nums text-[var(--accent-color)]">
                                        {item.number}
                                    </span>
                                    <div>
                                        <h4 className="text-xl font-bold text-[var(--secondary-color)]">{item.title}</h4>
                                        <p className="mt-2 max-w-[58ch] text-base leading-relaxed text-[var(--secondary-color)]/70">
                                            {item.description}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className="grid gap-8 border-t border-[var(--mid-main-secondary)]/30 pt-12 lg:grid-cols-[0.55fr_1fr] lg:gap-16">
                    <div>
                        <p className="text-sm font-bold text-[var(--accent-color)]">Questions, answered</p>
                        <h3 className="mt-3 max-w-[12ch] font-[Lexend] text-3xl font-extrabold leading-tight tracking-[-0.03em] text-[var(--secondary-color)] sm:text-4xl">
                            Know the flow before you start.
                        </h3>
                    </div>

                    <div className="flex flex-col border-t border-[var(--mid-main-secondary)]/30">
                        {faqs.map((faq) => (
                            <details
                                key={faq.question}
                                className="group border-b border-[var(--mid-main-secondary)]/30"
                            >
                                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-bold text-[var(--secondary-color)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-color)]">
                                    {faq.question}
                                    <FaChevronDown
                                        aria-hidden="true"
                                        className="shrink-0 text-sm text-[var(--accent-color)] transition-transform duration-150 group-open:rotate-180"
                                    />
                                </summary>
                                <p className="max-w-[64ch] pb-6 pr-10 text-base leading-relaxed text-[var(--secondary-color)]/70">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
