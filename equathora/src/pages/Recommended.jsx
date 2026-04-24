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
import './Recommended.css';

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
    if (status === PROBLEM_NODE_STATUS.SOLVED) return 'problem-node--solved';
    if (status === PROBLEM_NODE_STATUS.IN_PROGRESS) return 'problem-node--in-progress';
    if (status === PROBLEM_NODE_STATUS.AVAILABLE) return 'problem-node--available';
    return 'problem-node--locked';
};

const getDifficultyBadgeClass = (difficulty) => {
    const normalized = String(difficulty || '').toLowerCase();
    if (normalized === 'easy' || normalized === 'beginner') return 'recommended-badge--easy';
    if (normalized === 'hard' || normalized === 'advanced' || normalized === 'expert') return 'recommended-badge--hard';
    return 'recommended-badge--medium';
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
                <main className="recommended-shell flex min-h-screen items-center justify-center font-[Sansation]">
                    <LoadingSpinner />
                </main>
            </>
        );
    }

    if (error || !plan) {
        return (
            <>
                <Navbar />
                <main className="recommended-shell w-full font-[Sansation] text-[var(--secondary-color)]">
                    <section className="px-auto flex w-full max-w-[1500px] flex-col items-start gap-4 px-[4vw] pb-12 pt-8 xl:px-[6vw]">
                        <h1 className="text-3xl font-extrabold">Recommended Study Plan</h1>
                        <p className="recommended-muted text-sm">
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
            <main className="recommended-shell w-full font-[Sansation] text-[var(--secondary-color)]">
                <section className="px-auto flex w-full max-w-[1500px] flex-col gap-5 px-[4vw] pb-10 pt-5 xl:px-[6vw]">
                    <header className="recommended-card flex flex-col gap-4 p-5 md:p-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-extrabold md:text-4xl">{plan.personalizedHeader.greeting}</h1>
                                <p className="recommended-muted text-sm md:text-base">
                                    Your adaptive plan updates continuously from solve accuracy, time spent, and revision needs.
                                </p>
                            </div>

                            <div className="rounded-md border border-[var(--mid-main-secondary)] bg-[var(--main-color)] px-3 py-2 text-xs font-semibold">
                                {plan.learnerBandLabel}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            <div className="recommended-card-soft p-3">
                                <p className="recommended-muted text-xs">Current level</p>
                                <p className="text-sm font-bold capitalize">{plan.personalizedHeader.levelLabel}</p>
                            </div>
                            <div className="recommended-card-soft p-3">
                                <p className="recommended-muted text-xs">Weekly goal</p>
                                <p className="text-sm font-bold">{plan.personalizedHeader.weeklyGoal}</p>
                            </div>
                            <div className="recommended-card-soft p-3">
                                <p className="recommended-muted text-xs">Daily time target</p>
                                <p className="text-sm font-bold">{plan.personalizedHeader.dailyTime}</p>
                            </div>
                            <div className="recommended-card-soft p-3">
                                <p className="recommended-muted text-xs">Current streak</p>
                                <p className="text-sm font-bold">{plan.overallStats.streakDays} days</p>
                            </div>
                        </div>

                        {!hasSession && (
                            <div className="rounded-md border border-[var(--accent-color)] bg-[var(--main-color)] px-3 py-2 text-xs font-semibold text-[var(--accent-color)]">
                                Sign in to use full progress tracking. Right now, this plan is generated from your questionnaire and public problem data.
                            </div>
                        )}
                    </header>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                        <article className="recommended-card flex flex-col gap-4 p-5 xl:col-span-2">
                            <div className="flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-xl font-bold">
                                    <FaRocket className="text-[var(--accent-color)]" />
                                    Today&apos;s Action
                                </h2>
                                <span className="recommended-pill">
                                    {formatMinutes(todayAction?.estimatedMinutes || 0)} total
                                </span>
                            </div>

                            {todayAction?.nextProblems?.length > 0 ? (
                                <div className="grid gap-2 md:grid-cols-3">
                                    {todayAction.nextProblems.map((problem, index) => (
                                        <div
                                            key={`today-${problem.id}`}
                                            className="recommended-card-soft flex flex-col gap-1 p-3"
                                        >
                                            <p className="text-xs font-bold">#{index + 1}</p>
                                            <p className="line-clamp-2 text-sm font-semibold">{problem.title}</p>
                                            <p className="recommended-muted text-xs">{problem.topic || 'General Concepts'}</p>
                                            <p className="text-xs font-semibold">
                                                {problem.timeSpentSeconds > 0
                                                    ? `Spent ${formatDuration(problem.timeSpentSeconds)}`
                                                    : `Estimated ${formatMinutes(problem.estimatedMinutes)}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="recommended-muted text-sm">No available problems right now. Refresh after your next solve.</p>
                            )}

                            <div className="flex flex-wrap items-center gap-2">
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

                                <span className="recommended-muted text-xs">
                                    Suggested daily commitment: {formatMinutes(todayAction?.recommendedDailyMinutes || plan.dailyMinutes)}
                                </span>
                            </div>
                        </article>

                        <aside className="recommended-card flex flex-col gap-4 p-5">
                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                <FaClock className="text-[var(--accent-color)]" />
                                Smart Session Mode
                            </h2>

                            <div className="flex flex-wrap gap-2" role="group" aria-label="Choose session duration">
                                {[15, 30, 60].map((minutes) => (
                                    <button
                                        key={`session-${minutes}`}
                                        type="button"
                                        onClick={() => setSessionMinutes(minutes)}
                                        className={`recommended-pill ${sessionMinutes === minutes ? 'recommended-pill-active' : ''}`}
                                        aria-pressed={sessionMinutes === minutes}
                                    >
                                        {minutes} min
                                    </button>
                                ))}
                            </div>

                            <div className="recommended-card-soft p-3">
                                <p className="text-sm font-semibold">
                                    {quickSession.problems.length} problems fit your {quickSession.minutes}-minute window.
                                </p>
                                <p className="recommended-muted text-xs">
                                    Estimated load: {formatMinutes(quickSession.totalEstimatedMinutes)}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1">
                                {quickSession.problems.slice(0, 3).map((problem) => (
                                    <p key={`quick-${problem.id}`} className="recommended-muted text-xs">
                                        • {problem.title}
                                    </p>
                                ))}
                            </div>
                        </aside>
                    </div>

                    <article className="recommended-card flex flex-col gap-4 p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-xl font-bold">
                                <FaBullseye className="text-[var(--accent-color)]" />
                                Recommended Path
                            </h2>
                            <span className="recommended-muted text-xs">Circle states: locked, available, in progress, solved</span>
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
                                                className={`problem-node ${getStatusNodeClass(node.status)}`}
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
                                            {next ? <span className={`path-connector ${connectorSolved ? 'path-connector--solved' : ''}`} /> : null}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="problem-path-list">
                            {pathNodes.map((node) => (
                                <div key={`node-${node.id}`} className="problem-path-item">
                                    <span className={`problem-node ${getStatusNodeClass(node.status)}`} aria-hidden="true">
                                        {node.status === PROBLEM_NODE_STATUS.SOLVED ? '✓' : node.status === PROBLEM_NODE_STATUS.IN_PROGRESS ? '…' : ''}
                                    </span>

                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="line-clamp-1 text-sm font-semibold">{node.title}</p>
                                            <span className={`recommended-badge ${getDifficultyBadgeClass(node.difficultyBucket)}`}>
                                                {node.difficultyBucket}
                                            </span>
                                        </div>

                                        <p className="recommended-muted line-clamp-1 text-xs">{node.topic || 'General Concepts'}</p>
                                        <p className="text-xs font-semibold">{getStatusText(node.status)}</p>

                                        <p className="recommended-muted text-xs">
                                            {node.timeSpentSeconds > 0
                                                ? `You spent ${formatDuration(node.timeSpentSeconds)} on this problem.`
                                                : `Estimated time: ${formatMinutes(node.estimatedMinutes)}.`}
                                        </p>

                                        {node.status !== PROBLEM_NODE_STATUS.LOCKED && node.slug ? (
                                            <Link
                                                to={`/problems/${node.slug}`}
                                                className="w-fit rounded-md border border-[var(--mid-main-secondary)] px-2 py-1 text-xs font-semibold !text-[var(--secondary-color)] transition-all hover:border-[var(--secondary-color)]"
                                            >
                                                Open Problem
                                            </Link>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                        <article className="recommended-card flex flex-col gap-4 p-5 xl:col-span-2">
                            <h2 className="flex items-center gap-2 text-xl font-bold">
                                <FaSignal className="text-[var(--accent-color)]" />
                                Learning Insights
                            </h2>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                <div className="recommended-card-soft p-3">
                                    <p className="recommended-muted text-xs">Solved</p>
                                    <p className="recommended-stat-value">{plan.overallStats.solvedCount}</p>
                                </div>
                                <div className="recommended-card-soft p-3">
                                    <p className="recommended-muted text-xs">Accuracy</p>
                                    <p className="recommended-stat-value">{plan.overallStats.overallAccuracy}%</p>
                                </div>
                                <div className="recommended-card-soft p-3">
                                    <p className="recommended-muted text-xs">First-try success</p>
                                    <p className="recommended-stat-value">{plan.firstTryRate}%</p>
                                </div>
                                <div className="recommended-card-soft p-3">
                                    <p className="recommended-muted text-xs">Avg solve time</p>
                                    <p className="recommended-stat-value">{formatDuration(plan.overallStats.averageSolveSeconds)}</p>
                                </div>
                            </div>

                            <div className="recommended-card-soft overflow-hidden p-3">
                                <p className="pb-2 text-sm font-bold">Average solve time by topic</p>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    {plan.topicInsights.slice(0, 6).map((topic) => (
                                        <div key={`topic-${topic.topic}`} className="rounded-md border border-[var(--mid-main-secondary)] px-2 py-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-semibold">{topic.topic}</p>
                                                <p className="text-xs font-bold">{topic.accuracy}%</p>
                                            </div>
                                            <p className="recommended-muted text-xs">
                                                {formatDuration(topic.avgSolveSeconds)} avg • confidence {topic.confidenceScore}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="recommended-card-soft p-3">
                                <p className="pb-2 text-sm font-bold">Streak trend this week</p>
                                <div className="grid grid-cols-7 gap-1">
                                    {WEEKDAY_LABELS.map((label, index) => {
                                        const dayCount = weeklyProgress.find((item) => Number(item.day_index) === index)?.count || 0;
                                        const isActive = dayCount > 0;

                                        return (
                                            <div
                                                key={`week-${label}`}
                                                className="flex flex-col items-center gap-1 rounded-md border border-[var(--mid-main-secondary)] px-1 py-2"
                                            >
                                                <p className="text-[10px] font-semibold">{label}</p>
                                                <span
                                                    className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${isActive ? 'bg-[var(--accent-color)] text-[var(--main-color)]' : 'bg-[var(--main-color)] text-[var(--secondary-color)]'}`}
                                                >
                                                    {dayCount}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </article>

                        <aside className="flex flex-col gap-5">
                            <article className="recommended-card flex flex-col gap-3 p-5">
                                <h2 className="flex items-center gap-2 text-lg font-bold">
                                    <FaUndoAlt className="text-[var(--accent-color)]" />
                                    Revision Focus
                                </h2>

                                {plan.revisionFocus.length === 0 ? (
                                    <p className="recommended-muted text-sm">
                                        No urgent revision topic flagged. Keep following your recommended path.
                                    </p>
                                ) : (
                                    plan.revisionFocus.map((topic) => (
                                        <div key={`rev-${topic.topic}`} className="recommended-card-soft p-3">
                                            <p className="text-sm font-semibold">{topic.topic}</p>
                                            <p className="recommended-muted text-xs">Flagged for {topic.reasons.join(', ')}</p>
                                            <p className="text-xs font-semibold">Accuracy {topic.accuracy}%</p>
                                        </div>
                                    ))
                                )}
                            </article>

                            <article className="recommended-card flex flex-col gap-3 p-5">
                                <h2 className="flex items-center gap-2 text-lg font-bold">
                                    <FaTrophy className="text-[var(--accent-color)]" />
                                    Milestones & Weekly Summary
                                </h2>

                                <div className="flex flex-col gap-2">
                                    {plan.milestones.length > 0 ? (
                                        plan.milestones.map((milestone) => (
                                            <div key={milestone.id} className="recommended-card-soft p-3">
                                                <p className="text-sm font-bold">{milestone.title}</p>
                                                <p className="recommended-muted text-xs">{milestone.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="recommended-muted text-sm">Complete your first focused session to unlock milestones.</p>
                                    )}
                                </div>

                                <div className="recommended-card-soft p-3">
                                    <p className="text-xs font-bold">What improved</p>
                                    <p className="recommended-muted text-xs">{plan.weeklySummary.improved}</p>
                                    <p className="pt-2 text-xs font-bold">Needs work</p>
                                    <p className="recommended-muted text-xs">{plan.weeklySummary.needsWork}</p>
                                    <p className="pt-2 text-xs font-bold">Next-week focus</p>
                                    <p className="recommended-muted text-xs">{plan.weeklySummary.nextWeekFocus}</p>
                                </div>
                            </article>
                        </aside>
                    </div>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <article className="recommended-card flex flex-col gap-4 p-5">
                            <h2 className="flex items-center gap-2 text-xl font-bold">
                                <FaLightbulb className="text-[var(--accent-color)]" />
                                Getting Started Guide
                            </h2>

                            <div className="recommended-card-soft p-3">
                                <p className="pb-2 text-sm font-bold">How to work effectively on Equathora</p>
                                <ol className="flex list-decimal flex-col gap-1 pl-4 text-sm">
                                    {plan.guide.coreSteps.map((step, index) => (
                                        <li key={`guide-step-${index}`} className="recommended-muted">
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className="recommended-card-soft p-3">
                                <p className="pb-2 text-sm font-bold">Suggested first-week routine</p>
                                <ul className="flex list-disc flex-col gap-1 pl-4 text-sm">
                                    {plan.guide.firstWeekRoutine.map((step, index) => (
                                        <li key={`routine-${index}`} className="recommended-muted">
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </article>

                        <article className="recommended-card flex flex-col gap-4 p-5">
                            <h2 className="flex items-center gap-2 text-xl font-bold">
                                <FaCheckCircle className="text-[var(--accent-color)]" />
                                Reflection Notes
                            </h2>

                            {plan.recoveryMode.enabled ? (
                                <div className="recommended-card-soft flex items-start gap-2 p-3 text-[var(--accent-color)]">
                                    <FaExclamationTriangle className="pt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold">Recovery mode is active</p>
                                        <p className="text-xs font-semibold">{plan.recoveryMode.reason}</p>
                                        <p className="recommended-muted text-xs">
                                            Your plan now favors confidence-building and revision-first nodes.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="recommended-card-soft flex items-start gap-2 p-3">
                                    <FaFire className="pt-0.5 text-[var(--accent-color)]" />
                                    <div>
                                        <p className="text-sm font-bold">You are in growth mode</p>
                                        <p className="recommended-muted text-xs">
                                            Keep your routine steady and log session reflections for smarter recommendations.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label htmlFor="reflection-note" className="text-xs font-semibold">
                                    What felt hard in this session?
                                </label>
                                <textarea
                                    id="reflection-note"
                                    value={reflectionDraft}
                                    onChange={(event) => setReflectionDraft(event.target.value)}
                                    placeholder="Example: I got stuck simplifying trig identities without hints."
                                    className="h-24 rounded-md border border-[var(--mid-main-secondary)] bg-[var(--main-color)] px-3 py-2 text-sm text-[var(--secondary-color)] outline-none transition-all focus:border-[var(--accent-color)]"
                                />

                                {reflectionError ? <p className="text-xs font-semibold text-[var(--accent-color)]">{reflectionError}</p> : null}

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

                            <div className="recommended-card-soft p-3">
                                <p className="pb-2 text-sm font-bold">Recent reflections</p>
                                {reflectionNotes.length === 0 ? (
                                    <p className="recommended-muted text-xs">No reflections yet. Add one after each session for better personalization.</p>
                                ) : (
                                    <div className="flex max-h-36 flex-col gap-2 overflow-y-auto pr-1">
                                        {reflectionNotes.slice(0, 4).map((note) => (
                                            <div key={note.id} className="rounded-md border border-[var(--mid-main-secondary)] px-2 py-2">
                                                <p className="line-clamp-2 text-xs">{note.note}</p>
                                                <p className="recommended-muted pt-1 text-[10px]">
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
