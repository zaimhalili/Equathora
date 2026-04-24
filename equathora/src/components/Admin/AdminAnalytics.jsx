import React, { useEffect, useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {
    FiAlertTriangle,
    FiCheckCircle,
    FiClock,
    FiTrendingUp,
    FiUserPlus,
    FiUsers
} from 'react-icons/fi';
import { getAdminAnalytics } from '@/lib/adminAnalyticsService';

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

const chartTooltipStyles = {
    backgroundColor: palette.main,
    border: `1px solid ${palette.mid}`,
    borderRadius: '10px',
    color: palette.secondary
};

const emptyAnalytics = {
    rangeLabel: 'No data',
    trends: [],
    overview: {
        avgDau: 0,
        totalSignups: 0,
        totalSolved: 0,
        totalReports: 0,
        reportsPerThousand: 0
    },
    kpis: {
        dailyActiveUsers: 0,
        weeklyActiveUsers: 0,
        newSignups: 0,
        retentionD7: 0,
        solvedProblems: 0,
        reportCount: 0
    },
    retention: [],
    issueDistribution: [],
    systemHealth: [],
    moderationAlerts: [],
    topTopics: []
};

const issueColors = [
    palette.accent,
    palette.accentDark,
    palette.secondary,
    palette.mid,
    palette.accentLight
];

const healthToneByStatus = {
    Healthy: palette.secondary,
    Stable: palette.mid,
    Good: palette.secondary,
    Normal: palette.accentDark,
    Watch: palette.accent,
    Warning: palette.accent,
    Critical: '#b91c1c'
};

const formatNumber = (value) => Number(value || 0).toLocaleString();

const AdminAnalytics = () => {
    const [range, setRange] = useState('week');
    const [weekIndex, setWeekIndex] = useState(0);
    const [analytics, setAnalytics] = useState(emptyAnalytics);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            setLoading(true);
            setError('');

            try {
                const data = await getAdminAnalytics({
                    range,
                    weekOffset: range === 'week' ? weekIndex : 0
                });

                if (data?.__fetchError) {
                    setError(data.__fetchError);
                }

                if (!isMounted) return;
                setAnalytics({
                    ...emptyAnalytics,
                    ...data,
                    trends: data?.trends || [],
                    overview: { ...emptyAnalytics.overview, ...(data?.overview || {}) },
                    kpis: { ...emptyAnalytics.kpis, ...(data?.kpis || {}) },
                    retention: data?.retention || [],
                    issueDistribution: data?.issueDistribution || [],
                    systemHealth: data?.systemHealth || [],
                    moderationAlerts: data?.moderationAlerts || [],
                    topTopics: data?.topTopics || []
                });
            } catch (err) {
                if (!isMounted) return;
                setError(err?.message || 'Failed to load analytics data.');
                setAnalytics(emptyAnalytics);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            isMounted = false;
        };
    }, [range, weekIndex]);

    const activeTrendData = analytics.trends;
    const overviewStats = analytics.overview;

    const canGoPrevWeek = range === 'week' && weekIndex < 12;
    const canGoNextWeek = range === 'week' && weekIndex > 0;

    const kpiCards = useMemo(() => [
        {
            title: 'Daily Active Users',
            value: formatNumber(analytics.kpis.dailyActiveUsers),
            hint: 'Distinct users active in last 24h',
            icon: FiUsers,
            accent: palette.secondary
        },
        {
            title: 'Weekly Active Users',
            value: formatNumber(analytics.kpis.weeklyActiveUsers),
            hint: 'Distinct users active in last 7d',
            icon: FiTrendingUp,
            accent: palette.accent
        },
        {
            title: 'New Signups',
            value: formatNumber(analytics.kpis.newSignups),
            hint: 'Signups in selected range',
            icon: FiUserPlus,
            accent: palette.accentDark
        },
        {
            title: 'Retention (D7)',
            value: `${Number(analytics.kpis.retentionD7 || 0).toFixed(1)}%`,
            hint: 'Users retained after 7 days',
            icon: FiClock,
            accent: palette.mid
        },
        {
            title: 'Solved Problems',
            value: formatNumber(analytics.kpis.solvedProblems),
            hint: 'Correct attempts in selected range',
            icon: FiCheckCircle,
            accent: palette.secondary
        },
        {
            title: 'Issue Signals',
            value: formatNumber(analytics.kpis.reportCount),
            hint: 'Incorrect attempts in selected range',
            icon: FiAlertTriangle,
            accent: palette.accent
        }
    ], [analytics.kpis]);

    const issueDistributionData = useMemo(() => analytics.issueDistribution.map((item, index) => ({
        ...item,
        color: issueColors[index % issueColors.length]
    })), [analytics.issueDistribution]);

    return (
        <section className='flex flex-col gap-6 px-3 py-2 text-[var(--secondary-color)] md:px-5'>
            <div
                className='rounded-xl border p-5'
                style={{
                    borderColor: palette.mid,
                    background: `linear-gradient(135deg, ${palette.main}, ${palette.french})`
                }}
            >
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h1 className='text-2xl font-black md:text-3xl'>Admin Analytics</h1>
                        <p className='pt-1 text-sm md:text-base' style={{ color: palette.secondary }}>
                            Real-time product and engagement metrics from backend data.
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

                <div className='pt-3 flex flex-wrap items-center gap-2'>
                    <span
                        className='rounded-md px-2 py-1 text-xs font-semibold'
                        style={{ backgroundColor: palette.secondary, color: palette.main }}
                    >
                        {analytics.rangeLabel}
                    </span>

                    {range === 'week' && (
                        <>
                            <button
                                type='button'
                                disabled={!canGoPrevWeek || loading}
                                onClick={() => setWeekIndex((prev) => prev + 1)}
                                className='rounded-md border px-2 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50'
                                style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                            >
                                Previous Week
                            </button>
                            <button
                                type='button'
                                disabled={!canGoNextWeek || loading}
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
                            Loading data...
                        </span>
                    )}
                    {!!error && (
                        <span className='text-xs font-semibold text-red-500'>
                            {error}
                        </span>
                    )}
                </div>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5'>
                <article className='rounded-xl border p-4 sm:col-span-2 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Avg DAU</p>
                    <p className='pt-1 text-2xl font-black'>{formatNumber(overviewStats.avgDau)}</p>
                </article>
                <article className='rounded-xl border p-4 sm:col-span-2 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Signups</p>
                    <p className='pt-1 text-2xl font-black'>{formatNumber(overviewStats.totalSignups)}</p>
                </article>
                <article className='rounded-xl border p-4 sm:col-span-2 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Solved</p>
                    <p className='pt-1 text-2xl font-black'>{formatNumber(overviewStats.totalSolved)}</p>
                </article>
                <article className='rounded-xl border p-4 sm:col-span-2 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Issue Signals</p>
                    <p className='pt-1 text-2xl font-black'>{formatNumber(overviewStats.totalReports)}</p>
                </article>
                <article className='rounded-xl border p-4 sm:col-span-2 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Issues / 1k Solves</p>
                    <p className='pt-1 text-2xl font-black'>{formatNumber(overviewStats.reportsPerThousand)}</p>
                </article>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
                {kpiCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <article
                            key={card.title}
                            className='rounded-xl border p-4'
                            style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                        >
                            <div className='flex items-start justify-between gap-2'>
                                <h2 className='text-sm font-semibold'>{card.title}</h2>
                                <Icon className='text-lg' style={{ color: card.accent }} />
                            </div>
                            <p className='pt-2 text-2xl font-black'>{card.value}</p>
                            <p className='pt-1 text-xs' style={{ color: palette.mid }}>{card.hint}</p>
                        </article>
                    );
                })}
            </div>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-5'>
                <article className='rounded-xl border p-4 xl:col-span-3' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='pb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Active Users Trend</h3>
                        <span
                            className='rounded-md px-2 py-1 text-xs'
                            style={{ backgroundColor: palette.french, color: palette.secondary }}
                        >
                            {range === 'month' ? '30 points' : '7 points'}
                        </span>
                    </header>
                    <div className='h-72 w-full'>
                        <ResponsiveContainer>
                            <AreaChart data={activeTrendData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id='dauFill' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='5%' stopColor={palette.accent} stopOpacity={0.35} />
                                        <stop offset='95%' stopColor={palette.accent} stopOpacity={0.04} />
                                    </linearGradient>
                                    <linearGradient id='wauFill' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='5%' stopColor={palette.secondary} stopOpacity={0.28} />
                                        <stop offset='95%' stopColor={palette.secondary} stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke={palette.french} vertical={false} />
                                <XAxis dataKey='label' tick={{ fill: palette.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: palette.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={chartTooltipStyles} />
                                <Area type='monotone' dataKey='wau' stroke={palette.secondary} strokeWidth={2} fill='url(#wauFill)' />
                                <Area type='monotone' dataKey='dau' stroke={palette.accent} strokeWidth={2} fill='url(#dauFill)' />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className='rounded-xl border p-4 xl:col-span-2' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='pb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Issue Type Distribution</h3>
                        <span
                            className='rounded-md px-2 py-1 text-xs'
                            style={{ backgroundColor: palette.french, color: palette.secondary }}
                        >
                            Derived from attempts
                        </span>
                    </header>
                    <div className='h-72 w-full'>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={issueDistributionData}
                                    dataKey='value'
                                    nameKey='name'
                                    cx='50%'
                                    cy='50%'
                                    innerRadius={55}
                                    outerRadius={92}
                                    paddingAngle={3}
                                >
                                    {issueDistributionData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={chartTooltipStyles} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='grid grid-cols-2 gap-2 text-xs'>
                        {issueDistributionData.map((item) => (
                            <div key={item.name} className='flex items-center gap-2'>
                                <span className='h-2.5 w-2.5 rounded-full' style={{ backgroundColor: item.color }} />
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </article>
            </div>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-6'>
                <article className='rounded-xl border p-4 xl:col-span-3' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='pb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Signups, Solves & Issue Signals</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            {range === 'month' ? 'Monthly trend' : 'Weekly trend'}
                        </span>
                    </header>
                    <div className='h-72 w-full'>
                        <ResponsiveContainer>
                            <BarChart data={activeTrendData} margin={{ left: -5, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid stroke={palette.french} vertical={false} />
                                <XAxis dataKey='label' tick={{ fill: palette.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: palette.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={chartTooltipStyles} />
                                <Bar dataKey='signups' fill={palette.accentDark} radius={[6, 6, 0, 0]} />
                                <Bar dataKey='solved' fill={palette.secondary} radius={[6, 6, 0, 0]} />
                                <Bar dataKey='reports' fill={palette.accent} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className='rounded-xl border p-4 xl:col-span-2' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='pb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Retention Curve</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            Cohort
                        </span>
                    </header>
                    <div className='h-72 w-full'>
                        <ResponsiveContainer>
                            <AreaChart data={analytics.retention} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id='retentionFill' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='5%' stopColor={palette.accentDark} stopOpacity={0.35} />
                                        <stop offset='95%' stopColor={palette.accentDark} stopOpacity={0.03} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke={palette.french} vertical={false} />
                                <XAxis dataKey='name' tick={{ fill: palette.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: palette.secondary, fontSize: 11 }} axisLine={false} tickLine={false} unit='%' />
                                <Tooltip contentStyle={chartTooltipStyles} />
                                <Area type='monotone' dataKey='value' stroke={palette.accentDark} strokeWidth={2} fill='url(#retentionFill)' />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className='rounded-xl border p-4 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='pb-3'>
                        <h3 className='text-sm font-semibold md:text-base'>System Health</h3>
                    </header>
                    <div className='flex flex-col gap-3'>
                        {analytics.systemHealth.map((item) => (
                            <div key={item.label} className='rounded-lg border p-3' style={{ borderColor: palette.french, backgroundColor: palette.main }}>
                                <p className='text-xs' style={{ color: palette.mid }}>{item.label}</p>
                                <p className='text-lg font-bold'>{item.value}</p>
                                <p className='text-xs font-semibold' style={{ color: healthToneByStatus[item.status] || palette.accentDark }}>{item.status}</p>
                            </div>
                        ))}
                    </div>
                </article>
            </div>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='pb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Moderation Alerts</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            Generated from live signals
                        </span>
                    </header>
                    <div className='space-y-2'>
                        {analytics.moderationAlerts.map((alert) => (
                            <div key={alert.id} className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                                <p className='text-xs font-semibold' style={{ color: palette.mid }}>{alert.id}</p>
                                <p className='text-sm font-semibold'>{alert.title}</p>
                                <p className='text-xs' style={{ color: palette.secondary }}>{alert.priority} priority · {alert.eta}</p>
                            </div>
                        ))}
                        {analytics.moderationAlerts.length === 0 && (
                            <p className='text-sm' style={{ color: palette.mid }}>No active moderation alerts in this range.</p>
                        )}
                    </div>
                </article>

                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='pb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Top Topics Snapshot</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            Live topic ranking
                        </span>
                    </header>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full text-left text-sm'>
                            <thead>
                                <tr>
                                    <th className='pb-2 font-semibold' style={{ color: palette.mid }}>Topic</th>
                                    <th className='pb-2 font-semibold' style={{ color: palette.mid }}>Solves</th>
                                    <th className='pb-2 font-semibold' style={{ color: palette.mid }}>Issues</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.topTopics.map((row) => (
                                    <tr key={row.topic} className='border-t' style={{ borderColor: palette.french }}>
                                        <td className='py-2 pr-4'>{row.topic}</td>
                                        <td className='py-2 pr-4'>{formatNumber(row.solves)}</td>
                                        <td className='py-2'>{formatNumber(row.reports)}</td>
                                    </tr>
                                ))}
                                {analytics.topTopics.length === 0 && (
                                    <tr>
                                        <td className='py-2 text-sm' colSpan={3} style={{ color: palette.mid }}>
                                            No topic activity found for this period.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default AdminAnalytics;
