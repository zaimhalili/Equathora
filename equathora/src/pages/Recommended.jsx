import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaBullseye,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaFire,
    FaLightbulb,
    FaRocket,
    FaSignal,
    FaTrophy,
    FaUndoAlt,
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRecommendedPlan } from '../hooks/useRecommendedPlan';
import { PROBLEM_NODE_STATUS } from '../utils/recommendationEngine';
const cardBase =
    'rounded-md border border-[color-mix(in_srgb,var(--secondary-color)_14%,transparent)] bg-[var(--main-color)] shadow-sm shadow-[color-mix(in_srgb,var(--secondary-color)_8%,transparent)]';
const cardSoft =
    'rounded-md border border-[color-mix(in_srgb,var(--secondary-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--main-color)_96%,white)]';
const mutedText = 'text-[color-mix(in_srgb,var(--secondary-color)_70%,transparent)]';
const pillBase =
    'rounded-md border border-[color-mix(in_srgb,var(--secondary-color)_16%,transparent)] bg-[color-mix(in_srgb,var(--main-color)_97%,white)] px-3 py-2 text-sm font-semibold text-[var(--secondary-color)]';
const pillActive =
    'border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--main-color)]';
const badgeBase = 'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm font-semibold';
const problemNodeBase =
    'inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border-2 bg-[var(--main-color)] text-sm font-bold text-[var(--secondary-color)]';
const pathConnectorBase =
    'flex-1 min-w-4 h-0.5 bg-[color-mix(in_srgb,var(--mid-main-secondary)_60%,transparent)]';
const sectionTitle = 'text-xl font-bold tracking-tight';
const sectionSubtitle = 'text-base leading-relaxed';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatMinutes = (minutes) => `${Math.max(0, Math.round(minutes || 0))} min`;

const formatDuration = (seconds) => {
    const total = Math.max(0, Math.round(seconds || 0));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}m ${secs}s`;
};

const getStatusText = (status) => {
    if (status === PROBLEM_NODE_STATUS.SOLVED) return 'Solved';
    if (status === PROBLEM_NODE_STATUS.IN_PROGRESS) return 'In progress';
    if (status === PROBLEM_NODE_STATUS.AVAILABLE) return 'Available';
    return 'Locked';
};

const getStatusNodeClass = (status) => {
    if (status === PROBLEM_NODE_STATUS.SOLVED) {
        return 'border-[var(--accent-color)] bg-[color-mix(in_srgb,var(--accent-color)_18%,var(--main-color)_82%)] text-[var(--accent-color)]';
    }
    if (status === PROBLEM_NODE_STATUS.IN_PROGRESS) {
        return 'border-[var(--accent-color)] bg-[color-mix(in_srgb,var(--accent-color)_12%,var(--main-color)_88%)] text-[var(--accent-color)]';
    }
    if (status === PROBLEM_NODE_STATUS.AVAILABLE) {
        return 'border-[var(--secondary-color)]';
    }
    return 'border-dashed border-[var(--mid-main-secondary)] bg-[color-mix(in_srgb,var(--french-gray)_70%,var(--main-color)_30%)] text-[color-mix(in_srgb,var(--secondary-color)_66%,transparent)]';
};

const getDifficultyBadgeClass = (difficulty) => {
    const normalized = String(difficulty || '').toLowerCase();
    if (normalized === 'easy' || normalized === 'beginner') {
        return 'text-[var(--secondary-color)] border-[color-mix(in_srgb,var(--secondary-color)_16%,transparent)] bg-[color-mix(in_srgb,var(--french-gray)_80%,white)]';
    }
    if (normalized === 'hard' || normalized === 'advanced' || normalized === 'expert') {
        return 'text-[var(--accent-color)] border-[var(--dark-accent-color)] bg-[color-mix(in_srgb,var(--dark-accent-color)_10%,var(--main-color)_90%)]';
    }
    return 'text-[var(--accent-color)] border-[color-mix(in_srgb,var(--accent-color)_30%,transparent)] bg-[color-mix(in_srgb,var(--light-accent-color)_10%,var(--main-color)_90%)]';
};

const Recommended = () => {
    const {
        loading,
        error,
        plan,
        weeklyProgress,
        hasSession,
        refresh,
        pathNodes,
        todayAction,
        quickSession,
        sessionMinutes,
        setSessionMinutes,
        markNodeSolvedPreview,
        reflectionDraft,
        setReflectionDraft,
        reflectionSaving,
        reflectionError,
        reflectionNotes,
        submitReflection,
    } = useRecommendedPlan();

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="flex min-h-screen items-center justify-center bg-[var(--main-color)] font-[Sansation]">
                    <LoadingSpinner />
                </main>
            </>
        );
    }

    if (error || !plan) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen w-full bg-[var(--main-color)] font-[Sansation] text-[var(--secondary-color)]">
                    <section className="mx-auto flex w-full max-w-[1500px] flex-col items-start gap-4 px-[4vw] pb-12 pt-8 xl:px-[6vw]">
                        <h1 className="text-3xl font-extrabold">Recommended Study Plan</h1>
                        <p className={`${mutedText} text-base`}>
                            {error || 'The recommendation plan is unavailable right now.'}
                        </p>
                        <button
                            type="button"
                            onClick={refresh}
                            className="rounded-md bg-[var(--secondary-color)] px-4 py-2 text-sm font-bold text-[var(--main-color)] transition-all hover:bg-[var(--raisin-black)]"
                        >
                            Retry
                        </button>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    const startProblem = todayAction?.nextProblems?.[0];

    return (
        <>
            <Navbar />
            <main className="min-h-screen w-full bg-[var(--main-color)] font-[Sansation] text-[var(--secondary-color)]">
                <section className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-[4vw] pb-12 pt-6 xl:px-[6vw]">
                    <header className={`${cardBase} flex flex-col gap-4 p-6`}>
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-extrabold md:text-4xl">{plan.personalizedHeader.greeting}</h1>
                                <p className={`${mutedText} ${sectionSubtitle}`}>
                                    Follow these steps to build confidence, stay consistent, and see exactly what to do next.
                                </p>
                            </div>

                            <div className="rounded-md border border-[var(--mid-main-secondary)] bg-[color-mix(in_srgb,var(--main-color)_96%,white)] px-3 py-2 text-sm font-semibold">
                                {plan.learnerBandLabel}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                            <div className={`${cardSoft} p-3`}>
                                <p className={`${mutedText} text-sm`}>Current level</p>
                                <p className="text-base font-bold capitalize">{plan.personalizedHeader.levelLabel}</p>
                            </div>
                            <div className={`${cardSoft} p-3`}>
                                <p className={`${mutedText} text-sm`}>Weekly goal</p>
                                <p className="text-base font-bold">{plan.personalizedHeader.weeklyGoal}</p>
                            </div>
                            <div className={`${cardSoft} p-3`}>
                                <p className={`${mutedText} text-sm`}>Daily time target</p>
                                <p className="text-base font-bold">{plan.personalizedHeader.dailyTime}</p>
                            </div>
                            <div className={`${cardSoft} p-3`}>
                                <p className={`${mutedText} text-sm`}>Current streak</p>
                                <p className="text-base font-bold">{plan.overallStats.streakDays} days</p>
                            </div>
                        </div>

                        <div className={`${cardSoft} flex flex-col gap-2 p-3 text-sm md:flex-row md:items-center md:justify-between`}>
                            <p className={`${mutedText} text-sm`}>
                                Updated from {plan.overallStats.totalAttempts} attempts and {plan.overallStats.totalTimeMinutes} minutes logged.
                            </p>
                            <details className="text-sm">
                                <summary className="cursor-pointer font-semibold text-[var(--secondary-color)]">How recommendations are built</summary>
                                <p className={`${mutedText} mt-2 text-sm`}>
                                    We use your submissions, streak activity, and onboarding profile to rank problems and set daily targets.
                                </p>
                            </details>
                        </div>

                        {!hasSession && (
                            <div className="rounded-md border border-[var(--accent-color)] bg-[color-mix(in_srgb,var(--main-color)_95%,white)] px-3 py-2 text-sm font-semibold text-[var(--accent-color)]">
                                Sign in to use full progress tracking. Right now, this plan is generated from your questionnaire and public problem data.
                            </div>
                        )}
                    </header>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <article className={`${cardBase} flex flex-col gap-5 p-6 xl:col-span-2`}>
                            <div className="flex flex-col gap-2">
                                <h2 className={`flex items-center gap-2 ${sectionTitle}`}>
                                    <FaRocket className="text-[var(--accent-color)]" />
                                    Step 1: Start your next session
                                </h2>
                                <p className={`${mutedText} ${sectionSubtitle}`}>
                                    Focus on the next three problems in order. This keeps the learning path simple and progressive.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {startProblem ? (
                                    <Link
                                        to={`/problems/${startProblem.slug}`}
                                        className="inline-flex items-center gap-2 rounded-md bg-[var(--secondary-color)] px-4 py-2 text-sm font-bold !text-[var(--main-color)] transition-all hover:bg-[var(--raisin-black)]"
                                        aria-label={`Start session with ${startProblem.title}`}
                                    >
                                        Start Session
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={refresh}
                                        className="rounded-md bg-[var(--secondary-color)] px-4 py-2 text-sm font-bold text-[var(--main-color)] transition-all hover:bg-[var(--raisin-black)]"
                                    >
                                        Refresh Plan
                                    </button>
                                )}

                                <span className={pillBase}>
                                    {formatMinutes(todayAction?.estimatedMinutes || 0)} total
                                </span>
                                <span className={`${mutedText} text-sm`}>
                                    Suggested daily commitment: {formatMinutes(todayAction?.recommendedDailyMinutes || plan.dailyMinutes)}
                                </span>
                            </div>

                            {todayAction?.nextProblems?.length > 0 ? (
                                <ol className="grid gap-3 md:grid-cols-3">
                                    {todayAction.nextProblems.map((problem, index) => (
                                        <li key={`today-${problem.id}`} className={`${cardSoft} flex flex-col gap-2 p-3`}>
                                            <p className="text-sm font-semibold text-[var(--mid-main-secondary)]">Step {index + 1}</p>
                                            <p className="line-clamp-2 text-base font-semibold">{problem.title}</p>
                                            <p className={`${mutedText} text-sm`}>{problem.topic || 'General Concepts'}</p>
                                            <p className="text-sm font-semibold">
                                                {problem.timeSpentSeconds > 0
                                                    ? `Spent ${formatDuration(problem.timeSpentSeconds)}`
                                                    : `Estimated ${formatMinutes(problem.estimatedMinutes)}`}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className={`${mutedText} text-base`}>No available problems right now. Refresh after your next solve.</p>
                            )}
                        </article>

                        <aside className={`${cardBase} flex flex-col gap-4 p-6`}>
                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                <FaClock className="text-[var(--accent-color)]" />
                                Step 2: Pick a session length
                            </h2>
                            <p className={`${mutedText} text-base`}>
                                Choose a time window and we will fit a focused problem set.
                            </p>

                            <div className="flex flex-wrap gap-2" role="group" aria-label="Choose session duration">
                                {[15, 30, 60].map((minutes) => (
                                    <button
                                        key={`session-${minutes}`}
                                        type="button"
                                        onClick={() => setSessionMinutes(minutes)}
                                        className={`${pillBase} ${sessionMinutes === minutes ? pillActive : ''}`}
                                        aria-pressed={sessionMinutes === minutes}
                                    >
                                        {minutes} min
                                    </button>
                                ))}
                            </div>

                            <div className={`${cardSoft} p-3`}>
                                <p className="text-base font-semibold">
                                    {quickSession.problems.length} problems fit your {quickSession.minutes}-minute window.
                                </p>
                                <p className={`${mutedText} text-sm`}>
                                    Estimated load: {formatMinutes(quickSession.totalEstimatedMinutes)}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1">
                                {quickSession.problems.slice(0, 3).map((problem) => (
                                    <p key={`quick-${problem.id}`} className={`${mutedText} text-sm`}>
                                        • {problem.title}
                                    </p>
                                ))}
                            </div>
                        </aside>
                    </div>

                    <article className={`${cardBase} flex flex-col gap-5 p-6`}>
                        <div className="flex flex-col gap-2">
                            <h2 className={`flex items-center gap-2 ${sectionTitle}`}>
                                <FaBullseye className="text-[var(--accent-color)]" />
                                Step 3: Follow your path
                            </h2>
                            <p className={`${mutedText} ${sectionSubtitle}`}>
                                Track progress in order. Each node opens the next so you do not have to guess.
                            </p>
                        </div>

                        <div className="overflow-x-auto pb-1">
                            <div className="flex min-w-max items-center gap-2 pr-4">
                                {pathNodes.map((node, index) => {
                                    const next = pathNodes[index + 1];
                                    const connectorSolved =
                                        node.status === PROBLEM_NODE_STATUS.SOLVED
                                        && next?.status === PROBLEM_NODE_STATUS.SOLVED;

                                    return (
                                        <React.Fragment key={`connector-${node.id}`}>
                                            <button
                                                type="button"
                                                className={`${problemNodeBase} ${getStatusNodeClass(node.status)}`}
                                                aria-label={`${node.title}: ${getStatusText(node.status)}`}
                                                title={`${node.title} • ${getStatusText(node.status)}`}
                                                onClick={() => {
                                                    if (node.status === PROBLEM_NODE_STATUS.AVAILABLE || node.status === PROBLEM_NODE_STATUS.IN_PROGRESS) {
                                                        markNodeSolvedPreview(node.id);
                                                    }
                                                }}
                                            >
                                                {index + 1}
                                            </button>
                                            {next ? (
                                                <span
                                                    className={`${pathConnectorBase} ${connectorSolved ? 'bg-[var(--accent-color)]' : ''
                                                        }`}
                                                />
                                            ) : null}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                        <details className="rounded-md border border-[color-mix(in_srgb,var(--secondary-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--main-color)_97%,white)] p-4">
                            <summary className="cursor-pointer text-base font-semibold text-[var(--secondary-color)]">
                                View full path details
                            </summary>
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                                {pathNodes.map((node) => (
                                    <div
                                        key={`node-${node.id}`}
                                        className="flex items-center gap-3 rounded-md border border-[color-mix(in_srgb,var(--secondary-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--main-color)_96%,white)] p-3"
                                    >
                                        <span
                                            className={`${problemNodeBase} ${getStatusNodeClass(node.status)}`}
                                            aria-hidden="true"
                                        >
                                            {node.status === PROBLEM_NODE_STATUS.SOLVED ? '✓' : node.status === PROBLEM_NODE_STATUS.IN_PROGRESS ? '…' : ''}
                                        </span>

                                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="line-clamp-1 text-base font-semibold">{node.title}</p>
                                                <span className={`${badgeBase} ${getDifficultyBadgeClass(node.difficultyBucket)}`}>
                                                    {node.difficultyBucket}
                                                </span>
                                            </div>

                                            <p className={`${mutedText} line-clamp-1 text-sm`}>{node.topic || 'General Concepts'}</p>
                                            <p className="text-sm font-semibold">{getStatusText(node.status)}</p>

                                            <p className={`${mutedText} text-sm`}>
                                                {node.timeSpentSeconds > 0
                                                    ? `You spent ${formatDuration(node.timeSpentSeconds)} on this problem.`
                                                    : `Estimated time: ${formatMinutes(node.estimatedMinutes)}.`}
                                            </p>

                                            {node.status !== PROBLEM_NODE_STATUS.LOCKED && node.slug ? (
                                                <Link
                                                    to={`/problems/${node.slug}`}
                                                    className="w-fit rounded-md border border-[var(--mid-main-secondary)] px-2 py-1 text-sm font-semibold !text-[var(--secondary-color)] transition-all hover:border-[var(--secondary-color)]"
                                                >
                                                    Open Problem
                                                </Link>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </details>
                    </article>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <article className={`${cardBase} flex flex-col gap-4 p-6 xl:col-span-2`}>
                            <h2 className={`flex items-center gap-2 ${sectionTitle}`}>
                                <FaSignal className="text-[var(--accent-color)]" />
                                Insights when you want them
                            </h2>
                            <p className={`${mutedText} ${sectionSubtitle}`}>
                                Keep the headline metrics visible, and expand for deeper details.
                            </p>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                <div className={`${cardSoft} p-3`}>
                                    <p className={`${mutedText} text-sm`}>Solved</p>
                                    <p className="text-2xl font-extrabold text-[var(--secondary-color)]">{plan.overallStats.solvedCount}</p>
                                </div>
                                <div className={`${cardSoft} p-3`}>
                                    <p className={`${mutedText} text-sm`}>Accuracy</p>
                                    <p className="text-2xl font-extrabold text-[var(--secondary-color)]">{plan.overallStats.overallAccuracy}%</p>
                                </div>
                                <div className={`${cardSoft} p-3`}>
                                    <p className={`${mutedText} text-sm`}>First-try success</p>
                                    <p className="text-2xl font-extrabold text-[var(--secondary-color)]">{plan.firstTryRate}%</p>
                                </div>
                                <div className={`${cardSoft} p-3`}>
                                    <p className={`${mutedText} text-sm`}>Avg solve time</p>
                                    <p className="text-2xl font-extrabold text-[var(--secondary-color)]">
                                        {formatDuration(plan.overallStats.averageSolveSeconds)}
                                    </p>
                                </div>
                            </div>

                            <details className={`${cardSoft} p-3`}>
                                <summary className="cursor-pointer text-base font-semibold text-[var(--secondary-color)]">
                                    Topic insights
                                </summary>
                                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                                    {plan.topicInsights.slice(0, 6).map((topic) => (
                                        <div key={`topic-${topic.topic}`} className="rounded-md border border-[var(--mid-main-secondary)] px-2 py-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold">{topic.topic}</p>
                                                <p className="text-sm font-bold">{topic.accuracy}%</p>
                                            </div>
                                            <p className={`${mutedText} text-sm`}>
                                                {formatDuration(topic.avgSolveSeconds)} avg • confidence {topic.confidenceScore}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </details>

                            <details className={`${cardSoft} p-3`}>
                                <summary className="cursor-pointer text-base font-semibold text-[var(--secondary-color)]">
                                    Streak trend this week
                                </summary>
                                <div className="mt-3 grid grid-cols-7 gap-2">
                                    {WEEKDAY_LABELS.map((label, index) => {
                                        const dayCount = weeklyProgress.find((item) => Number(item.day_index) === index)?.count || 0;
                                        const isActive = dayCount > 0;

                                        return (
                                            <div
                                                key={`week-${label}`}
                                                className="flex flex-col items-center gap-1 rounded-md border border-[var(--mid-main-secondary)] px-2 py-2"
                                            >
                                                <p className="text-sm font-semibold">{label}</p>
                                                <span
                                                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold ${isActive
                                                            ? 'bg-[color-mix(in_srgb,var(--accent-color)_20%,var(--main-color)_80%)] text-[var(--accent-color)]'
                                                            : 'bg-[var(--main-color)] text-[var(--secondary-color)]'
                                                        }`}
                                                >
                                                    {dayCount}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </details>
                        </article>

                        <aside className="flex flex-col gap-5">
                            <article className={`${cardBase} flex flex-col gap-3 p-6`}>
                                <h2 className="flex items-center gap-2 text-lg font-bold">
                                    <FaUndoAlt className="text-[var(--accent-color)]" />
                                    Focus this week
                                </h2>
                                <p className={`${mutedText} text-base`}>
                                    Keep attention on the topic that needs the most care, then return to your path.
                                </p>

                                {plan.revisionFocus.length === 0 ? (
                                    <p className={`${mutedText} text-base`}>
                                        No urgent revision topic flagged. Keep following your recommended path.
                                    </p>
                                ) : (
                                    plan.revisionFocus.map((topic) => (
                                        <div key={`rev-${topic.topic}`} className={`${cardSoft} p-3`}>
                                            <p className="text-base font-semibold">{topic.topic}</p>
                                            <p className={`${mutedText} text-sm`}>Flagged for {topic.reasons.join(', ')}</p>
                                            <p className="text-sm font-semibold">Accuracy {topic.accuracy}%</p>
                                        </div>
                                    ))
                                )}
                            </article>

                            <article className={`${cardBase} flex flex-col gap-3 p-6`}>
                                <h2 className="flex items-center gap-2 text-lg font-bold">
                                    <FaTrophy className="text-[var(--accent-color)]" />
                                    Milestones and weekly focus
                                </h2>

                                <div className="flex flex-col gap-2">
                                    {plan.milestones.length > 0 ? (
                                        plan.milestones.map((milestone) => (
                                            <div key={milestone.id} className={`${cardSoft} p-3`}>
                                                <p className="text-base font-bold">{milestone.title}</p>
                                                <p className={`${mutedText} text-sm`}>{milestone.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className={`${mutedText} text-base`}>
                                            Complete your first focused session to unlock milestones.
                                        </p>
                                    )}
                                </div>

                                <details className={`${cardSoft} p-3`}>
                                    <summary className="cursor-pointer text-base font-semibold text-[var(--secondary-color)]">
                                        Weekly summary
                                    </summary>
                                    <div className="mt-2">
                                        <p className="text-sm font-bold">What improved</p>
                                        <p className={`${mutedText} text-sm`}>{plan.weeklySummary.improved}</p>
                                        <p className="pt-2 text-sm font-bold">Needs work</p>
                                        <p className={`${mutedText} text-sm`}>{plan.weeklySummary.needsWork}</p>
                                        <p className="pt-2 text-sm font-bold">Next-week focus</p>
                                        <p className={`${mutedText} text-sm`}>{plan.weeklySummary.nextWeekFocus}</p>
                                    </div>
                                </details>
                            </article>
                        </aside>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <article className={`${cardBase} flex flex-col gap-4 p-6`}>
                            <h2 className={`flex items-center gap-2 ${sectionTitle}`}>
                                <FaLightbulb className="text-[var(--accent-color)]" />
                                Getting Started Guide
                            </h2>
                            <details className={`${cardSoft} p-3`} open>
                                <summary className="cursor-pointer text-base font-semibold text-[var(--secondary-color)]">
                                    Core steps
                                </summary>
                                <ol className="mt-2 flex list-decimal flex-col gap-2 pl-4 text-base">
                                    {plan.guide.coreSteps.map((step, index) => (
                                        <li key={`guide-step-${index}`} className={mutedText}>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </details>

                            <details className={`${cardSoft} p-3`}>
                                <summary className="cursor-pointer text-base font-semibold text-[var(--secondary-color)]">
                                    Suggested first-week routine
                                </summary>
                                <ul className="mt-2 flex list-disc flex-col gap-2 pl-4 text-base">
                                    {plan.guide.firstWeekRoutine.map((step, index) => (
                                        <li key={`routine-${index}`} className={mutedText}>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </article>

                        <article className={`${cardBase} flex flex-col gap-4 p-6`}>
                            <h2 className={`flex items-center gap-2 ${sectionTitle}`}>
                                <FaCheckCircle className="text-[var(--accent-color)]" />
                                Reflection Notes
                            </h2>

                            {plan.recoveryMode.enabled ? (
                                <div className={`${cardSoft} flex items-start gap-3 p-3 text-[var(--accent-color)]`}>
                                    <FaExclamationTriangle className="pt-0.5" />
                                    <div>
                                        <p className="text-base font-bold">Recovery mode is active</p>
                                        <p className="text-sm font-semibold">{plan.recoveryMode.reason}</p>
                                        <p className={`${mutedText} text-sm`}>
                                            Your plan now favors confidence-building and revision-first nodes.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className={`${cardSoft} flex items-start gap-3 p-3`}>
                                    <FaFire className="pt-0.5 text-[var(--accent-color)]" />
                                    <div>
                                        <p className="text-base font-bold">You are in growth mode</p>
                                        <p className={`${mutedText} text-sm`}>
                                            Keep your routine steady and log session reflections for smarter recommendations.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label htmlFor="reflection-note" className="text-sm font-semibold">
                                    What felt hard in this session?
                                </label>
                                <textarea
                                    id="reflection-note"
                                    value={reflectionDraft}
                                    onChange={(event) => setReflectionDraft(event.target.value)}
                                    placeholder="Example: I got stuck simplifying trig identities without hints."
                                    className="h-28 rounded-md border border-[var(--mid-main-secondary)] bg-[var(--main-color)] px-3 py-2 text-base text-[var(--secondary-color)] outline-none transition-all focus:border-[var(--accent-color)]"
                                />

                                {reflectionError ? <p className="text-sm font-semibold text-[var(--accent-color)]">{reflectionError}</p> : null}

                                <button
                                    type="button"
                                    onClick={() => {
                                        void submitReflection({
                                            sessionMinutes,
                                            quickSessionProblemCount: quickSession.problems.length,
                                        });
                                    }}
                                    disabled={reflectionSaving}
                                    className="w-fit rounded-md bg-[var(--secondary-color)] px-4 py-2 text-sm font-bold text-[var(--main-color)] transition-all hover:bg-[var(--raisin-black)] disabled:opacity-60"
                                >
                                    {reflectionSaving ? 'Saving...' : 'Save Reflection'}
                                </button>
                            </div>

                            <div className={`${cardSoft} p-3`}>
                                <p className="pb-2 text-base font-bold">Recent reflections</p>
                                {reflectionNotes.length === 0 ? (
                                    <p className={`${mutedText} text-sm`}>
                                        No reflections yet. Add one after each session for better personalization.
                                    </p>
                                ) : (
                                    <div className="flex max-h-36 flex-col gap-2 overflow-y-auto pr-1">
                                        {reflectionNotes.slice(0, 4).map((note) => (
                                            <div key={note.id} className="rounded-md border border-[var(--mid-main-secondary)] px-2 py-2">
                                                <p className="line-clamp-2 text-sm">{note.note}</p>
                                                <p className={`${mutedText} pt-1 text-sm`}>
                                                    {new Date(note.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </article>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Recommended;
