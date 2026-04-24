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

const emptyLoadMeta = {
    count: 0,
    fetched: 0,
    pagesFetched: 0,
    pageSize: 100
};

const tooltipStyle = {
    backgroundColor: 'var(--main-color)',
    border: '1px solid var(--mid-main-secondary)',
    borderRadius: '10px',
    color: 'var(--secondary-color)'
};

const badgeStyleByStatus = {
    Completed: { backgroundColor: 'var(--secondary-color)', color: 'var(--main-color)' },
    'In Progress': { backgroundColor: 'var(--accent-color)', color: 'var(--main-color)' },
    'Not Started': { backgroundColor: 'var(--mid-main-secondary)', color: 'var(--raisin-black)' }
};

const difficultyDisplayRank = {
    beginner: 1,
    easy: 2,
    standard: 3,
    intermediate: 4,
    medium: 5,
    challenging: 6,
    hard: 7,
    advanced: 8,
    expert: 9,
    unknown: 99
};

const difficultyColorPalette = [
    '#2563eb',
    '#7c3aed',
    '#0f766e',
    '#be123c',
    '#0ea5e9',
    '#f97316',
    '#6366f1'
];

const normalizeDifficultyKey = (difficulty) => String(difficulty || '').trim().toLowerCase();

const formatDifficultyLabel = (difficulty) => {
    const raw = String(difficulty || '').trim();
    if (!raw) return 'Unknown';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const getDifficultyColor = (difficultyKey, index) => {
    if (difficultyKey === 'easy') return '#16a34a';
    if (difficultyKey === 'medium') return '#d97706';
    if (difficultyKey === 'hard') return '#a3142c';
    return difficultyColorPalette[index % difficultyColorPalette.length];
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
    const [exporting, setExporting] = useState(false);

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
        const distribution = filteredProblems.reduce((map, row) => {
            const key = normalizeDifficultyKey(row?.difficulty) || 'unknown';
            const existing = map.get(key) || {
                key,
                name: formatDifficultyLabel(row?.difficulty),
                value: 0
            };
            existing.value += 1;
            map.set(key, existing);
            return map;
        }, new Map());

        return Array.from(distribution.values())
            .sort((a, b) => {
                const rankDiff = (difficultyDisplayRank[a.key] ?? 99) - (difficultyDisplayRank[b.key] ?? 99);
                if (rankDiff !== 0) return rankDiff;
                return a.name.localeCompare(b.name);
            })
            .map((item, index) => ({
                ...item,
                color: getDifficultyColor(item.key, index)
            }));
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

    const orderedAllProblems = useMemo(() => {
        return [...normalizedProblems].sort((a, b) => {
            if (a.numericId !== b.numericId) return a.numericId - b.numericId;
            return a.title.localeCompare(b.title);
        });
    }, [normalizedProblems]);

    const handleExportJson = async () => {
        setExporting(true);

        try {
            let detailsSnapshot = detailsById;

            if (!detailsReady || Object.keys(detailsSnapshot).length < orderedAllProblems.length) {
                const allDetails = await getAllAdminProblemDetails();
                detailsSnapshot = (Array.isArray(allDetails) ? allDetails : []).reduce((map, detail) => {
                    const key = String(detail?.id || '');
                    if (key) map[key] = detail;
                    return map;
                }, {});
                setDetailsById(detailsSnapshot);
            }

            const exportRows = orderedAllProblems.map((problem) => {
                const detail = detailsSnapshot[problem.id] || {};

                return {
                    id: problem.numericId,
                    title: detail.title || problem.title,
                    slug: detail.slug || problem.slug || '',
                    topic: detail.topic || problem.topic,
                    difficulty: detail.difficulty || problem.difficulty,
                    premium: Boolean(detail.premium ?? problem.premium),
                    source: problem.source,
                    status: problem.status,
                    createdAt: detail.createdAt || problem.createdAt,
                    updatedAt: detail.updatedAt || null,
                    solvedCount: Number(detail.solvedCount ?? problem.solvedCount ?? 0),
                    attempts: Number(detail.attempts ?? problem.attempts ?? 0),
                    solveRate: Number(detail.solveRate ?? problem.solveRate ?? 0),
                    description: detail.description || problem.description || '',
                    solution: detail.solution || '',
                    answer: detail.answer || '',
                    acceptedAnswers: Array.isArray(detail.acceptedAnswers) ? detail.acceptedAnswers : [],
                    hints: Array.isArray(detail.hints) ? detail.hints : []
                };
            });

            const payload = {
                exportedAt: new Date().toISOString(),
                total: exportRows.length,
                sort: 'id_asc',
                data: exportRows
            };

            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `problem-library-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(url);
        } catch (exportError) {
            setError(exportError?.message || 'Failed to export problems JSON.');
        } finally {
            setExporting(false);
        }
    };

    const canGoPrevWeek = range === 'week' && weekIndex < maxWeekIndex;
    const canGoNextWeek = range === 'week' && weekIndex > 0;

    return (
        <section className='flex flex-col gap-6 px-3 py-2 md:px-5' style={{ color: 'var(--secondary-color)' }}>
            <header
                className='rounded-xl border p-5'
                style={{
                    borderColor: 'var(--mid-main-secondary)',
                    background: 'linear-gradient(135deg, var(--main-color), var(--french-gray))'
                }}
            >
                <div className='flex flex-wrap items-start justify-between gap-3'>
                    <div>
                        <h1 className='text-2xl font-black md:text-3xl'>Problem Library</h1>
                        <p className='pt-1 pb-2 text-sm md:text-base'>
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
                                borderColor: range === 'week' ? 'var(--accent-color)' : 'var(--mid-main-secondary)',
                                backgroundColor: range === 'week' ? 'var(--accent-color)' : 'var(--main-color)',
                                color: range === 'week' ? 'var(--main-color)' : 'var(--secondary-color)'
                            }}
                        >
                            Last Week
                        </button>
                        <button
                            type='button'
                            onClick={() => setRange('month')}
                            className='rounded-md border px-3 py-1.5 text-sm font-semibold transition'
                            style={{
                                borderColor: range === 'month' ? 'var(--accent-color)' : 'var(--mid-main-secondary)',
                                backgroundColor: range === 'month' ? 'var(--accent-color)' : 'var(--main-color)',
                                color: range === 'month' ? 'var(--main-color)' : 'var(--secondary-color)'
                            }}
                        >
                            Last Month
                        </button>
                    </div>
                </div>

                <div className='pt-3 flex flex-wrap items-center gap-2'>
                    <span
                        className='rounded-md px-2 py-1 text-xs font-semibold'
                        style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--main-color)' }}
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
                                style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                            >
                                Previous Week
                            </button>
                            <button
                                type='button'
                                disabled={!canGoNextWeek}
                                onClick={() => setWeekIndex((prev) => prev - 1)}
                                className='rounded-md border px-2 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50'
                                style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                            >
                                Next Week
                            </button>
                        </>
                    )}

                    {loading && (
                        <span className='text-xs font-semibold' style={{ color: 'var(--mid-main-secondary)' }}>
                            Loading all problems...
                        </span>
                    )}
                    {!loading && !detailsReady && !error && (
                        <span className='text-xs font-semibold' style={{ color: 'var(--mid-main-secondary)' }}>
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
                <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: 'var(--mid-main-secondary)' }}>Filtered Problems</p>
                    <p className='pt-1 text-2xl font-black'>{overview.total}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: 'var(--mid-main-secondary)' }}>Completed</p>
                    <p className='pt-1 text-2xl font-black'>{overview.published}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: 'var(--mid-main-secondary)' }}>In Progress</p>
                    <p className='pt-1 text-2xl font-black'>{overview.review}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: 'var(--mid-main-secondary)' }}>Avg Solve Rate</p>
                    <p className='pt-1 text-2xl font-black'>{overview.avgSolveRate}%</p>
                </article>
            </div>

            <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                <h2 className='pb-3 text-lg font-bold'>Search and Filters</h2>

                <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4'>
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder='Search by title or ID...'
                        className='rounded-md border px-3 py-2 text-sm outline-none'
                        style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                    />

                    <select value={topic} onChange={(event) => setTopic(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                        {options.topics.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                        {options.difficulties.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <select value={source} onChange={(event) => setSource(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                        {options.sources.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <select value={status} onChange={(event) => setStatus(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                        {options.statuses.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <input
                        type='date'
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        className='rounded-md border px-3 py-2 text-sm'
                        style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
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
                        style={{ borderColor: 'var(--accent-color)', backgroundColor: 'var(--accent-color)', color: 'var(--main-color)' }}
                    >
                        Reset Filters
                    </button>
                </div>
            </article>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-5'>
                <article className='rounded-xl border p-4 xl:col-span-3' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <header className='pb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Problem Flow (Created / Completed / In Progress)</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: 'var(--french-gray)', color: 'var(--secondary-color)' }}>
                            {range === 'month' ? 'Last 30 days' : 'Last 7 days'}
                        </span>
                    </header>
                    <div className='h-72 w-full'>
                        <ResponsiveContainer width='100%' height='100%' minWidth={0}>
                            <BarChart data={activeGraphData} margin={{ left: -8, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid stroke={'var(--french-gray)'} vertical={false} />
                                <XAxis dataKey='label' tick={{ fill: 'var(--secondary-color)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'var(--secondary-color)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Bar dataKey='created' fill={'var(--secondary-color)'} radius={[6, 6, 0, 0]} />
                                <Bar dataKey='published' fill={'var(--dark-accent-color)'} radius={[6, 6, 0, 0]} />
                                <Bar dataKey='flagged' fill={'var(--accent-color)'} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className='rounded-xl border p-4 xl:col-span-2' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <header className='pb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Difficulty Mix (Filtered)</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: 'var(--french-gray)', color: 'var(--secondary-color)' }}>
                            Dynamic
                        </span>
                    </header>
                    <div className='h-72 w-full'>
                        <ResponsiveContainer width='100%' height='100%' minWidth={0}>
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
                <article className='rounded-xl border p-4 xl:col-span-2' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <header className='pb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Average Solve Rate Trend</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: 'var(--french-gray)', color: 'var(--secondary-color)' }}>
                            Quality signal
                        </span>
                    </header>
                    <div className='h-64 w-full'>
                        <ResponsiveContainer width='100%' height='100%' minWidth={0}>
                            <LineChart data={activeGraphData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid stroke={'var(--french-gray)'} vertical={false} />
                                <XAxis dataKey='label' tick={{ fill: 'var(--secondary-color)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'var(--secondary-color)', fontSize: 11 }} unit='%' axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Line type='monotone' dataKey='avgSolveRate' stroke={'var(--dark-accent-color)'} strokeWidth={2.5} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className='rounded-xl border p-4 xl:col-span-1' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <h3 className='pb-3 text-sm font-semibold md:text-base'>Review Queue Snapshot</h3>
                    <div className='space-y-2'>
                        <div className='rounded-lg border p-3' style={{ borderColor: 'var(--french-gray)' }}>
                            <p className='text-xs font-semibold' style={{ color: 'var(--mid-main-secondary)' }}>In Progress Problems</p>
                            <p className='text-xl font-black'>{filteredProblems.filter((item) => item.status === 'In Progress').length}</p>
                        </div>
                        <div className='rounded-lg border p-3' style={{ borderColor: 'var(--french-gray)' }}>
                            <p className='text-xs font-semibold' style={{ color: 'var(--mid-main-secondary)' }}>Low Solve-Rate Problems (&lt;50%)</p>
                            <p className='text-xl font-black'>{filteredProblems.filter((item) => item.attempts > 0 && item.solveRate < 50).length}</p>
                        </div>
                        <div className='rounded-lg border p-3' style={{ borderColor: 'var(--french-gray)' }}>
                            <p className='text-xs font-semibold' style={{ color: 'var(--mid-main-secondary)' }}>No Attempts Yet</p>
                            <p className='text-xl font-black'>{filteredProblems.filter((item) => item.attempts === 0).length}</p>
                        </div>
                    </div>
                </article>
            </div>

            <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                <header className='pb-3 flex items-center justify-between gap-2'>
                    <h2 className='text-lg font-bold'>All Problems Table</h2>
                    <div className='flex items-center gap-2'>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: 'var(--french-gray)', color: 'var(--secondary-color)' }}>
                            {orderedFilteredProblems.length} rows
                        </span>
                        <button
                            type='button'
                            onClick={handleExportJson}
                            disabled={exporting || loading || !orderedAllProblems.length}
                            className='rounded-md border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50'
                            style={{ borderColor: 'var(--dark-accent-color)', backgroundColor: 'var(--dark-accent-color)', color: 'var(--main-color)' }}
                        >
                            {exporting ? 'Exporting...' : 'Download JSON'}
                        </button>
                    </div>
                </header>

                <p className='pb-3 text-xs font-semibold' style={{ color: 'var(--mid-main-secondary)' }}>
                    Loaded {loadMeta.fetched.toLocaleString()} / {loadMeta.count.toLocaleString()} problems in {loadMeta.pagesFetched.toLocaleString()} request(s). No table pagination is applied.
                </p>
                <p className='pb-3 text-xs font-semibold' style={{ color: 'var(--mid-main-secondary)' }}>
                    Ordered by ID (ascending). Full details are preloaded first, then row click opens instantly with no extra fetch.
                </p>

                <div className='overflow-x-auto'>
                    <table className='min-w-full text-left text-sm'>
                        <thead>
                            <tr style={{ color: 'var(--mid-main-secondary)' }}>
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
                                        borderColor: 'var(--french-gray)',
                                        backgroundColor: row.id === selectedProblemId ? 'var(--french-gray)' : 'transparent',
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
                            style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <header className='pb-3 flex flex-wrap items-center justify-between gap-2'>
                                <div>
                                    <h3 className='text-base font-bold md:text-lg'>Problem Reader</h3>
                                    <p className='text-xs font-semibold' style={{ color: 'var(--mid-main-secondary)' }}>
                                        #{selectedProblem.id} • {selectedProblem.title}
                                    </p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <button
                                        type='button'
                                        onClick={() => goToProblemByIndex(selectedProblemIndex - 1)}
                                        disabled={selectedProblemIndex <= 0}
                                        className='rounded-md border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50'
                                        style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => goToProblemByIndex(selectedProblemIndex + 1)}
                                        disabled={selectedProblemIndex < 0 || selectedProblemIndex >= orderedFilteredProblems.length - 1}
                                        className='rounded-md border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50'
                                        style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                                    >
                                        Next
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => setIsReaderOpen(false)}
                                        className='rounded-md border px-3 py-1.5 text-xs font-semibold'
                                        style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </header>

                            {detailsLoading && (
                                <p className='text-sm font-semibold' style={{ color: 'var(--mid-main-secondary)' }}>Loading problem details...</p>
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

                                    <div className='pt-3'>
                                        <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: 'var(--mid-main-secondary)' }}>Description</p>
                                        <p className='pt-1 whitespace-pre-wrap text-sm'>
                                            {selectedProblemDetails.description || selectedProblem.description || 'No description available.'}
                                        </p>
                                    </div>

                                    <div className='pt-3'>
                                        <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: 'var(--mid-main-secondary)' }}>Solution</p>
                                        <p className='pt-1 whitespace-pre-wrap text-sm'>
                                            {selectedProblemDetails.solution || 'No solution available.'}
                                        </p>
                                    </div>

                                    <div className='pt-3 grid grid-cols-1 gap-3 md:grid-cols-2'>
                                        <div>
                                            <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: 'var(--mid-main-secondary)' }}>Answer</p>
                                            <p className='pt-1 whitespace-pre-wrap text-sm'>
                                                {selectedProblemDetails.answer || 'No answer available.'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: 'var(--mid-main-secondary)' }}>Accepted Answers</p>
                                            <ul className='pt-1 list-disc pl-5 text-sm'>
                                                {(Array.isArray(selectedProblemDetails.acceptedAnswers) && selectedProblemDetails.acceptedAnswers.length > 0
                                                    ? selectedProblemDetails.acceptedAnswers
                                                    : ['No accepted answers configured.'])
                                                    .map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className='pt-3'>
                                        <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: 'var(--mid-main-secondary)' }}>Hints</p>
                                        <ul className='pt-1 list-disc pl-5 text-sm'>
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
                    <p className='pt-3 text-sm font-semibold' style={{ color: 'var(--dark-accent-color)' }}>
                        No problems matched current filters.
                    </p>
                )}
            </article>
        </section>
    );
};

export default AdminProblems;

