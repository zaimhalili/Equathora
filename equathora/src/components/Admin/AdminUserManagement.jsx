import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
    adminUserEnums,
    getAdminUsers,
    resetAdminUserSessions,
    updateAdminMentorVerification,
    updateAdminUserRole,
    updateAdminUserStatus
} from '@/lib/adminUserManagementService';

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

const roleDistributionBase = [
    { name: 'Student', value: 0, color: palette.secondary },
    { name: 'Mentor', value: 0, color: palette.mid },
    { name: 'Admin', value: 0, color: palette.accent },
    { name: 'Parent', value: 0, color: palette.accentDark }
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

const dayLabelFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

const toDateKey = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const buildUserSeries = ({ rows, range, weekIndex }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = range === 'month' ? 30 : 7;
    const shiftDays = range === 'month' ? 0 : weekIndex * 7;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (days - 1) - shiftDays);

    return Array.from({ length: days }, (_, index) => {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + index);
        const dateKey = toDateKey(day);

        const newUsers = rows.filter((item) => item.joinedAtKey === dateKey).length;
        const activeUsers = rows.filter((item) => item.lastSeenKey === dateKey).length;
        const suspended = rows.filter((item) => item.status === 'Suspended' && item.lastSeenKey === dateKey).length;
        const mentorRequests = rows.filter((item) => item.mentorVerification === 'Pending' && item.joinedAtKey === dateKey).length;

        return {
            label: range === 'month' ? `${index + 1}` : dayLabelFormatter.format(day),
            activeUsers,
            newUsers,
            suspended,
            mentorRequests
        };
    });
};

const maxWeekOffsetFromRows = (rows) => {
    const validTimes = rows
        .map((item) => new Date(item.joinedAtKey || '').getTime())
        .filter((value) => Number.isFinite(value));

    if (!validTimes.length) return 0;

    const oldest = Math.min(...validTimes);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysDiff = Math.max(0, Math.floor((today.getTime() - oldest) / (24 * 60 * 60 * 1000)));
    return Math.max(0, Math.floor(daysDiff / 7));
};

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [role, setRole] = useState('All');
    const [permission, setPermission] = useState('All');
    const [status, setStatus] = useState('All');
    const [verification, setVerification] = useState('All');
    const [date, setDate] = useState('');
    const [range, setRange] = useState('week');
    const [weekIndex, setWeekIndex] = useState(0);

    const [selectedUserId, setSelectedUserId] = useState('');
    const [roleDraft, setRoleDraft] = useState('Student');
    const [statusDraft, setStatusDraft] = useState('Active');
    const [verificationDraft, setVerificationDraft] = useState('Not Required');
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState('');

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const rows = await getAdminUsers();
            setUsers(rows);
        } catch (loadError) {
            setUsers([]);
            setError(loadError?.message || 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const selectOptions = useMemo(() => {
        const uniq = (key) => ['All', ...new Set(users.map((item) => item[key]))];
        return {
            roles: uniq('role'),
            permissions: uniq('permission'),
            statuses: uniq('status'),
            verifications: uniq('mentorVerification')
        };
    }, [users]);

    const filteredUsers = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return users.filter((row) => {
            const matchesSearch = !needle
                || row.name.toLowerCase().includes(needle)
                || row.email.toLowerCase().includes(needle)
                || row.id.toLowerCase().includes(needle);

            const matchesRole = role === 'All' || row.role === role;
            const matchesPermission = permission === 'All' || row.permission === permission;
            const matchesStatus = status === 'All' || row.status === status;
            const matchesVerification = verification === 'All' || row.mentorVerification === verification;
            const matchesDate = !date || row.joinedAtKey === date;

            return (
                matchesSearch
                && matchesRole
                && matchesPermission
                && matchesStatus
                && matchesVerification
                && matchesDate
            );
        });
    }, [users, search, role, permission, status, verification, date]);

    useEffect(() => {
        if (!filteredUsers.length) {
            setSelectedUserId('');
            return;
        }

        if (!selectedUserId || !filteredUsers.some((item) => item.id === selectedUserId)) {
            setSelectedUserId(filteredUsers[0].id);
        }
    }, [filteredUsers, selectedUserId]);

    const selectedUser = useMemo(() => filteredUsers.find((item) => item.id === selectedUserId) || null, [filteredUsers, selectedUserId]);

    useEffect(() => {
        if (!selectedUser) return;
        setRoleDraft(selectedUser.role);
        setStatusDraft(selectedUser.status);
        setVerificationDraft(selectedUser.mentorVerification);
    }, [selectedUser]);

    const maxWeekIndex = useMemo(() => maxWeekOffsetFromRows(users), [users]);

    const activeGraphData = useMemo(() => buildUserSeries({ rows: filteredUsers, range, weekIndex }), [filteredUsers, range, weekIndex]);

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
        ? 'Last 30 days'
        : weekIndex === 0
            ? 'Last week'
            : `Week ${weekIndex + 1} ago`;

    const canGoPrevWeek = range === 'week' && weekIndex < maxWeekIndex;
    const canGoNextWeek = range === 'week' && weekIndex > 0;

    const handleAction = async (action, confirmMessage) => {
        if (!selectedUser) return;
        if (confirmMessage && !window.confirm(confirmMessage)) return;

        setActionLoading(true);
        setActionMessage('');

        try {
            await action();
            await loadUsers();
            setActionMessage('Saved successfully.');
        } catch (actionError) {
            setActionMessage(actionError?.message || 'Action failed.');
        } finally {
            setActionLoading(false);
        }
    };

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
                            Live user data from Supabase with admin actions for role/status/verification and session reset.
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
                            Loading users...
                        </span>
                    )}
                    {!!error && (
                        <span className='text-xs font-semibold text-red-500'>
                            {error}
                        </span>
                    )}
                </div>
            </header>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5'>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Filtered Users</p>
                    <p className='mt-1 text-2xl font-black'>{overview.total}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Active Users</p>
                    <p className='mt-1 text-2xl font-black'>{overview.active}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Suspended Users</p>
                    <p className='mt-1 text-2xl font-black'>{overview.suspended}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Pending Mentor Verif.</p>
                    <p className='mt-1 text-2xl font-black'>{overview.pendingMentor}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <p className='text-xs font-semibold uppercase tracking-wide' style={{ color: palette.mid }}>Total Attempts</p>
                    <p className='mt-1 text-2xl font-black'>{overview.totalSessions}</p>
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
                                <span>{item.name}: {item.value}</span>
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
                            <p className='text-xl font-black'>{overview.pendingMentor}</p>
                        </div>
                        <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                            <p className='text-xs font-semibold' style={{ color: palette.mid }}>Suspended Users</p>
                            <p className='text-xl font-black'>{overview.suspended}</p>
                        </div>
                        <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                            <p className='text-xs font-semibold' style={{ color: palette.mid }}>Users In Scope</p>
                            <p className='text-xl font-black'>{overview.total}</p>
                        </div>
                    </div>
                </article>
            </div>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-3'>
                <article className='rounded-xl border p-4 xl:col-span-2' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <header className='mb-3 flex items-center justify-between gap-2'>
                        <h2 className='text-lg font-bold'>Users Table</h2>
                        <span className='rounded-md px-2 py-1 text-xs' style={{ backgroundColor: palette.french, color: palette.secondary }}>
                            {filteredUsers.length} users
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
                                    <tr
                                        key={row.id}
                                        className='cursor-pointer border-t'
                                        style={{
                                            borderColor: palette.french,
                                            backgroundColor: row.id === selectedUserId ? palette.french : 'transparent'
                                        }}
                                        onClick={() => setSelectedUserId(row.id)}
                                    >
                                        <td className='py-2 pr-4'>
                                            <p className='font-semibold'>{row.name}</p>
                                            <p className='text-xs' style={{ color: palette.mid }}>{row.email} · {row.id}</p>
                                        </td>
                                        <td className='py-2 pr-4'>{row.role}</td>
                                        <td className='py-2 pr-4'>{row.permission}</td>
                                        <td className='py-2 pr-4'>
                                            <span className='rounded-md px-2 py-1 text-xs font-semibold' style={statusBadge[row.status] || statusBadge.Active}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className='py-2 pr-4'>
                                            <span className='rounded-md px-2 py-1 text-xs font-semibold' style={verificationBadge[row.mentorVerification] || verificationBadge['Not Required']}>
                                                {row.mentorVerification}
                                            </span>
                                        </td>
                                        <td className='py-2 pr-4'>{row.lastSeen}</td>
                                        <td className='py-2'>{row.reports}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <p className='mt-3 text-sm font-semibold' style={{ color: palette.accentDark }}>
                            No users matched current filters.
                        </p>
                    )}
                </article>

                <article className='rounded-xl border p-4 xl:col-span-1' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                    <h3 className='mb-3 text-sm font-semibold md:text-base'>Selected Profile</h3>

                    {selectedUser ? (
                        <div className='space-y-3'>
                            <div className='rounded-lg border p-3' style={{ borderColor: palette.french }}>
                                <p className='font-semibold'>{selectedUser.name}</p>
                                <p className='text-xs' style={{ color: palette.mid }}>{selectedUser.email}</p>
                                <p className='mt-2 text-xs'>Joined: {selectedUser.joinedAt}</p>
                                <p className='text-xs'>Total Attempts: {selectedUser.sessions}</p>
                                <p className='text-xs'>Reports: {selectedUser.reports}</p>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-xs font-semibold' style={{ color: palette.mid }}>Role</label>
                                <select value={roleDraft} onChange={(event) => setRoleDraft(event.target.value)} className='w-full rounded-md border px-2 py-2 text-xs font-semibold' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                                    {adminUserEnums.roleOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                                </select>

                                <label className='text-xs font-semibold' style={{ color: palette.mid }}>Status</label>
                                <select value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)} className='w-full rounded-md border px-2 py-2 text-xs font-semibold' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                                    {adminUserEnums.statusOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                                </select>

                                <label className='text-xs font-semibold' style={{ color: palette.mid }}>Mentor Verification</label>
                                <select value={verificationDraft} onChange={(event) => setVerificationDraft(event.target.value)} className='w-full rounded-md border px-2 py-2 text-xs font-semibold' style={{ borderColor: palette.mid, backgroundColor: palette.main }}>
                                    {adminUserEnums.verificationOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                                </select>
                            </div>

                            <div className='grid grid-cols-2 gap-2'>
                                <button
                                    type='button'
                                    onClick={() => {
                                        window.location.href = `/profile/${selectedUser.id}`;
                                    }}
                                    className='rounded-md border px-2 py-2 text-xs font-semibold'
                                    style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                                >
                                    View Profile
                                </button>
                                <button
                                    type='button'
                                    disabled={actionLoading}
                                    onClick={() => handleAction(
                                        () => updateAdminUserRole(selectedUser.id, roleDraft),
                                        `Change role for ${selectedUser.email} to ${roleDraft}?`
                                    )}
                                    className='rounded-md border px-2 py-2 text-xs font-semibold disabled:opacity-60'
                                    style={{ borderColor: palette.secondary, backgroundColor: palette.secondary, color: palette.main }}
                                >
                                    Save Role
                                </button>
                                <button
                                    type='button'
                                    disabled={actionLoading}
                                    onClick={() => handleAction(
                                        () => resetAdminUserSessions(selectedUser.id),
                                        `Reset all active sessions for ${selectedUser.email}? This will force re-login.`
                                    )}
                                    className='rounded-md border px-2 py-2 text-xs font-semibold disabled:opacity-60'
                                    style={{ borderColor: palette.accentDark, backgroundColor: palette.accentDark, color: palette.main }}
                                >
                                    Reset Sessions
                                </button>
                                <button
                                    type='button'
                                    disabled={actionLoading}
                                    onClick={() => handleAction(
                                        () => updateAdminUserStatus({ ...selectedUser, status: statusDraft }),
                                        `Change status for ${selectedUser.email} to ${statusDraft}?`
                                    )}
                                    className='rounded-md border px-2 py-2 text-xs font-semibold disabled:opacity-60'
                                    style={{ borderColor: palette.accent, backgroundColor: palette.accent, color: palette.main }}
                                >
                                    Save Status
                                </button>
                                <button
                                    type='button'
                                    disabled={actionLoading}
                                    onClick={() => handleAction(
                                        () => updateAdminMentorVerification(selectedUser.id, verificationDraft),
                                        `Set mentor verification for ${selectedUser.email} to ${verificationDraft}?`
                                    )}
                                    className='col-span-2 rounded-md border px-2 py-2 text-xs font-semibold disabled:opacity-60'
                                    style={{ borderColor: palette.mid, backgroundColor: palette.main }}
                                >
                                    Save Verification
                                </button>
                            </div>

                            {!!actionMessage && (
                                <p className='text-xs font-semibold' style={{ color: actionMessage === 'Saved successfully.' ? palette.secondary : palette.accent }}>
                                    {actionMessage}
                                </p>
                            )}
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
