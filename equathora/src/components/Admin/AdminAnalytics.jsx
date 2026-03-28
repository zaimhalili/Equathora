import React, { useMemo, useState } from 'react';
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

const kpiCards = [
    {
        title: 'Daily Active Users',
        value: '1,240 (mock)',
        hint: '+8.2% vs yesterday',
        icon: FiUsers,
        accent: palette.secondary
    },
    {
        title: 'Weekly Active Users',
        value: '6,980 (mock)',
        hint: '+5.1% this week',
        icon: FiTrendingUp,
        accent: palette.accent
    },
    {
        title: 'New Signups',
        value: '352 (mock)',
        hint: '7-day rolling average',
        icon: FiUserPlus,
        accent: palette.accentDark
    },
    {
        title: 'Retention (D7)',
        value: '48.6% (mock)',
        hint: '+2.4 pts this month',
        icon: FiClock,
        accent: palette.mid
    },
    {
        title: 'Solved Problems',
        value: '12,430 (mock)',
        hint: 'Across all active users',
        icon: FiCheckCircle,
        accent: palette.secondary
    },
    {
        title: 'Report Count',
        value: '27 (mock)',
        hint: '-11% vs last week',
        icon: FiAlertTriangle,
        accent: palette.accent
    }
];

const weeklyTrendSets = [
    [
        { label: 'Mon', dau: 760, wau: 4200, signups: 30, solved: 360, reports: 4 },
        { label: 'Tue', dau: 810, wau: 4500, signups: 37, solved: 420, reports: 3 },
        { label: 'Wed', dau: 860, wau: 4780, signups: 39, solved: 490, reports: 4 },
        { label: 'Thu', dau: 840, wau: 4920, signups: 36, solved: 520, reports: 2 },
        { label: 'Fri', dau: 910, wau: 5100, signups: 44, solved: 560, reports: 5 },
        { label: 'Sat', dau: 960, wau: 5400, signups: 41, solved: 590, reports: 4 },
        { label: 'Sun', dau: 1010, wau: 5650, signups: 46, solved: 640, reports: 3 }
    ],
    [
        { label: 'Mon', dau: 800, wau: 4700, signups: 35, solved: 405, reports: 4 },
        { label: 'Tue', dau: 870, wau: 4950, signups: 39, solved: 470, reports: 3 },
        { label: 'Wed', dau: 920, wau: 5180, signups: 43, solved: 510, reports: 4 },
        { label: 'Thu', dau: 900, wau: 5350, signups: 40, solved: 550, reports: 2 },
        { label: 'Fri', dau: 970, wau: 5590, signups: 48, solved: 600, reports: 6 },
        { label: 'Sat', dau: 1020, wau: 5820, signups: 45, solved: 670, reports: 4 },
        { label: 'Sun', dau: 1080, wau: 6090, signups: 49, solved: 700, reports: 3 }
    ],
    [
        { label: 'Mon', dau: 850, wau: 5000, signups: 38, solved: 440, reports: 5 },
        { label: 'Tue', dau: 930, wau: 5280, signups: 42, solved: 500, reports: 4 },
        { label: 'Wed', dau: 980, wau: 5500, signups: 47, solved: 560, reports: 4 },
        { label: 'Thu', dau: 960, wau: 5720, signups: 44, solved: 610, reports: 3 },
        { label: 'Fri', dau: 1040, wau: 5980, signups: 54, solved: 660, reports: 6 },
        { label: 'Sat', dau: 1100, wau: 6280, signups: 51, solved: 720, reports: 4 },
        { label: 'Sun', dau: 1160, wau: 6540, signups: 55, solved: 760, reports: 3 }
    ],
    [
        { label: 'Mon', dau: 880, wau: 5200, signups: 40, solved: 470, reports: 5 },
        { label: 'Tue', dau: 960, wau: 5500, signups: 46, solved: 530, reports: 4 },
        { label: 'Wed', dau: 1020, wau: 5750, signups: 50, solved: 590, reports: 5 },
        { label: 'Thu', dau: 990, wau: 5960, signups: 48, solved: 630, reports: 3 },
        { label: 'Fri', dau: 1080, wau: 6230, signups: 57, solved: 690, reports: 6 },
        { label: 'Sat', dau: 1140, wau: 6580, signups: 53, solved: 740, reports: 4 },
        { label: 'Sun', dau: 1210, wau: 6860, signups: 58, solved: 800, reports: 3 }
    ],
    [
        { label: 'Mon', dau: 900, wau: 5400, signups: 42, solved: 490, reports: 5 },
        { label: 'Tue', dau: 990, wau: 5700, signups: 48, solved: 560, reports: 4 },
        { label: 'Wed', dau: 1050, wau: 5950, signups: 53, solved: 620, reports: 5 },
        { label: 'Thu', dau: 1020, wau: 6190, signups: 49, solved: 660, reports: 3 },
        { label: 'Fri', dau: 1110, wau: 6460, signups: 61, solved: 720, reports: 6 },
        { label: 'Sat', dau: 1180, wau: 6780, signups: 56, solved: 790, reports: 4 },
        { label: 'Sun', dau: 1240, wau: 6980, signups: 59, solved: 840, reports: 3 }
    ]
];

const monthTrend = Array.from({ length: 30 }, (_, index) => ({
    label: `${index + 1}`,
    dau: 920 + ((index * 23) % 340),
    wau: 5600 + ((index * 115) % 1900),
    signups: 38 + ((index * 7) % 26),
    solved: 520 + ((index * 33) % 290),
    reports: 2 + (index % 5)
}));

const retentionData = [
    { name: 'D1', value: 72 },
    { name: 'D3', value: 58 },
    { name: 'D7', value: 48.6 },
    { name: 'D14', value: 36 },
    { name: 'D30', value: 24 }
];

const issueDistributionData = [
    { name: 'Bug Report', value: 42, color: palette.accent },
    { name: 'Content Issue', value: 26, color: palette.accentDark },
    { name: 'Account Problem', value: 18, color: palette.secondary },
    { name: 'Abuse Report', value: 14, color: palette.mid }
];

const systemHealth = [
    { label: 'API Uptime', value: '99.97% (mock)', status: 'Healthy', tone: palette.secondary },
    { label: 'Avg Response Time', value: '142ms (mock)', status: 'Stable', tone: palette.mid },
    { label: 'DB Load', value: '64% (mock)', status: 'Watch', tone: palette.accent },
    { label: 'Queue Health', value: 'Good (mock)', status: 'Normal', tone: palette.accentDark }
];

const moderationAlerts = [
    { id: 'MOD-1204', title: 'Spike in content reports', priority: 'High', eta: 'Needs review' },
    { id: 'MOD-1207', title: 'Repeated abuse flags on topic set', priority: 'Medium', eta: '24h window' },
    { id: 'MOD-1210', title: 'Signup fraud pattern detected', priority: 'Low', eta: 'Monitor' }
];

const topTopics = [
    { topic: 'Linear Equations', solves: '2,140 (mock)', reports: '6 (mock)' },
    { topic: 'Quadratics', solves: '1,860 (mock)', reports: '4 (mock)' },
    { topic: 'Ratios & Proportions', solves: '1,420 (mock)', reports: '3 (mock)' },
    { topic: 'Geometry Basics', solves: '1,115 (mock)', reports: '5 (mock)' }
];

const chartTooltipStyles = {
    backgroundColor: palette.main,
    border: `1px solid ${palette.mid}`,
    borderRadius: '10px',
    color: palette.secondary
};

const AdminAnalytics = () => {
    const [range, setRange] = useState('week');
    const [weekIndex, setWeekIndex] = useState(0);

    const activeTrendData = useMemo(() => {
        if (range === 'month') {
            return monthTrend;
        }

        return weeklyTrendSets[weekIndex];
    }, [range, weekIndex]);

    const overviewStats = useMemo(() => {
        const daysCount = activeTrendData.length || 1;
        const totalSignups = activeTrendData.reduce((sum, item) => sum + item.signups, 0);
        const totalSolved = activeTrendData.reduce((sum, item) => sum + item.solved, 0);
        const totalReports = activeTrendData.reduce((sum, item) => sum + item.reports, 0);
        const avgDau = Math.round(activeTrendData.reduce((sum, item) => sum + item.dau, 0) / daysCount);
        const reportsPerThousand = Math.round((totalReports / Math.max(totalSolved, 1)) * 1000);

        return {
            avgDau,
            totalSignups,
            totalSolved,
            totalReports,
            reportsPerThousand
        };
    }, [activeTrendData]);

    const rangeLabel = range === 'month'
        ? 'Last month (placeholder)'
        : weekIndex === 0
            ? 'Last week (placeholder)'
            : `Week ${weekIndex + 1} ago (placeholder)`;

    const canGoPrevWeek = range === 'week' && weekIndex < weeklyTrendSets.length - 1;
    const canGoNextWeek = range === 'week' && weekIndex > 0;

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
                        <p className='mt-1 text-sm md:text-base' style={{ color: palette.secondary }}>
                            Product, growth, and moderation overview. Values below are temporary placeholders.
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
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5'>
                <article className='rounded-xl border p-4 sm:col-span-2 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Avg DAU</p>
                    <p className='mt-1 text-2xl font-black'>{overviewStats.avgDau.toLocaleString()} (mock)</p>
                </article>
                <article className='rounded-xl border p-4 sm:col-span-2 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Signups</p>
                    <p className='mt-1 text-2xl font-black'>{overviewStats.totalSignups.toLocaleString()} (mock)</p>
                </article>
                <article className='rounded-xl border p-4 sm:col-span-2 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Solved</p>
                    <p className='mt-1 text-2xl font-black'>{overviewStats.totalSolved.toLocaleString()} (mock)</p>
                </article>
                <article className='rounded-xl border p-4 sm:col-span-2 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Reports</p>
                    <p className='mt-1 text-2xl font-black'>{overviewStats.totalReports.toLocaleString()} (mock)</p>
                </article>
                <article className='rounded-xl border p-4 sm:col-span-2 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Reports / 1k Solves</p>
                    <p className='mt-1 text-2xl font-black'>{overviewStats.reportsPerThousand} (mock)</p>
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
                            <p className='mt-2 text-2xl font-black'>{card.value}</p>
                            <p className='mt-1 text-xs' style={{ color: palette.mid }}>{card.hint}</p>
                        </article>
                    );
                })}
            </div>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-5'>
                <article className='rounded-xl border p-4 xl:col-span-3' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='mb-3 flex items-center justify-between'>
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
                    <header className='mb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Issue Type Distribution</h3>
                        <span
                            className='rounded-md px-2 py-1 text-xs'
                            style={{ backgroundColor: palette.french, color: palette.secondary }}
                        >
                            Placeholder
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
                    <header className='mb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Signups, Solves & Reports</h3>
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
                    <header className='mb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Retention Curve</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            Cohort
                        </span>
                    </header>
                    <div className='h-72 w-full'>
                        <ResponsiveContainer>
                            <AreaChart data={retentionData} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
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
                    <header className='mb-3'>
                        <h3 className='text-sm font-semibold md:text-base'>System Health</h3>
                    </header>
                    <div className='flex flex-col gap-3'>
                        {systemHealth.map((item) => (
                            <div key={item.label} className='rounded-lg border p-3' style={{ borderColor: palette.french, backgroundColor: palette.main }}>
                                <p className='text-xs' style={{ color: palette.mid }}>{item.label}</p>
                                <p className='text-lg font-bold'>{item.value}</p>
                                <p className='text-xs font-semibold' style={{ color: item.tone }}>{item.status}</p>
                            </div>
                        ))}
                    </div>
                </article>
            </div>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='mb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Moderation Alerts</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            Needed for analytics ops
                        </span>
                    </header>
                    <div className='space-y-2'>
                        {moderationAlerts.map((alert) => (
                            <div key={alert.id} className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                                <p className='text-xs font-semibold' style={{ color: palette.mid }}>{alert.id}</p>
                                <p className='text-sm font-semibold'>{alert.title}</p>
                                <p className='text-xs' style={{ color: palette.secondary }}>{alert.priority} priority · {alert.eta}</p>
                            </div>
                        ))}
                    </div>
                </article>

                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='mb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Top Topics Snapshot</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            Placeholder table
                        </span>
                    </header>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full text-left text-sm'>
                            <thead>
                                <tr>
                                    <th className='pb-2 font-semibold' style={{ color: palette.mid }}>Topic</th>
                                    <th className='pb-2 font-semibold' style={{ color: palette.mid }}>Solves</th>
                                    <th className='pb-2 font-semibold' style={{ color: palette.mid }}>Reports</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topTopics.map((row) => (
                                    <tr key={row.topic} className='border-t' style={{ borderColor: palette.french }}>
                                        <td className='py-2 pr-4'>{row.topic}</td>
                                        <td className='py-2 pr-4'>{row.solves}</td>
                                        <td className='py-2'>{row.reports}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default AdminAnalytics;