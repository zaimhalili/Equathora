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

const usersMock = [
    {
        id: 'U-9001',
        name: 'Ayse Yildirim',
        email: 'ayse.y@mockmail.com',
        role: 'Student',
        permission: 'Standard',
        status: 'Active',
        mentorVerification: 'Not Required',
        joinedAt: '2026-03-23',
        lastSeen: '2026-03-27',
        reports: 0,
        sessions: 4
    },
    {
        id: 'U-9002',
        name: 'Burak Demir',
        email: 'burak.d@mockmail.com',
        role: 'Mentor',
        permission: 'Mentor Review',
        status: 'Active',
        mentorVerification: 'Pending',
        joinedAt: '2026-03-20',
        lastSeen: '2026-03-27',
        reports: 1,
        sessions: 3
    },
    {
        id: 'U-9003',
        name: 'Cem Kaya',
        email: 'cem.k@mockmail.com',
        role: 'Student',
        permission: 'Standard',
        status: 'Suspended',
        mentorVerification: 'Not Required',
        joinedAt: '2026-03-18',
        lastSeen: '2026-03-24',
        reports: 4,
        sessions: 0
    },
    {
        id: 'U-9004',
        name: 'Derya Aslan',
        email: 'derya.a@mockmail.com',
        role: 'Admin',
        permission: 'Full Access',
        status: 'Active',
        mentorVerification: 'Verified',
        joinedAt: '2026-03-12',
        lastSeen: '2026-03-27',
        reports: 0,
        sessions: 7
    },
    {
        id: 'U-9005',
        name: 'Eren Arda',
        email: 'eren.a@mockmail.com',
        role: 'Mentor',
        permission: 'Mentor Review',
        status: 'Active',
        mentorVerification: 'Verified',
        joinedAt: '2026-03-10',
        lastSeen: '2026-03-26',
        reports: 0,
        sessions: 2
    },
    {
        id: 'U-9006',
        name: 'Fatma Gunes',
        email: 'fatma.g@mockmail.com',
        role: 'Student',
        permission: 'Standard',
        status: 'Inactive',
        mentorVerification: 'Not Required',
        joinedAt: '2026-03-08',
        lastSeen: '2026-03-19',
        reports: 2,
        sessions: 1
    },
    {
        id: 'U-9007',
        name: 'Gokhan Yilmaz',
        email: 'gokhan.y@mockmail.com',
        role: 'Mentor',
        permission: 'Mentor Review',
        status: 'Active',
        mentorVerification: 'Rejected',
        joinedAt: '2026-03-06',
        lastSeen: '2026-03-25',
        reports: 3,
        sessions: 2
    },
    {
        id: 'U-9008',
        name: 'Hale Cakir',
        email: 'hale.c@mockmail.com',
        role: 'Student',
        permission: 'Standard',
        status: 'Active',
        mentorVerification: 'Not Required',
        joinedAt: '2026-03-05',
        lastSeen: '2026-03-27',
        reports: 0,
        sessions: 5
    }
];

const weekSeries = [
    [
        { label: 'Mon', activeUsers: 540, newUsers: 31, suspended: 2, mentorRequests: 7 },
        { label: 'Tue', activeUsers: 560, newUsers: 28, suspended: 1, mentorRequests: 8 },
        { label: 'Wed', activeUsers: 580, newUsers: 34, suspended: 2, mentorRequests: 6 },
        { label: 'Thu', activeUsers: 590, newUsers: 32, suspended: 3, mentorRequests: 7 },
        { label: 'Fri', activeUsers: 620, newUsers: 38, suspended: 2, mentorRequests: 9 },
        { label: 'Sat', activeUsers: 640, newUsers: 30, suspended: 1, mentorRequests: 6 },
        { label: 'Sun', activeUsers: 660, newUsers: 26, suspended: 1, mentorRequests: 5 }
    ],
    [
        { label: 'Mon', activeUsers: 560, newUsers: 32, suspended: 2, mentorRequests: 8 },
        { label: 'Tue', activeUsers: 580, newUsers: 31, suspended: 2, mentorRequests: 7 },
        { label: 'Wed', activeUsers: 600, newUsers: 36, suspended: 2, mentorRequests: 7 },
        { label: 'Thu', activeUsers: 615, newUsers: 34, suspended: 3, mentorRequests: 8 },
        { label: 'Fri', activeUsers: 640, newUsers: 40, suspended: 2, mentorRequests: 10 },
        { label: 'Sat', activeUsers: 660, newUsers: 33, suspended: 1, mentorRequests: 7 },
        { label: 'Sun', activeUsers: 680, newUsers: 28, suspended: 1, mentorRequests: 6 }
    ],
    [
        { label: 'Mon', activeUsers: 580, newUsers: 35, suspended: 3, mentorRequests: 9 },
        { label: 'Tue', activeUsers: 600, newUsers: 33, suspended: 2, mentorRequests: 8 },
        { label: 'Wed', activeUsers: 620, newUsers: 38, suspended: 3, mentorRequests: 8 },
        { label: 'Thu', activeUsers: 635, newUsers: 36, suspended: 4, mentorRequests: 9 },
        { label: 'Fri', activeUsers: 660, newUsers: 44, suspended: 3, mentorRequests: 11 },
        { label: 'Sat', activeUsers: 675, newUsers: 35, suspended: 1, mentorRequests: 8 },
        { label: 'Sun', activeUsers: 700, newUsers: 30, suspended: 1, mentorRequests: 7 }
    ],
    [
        { label: 'Mon', activeUsers: 600, newUsers: 37, suspended: 3, mentorRequests: 10 },
        { label: 'Tue', activeUsers: 620, newUsers: 35, suspended: 3, mentorRequests: 9 },
        { label: 'Wed', activeUsers: 640, newUsers: 41, suspended: 3, mentorRequests: 9 },
        { label: 'Thu', activeUsers: 660, newUsers: 39, suspended: 4, mentorRequests: 10 },
        { label: 'Fri', activeUsers: 690, newUsers: 46, suspended: 3, mentorRequests: 12 },
        { label: 'Sat', activeUsers: 710, newUsers: 37, suspended: 2, mentorRequests: 9 },
        { label: 'Sun', activeUsers: 730, newUsers: 32, suspended: 1, mentorRequests: 8 }
    ]
];

const monthSeries = Array.from({ length: 30 }, (_, index) => ({
    label: `${index + 1}`,
    activeUsers: 540 + ((index * 13) % 220),
    newUsers: 24 + ((index * 3) % 21),
    suspended: 1 + (index % 4),
    mentorRequests: 5 + ((index * 2) % 8)
}));

const roleDistributionBase = [
    { name: 'Student', value: 0, color: palette.secondary },
    { name: 'Mentor', value: 0, color: palette.mid },
    { name: 'Admin', value: 0, color: palette.accent }
];

const tooltipStyle = {
    backgroundColor: palette.main,
    border: `1px solid ${palette.mid}`,
    borderRadius: '10px',
    color: palette.secondary
};

const statusBadge = {
    Active: { backgroundColor: palette.secondary, color: palette.main },
    Inactive: { backgroundColor: palette.mid, color: palette.raisinBlack },
    Suspended: { backgroundColor: palette.accent, color: palette.main }
};

const verificationBadge = {
    Verified: { backgroundColor: palette.secondary, color: palette.main },
    Pending: { backgroundColor: palette.accentDark, color: palette.main },
    Rejected: { backgroundColor: palette.accent, color: palette.main },
    'Not Required': { backgroundColor: palette.french, color: palette.secondary }
};

const AdminUserManagement = () => {
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('All');
    const [permission, setPermission] = useState('All');
    const [status, setStatus] = useState('All');
    const [verification, setVerification] = useState('All');
    const [date, setDate] = useState('');
    const [range, setRange] = useState('week');
    const [weekIndex, setWeekIndex] = useState(0);

    const selectOptions = useMemo(() => {
        const uniq = (key) => ['All', ...new Set(usersMock.map((item) => item[key]))];
        return {
            roles: uniq('role'),
            permissions: uniq('permission'),
            statuses: uniq('status'),
            verifications: uniq('mentorVerification')
        };
    }, []);

    const filteredUsers = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return usersMock.filter((row) => {
            const matchesSearch = !needle
                || row.name.toLowerCase().includes(needle)
                || row.email.toLowerCase().includes(needle)
                || row.id.toLowerCase().includes(needle);

            const matchesRole = role === 'All' || row.role === role;
            const matchesPermission = permission === 'All' || row.permission === permission;
            const matchesStatus = status === 'All' || row.status === status;
            const matchesVerification = verification === 'All' || row.mentorVerification === verification;
            const matchesDate = !date || row.joinedAt === date;

            return (
                matchesSearch
                && matchesRole
                && matchesPermission
                && matchesStatus
                && matchesVerification
                && matchesDate
            );
        });
    }, [search, role, permission, status, verification, date]);

    const activeGraphData = useMemo(() => {
        if (range === 'month') return monthSeries;
        return weekSeries[weekIndex];
    }, [range, weekIndex]);

    const roleDistribution = useMemo(() => {
        const next = roleDistributionBase.map((item) => ({ ...item }));
        filteredUsers.forEach((row) => {
            const target = next.find((item) => item.name === row.role);
            if (target) target.value += 1;
        });
        return next;
    }, [filteredUsers]);

    const overview = useMemo(() => {
        const total = filteredUsers.length;
        const active = filteredUsers.filter((item) => item.status === 'Active').length;
        const suspended = filteredUsers.filter((item) => item.status === 'Suspended').length;
        const pendingMentor = filteredUsers.filter((item) => item.mentorVerification === 'Pending').length;
        const totalSessions = filteredUsers.reduce((sum, item) => sum + item.sessions, 0);
        return { total, active, suspended, pendingMentor, totalSessions };
    }, [filteredUsers]);

    const rangeLabel = range === 'month'
        ? 'Last month (mock)'
        : weekIndex === 0
            ? 'Last week (mock)'
            : `Week ${weekIndex + 1} ago (mock)`;

    const canGoPrevWeek = range === 'week' && weekIndex < weekSeries.length - 1;
    const canGoNextWeek = range === 'week' && weekIndex > 0;

    const selectedUser = filteredUsers[0] || null;

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
                        <h1 className='text-2xl font-black md:text-3xl'>User Management</h1>
                        <p className='mt-1 text-sm md:text-base'>
                            Search users, inspect profiles, handle roles and permissions, and run account actions (placeholder data only).
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

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5'>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Filtered Users</p>
                    <p className='mt-1 text-2xl font-black'>{overview.total} (mock)</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Active Users</p>
                    <p className='mt-1 text-2xl font-black'>{overview.active} (mock)</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Suspended Users</p>
                    <p className='mt-1 text-2xl font-black'>{overview.suspended} (mock)</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Pending Mentor Verif.</p>
                    <p className='mt-1 text-2xl font-black'>{overview.pendingMentor} (mock)</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Open Sessions</p>
                    <p className='mt-1 text-2xl font-black'>{overview.totalSessions} (mock)</p>
                </article>
            </div>

            <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                <h2 className='mb-3 text-lg font-bold'>Search and Filters</h2>

                <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4'>
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder='Search by name, email, or ID...'
                        className='rounded-md border px-3 py-2 text-sm outline-none'
                        style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                    />

                    <select value={role} onChange={(event) => setRole(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                        {selectOptions.roles.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <select value={permission} onChange={(event) => setPermission(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                        {selectOptions.permissions.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <select value={status} onChange={(event) => setStatus(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                        {selectOptions.statuses.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <select value={verification} onChange={(event) => setVerification(event.target.value)} className='rounded-md border px-3 py-2 text-sm' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                        {selectOptions.verifications.map((value) => <option key={value} value={value}>{value}</option>)}
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
                            setRole('All');
                            setPermission('All');
                            setStatus('All');
                            setVerification('All');
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
                        <h3 className='text-sm font-semibold md:text-base'>User Activity and Account Events</h3>
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
                                <Bar dataKey='newUsers' fill={palette.secondary} radius={[6, 6, 0, 0]} />
                                <Bar dataKey='suspended' fill={palette.accent} radius={[6, 6, 0, 0]} />
                                <Bar dataKey='mentorRequests' fill={palette.accentDark} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className='rounded-xl border p-4 xl:col-span-2' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='mb-3 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold md:text-base'>Role Distribution</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            Filter-aware
                        </span>
                    </header>
                    <div className='h-72 w-full'>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={roleDistribution}
                                    dataKey='value'
                                    nameKey='name'
                                    cx='50%'
                                    cy='50%'
                                    innerRadius={55}
                                    outerRadius={92}
                                    paddingAngle={3}
                                >
                                    {roleDistribution.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='flex flex-wrap gap-3 text-xs'>
                        {roleDistribution.map((item) => (
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
                        <h3 className='text-sm font-semibold md:text-base'>Daily Active Users Trend</h3>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            Engagement
                        </span>
                    </header>
                    <div className='h-64 w-full'>
                        <ResponsiveContainer>
                            <LineChart data={activeGraphData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid stroke={palette.french} vertical={false} />
                                <XAxis dataKey='label' tick={{ fill: palette.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: palette.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Line type='monotone' dataKey='activeUsers' stroke={palette.accentDark} strokeWidth={2.5} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className='rounded-xl border p-4 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <h3 className='mb-3 text-sm font-semibold md:text-base'>Action Queue Snapshot</h3>
                    <div className='space-y-2'>
                        <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                            <p className='text-xs font-semibold' style={{ color: palette.mid }}>Mentor Verifications Pending</p>
                            <p className='text-xl font-black'>7 (mock)</p>
                        </div>
                        <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                            <p className='text-xs font-semibold' style={{ color: palette.mid }}>Suspensions This Week</p>
                            <p className='text-xl font-black'>3 (mock)</p>
                        </div>
                        <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                            <p className='text-xs font-semibold' style={{ color: palette.mid }}>Session Resets Needed</p>
                            <p className='text-xl font-black'>5 (mock)</p>
                        </div>
                    </div>
                </article>
            </div>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-3'>
                <article className='rounded-xl border p-4 xl:col-span-2' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='mb-3 flex items-center justify-between gap-2'>
                        <h2 className='text-lg font-bold'>Users Table</h2>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            {filteredUsers.length} users (mock)
                        </span>
                    </header>

                    <div className='overflow-x-auto'>
                        <table className='min-w-full text-left text-sm'>
                            <thead>
                                <tr style={{ color: palette.mid }}>
                                    <th className='pb-2 pr-4 font-semibold'>User</th>
                                    <th className='pb-2 pr-4 font-semibold'>Role</th>
                                    <th className='pb-2 pr-4 font-semibold'>Permission</th>
                                    <th className='pb-2 pr-4 font-semibold'>Status</th>
                                    <th className='pb-2 pr-4 font-semibold'>Mentor Verif.</th>
                                    <th className='pb-2 pr-4 font-semibold'>Last Seen</th>
                                    <th className='pb-2 font-semibold'>Reports</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((row) => (
                                    <tr key={row.id} className='border-t' style={{ borderColor: palette.french }}>
                                        <td className='py-2 pr-4'>
                                            <p className='font-semibold'>{row.name}</p>
                                            <p className='text-xs' style={{ color: palette.mid }}>{row.email} · {row.id}</p>
                                        </td>
                                        <td className='py-2 pr-4'>{row.role}</td>
                                        <td className='py-2 pr-4'>{row.permission}</td>
                                        <td className='py-2 pr-4'>
                                            <span className='rounded-md px-2 py-1 text-xs font-semibold' style={statusBadge[row.status]}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className='py-2 pr-4'>
                                            <span className='rounded-md px-2 py-1 text-xs font-semibold' style={verificationBadge[row.mentorVerification]}>
                                                {row.mentorVerification}
                                            </span>
                                        </td>
                                        <td className='py-2 pr-4'>{row.lastSeen}</td>
                                        <td className='py-2'>{row.reports} (mock)</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <p className='mt-3 text-sm font-semibold' style={{ color: palette.accentDark }}>
                            No mock users matched current filters.
                        </p>
                    )}
                </article>

                <article className='rounded-xl border p-4 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <h3 className='mb-3 text-sm font-semibold md:text-base'>Selected Profile (Mock)</h3>

                    {selectedUser ? (
                        <div className='space-y-3'>
                            <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                                <p className='font-semibold'>{selectedUser.name}</p>
                                <p className='text-xs' style={{ color: palette.mid }}>{selectedUser.email}</p>
                                <p className='mt-2 text-xs'>Joined: {selectedUser.joinedAt}</p>
                                <p className='text-xs'>Open Sessions: {selectedUser.sessions} (mock)</p>
                            </div>

                            <div className='grid grid-cols-2 gap-2'>
                                <button type='button' className='rounded-md border px-2 py-2 text-xs font-semibold' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                                    View Profile
                                </button>
                                <button type='button' className='rounded-md border px-2 py-2 text-xs font-semibold' style={{ borderColor: palette.secondary, backgroundColor: palette.secondary, color: palette.main }}>
                                    Edit Role
                                </button>
                                <button type='button' className='rounded-md border px-2 py-2 text-xs font-semibold' style={{ borderColor: palette.accentDark, backgroundColor: palette.accentDark, color: palette.main }}>
                                    Reset Sessions
                                </button>
                                <button type='button' className='rounded-md border px-2 py-2 text-xs font-semibold' style={{ borderColor: palette.accent, backgroundColor: palette.accent, color: palette.main }}>
                                    Suspend
                                </button>
                                <button type='button' className='rounded-md border px-2 py-2 text-xs font-semibold' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                                    Reactivate
                                </button>
                                <button type='button' className='rounded-md border px-2 py-2 text-xs font-semibold' style={{ borderColor: palette.secondary, backgroundColor: palette.main }}>
                                    Verify Mentor
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className='text-sm font-semibold' style={{ color: palette.accentDark }}>No user selected in current filter scope.</p>
                    )}
                </article>
            </div>
        </section>
    );
};

export default AdminUserManagement;