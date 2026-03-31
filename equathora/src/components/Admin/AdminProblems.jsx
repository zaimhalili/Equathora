import React, { useEffect, useMemo, useState } from 'react';
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
import { getAllAdminProblems, getAllAdminProblemDetails, getAdminProblemDetails } from '@/lib/adminProblemsService';

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

const emptyLoadMeta = {
    count: 0,
    fetched: 0,
    pagesFetched: 0,
    pageSize: 100
};

const tooltipStyle = {
    backgroundColor: palette.main,
    border: `1px solid ${palette.mid}`,
    borderRadius: '10px',
    color: palette.secondary
};

const badgeStyleByStatus = {
    Completed: { backgroundColor: palette.secondary, color: palette.main },
    'In Progress': { backgroundColor: palette.accent, color: palette.main },
    'Not Started': { backgroundColor: palette.mid, color: palette.raisinBlack }
};

const dateFilterPass = (rowDate, selectedDate) => {
    if (!selectedDate) return true;
    return rowDate === selectedDate;
};

const dayLabelFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

const toDateKey = (input) => {
    const raw = input ? new Date(input) : null;
    if (!raw || Number.isNaN(raw.getTime())) return '';

    const year = raw.getFullYear();
    const month = `${raw.getMonth() + 1}`.padStart(2, '0');
    const day = `${raw.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDateForTable = (input) => {
    const raw = input ? new Date(input) : null;
    if (!raw || Number.isNaN(raw.getTime())) return '-';
    return raw.toLocaleDateString();
};

const buildTimeSeries = ({ rows, range, weekIndex }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = range === 'month' ? 30 : 7;
    const shiftDays = range === 'month' ? 0 : weekIndex * 7;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (days - 1) - shiftDays);

    const rowsByDate = rows.reduce((map, row) => {
        if (!row.dateKey) return map;
        if (!map.has(row.dateKey)) map.set(row.dateKey, []);
        map.get(row.dateKey).push(row);
        return map;
    }, new Map());

    return Array.from({ length: days }, (_, index) => {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + index);
        const dateKey = toDateKey(day);
        const dayRows = rowsByDate.get(dateKey) || [];
        const solvedRows = dayRows.filter((item) => item.attempts > 0);
        const avgSolveRate = solvedRows.length
            ? Math.round(solvedRows.reduce((sum, item) => sum + item.solveRate, 0) / solvedRows.length)
            : 0;

        return {
            label: range === 'month' ? `${index + 1}` : dayLabelFormatter.format(day),
            created: dayRows.length,
            published: dayRows.filter((item) => item.status === 'Completed').length,
            flagged: dayRows.filter((item) => item.status === 'In Progress').length,
            avgSolveRate
        };
    });
};

const maxWeekOffsetFromRows = (rows) => {
    const validTimes = rows
        .map((item) => new Date(item.createdAt).getTime())
        .filter((value) => Number.isFinite(value));

    if (!validTimes.length) return 0;

    const oldest = Math.min(...validTimes);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysDiff = Math.max(0, Math.floor((today.getTime() - oldest) / (24 * 60 * 60 * 1000)));
    return Math.max(0, Math.floor(daysDiff / 7));
};

const AdminProblems = () => {
    const [problems, setProblems] = useState([]);
    const [loadMeta, setLoadMeta] = useState(emptyLoadMeta);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [topic, setTopic] = useState('All');
    const [difficulty, setDifficulty] = useState('All');
    const [source, setSource] = useState('All');
    const [status, setStatus] = useState('All');
    const [date, setDate] = useState('');
    const [range, setRange] = useState('week');
    const [weekIndex, setWeekIndex] = useState(0);
    const [selectedProblemId, setSelectedProblemId] = useState(null);
    const [isReaderOpen, setIsReaderOpen] = useState(false);
    const [detailsById, setDetailsById] = useState({});
    const [detailsReady, setDetailsReady] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState('');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await getAllAdminProblems({ pageSize: 100 });
                if (!mounted) return;

                setProblems(Array.isArray(response?.data) ? response.data : []);
                setLoadMeta({
                    count: Number(response?.count || 0),
                    fetched: Number(response?.fetched || 0),
                    pagesFetched: Number(response?.pagesFetched || 0),
                    pageSize: Number(response?.pageSize || 100)
                });

                setDetailsReady(false);
                try {
                    const allDetails = await getAllAdminProblemDetails();
                    if (!mounted) return;

                    const detailsMap = (Array.isArray(allDetails) ? allDetails : []).reduce((map, detail) => {
                        const key = String(detail?.id || '');
                        if (key) map[key] = detail;
                        return map;
                    }, {});

                    setDetailsById(detailsMap);
                } catch (detailsLoadError) {
                    if (!mounted) return;
                    console.warn('Bulk preload failed, row click will use on-demand detail fetch.', detailsLoadError);
                    setDetailsById({});
                } finally {
                    if (mounted) {
                        setDetailsReady(true);
                    }
                }
            } catch (loadError) {
                if (!mounted) return;
                setProblems([]);
                setLoadMeta(emptyLoadMeta);
                setDetailsById({});
                setDetailsReady(false);
                setError(loadError?.message || 'Failed to load problem library data.');
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);

    const normalizedProblems = useMemo(() => problems.map((row) => {
        const rowStatus = row?.completed
            ? 'Completed'
            : row?.inProgress
                ? 'In Progress'
                : 'Not Started';

        return {
            id: String(row?.id ?? '-'),
            numericId: Number(row?.id || Number.MAX_SAFE_INTEGER),
            title: row?.title || 'Untitled',
            description: row?.description || '',
            topic: row?.topic || 'Uncategorized',
            difficulty: row?.difficulty || 'Unknown',
            source: row?.premium ? 'Premium' : 'Standard',
            premium: Boolean(row?.premium),
            slug: row?.slug || '',
            status: rowStatus,
            date: formatDateForTable(row?.createdAt),
            dateKey: toDateKey(row?.createdAt),
            attempts: Number(row?.attempts || 0),
            solvedCount: Number(row?.solvedCount || 0),
            solveRate: Number(row?.solveRate || 0),
            createdAt: row?.createdAt || null
        };
    }), [problems]);

    const options = useMemo(() => {
        const uniq = (key) => ['All', ...new Set(normalizedProblems.map((item) => item[key]))];
        return {
            topics: uniq('topic'),
            difficulties: uniq('difficulty'),
            sources: uniq('source'),
            statuses: uniq('status')
        };
    }, [normalizedProblems]);

    const filteredProblems = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return normalizedProblems.filter((row) => {
            const matchesSearch = !needle
                || row.title.toLowerCase().includes(needle)
                || row.id.toLowerCase().includes(needle);

            const matchesTopic = topic === 'All' || row.topic === topic;
            const matchesDifficulty = difficulty === 'All' || row.difficulty === difficulty;
            const matchesSource = source === 'All' || row.source === source;
            const matchesStatus = status === 'All' || row.status === status;
            const matchesDate = dateFilterPass(row.dateKey, date);

            return (
                matchesSearch
                && matchesTopic
                && matchesDifficulty
                && matchesSource
                && matchesStatus
                && matchesDate
            );
        });
    }, [normalizedProblems, search, topic, difficulty, source, status, date]);

    const orderedFilteredProblems = useMemo(() => {
        return [...filteredProblems].sort((a, b) => {
            if (a.numericId !== b.numericId) return a.numericId - b.numericId;
            return a.title.localeCompare(b.title);
        });
    }, [filteredProblems]);

    const selectedProblemIndex = useMemo(() => {
        if (!selectedProblemId) return -1;
        return orderedFilteredProblems.findIndex((row) => row.id === selectedProblemId);
    }, [orderedFilteredProblems, selectedProblemId]);

    const selectedProblem = selectedProblemIndex >= 0
        ? orderedFilteredProblems[selectedProblemIndex]
        : null;

    const selectedProblemDetails = selectedProblem ? detailsById[selectedProblem.id] || null : null;

    const openProblemReader = async (row) => {
        setSelectedProblemId(row.id);
        setIsReaderOpen(true);

        const cached = detailsById[row.id];
        if (cached) {
            setDetailsError('');
            setDetailsLoading(false);
            return;
        }

        setDetailsLoading(true);
        setDetailsError('');

        try {
            const detail = await getAdminProblemDetails(row.id);
            setDetailsById((prev) => ({ ...prev, [row.id]: detail }));
        } catch (detailError) {
            setDetailsError(detailError?.message || 'Failed to load problem details.');
        } finally {
            setDetailsLoading(false);
        }
    };

    const goToProblemByIndex = async (index) => {
        const target = orderedFilteredProblems[index];
        if (!target) return;
        await openProblemReader(target);
    };

    useEffect(() => {
        if (!orderedFilteredProblems.length) {
            if (selectedProblemId) setSelectedProblemId(null);
            return;
        }

        if (!selectedProblemId) {
            setSelectedProblemId(orderedFilteredProblems[0].id);
            return;
        }

        const stillVisible = orderedFilteredProblems.some((row) => row.id === selectedProblemId);
        if (!stillVisible) {
            setSelectedProblemId(orderedFilteredProblems[0].id);
        }
    }, [orderedFilteredProblems, selectedProblemId]);

    const maxWeekIndex = useMemo(() => maxWeekOffsetFromRows(normalizedProblems), [normalizedProblems]);

    const activeGraphData = useMemo(() => {
        return buildTimeSeries({ rows: filteredProblems, range, weekIndex });
    }, [filteredProblems, range, weekIndex]);

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
        const published = filteredProblems.filter((item) => item.status === 'Completed').length;
        const review = filteredProblems.filter((item) => item.status === 'In Progress').length;
        const avgSolveRate = total
            ? Math.round(filteredProblems.reduce((sum, item) => sum + item.solveRate, 0) / total)
            : 0;

        return { total, published, review, avgSolveRate };
    }, [filteredProblems]);

    const rangeLabel = range === 'month'
        ? 'Last 30 days (real data)'
        : weekIndex === 0
            ? 'Last week (real data)'
            : `Week ${weekIndex + 1} ago (real data)`;

    const canGoPrevWeek = range === 'week' && weekIndex < maxWeekIndex;
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
                        <p className='mt-1 pb-2 text-sm md:text-base'>
                            Searchable table and quality analytics from live backend data. All rows are fetched across every page.
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

                    {loading && (
                        <span className='text-xs font-semibold' style={{ color: palette.mid }}>
                            Loading all problems...
                        </span>
                    )}
                    {!loading && !detailsReady && !error && (
                        <span className='text-xs font-semibold' style={{ color: palette.mid }}>
                            Preloading full problem details...
                        </span>
                    )}
                    {!!error && (
                        <span className='text-xs font-semibold text-red-500'>
                            {error}
                        </span>
                    )}
                </div>
            </header>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Filtered Problems</p>
                    <p className='mt-1 text-2xl font-black'>{overview.total}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Completed</p>
                    <p className='mt-1 text-2xl font-black'>{overview.published}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>In Progress</p>
                    <p className='mt-1 text-2xl font-black'>{overview.review}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Avg Solve Rate</p>
                    <p className='mt-1 text-2xl font-black'>{overview.avgSolveRate}%</p>
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
                        <h3 className='text-sm font-semibold md:text-base'>Problem Flow (Created / Completed / In Progress)</h3>
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
                                <span>{item.name}: {item.value}</span>
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
                            <p className='text-xs font-semibold' style={{ color: palette.mid }}>In Progress Problems</p>
                            <p className='text-xl font-black'>{filteredProblems.filter((item) => item.status === 'In Progress').length}</p>
                        </div>
                        <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                            <p className='text-xs font-semibold' style={{ color: palette.mid }}>Low Solve-Rate Problems (&lt;50%)</p>
                            <p className='text-xl font-black'>{filteredProblems.filter((item) => item.attempts > 0 && item.solveRate < 50).length}</p>
                        </div>
                        <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                            <p className='text-xs font-semibold' style={{ color: palette.mid }}>No Attempts Yet</p>
                            <p className='text-xl font-black'>{filteredProblems.filter((item) => item.attempts === 0).length}</p>
                        </div>
                    </div>
                </article>
            </div>

            <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                <header className='mb-3 flex items-center justify-between gap-2'>
                    <h2 className='text-lg font-bold'>All Problems Table</h2>
                    <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                        {orderedFilteredProblems.length} rows
                    </span>
                </header>

                <p className='mb-3 text-xs font-semibold' style={{ color: palette.mid }}>
                    Loaded {loadMeta.fetched.toLocaleString()} / {loadMeta.count.toLocaleString()} problems in {loadMeta.pagesFetched.toLocaleString()} request(s). No table pagination is applied.
                </p>
                <p className='mb-3 text-xs font-semibold' style={{ color: palette.mid }}>
                    Ordered by ID (ascending). Full details are preloaded first, then row click opens instantly with no extra fetch.
                </p>

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
                                <th className='pb-2 pr-4 font-semibold'>Date</th>
                                <th className='pb-2 pr-4 font-semibold'>Solved</th>
                                <th className='pb-2 pr-4 font-semibold'>Attempts</th>
                                <th className='pb-2 font-semibold'>Solve Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderedFilteredProblems.map((row) => (
                                <tr
                                    key={row.id}
                                    className='cursor-pointer border-t transition-colors'
                                    style={{
                                        borderColor: palette.french,
                                        backgroundColor: row.id === selectedProblemId ? palette.french : 'transparent',
                                        opacity: detailsReady ? 1 : 0.65
                                    }}
                                    onClick={() => openProblemReader(row)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            openProblemReader(row);
                                        }
                                    }}
                                    tabIndex={0}
                                >
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
                                    <td className='py-2 pr-4'>{row.date}</td>
                                    <td className='py-2 pr-4'>{row.solvedCount.toLocaleString()}</td>
                                    <td className='py-2 pr-4'>{row.attempts.toLocaleString()}</td>
                                    <td className='py-2'>{row.solveRate.toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isReaderOpen && selectedProblem && (
                    <div className='fixed inset-0 z-[1300] flex items-center justify-center bg-black/55 px-3 py-6' onClick={() => setIsReaderOpen(false)}>
                        <article
                            className='max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl border p-4 md:p-5'
                            style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <header className='mb-3 flex flex-wrap items-center justify-between gap-2'>
                                <div>
                                    <h3 className='text-base font-bold md:text-lg'>Problem Reader</h3>
                                    <p className='text-xs font-semibold' style={{ color: palette.mid }}>
                                        #{selectedProblem.id} • {selectedProblem.title}
                                    </p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <button
                                        type='button'
                                        onClick={() => goToProblemByIndex(selectedProblemIndex - 1)}
                                        disabled={selectedProblemIndex <= 0}
                                        className='rounded-md border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50'
                                        style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => goToProblemByIndex(selectedProblemIndex + 1)}
                                        disabled={selectedProblemIndex < 0 || selectedProblemIndex >= orderedFilteredProblems.length - 1}
                                        className='rounded-md border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50'
                                        style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                                    >
                                        Next
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => setIsReaderOpen(false)}
                                        className='rounded-md border px-3 py-1.5 text-xs font-semibold'
                                        style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </header>

                            {detailsLoading && (
                                <p className='text-sm font-semibold' style={{ color: palette.mid }}>Loading problem details...</p>
                            )}

                            {!!detailsError && (
                                <p className='text-sm font-semibold text-red-500'>{detailsError}</p>
                            )}

                            {!detailsLoading && !detailsError && !selectedProblemDetails && (
                                <p className='text-sm font-semibold text-red-500'>Problem details are unavailable for this row.</p>
                            )}

                            {!detailsLoading && !detailsError && selectedProblemDetails && (
                                <>
                                    <div className='grid grid-cols-1 gap-2 text-sm md:grid-cols-2'>
                                        <p><span className='font-semibold'>ID:</span> {selectedProblemDetails.id}</p>
                                        <p><span className='font-semibold'>Slug:</span> {selectedProblemDetails.slug || selectedProblem.slug || '-'}</p>
                                        <p><span className='font-semibold'>Topic:</span> {selectedProblemDetails.topic || selectedProblem.topic}</p>
                                        <p><span className='font-semibold'>Difficulty:</span> {selectedProblemDetails.difficulty || selectedProblem.difficulty}</p>
                                        <p><span className='font-semibold'>Source:</span> {selectedProblem.source}</p>
                                        <p><span className='font-semibold'>Premium:</span> {(selectedProblemDetails.premium ?? selectedProblem.premium) ? 'Yes' : 'No'}</p>
                                        <p><span className='font-semibold'>Date:</span> {selectedProblem.date}</p>
                                        <p><span className='font-semibold'>Solved:</span> {Number(selectedProblemDetails.solvedCount ?? selectedProblem.solvedCount ?? 0).toLocaleString()}</p>
                                        <p><span className='font-semibold'>Attempts:</span> {Number(selectedProblemDetails.attempts ?? selectedProblem.attempts).toLocaleString()}</p>
                                        <p><span className='font-semibold'>Solve Rate:</span> {Number(selectedProblemDetails.solveRate ?? selectedProblem.solveRate).toFixed(1)}%</p>
                                    </div>

                                    <div className='mt-3'>
                                        <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Description</p>
                                        <p className='mt-1 whitespace-pre-wrap text-sm'>
                                            {selectedProblemDetails.description || selectedProblem.description || 'No description available.'}
                                        </p>
                                    </div>

                                    <div className='mt-3'>
                                        <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Solution</p>
                                        <p className='mt-1 whitespace-pre-wrap text-sm'>
                                            {selectedProblemDetails.solution || 'No solution available.'}
                                        </p>
                                    </div>

                                    <div className='mt-3 grid grid-cols-1 gap-3 md:grid-cols-2'>
                                        <div>
                                            <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Answer</p>
                                            <p className='mt-1 whitespace-pre-wrap text-sm'>
                                                {selectedProblemDetails.answer || 'No answer available.'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Accepted Answers</p>
                                            <ul className='mt-1 list-disc pl-5 text-sm'>
                                                {(Array.isArray(selectedProblemDetails.acceptedAnswers) && selectedProblemDetails.acceptedAnswers.length > 0
                                                    ? selectedProblemDetails.acceptedAnswers
                                                    : ['No accepted answers configured.'])
                                                    .map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className='mt-3'>
                                        <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Hints</p>
                                        <ul className='mt-1 list-disc pl-5 text-sm'>
                                            {(Array.isArray(selectedProblemDetails.hints) && selectedProblemDetails.hints.length > 0
                                                ? selectedProblemDetails.hints
                                                : ['No hints available.'])
                                                .map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </article>
                    </div>
                )}

                {orderedFilteredProblems.length === 0 && (
                    <p className='mt-3 text-sm font-semibold' style={{ color: palette.accentDark }}>
                        No problems matched current filters.
                    </p>
                )}
            </article>
        </section>
    );
};

export default AdminProblems;