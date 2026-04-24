import React, { useEffect, useMemo, useState } from 'react';
import { FiCheckCircle, FiClipboard, FiCopy, FiFilter, FiSearch, FiSkipForward } from 'react-icons/fi';

const mockProblems = [
    {
        id: 'NP-2401',
        title: 'Quadratic Equation With Integer Constraints',
        topic: 'Algebra',
        difficulty: 'Medium',
        grade: '9',
        workflowStatus: 'New',
        published: false,
        qualityScore: 81,
        similarCount: 1,
        createdAt: '2026-04-19T10:14:00Z',
        lastEditedAt: '2026-04-20T08:02:00Z',
        author: 'AI Draft Batch 7',
        tags: ['equations', 'factoring'],
        reviewFlags: ['Needs final wording polish'],
        statement: 'Find all integer values of x satisfying x^2 - 5x + 6 = 0.',
        expectedAnswer: 'x = 2 or x = 3',
        hints: ['Factor the polynomial into two binomials.', 'Set each factor equal to zero.']
    },
    {
        id: 'NP-2402',
        title: 'Triangle Angle Chase (Supplementary Angles)',
        topic: 'Geometry',
        difficulty: 'Easy',
        grade: '8',
        workflowStatus: 'In Review',
        published: true,
        qualityScore: 74,
        similarCount: 2,
        createdAt: '2026-04-18T07:44:00Z',
        lastEditedAt: '2026-04-21T14:31:00Z',
        author: 'Mentor Upload',
        tags: ['triangles', 'angles'],
        reviewFlags: ['Already published (check overlap)', 'Diagram quality pending'],
        statement: 'In triangle ABC, angle A is 40 degrees and angle B is twice angle C. Find angle C.',
        expectedAnswer: 'Angle C = 46.67 degrees (or 140/3 degrees)',
        hints: ['Use A + B + C = 180 degrees.', 'Replace B with 2C and solve.']
    },
    {
        id: 'NP-2403',
        title: 'System of Equations Word Problem',
        topic: 'Algebra',
        difficulty: 'Hard',
        grade: '10',
        workflowStatus: 'Needs Fix',
        published: false,
        qualityScore: 68,
        similarCount: 0,
        createdAt: '2026-04-16T11:01:00Z',
        lastEditedAt: '2026-04-22T18:16:00Z',
        author: 'Content Team',
        tags: ['systems', 'word-problems'],
        reviewFlags: ['Units are missing in sentence 2', 'Final answer format unclear'],
        statement: 'A school bought pens and notebooks for $132. Pens cost $3 and notebooks cost $9. If 24 items were bought, how many of each were purchased?',
        expectedAnswer: '14 pens and 10 notebooks',
        hints: ['Set equations for count and cost.', 'Use elimination or substitution.']
    },
    {
        id: 'NP-2404',
        title: 'Basic Probability on Marbles',
        topic: 'Probability',
        difficulty: 'Easy',
        grade: '7',
        workflowStatus: 'Approved',
        published: false,
        qualityScore: 92,
        similarCount: 0,
        createdAt: '2026-04-22T08:39:00Z',
        lastEditedAt: '2026-04-23T12:08:00Z',
        author: 'AI Draft Batch 8',
        tags: ['probability', 'fractions'],
        reviewFlags: [],
        statement: 'A bag has 3 red and 5 blue marbles. What is the probability of drawing a red marble?',
        expectedAnswer: '3/8',
        hints: ['Probability = favorable outcomes / total outcomes.']
    },
    {
        id: 'NP-2405',
        title: 'Linear Function Slope Interpretation',
        topic: 'Functions',
        difficulty: 'Medium',
        grade: '9',
        workflowStatus: 'New',
        published: false,
        qualityScore: 79,
        similarCount: 3,
        createdAt: '2026-04-23T16:24:00Z',
        lastEditedAt: '2026-04-23T17:45:00Z',
        author: 'Mentor Upload',
        tags: ['slope', 'graphing'],
        reviewFlags: ['Potential duplicate with NP-2366'],
        statement: 'A line passes through (2,5) and (6,17). Find its slope and explain what it means.',
        expectedAnswer: 'Slope = 3. The y-value increases by 3 for every 1 increase in x.',
        hints: ['Use slope formula (y2-y1)/(x2-x1).', 'Interpret in context.']
    }
];

const workflowStyles = {
    New: { backgroundColor: 'var(--french-gray)', color: 'var(--secondary-color)' },
    'In Review': { backgroundColor: 'var(--mid-main-secondary)', color: 'var(--main-color)' },
    'Needs Fix': { backgroundColor: 'var(--accent-color)', color: 'var(--main-color)' },
    Approved: { backgroundColor: 'var(--secondary-color)', color: 'var(--main-color)' }
};

const byNewest = (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
const byQuality = (a, b) => b.qualityScore - a.qualityScore;
const byPriority = (a, b) => {
    const weight = { 'Needs Fix': 4, New: 3, 'In Review': 2, Approved: 1 };
    if (weight[a.workflowStatus] !== weight[b.workflowStatus]) {
        return weight[b.workflowStatus] - weight[a.workflowStatus];
    }
    return byNewest(a, b);
};

const AdminReviewProblems = () => {
    const [rows, setRows] = useState(mockProblems);
    const [search, setSearch] = useState('');
    const [topic, setTopic] = useState('All');
    const [difficulty, setDifficulty] = useState('All');
    const [publishFilter, setPublishFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Priority');
    const [showQueueOnly, setShowQueueOnly] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [activeId, setActiveId] = useState(mockProblems[0]?.id || '');
    const [reviewNotesById, setReviewNotesById] = useState({});
    const [copyFeedback, setCopyFeedback] = useState('');

    useEffect(() => {
        if (!copyFeedback) return;
        const timer = window.setTimeout(() => setCopyFeedback(''), 2200);
        return () => window.clearTimeout(timer);
    }, [copyFeedback]);

    const options = useMemo(() => {
        const uniq = (key) => ['All', ...new Set(rows.map((item) => item[key]))];
        return {
            topics: uniq('topic'),
            difficulties: uniq('difficulty')
        };
    }, [rows]);

    const filteredRows = useMemo(() => {
        const needle = search.trim().toLowerCase();

        let next = rows.filter((item) => {
            const matchesSearch = !needle
                || item.id.toLowerCase().includes(needle)
                || item.title.toLowerCase().includes(needle)
                || item.tags.join(' ').toLowerCase().includes(needle);

            const matchesTopic = topic === 'All' || item.topic === topic;
            const matchesDifficulty = difficulty === 'All' || item.difficulty === difficulty;
            const matchesPublish = publishFilter === 'All'
                || (publishFilter === 'Published' && item.published)
                || (publishFilter === 'Unpublished' && !item.published);

            const passesQueue = !showQueueOnly || item.workflowStatus !== 'Approved';

            return matchesSearch && matchesTopic && matchesDifficulty && matchesPublish && passesQueue;
        });

        if (sortBy === 'Newest') next = next.sort(byNewest);
        else if (sortBy === 'Quality') next = next.sort(byQuality);
        else next = next.sort(byPriority);

        return next;
    }, [rows, search, topic, difficulty, publishFilter, showQueueOnly, sortBy]);

    useEffect(() => {
        if (!filteredRows.length) {
            setActiveId('');
            return;
        }

        if (!activeId || !filteredRows.some((item) => item.id === activeId)) {
            setActiveId(filteredRows[0].id);
        }
    }, [filteredRows, activeId]);

    const activeProblem = useMemo(() => rows.find((item) => item.id === activeId) || null, [rows, activeId]);

    const dashboardStats = useMemo(() => {
        const total = rows.length;
        const published = rows.filter((item) => item.published).length;
        const pending = rows.filter((item) => item.workflowStatus !== 'Approved').length;
        const approved = rows.filter((item) => item.workflowStatus === 'Approved').length;
        return { total, published, pending, approved };
    }, [rows]);

    const allVisibleSelected = filteredRows.length > 0 && filteredRows.every((item) => selectedIds.includes(item.id));

    const setStatusForIds = (ids, nextStatus) => {
        if (!ids.length) return;
        setRows((prev) => prev.map((item) => (
            ids.includes(item.id)
                ? { ...item, workflowStatus: nextStatus }
                : item
        )));
    };

    const copyText = async (text, successMessage) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const area = document.createElement('textarea');
                area.value = text;
                area.setAttribute('readonly', '');
                area.style.position = 'absolute';
                area.style.left = '-9999px';
                document.body.appendChild(area);
                area.select();
                document.execCommand('copy');
                area.remove();
            }
            setCopyFeedback(successMessage);
        } catch {
            setCopyFeedback('Copy failed. Please copy manually.');
        }
    };

    const copyVisibleQueue = () => {
        const text = filteredRows.map((item) => `${item.id} | ${item.title}`).join('\n');
        if (!text) return;
        copyText(text, `Copied ${filteredRows.length} visible problems.`);
    };

    const copySelectedQueue = () => {
        const selectedRows = rows.filter((item) => selectedIds.includes(item.id));
        const text = selectedRows.map((item) => `${item.id} | ${item.title}`).join('\n');
        if (!text) return;
        copyText(text, `Copied ${selectedRows.length} selected problems.`);
    };

    const jumpToNextPending = () => {
        const queue = filteredRows.filter((item) => item.workflowStatus !== 'Approved');
        if (!queue.length) return;

        const index = queue.findIndex((item) => item.id === activeId);
        const next = queue[(index + 1) % queue.length];
        setActiveId(next.id);
    };

    return (
        <section className='flex flex-col gap-6 px-3 py-2 text-[var(--secondary-color)] md:px-5'>
            <header
                className='rounded-xl border p-5'
                style={{
                    borderColor: 'var(--mid-main-secondary)',
                    background: 'linear-gradient(135deg, var(--main-color), var(--french-gray))'
                }}
            >
                <div className='flex flex-wrap items-start justify-between gap-3'>
                    <div>
                        <h1 className='text-2xl font-black md:text-3xl'>Problem Review Queue</h1>
                        <p className='pt-1 text-sm md:text-base'>
                            UI-only reviewer cockpit with fast filtering, bulk actions, and a one-click next-pending flow.
                        </p>
                    </div>

                    <div className='flex flex-wrap items-center gap-2'>
                        <button
                            type='button'
                            onClick={() => setShowQueueOnly((prev) => !prev)}
                            className='rounded-md border px-3 py-2 text-sm font-semibold transition'
                            style={{
                                borderColor: showQueueOnly ? 'var(--accent-color)' : 'var(--mid-main-secondary)',
                                backgroundColor: showQueueOnly ? 'var(--accent-color)' : 'var(--main-color)',
                                color: showQueueOnly ? 'var(--main-color)' : 'var(--secondary-color)'
                            }}
                        >
                            <span className='inline-flex items-center gap-2'>
                                <FiFilter />
                                {showQueueOnly ? 'Queue Mode: On' : 'Queue Mode: Off'}
                            </span>
                        </button>
                        <button
                            type='button'
                            onClick={jumpToNextPending}
                            className='rounded-md border px-3 py-2 text-sm font-semibold transition'
                            style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                        >
                            <span className='inline-flex items-center gap-2'>
                                <FiSkipForward />
                                Next Pending
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <p className='text-xs uppercase tracking-wide text-[var(--mid-main-secondary)]'>Total In Buffer</p>
                    <p className='pt-2 text-3xl font-black'>{dashboardStats.total}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <p className='text-xs uppercase tracking-wide text-[var(--mid-main-secondary)]'>Pending Review</p>
                    <p className='pt-2 text-3xl font-black'>{dashboardStats.pending}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <p className='text-xs uppercase tracking-wide text-[var(--mid-main-secondary)]'>Approved</p>
                    <p className='pt-2 text-3xl font-black'>{dashboardStats.approved}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <p className='text-xs uppercase tracking-wide text-[var(--mid-main-secondary)]'>Already Published</p>
                    <p className='pt-2 text-3xl font-black'>{dashboardStats.published}</p>
                </article>
            </div>

            <div className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                <div className='grid grid-cols-1 gap-3 md:grid-cols-5'>
                    <label className='inline-flex items-center gap-2 rounded-md border px-3 py-2 md:col-span-2' style={{ borderColor: 'var(--mid-main-secondary)' }}>
                        <FiSearch />
                        <input
                            type='text'
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder='Search ID, title, or tags'
                            className='w-full bg-transparent text-sm outline-none'
                        />
                    </label>

                    <select
                        value={topic}
                        onChange={(event) => setTopic(event.target.value)}
                        className='rounded-md border px-2 py-2 text-sm outline-none'
                        style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                    >
                        {options.topics.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <select
                        value={difficulty}
                        onChange={(event) => setDifficulty(event.target.value)}
                        className='rounded-md border px-2 py-2 text-sm outline-none'
                        style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                    >
                        {options.difficulties.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <select
                        value={publishFilter}
                        onChange={(event) => setPublishFilter(event.target.value)}
                        className='rounded-md border px-2 py-2 text-sm outline-none'
                        style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                    >
                        {['All', 'Published', 'Unpublished'].map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </div>

                <div className='pt-3 flex flex-wrap items-center justify-between gap-2'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='rounded-md border px-2 py-1 text-xs font-semibold' style={{ borderColor: 'var(--mid-main-secondary)' }}>
                            {filteredRows.length} visible
                        </span>
                        <span className='rounded-md border px-2 py-1 text-xs font-semibold' style={{ borderColor: 'var(--mid-main-secondary)' }}>
                            {selectedIds.length} selected
                        </span>
                    </div>

                    <div className='flex flex-wrap items-center gap-2'>
                        <label className='text-xs font-semibold'>Sort</label>
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                            className='rounded-md border px-2 py-1.5 text-sm outline-none'
                            style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                        >
                            {['Priority', 'Newest', 'Quality'].map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,1fr)]'>
                <div className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <div className='flex flex-wrap items-center justify-between gap-2 pb-3'>
                        <h2 className='text-lg font-black'>Review List</h2>
                        <div className='flex flex-wrap items-center gap-2'>
                            <button
                                type='button'
                                onClick={() => {
                                    if (allVisibleSelected) setSelectedIds([]);
                                    else setSelectedIds(filteredRows.map((item) => item.id));
                                }}
                                className='rounded-md border px-3 py-1.5 text-xs font-semibold'
                                style={{ borderColor: 'var(--mid-main-secondary)' }}
                            >
                                {allVisibleSelected ? 'Clear Visible' : 'Select Visible'}
                            </button>
                            <button
                                type='button'
                                onClick={copyVisibleQueue}
                                className='rounded-md border px-3 py-1.5 text-xs font-semibold'
                                style={{ borderColor: 'var(--mid-main-secondary)' }}
                            >
                                <span className='inline-flex items-center gap-1'>
                                    <FiCopy />
                                    Copy Visible
                                </span>
                            </button>
                            <button
                                type='button'
                                onClick={copySelectedQueue}
                                disabled={!selectedIds.length}
                                className='rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-70'
                                style={{ borderColor: 'var(--mid-main-secondary)' }}
                            >
                                <span className='inline-flex items-center gap-1'>
                                    <FiClipboard />
                                    Copy Selected
                                </span>
                            </button>
                        </div>
                    </div>

                    {!!copyFeedback && (
                        <p className='pb-2 text-xs font-semibold' style={{ color: 'var(--accent-color)' }}>{copyFeedback}</p>
                    )}

                    <div className='max-h-[620px] space-y-3 overflow-auto pr-1'>
                        {!filteredRows.length && (
                            <p className='rounded-md border px-3 py-4 text-sm' style={{ borderColor: 'var(--mid-main-secondary)' }}>
                                No problems match your current filters.
                            </p>
                        )}

                        {filteredRows.map((item) => {
                            const selected = selectedIds.includes(item.id);
                            const active = item.id === activeId;

                            return (
                                <article
                                    key={item.id}
                                    className='rounded-lg border p-3 transition'
                                    style={{
                                        borderColor: active ? 'var(--accent-color)' : 'var(--mid-main-secondary)',
                                        backgroundColor: active ? 'var(--french-gray)' : 'var(--main-color)',
                                        opacity: item.published ? 0.62 : 1
                                    }}
                                >
                                    <div className='flex items-start justify-between gap-2'>
                                        <label className='inline-flex items-center gap-2 text-xs font-semibold'>
                                            <input
                                                type='checkbox'
                                                checked={selected}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setSelectedIds((prev) => [...new Set([...prev, item.id])]);
                                                    } else {
                                                        setSelectedIds((prev) => prev.filter((id) => id !== item.id));
                                                    }
                                                }}
                                            />
                                            {item.id}
                                        </label>

                                        <span className='rounded px-2 py-0.5 text-xs font-semibold' style={workflowStyles[item.workflowStatus]}>
                                            {item.workflowStatus}
                                        </span>
                                    </div>

                                    <button
                                        type='button'
                                        onClick={() => setActiveId(item.id)}
                                        className='w-full pt-2 text-left'
                                    >
                                        <p className='font-bold'>{item.title}</p>
                                        <p className='pt-1 text-xs text-[var(--mid-main-secondary)]'>
                                            {item.topic} • {item.difficulty} • Grade {item.grade} • Quality {item.qualityScore}
                                        </p>
                                    </button>

                                    <div className='pt-2 flex flex-wrap gap-2 text-[11px]'>
                                        <span className='rounded border px-2 py-0.5' style={{ borderColor: 'var(--mid-main-secondary)' }}>
                                            {item.published ? 'Published' : 'Not Published'}
                                        </span>
                                        <span className='rounded border px-2 py-0.5' style={{ borderColor: 'var(--mid-main-secondary)' }}>
                                            Similar: {item.similarCount}
                                        </span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>

                <aside className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    {!activeProblem ? (
                        <p className='text-sm'>Pick a problem from the list to inspect details.</p>
                    ) : (
                        <>
                            <div className='flex flex-wrap items-start justify-between gap-2'>
                                <div>
                                    <p className='text-xs font-semibold text-[var(--mid-main-secondary)]'>{activeProblem.id}</p>
                                    <h3 className='pt-1 text-lg font-black'>{activeProblem.title}</h3>
                                </div>
                                <span className='rounded px-2 py-1 text-xs font-semibold' style={workflowStyles[activeProblem.workflowStatus]}>
                                    {activeProblem.workflowStatus}
                                </span>
                            </div>

                            <p className='pt-2 text-xs text-[var(--mid-main-secondary)]'>
                                Author: {activeProblem.author} • Created: {new Date(activeProblem.createdAt).toLocaleDateString()} • Last edit: {new Date(activeProblem.lastEditedAt).toLocaleDateString()}
                            </p>

                            <div className='pt-4 space-y-3'>
                                <div className='rounded-md border p-3' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--french-gray)' }}>
                                    <p className='text-xs font-semibold uppercase'>Statement</p>
                                    <p className='pt-1 text-sm'>{activeProblem.statement}</p>
                                </div>

                                <div className='rounded-md border p-3' style={{ borderColor: 'var(--mid-main-secondary)' }}>
                                    <p className='text-xs font-semibold uppercase'>Expected Answer</p>
                                    <p className='pt-1 text-sm'>{activeProblem.expectedAnswer}</p>
                                </div>

                                {!!activeProblem.hints.length && (
                                    <div className='rounded-md border p-3' style={{ borderColor: 'var(--mid-main-secondary)' }}>
                                        <p className='text-xs font-semibold uppercase'>Hints</p>
                                        <ul className='list-disc pl-5 pt-1 text-sm'>
                                            {activeProblem.hints.map((hint) => (
                                                <li key={hint}>{hint}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className='rounded-md border p-3' style={{ borderColor: 'var(--mid-main-secondary)' }}>
                                    <p className='text-xs font-semibold uppercase'>Review Flags</p>
                                    {!activeProblem.reviewFlags.length ? (
                                        <p className='pt-1 text-sm'>No active flags.</p>
                                    ) : (
                                        <ul className='list-disc pl-5 pt-1 text-sm'>
                                            {activeProblem.reviewFlags.map((flag) => (
                                                <li key={flag}>{flag}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className='pt-4'>
                                <p className='text-xs font-semibold uppercase'>Quick Review Actions</p>
                                <div className='pt-2 flex flex-wrap gap-2'>
                                    <button
                                        type='button'
                                        onClick={() => setStatusForIds([activeProblem.id], 'In Review')}
                                        className='rounded-md border px-3 py-1.5 text-xs font-semibold'
                                        style={{ borderColor: 'var(--mid-main-secondary)' }}
                                    >
                                        Mark In Review
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => setStatusForIds([activeProblem.id], 'Needs Fix')}
                                        className='rounded-md border px-3 py-1.5 text-xs font-semibold'
                                        style={{ borderColor: 'var(--mid-main-secondary)' }}
                                    >
                                        Mark Needs Fix
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => setStatusForIds([activeProblem.id], 'Approved')}
                                        className='rounded-md border px-3 py-1.5 text-xs font-semibold text-[var(--main-color)]'
                                        style={{ borderColor: 'var(--secondary-color)', backgroundColor: 'var(--secondary-color)' }}
                                    >
                                        <span className='inline-flex items-center gap-1'>
                                            <FiCheckCircle />
                                            Approve
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className='pt-4'>
                                <p className='text-xs font-semibold uppercase'>Reviewer Notes (Local Draft)</p>
                                <textarea
                                    value={reviewNotesById[activeProblem.id] || ''}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setReviewNotesById((prev) => ({ ...prev, [activeProblem.id]: value }));
                                    }}
                                    placeholder='Write improvement notes, edge cases, or publish guidance...'
                                    className='pt-2 min-h-24 w-full rounded-md border p-3 text-sm outline-none'
                                    style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--french-gray)' }}
                                />
                            </div>

                            <div className='pt-4 flex flex-wrap gap-2'>
                                <button
                                    type='button'
                                    onClick={() => copyText(`${activeProblem.id} | ${activeProblem.title}`, 'Copied active problem reference.')}
                                    className='rounded-md border px-3 py-1.5 text-xs font-semibold'
                                    style={{ borderColor: 'var(--mid-main-secondary)' }}
                                >
                                    Copy Active Ref
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setStatusForIds(selectedIds, 'Approved')}
                                    disabled={!selectedIds.length}
                                    className='rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-70'
                                    style={{ borderColor: 'var(--mid-main-secondary)' }}
                                >
                                    Approve Selected ({selectedIds.length})
                                </button>
                            </div>
                        </>
                    )}
                </aside>
            </div>
        </section>
    );
};

export default AdminReviewProblems;

