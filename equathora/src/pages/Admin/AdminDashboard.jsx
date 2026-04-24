import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { FiMenu, FiX } from 'react-icons/fi';

// Components
import AdminAnalytics from '@/components/Admin/AdminAnalytics';
import AdminProblems from '@/components/Admin/AdminProblems';
import AdminUserManagement from '@/components/Admin/AdminUserManagement';
import AdminAnnouncements from '@/components/Admin/AdminAnnouncements';
import AdminSolutionGenerator from '@/components/Admin/AdminSolutionGenerator';
import AdminFinance from '@/components/Admin/AdminFinance';
import AdminLogs from '@/components/Admin/AdminLogs';
import AdminEmailBriefs from '@/components/Admin/AdminEmailBriefs';
import AdminReviewProblems from '@/components/Admin/AdminReviewProblems';

const TAB_COMPONENTS = {
    // analytics: <AdminAnalytics />,
    problems: <AdminProblems />,
    users: <AdminUserManagement />,
    announcements: <AdminAnnouncements />,
    solutionGenerator: <AdminSolutionGenerator />,
    finance: <AdminFinance />,
    logs: <AdminLogs />,
    emailBriefs: <AdminEmailBriefs />,
    reviewProblems: <AdminReviewProblems />
};

const TAB_DATA_SOURCE = {
    analytics: 'Real',
    problems: 'Real',
    users: 'Real',
    announcements: 'Mock',
    solutionGenerator: 'Local',
    finance: 'Mock',
    logs: 'Mock',
    emailBriefs: 'Real',
    reviewProblems: 'Mock',
};

const AdminDashboard = () => {
    const [selected, setSelected] = useState('problems');
    const [isSwitching, setIsSwitching] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setIsSwitching(true);
        const switchTimer = window.setTimeout(() => {
            setIsSwitching(false);
        }, 120);

        return () => {
            window.clearTimeout(switchTimer);
        };
    }, [selected]);

    const handleTabSelect = (tabId) => {
        if (tabId === selected) return;
        setSelected(tabId);
        setIsSidebarOpen(false);
    };

    const tabs = [
        // { id: 'analytics', label: 'Analytics' },
        { id: 'problems', label: 'Problem Library' },
        { id: 'users', label: 'User Management' },
        { id: 'announcements', label: 'Announcements' },
        // { id: 'solutionGenerator', label: 'Solution Generator' },
        { id: 'finance', label: 'Finance' },
        { id: 'logs', label: 'Logs' },
        { id: 'emailBriefs', label: 'Email Briefs' },
        { id: 'reviewProblems', label: 'Review Problems' }
    ];
    return (
        <>
            <header>
                <Navbar></Navbar>
            </header>
            <div className='flex justify-center flex-col items-center'>
                <main className='admin-interactive relative flex h-[calc(100vh-7.5vh)] max-h-[calc(100vh-7.5vh)] overflow-hidden bg-[var(--main-color)] max-w-[2000px]'>
                    {isSidebarOpen && (
                        <button
                            type='button'
                            aria-label='Close admin navigation overlay'
                            onClick={() => setIsSidebarOpen(false)}
                            className='absolute inset-0 z-20 bg-black/35 md:hidden'
                        />
                    )}

                    <aside className={`absolute inset-y-0 left-0 z-30 w-[84vw] max-w-[320px] overflow-y-auto border-r bg-[var(--main-color)] shadow-2xl transition-transform duration-200 md:static md:z-10 md:w-[280px] md:max-w-none md:min-w-[240px] md:translate-x-0 md:border-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ borderColor: 'var(--french-gray)' }}>
                        <div className='sticky top-0 z-10 border-b bg-[var(--main-color)] px-3 py-2 md:hidden' style={{ borderColor: 'var(--french-gray)' }}>
                            <div className='flex items-center justify-between'>
                                <p className='text-sm font-black text-[var(--secondary-color)]'>Admin Modules</p>
                                <button
                                    type='button'
                                    onClick={() => setIsSidebarOpen(false)}
                                    className='rounded-md border px-2 py-1 text-sm font-semibold'
                                    style={{ borderColor: 'var(--mid-main-secondary)' }}
                                >
                                    <span className='inline-flex items-center gap-1'>
                                        <FiX />
                                        Close
                                    </span>
                                </button>
                            </div>
                        </div>

                        {tabs.map(tab => (
                            <button
                                type='button'
                                key={tab.id}
                                onClick={() => handleTabSelect(tab.id)}
                                className={`w-full px-3 py-3 text-left text-sm shadow-sm transition md:text-base xl:text-xl ${selected === tab.id ? 'bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] relative z-10 font-black text-white' : 'bg-[var(--main-color)] font-medium text-[var(--secondary-color)] hover:bg-[var(--french-gray)]'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </aside>

                    <section className='flex-1 min-w-0 overflow-y-auto bg-[var(--main-color)] h-[calc(100vh-7.5vh)] max-h-[calc(100vh-7.5vh)]'>
                        <div className='sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 text-xs font-semibold' style={{ borderColor: 'var(--french-gray)', backgroundColor: 'var(--main-color)' }}>
                            <button
                                type='button'
                                onClick={() => setIsSidebarOpen(true)}
                                className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold md:hidden'
                                style={{ borderColor: 'var(--mid-main-secondary)' }}
                            >
                                <FiMenu />
                                Modules
                            </button>
                            <span className='truncate' style={{ color: 'var(--mid-main-secondary)' }}>
                                {isSwitching ? 'Loading module...' : 'Module ready'}
                            </span>
                            <span className='rounded-md px-2 py-1 whitespace-nowrap' style={{ backgroundColor: TAB_DATA_SOURCE[selected] === 'Real' ? 'var(--secondary-color)' : 'var(--mid-main-secondary)', color: 'var(--main-color)' }}>
                                Data Source: {TAB_DATA_SOURCE[selected]}
                            </span>
                        </div>
                        {TAB_COMPONENTS[selected]}
                    </section>
                </main>
            </div>
            
        </>
    );
};

export default AdminDashboard;
