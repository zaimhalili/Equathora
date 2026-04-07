import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

// Components
import AdminAnalytics from '@/components/Admin/AdminAnalytics';
import AdminProblems from '@/components/Admin/AdminProblems';
import AdminUserManagement from '@/components/Admin/AdminUserManagement';
import AdminAnnouncements from '@/components/Admin/AdminAnnouncements';
import AdminSolutionGenerator from '@/components/Admin/AdminSolutionGenerator';
import AdminFinance from '@/components/Admin/AdminFinance';
import AdminLogs from '@/components/Admin/AdminLogs';
import AdminEmailBriefs from '@/components/Admin/AdminEmailBriefs';

const TAB_COMPONENTS = {
    // analytics: <AdminAnalytics />,
    problems: <AdminProblems />,
    users: <AdminUserManagement />,
    announcements: <AdminAnnouncements />,
    solutionGenerator: <AdminSolutionGenerator />,
    finance: <AdminFinance />,
    logs: <AdminLogs />,
    emailBriefs: <AdminEmailBriefs />
}

const TAB_DATA_SOURCE = {
    analytics: 'Real',
    problems: 'Real',
    users: 'Real',
    announcements: 'Mock',
    solutionGenerator: 'Local',
    finance: 'Mock',
    logs: 'Mock',
    emailBriefs: 'Real',
};

const AdminDashboard = () => {
    const [selected, setSelected] = useState('problems');
    const [isSwitching, setIsSwitching] = useState(false);

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

    ]
    return (
        <>
            <header>
                <Navbar></Navbar>
            </header>
            <main className='admin-interactive flex relative max-h-[calc(100vh-7.5vh)] overflow-hidden'>
                <aside className='bg-[var(--main-color)] min-h-screen sticky left-0 w-1/3 xl:w-1/8 shadow-2xl z-4 overflow-hidden h-[calc(100vh-7.5vh)] max-h-[calc(100vh-7.5vh)]'>
                    {/* <h1 className='text-xl bg-[var(--dark-accent-color)] w-full text-center py-2 cursor-pointer shadow-md pb-4 font-black'>Admin Tools</h1> */}

                    {/* Admin Tabs */}
                    {tabs.map(tab => (
                        <button
                            type='button'
                            key={tab.id}
                            onClick={() => handleTabSelect(tab.id)}
                            className={`xl:text-xl w-full text-center px-3 py-2 cursor-pointer shadow-md ${selected === tab.id ? 'bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] z-10 relative font-black ' : 'bg-[var(--main-color)] text-[var(--secondary-color)] hover:bg-gray-300 font-medium'}`}>{tab.label}</button>
                    ))}
                </aside>
                <section className='bg-[var(--main-color)] w-2/3 xl:w-7/8 absolute right-0 overflow-y-scroll h-[calc(100vh-7.5vh)] max-h-[calc(100vh-7.5vh)]'>
                    <div className='sticky top-0 z-20 flex items-center justify-between border-b px-3 py-2 text-xs font-semibold' style={{ borderColor: 'var(--french-gray)', backgroundColor: 'var(--main-color)' }}>
                        <span style={{ color: 'var(--mid-main-secondary)' }}>
                            {isSwitching ? 'Loading module...' : 'Module ready'}
                        </span>
                        <span className='rounded-md px-2 py-1' style={{ backgroundColor: TAB_DATA_SOURCE[selected] === 'Real' ? 'var(--secondary-color)' : 'var(--mid-main-secondary)', color: 'var(--main-color)' }}>
                            Data Source: {TAB_DATA_SOURCE[selected]}
                        </span>
                    </div>
                    {TAB_COMPONENTS[selected]}
                </section>
            </main>
        </>
    );
};

export default AdminDashboard;
