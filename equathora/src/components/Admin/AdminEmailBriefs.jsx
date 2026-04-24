import React, { useEffect, useMemo, useState } from 'react';
import { FiCopy, FiDownload, FiMail, FiRefreshCw, FiSearch, FiUsers } from 'react-icons/fi';
import { getAdminEmailBriefSubscribers } from '@/lib/adminEmailBriefsService';

const AdminEmailBriefs = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getAdminEmailBriefSubscribers();
            setRows(data);
        } catch (loadError) {
            setRows([]);
            setError(loadError?.message || 'Failed to load email briefs list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (!copied) return;
        const timer = window.setTimeout(() => setCopied(''), 2200);
        return () => window.clearTimeout(timer);
    }, [copied]);

    const filteredRows = useMemo(() => {
        const needle = search.trim().toLowerCase();
        if (!needle) return rows;

        return rows.filter((item) => (
            item.name.toLowerCase().includes(needle)
            || item.email.toLowerCase().includes(needle)
        ));
    }, [rows, search]);

    const uniqueEmails = useMemo(() => {
        const unique = new Set();
        filteredRows.forEach((item) => {
            if (item.email) unique.add(item.email);
        });
        return [...unique];
    }, [filteredRows]);

    const bccString = useMemo(() => uniqueEmails.join(', '), [uniqueEmails]);

    const copyBcc = async () => {
        if (!bccString) return;

        try {
            await navigator.clipboard.writeText(bccString);
            setCopied(`Copied ${uniqueEmails.length} emails for BCC.`);
        } catch {
            setCopied('Copy failed. Please copy manually from the box below.');
        }
    };

    const exportCsv = () => {
        const header = 'Name,Email,Created At';
        const lines = filteredRows.map((row) => {
            const safeName = `"${row.name.replaceAll('"', '""')}"`;
            const safeEmail = `"${row.email.replaceAll('"', '""')}"`;
            const safeDate = `"${row.createdAt ? row.createdAt.toISOString() : ''}"`;
            return `${safeName},${safeEmail},${safeDate}`;
        });

        const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `equathora-briefs-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(url);
    };

    return (
        <section className='flex flex-col gap-6 px-3 py-2 text-[var(--secondary-color)] md:px-5'>
            <header className='rounded-xl border p-5' style={{ borderColor: 'var(--mid-main-secondary)', background: 'linear-gradient(135deg, var(--main-color), var(--french-gray))' }}>
                <div className='flex flex-wrap items-start justify-between gap-3'>
                    <div>
                        <h1 className='text-2xl font-black md:text-3xl'>Email Briefs Waitlist</h1>
                        <p className='pt-1 text-sm md:text-base'>View all waitlist subscribers, copy BCC-ready emails, and export list data.</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            onClick={load}
                            disabled={loading}
                            className='inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition disabled:opacity-70'
                            style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                        >
                            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                        <button
                            type='button'
                            onClick={exportCsv}
                            disabled={!filteredRows.length}
                            className='inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition disabled:opacity-70'
                            style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}
                        >
                            <FiDownload />
                            Export CSV
                        </button>
                    </div>
                </div>
            </header>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <p className='text-xs uppercase tracking-wide text-[var(--mid-main-secondary)]'>Filtered Subscribers</p>
                    <p className='pt-2 text-3xl font-black'>{filteredRows.length.toLocaleString()}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <p className='text-xs uppercase tracking-wide text-[var(--mid-main-secondary)]'>Unique Emails</p>
                    <p className='pt-2 text-3xl font-black'>{uniqueEmails.length.toLocaleString()}</p>
                </article>
                <article className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                    <p className='text-xs uppercase tracking-wide text-[var(--mid-main-secondary)]'>Ready For BCC</p>
                    <p className='pt-2 text-3xl font-black'>{uniqueEmails.length ? 'Yes' : 'No'}</p>
                </article>
            </div>

            <div className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <label className='inline-flex min-w-[260px] flex-1 items-center gap-2 rounded-md border px-3 py-2' style={{ borderColor: 'var(--mid-main-secondary)' }}>
                        <FiSearch />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type='text'
                            placeholder='Search by name or email'
                            className='w-full bg-transparent text-sm outline-none'
                        />
                    </label>

                    <button
                        type='button'
                        onClick={copyBcc}
                        disabled={!uniqueEmails.length}
                        className='inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-[var(--main-color)] transition disabled:opacity-70'
                        style={{ background: 'linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))' }}
                    >
                        <FiCopy />
                        Copy All Emails (BCC)
                    </button>
                </div>

                {!!copied && (
                    <p className='pt-3 text-sm font-semibold' style={{ color: copied.startsWith('Copied') ? 'var(--secondary-color)' : 'var(--accent-color)' }}>
                        {copied}
                    </p>
                )}

                <div className='pt-3'>
                    <p className='pb-1 text-xs font-semibold uppercase tracking-wide text-[var(--mid-main-secondary)]'>BCC preview</p>
                    <textarea
                        readOnly
                        value={bccString}
                        className='min-h-24 w-full rounded-md border p-3 text-xs md:text-sm'
                        style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--french-gray)' }}
                    />
                </div>
            </div>

            <div className='rounded-xl border' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                <div className='flex items-center gap-2 border-b px-4 py-3' style={{ borderColor: 'var(--french-gray)' }}>
                    <FiUsers />
                    <h2 className='font-bold'>Subscriber List</h2>
                </div>

                {loading ? (
                    <p className='px-4 py-6 text-sm'>Loading subscribers...</p>
                ) : error ? (
                    <div className='px-4 py-6'>
                        <p className='text-sm font-semibold' style={{ color: 'var(--accent-color)' }}>{error}</p>
                        <p className='pt-1 text-xs text-[var(--mid-main-secondary)]'>Ensure RLS policy allows admin reads for this table.</p>
                    </div>
                ) : !filteredRows.length ? (
                    <p className='px-4 py-6 text-sm'>No subscribers found for current filter.</p>
                ) : (
                    <div className='max-h-[540px] overflow-auto'>
                        <table className='w-full min-w-[640px] text-left text-sm'>
                            <thead className='sticky top-0 z-10' style={{ backgroundColor: 'var(--french-gray)' }}>
                                <tr>
                                    <th className='px-4 py-2 font-semibold'>Name</th>
                                    <th className='px-4 py-2 font-semibold'>Email</th>
                                    <th className='px-4 py-2 font-semibold'>Joined</th>
                                    <th className='px-4 py-2 font-semibold'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row, index) => (
                                    <tr key={`${row.email}-${index}`} className='border-t' style={{ borderColor: 'var(--french-gray)' }}>
                                        <td className='px-4 py-2'>{row.name || '-'}</td>
                                        <td className='px-4 py-2'>{row.email}</td>
                                        <td className='px-4 py-2'>{row.createdAt ? row.createdAt.toLocaleString() : '-'}</td>
                                        <td className='px-4 py-2'>
                                            <a
                                                href={`mailto:?bcc=${encodeURIComponent(row.email)}`}
                                                className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold'
                                                style={{ borderColor: 'var(--mid-main-secondary)' }}
                                            >
                                                <FiMail />
                                                Compose
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminEmailBriefs;