import React, { useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const palette = {
    raisinBlack: 'var(--raisin-black)',
    secondary: 'var(--secondary-color)',
    mid: 'var(--mid-main-secondary)',
    french: 'var(--french-gray)',
    main: 'var(--main-color)',
    accentLight: 'var(--light-accent-color)',
    accent: 'var(--accent-color)',
    accentDark: 'var(--dark-accent-color)'
};

const problemsMock = [
    { id: 'P-2401', title: 'Linear Expressions Intro', topic: 'Algebra', difficulty: 'Easy', source: 'Internal', status: 'Published', author: 'A. Mentor', date: '2026-03-22', attempts: 4100, solveRate: 78 },
    { id: 'P-2402', title: 'System of Equations', topic: 'Algebra', difficulty: 'Medium', source: 'Internal', status: 'Review', author: 'K. Teacher', date: '2026-03-20', attempts: 2980, solveRate: 52 },
    { id: 'P-2403', title: 'Triangle Similarity', topic: 'Geometry', difficulty: 'Medium', source: 'Olympiad', status: 'Published', author: 'R. Coach', date: '2026-03-18', attempts: 2160, solveRate: 49 },
    { id: 'P-2404', title: 'Probability Tree Model', topic: 'Probability', difficulty: 'Hard', source: 'Contest', status: 'Draft', author: 'S. Author', date: '2026-03-16', attempts: 1320, solveRate: 33 },
    { id: 'P-2405', title: 'Ratio and Scale', topic: 'Arithmetic', difficulty: 'Easy', source: 'Internal', status: 'Published', author: 'A. Mentor', date: '2026-03-14', attempts: 4520, solveRate: 83 },
    { id: 'P-2406', title: 'Quadratic Graph Reasoning', topic: 'Algebra', difficulty: 'Hard', source: 'Olympiad', status: 'Archived', author: 'N. Reviewer', date: '2026-03-12', attempts: 980, solveRate: 27 },
    { id: 'P-2407', title: 'Coordinate Geometry Basics', topic: 'Geometry', difficulty: 'Easy', source: 'Internal', status: 'Published', author: 'K. Teacher', date: '2026-03-10', attempts: 3610, solveRate: 74 },
    { id: 'P-2408', title: 'Combinatorics Case Split', topic: 'Combinatorics', difficulty: 'Hard', source: 'Contest', status: 'Review', author: 'R. Coach', date: '2026-03-08', attempts: 1140, solveRate: 24 }
];

const weekSeries = [
    [
        { label: 'Mon', created: 8, published: 5, flagged: 2, avgSolveRate: 58 },
        { label: 'Tue', created: 7, published: 4, flagged: 1, avgSolveRate: 60 },
        { label: 'Wed', created: 9, published: 6, flagged: 2, avgSolveRate: 62 },
        { label: 'Thu', created: 6, published: 5, flagged: 1, avgSolveRate: 61 },
        { label: 'Fri', created: 10, published: 7, flagged: 3, avgSolveRate: 63 },
        { label: 'Sat', created: 5, published: 3, flagged: 1, avgSolveRate: 64 },
        { label: 'Sun', created: 4, published: 2, flagged: 1, avgSolveRate: 65 }
    ],
    [
        { label: 'Mon', created: 9, published: 6, flagged: 2, avgSolveRate: 60 },
        { label: 'Tue', created: 8, published: 5, flagged: 2, avgSolveRate: 61 },
        { label: 'Wed', created: 11, published: 7, flagged: 3, avgSolveRate: 62 },
        { label: 'Thu', created: 7, published: 5, flagged: 2, avgSolveRate: 63 },
        { label: 'Fri', created: 12, published: 8, flagged: 3, avgSolveRate: 64 },
        { label: 'Sat', created: 6, published: 4, flagged: 1, avgSolveRate: 65 },
        { label: 'Sun', created: 5, published: 3, flagged: 1, avgSolveRate: 66 }
    ],
    [
        { label: 'Mon', created: 10, published: 6, flagged: 3, avgSolveRate: 62 },
        { label: 'Tue', created: 9, published: 5, flagged: 2, avgSolveRate: 63 },
        { label: 'Wed', created: 12, published: 8, flagged: 3, avgSolveRate: 64 },
        { label: 'Thu', created: 8, published: 6, flagged: 2, avgSolveRate: 65 },
        { label: 'Fri', created: 13, published: 9, flagged: 3, avgSolveRate: 66 },
        { label: 'Sat', created: 7, published: 5, flagged: 2, avgSolveRate: 67 },
        { label: 'Sun', created: 6, published: 4, flagged: 1, avgSolveRate: 68 }
    ],
    [
        { label: 'Mon', created: 11, published: 7, flagged: 3, avgSolveRate: 63 },
        { label: 'Tue', created: 10, published: 6, flagged: 2, avgSolveRate: 64 },
        { label: 'Wed', created: 13, published: 9, flagged: 4, avgSolveRate: 65 },
        { label: 'Thu', created: 9, published: 6, flagged: 2, avgSolveRate: 66 },
        { label: 'Fri', created: 14, published: 9, flagged: 3, avgSolveRate: 67 },
        { label: 'Sat', created: 8, published: 5, flagged: 2, avgSolveRate: 68 },
        { label: 'Sun', created: 6, published: 4, flagged: 1, avgSolveRate: 69 }
    ]
];

const monthSeries = Array.from({ length: 30 }, (_, index) => ({
    label: `${index + 1}`,
    created: 7 + ((index * 3) % 8),
    published: 4 + ((index * 2) % 6),
    flagged: 1 + (index % 4),
    avgSolveRate: 57 + ((index * 2) % 15)
}));

const tooltipStyle = {
    backgroundColor: palette.main,
    border: `1px solid ${palette.mid}`,
    borderRadius: '10px',
    color: palette.secondary
};

const badgeStyleByStatus = {
    Published: { backgroundColor: palette.secondary, color: palette.main },
    Review: { backgroundColor: palette.accent, color: palette.main },
    Draft: { backgroundColor: palette.mid, color: palette.raisinBlack },
    Archived: { backgroundColor: palette.accentDark, color: palette.main }
};

const dateFilterPass = (rowDate, selectedDate) => {
    if (!selectedDate) return true;
    return rowDate === selectedDate;
};

const AdminProblems = () => {
    const [search, setSearch] = useState('');
    const [topic, setTopic] = useState('All');
    const [difficulty, setDifficulty] = useState('All');
    const [source, setSource] = useState('All');
    const [status, setStatus] = useState('All');
    const [author, setAuthor] = useState('All');
    const [date, setDate] = useState('');
    const [range, setRange] = useState('week');
    const [weekIndex, setWeekIndex] = useState(0);

    const options = useMemo(() => {
        const uniq = (key) => ['All', ...new Set(problemsMock.map((item) => item[key]))];
        return {
            topics: uniq('topic'),
            difficulties: uniq('difficulty'),
            sources: uniq('source'),
            statuses: uniq('status'),
            authors: uniq('author')
        };
    }, []);

    const filteredProblems = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return problemsMock.filter((row) => {
            const matchesSearch = !needle
                || row.title.toLowerCase().includes(needle)
                || row.id.toLowerCase().includes(needle);

            const matchesTopic = topic === 'All' || row.topic === topic;
            const matchesDifficulty = difficulty === 'All' || row.difficulty === difficulty;
            const matchesSource = source === 'All' || row.source === source;
            const matchesStatus = status === 'All' || row.status === status;
            const matchesAuthor = author === 'All' || row.author === author;
            const matchesDate = dateFilterPass(row.date, date);

            return (
                matchesSearch
                && matchesTopic
                && matchesDifficulty
                && matchesSource
                && matchesStatus
                && matchesAuthor
                && matchesDate
            );
        });
    }, [search, topic, difficulty, source, status, author, date]);

    const activeGraphData = useMemo(() => {
        if (range === 'month') return monthSeries;
        return weekSeries[weekIndex];
    }, [range, weekIndex]);

    const difficultyDistribution = useMemo(() => {
        const base = [
            { name: 'Easy', value: 0, color: palette.secondary },
            { name: 'Medium', value: 0, color: palette.mid },
            { name: 'Hard', value: 0, color: palette.accent }
        ];

        filteredProblems.forEach((row) => {
            const target = base.find((item) => item.name === row.difficulty);
            if (target) target.value += 1;
        });

        return base;
    }, [filteredProblems]);

    const overview = useMemo(() => {
        const total = filteredProblems.length;
        const published = filteredProblems.filter((item) => item.status === 'Published').length;
        const review = filteredProblems.filter((item) => item.status === 'Review').length;
        const avgSolveRate = total
            ? Math.round(filteredProblems.reduce((sum, item) => sum + item.solveRate, 0) / total)
            : 0;

        return { total, published, review, avgSolveRate };
    }, [filteredProblems]);

    const rangeLabel = range === 'month'
        ? 'Last month (mock)'
        : weekIndex === 0
            ? 'Last week (mock)'
            : `Week ${weekIndex + 1} ago (mock)`;

    const canGoPrevWeek = range === 'week' && weekIndex < weekSeries.length - 1;
    const canGoNextWeek = range === 'week' && weekIndex > 0;

    return (
        <section className='flex flex-col gap-6 px-3 py-2 md:px-5' style={{ color: palette.secondary }}>
            <header
                className='rounded-xl border p-5'
                style={{
                    borderColor: palette.mid,
                    background: `linear-gradient(135deg, ${palette.main}, ${palette.french})`
                }}
            >
                <div className='flex flex-wrap items-start justify-between gap-3'>
                    <div>
                        <h1 className='text-2xl font-black md:text-3xl'>Problem Library</h1>
                        <p className='mt-1 text-sm md:text-base'>
                            Searchable table, moderation view, and creation analytics for all problems (placeholder data only).
                        </p>
                    </div>

                    <div className='flex flex-wrap items-center gap-2'>
                        <button
                            type='button'
                            onClick={() => {
                                setRange('week');
                                setWeekIndex(0);
                            }}
                            className='rounded-md border px-3 py-1.5 text-sm font-semibold transition'
                            style={{
                                borderColor: range === 'week' ? palette.accent : palette.mid,
                                backgroundColor: range === 'week' ? palette.accent : palette.main,
                                color: range === 'week' ? palette.main : palette.secondary
                            }}
                        >
                            Last Week
                        </button>
                        <button
                            type='button'
                            onClick={() => setRange('month')}
                            className='rounded-md border px-3 py-1.5 text-sm font-semibold transition'
                            style={{
                                borderColor: range === 'month' ? palette.accent : palette.mid,
                                backgroundColor: range === 'month' ? palette.accent : palette.main,
                                color: range === 'month' ? palette.main : palette.secondary
                            }}
                        >
                            Last Month
                        </button>
                    </div>
                </div>

                <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <span
                        className='rounded-md px-2 py-1 text-xs font-semibold'
                        style={{ backgroundColor: palette.secondary, color: palette.main }}
                    >
                        {rangeLabel}
                    </span>

                    {range === 'week' && (
                        <>
                            <button
                                type='button'
                                disabled={!canGoPrevWeek}
                                onClick={() => setWeekIndex((prev) => prev + 1)}
                                className='rounded-md border px-2 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50'
                                style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                            >
                                Previous Week
                            </button>
                            <button
                                type='button'
                                disabled={!canGoNextWeek}
                                onClick={() => setWeekIndex((prev) => prev - 1)}
                                className='rounded-md border px-2 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50'
                                style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                            >
                                Next Week
                            </button>
                        </>
                    )}
                </div>
            </header>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Filtered Problems</p>
                    <p className='mt-1 text-2xl font-black'>{overview.total} (mock)</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Published</p>
                    <p className='mt-1 text-2xl font-black'>{overview.published} (mock)</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>In Review</p>
                    <p className='mt-1 text-2xl font-black'>{overview.review} (mock)</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Avg Solve Rate</p>
                    <p className='mt-1 text-2xl font-black'>{overview.avgSolveRate}% (mock)</p>
                </article>
            </div>

            <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                <h2 className='mb-3 text-lg font-bold'>Search and Filters</h2>

                <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4'>
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder='Search by title or ID...'
                        className='rounded-md border px-3 py-2 text-sm outline-none'
                        style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                    />

                    <select value={topic} onChange={(event) => setTopic(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                        {options.topics.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                        {options.difficulties.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <select value={source} onChange={(event) => setSource(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                        {options.sources.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <select value={status} onChange={(event) => setStatus(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                        {options.statuses.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <select value={author} onChange={(event) => setAuthor(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                        {options.authors.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <input
                        type='date'
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        className='rounded-md border px-3 py-2 text-sm'
                        style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                    />

                    <button
                        type='button'
                        onClick={() => {
                            setSearch('');
                            setTopic('All');
                            setDifficulty('All');
                            setSource('All');
                            setStatus('All');
                            setAuthor('All');
                            setDate('');
                        }}
                        className='rounded-md border px-3 py-2 text-sm font-semibold'
                        style={{ borderColor: palette.accent, backgroundColor: palette.accent, color: palette.main }}
                    >
                        Reset Filters
                    </button>
                </div>
            </article>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-5'>
                <article className='rounded-xl border p-4 xl:col-span-3' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='mb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Problem Flow (Created / Published / Flagged)</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            {range === 'month' ? 'Last 30 days' : 'Last 7 days'}
                        </span>
                    </header>
                    <div className='h-72 w-full'>
                        <ResponsiveContainer>
                            <BarChart data={activeGraphData} margin={{ left: -8, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid stroke={palette.french} vertical={false} />
                                <XAxis dataKey='label' tick={{ fill: palette.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: palette.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Bar dataKey='created' fill={palette.secondary} radius={[6, 6, 0, 0]} />
                                <Bar dataKey='published' fill={palette.accentDark} radius={[6, 6, 0, 0]} />
                                <Bar dataKey='flagged' fill={palette.accent} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className='rounded-xl border p-4 xl:col-span-2' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='mb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Difficulty Mix (Filtered)</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            Dynamic
                        </span>
                    </header>
                    <div className='h-72 w-full'>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={difficultyDistribution}
                                    dataKey='value'
                                    nameKey='name'
                                    cx='50%'
                                    cy='50%'
                                    innerRadius={55}
                                    outerRadius={92}
                                    paddingAngle={3}
                                >
                                    {difficultyDistribution.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='flex flex-wrap gap-3 text-xs'>
                        {difficultyDistribution.map((item) => (
                            <div key={item.name} className='flex items-center gap-2'>
                                <span className='h-2.5 w-2.5 rounded-full' style={{ backgroundColor: item.color }} />
                                <span>{item.name}: {item.value} (mock)</span>
                            </div>
                        ))}
                    </div>
                </article>
            </div>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-3'>
                <article className='rounded-xl border p-4 xl:col-span-2' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='mb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Average Solve Rate Trend</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            Quality signal
                        </span>
                    </header>
                    <div className='h-64 w-full'>
                        <ResponsiveContainer>
                            <LineChart data={activeGraphData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid stroke={palette.french} vertical={false} />
                                <XAxis dataKey='label' tick={{ fill: palette.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: palette.secondary, fontSize: 11 }} unit='%' axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Line type='monotone' dataKey='avgSolveRate' stroke={palette.accentDark} strokeWidth={2.5} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className='rounded-xl border p-4 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <h3 className='mb-3 text-sm font-semibold md:text-base'>Review Queue Snapshot</h3>
                    <div className='space-y-2'>
                        <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                            <p className='text-xs font-semibold' style={{ color: palette.mid }}>Needs Moderation</p>
                            <p className='text-xl font-black'>14 (mock)</p>
                        </div>
                        <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                            <p className='text-xs font-semibold' style={{ color: palette.mid }}>Low Solve-Rate Problems</p>
                            <p className='text-xl font-black'>9 (mock)</p>
                        </div>
                        <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                            <p className='text-xs font-semibold' style={{ color: palette.mid }}>Stale Drafts {'>'} 14 days</p>
                            <p className='text-xl font-black'>6 (mock)</p>
                        </div>
                    </div>
                </article>
            </div>

            <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                <header className='mb-3 flex items-center justify-between gap-2'>
                    <h2 className='text-lg font-bold'>All Problems Table</h2>
                    <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                        {filteredProblems.length} rows (mock)
                    </span>
                </header>

                <div className='overflow-x-auto'>
                    <table className='min-w-full text-left text-sm'>
                        <thead>
                            <tr style={{ color: palette.mid }}>
                                <th className='pb-2 pr-4 font-semibold'>ID</th>
                                <th className='pb-2 pr-4 font-semibold'>Title</th>
                                <th className='pb-2 pr-4 font-semibold'>Topic</th>
                                <th className='pb-2 pr-4 font-semibold'>Difficulty</th>
                                <th className='pb-2 pr-4 font-semibold'>Source</th>
                                <th className='pb-2 pr-4 font-semibold'>Status</th>
                                <th className='pb-2 pr-4 font-semibold'>Author</th>
                                <th className='pb-2 pr-4 font-semibold'>Date</th>
                                <th className='pb-2 pr-4 font-semibold'>Attempts</th>
                                <th className='pb-2 font-semibold'>Solve Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProblems.map((row) => (
                                <tr key={row.id} className='border-t' style={{ borderColor: palette.french }}>
                                    <td className='py-2 pr-4 font-semibold'>{row.id}</td>
                                    <td className='py-2 pr-4'>{row.title}</td>
                                    <td className='py-2 pr-4'>{row.topic}</td>
                                    <td className='py-2 pr-4'>{row.difficulty}</td>
                                    <td className='py-2 pr-4'>{row.source}</td>
                                    <td className='py-2 pr-4'>
                                        <span className='rounded-md px-2 py-1 text-xs font-semibold' style={badgeStyleByStatus[row.status]}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className='py-2 pr-4'>{row.author}</td>
                                    <td className='py-2 pr-4'>{row.date}</td>
                                    <td className='py-2 pr-4'>{row.attempts.toLocaleString()} (mock)</td>
                                    <td className='py-2'>{row.solveRate}% (mock)</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProblems.length === 0 && (
                    <p className='mt-3 text-sm font-semibold' style={{ color: palette.accentDark }}>
                        No mock problems matched current filters.
                    </p>
                )}
            </article>
        </section>
    );
};

export default AdminProblems;