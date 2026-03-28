import React from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { useState } from 'react';

// Components
import AdminAnalytics from '@/components/Admin/AdminAnalytics';
import AdminProblems from '@/components/Admin/AdminProblems';
import AdminUserManagement from '@/components/Admin/AdminUserManagement';
import AdminAnnouncements from '@/components/Admin/AdminAnnouncements';
import AdminSolutionGenerator from '@/components/Admin/AdminSolutionGenerator';
import AdminFinance from '@/components/Admin/AdminFinance';
import AdminLogs from '@/components/Admin/AdminLogs';

const TAB_COMPONENTS = {
    analytics: <AdminAnalytics />,
    problems: <AdminProblems />,
    users: <AdminUserManagement />,
    announcements: <AdminProblems />,
    solutionGenerator: <AdminProblems />,
    finance: <AdminProblems />,
    logs: <AdminProblems />,
}

const AdminDashboard = () => {
    const [selected, setSelected] = useState('analytics');

    const tabs = [
        { id: 'analytics', label: 'Analytics' },
        { id: 'problems', label: 'Problem Library' },
        { id: 'users', label: 'User Management' },
        { id: 'announcements', label: 'Announcements' },
        { id: 'solutionGenerator', label: 'Solution Generator' },
        { id: 'finance', label: 'Finance' },
        { id: 'logs', label: 'Logs' },
    ]
    return (
        <>
            <header>
                <Navbar></Navbar>
            </header>
            <main className='flex  relative min-h-screen'>
                <aside className='bg-[var(--main-color)] min-h-screen absolute left-0 w-1/8 shadow-2xl z-4 overflow-hidden'>
                    {/* <h1 className='text-xl bg-[var(--dark-accent-color)] w-full text-center py-2 cursor-pointer shadow-md pb-4 font-black'>Admin Tools</h1> */}
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSelected(tab.id)}
                            className={`text-xl w-full text-center px-3 py-2 cursor-pointer shadow-md ${selected === tab.id ? 'bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] z-10 relative font-black ' : 'bg-[var(--main-color)] text-[var(--secondary-color)] hover:bg-gray-300 font-medium'}`}>{tab.label}</button>
                    ))}
                </aside>
                <section className='bg-[var(--main-color)] w-7/8 absolute right-0 min-h-screen'>
                    {TAB_COMPONENTS[selected]}
                </section>
            </main>
        </>
    );
};

export default AdminDashboard;


// -  Content moderation: queue for reported problems / solutions / comments, approve / reject actions, reason logging.
// -  Content operations: manage problems / topics / paths, publish / unpublish, difficulty tuning, bulk import/export status.
// -  Support & incident center: recent errors, failed jobs, abuse spikes, quick links to logs.
// -  Announcements / notifications: send targeted messages(all users, mentors, specific cohorts), schedule + preview.
// -  Audit trail: who changed what and when(role changes, deletions, moderation decisions).
// -  Security controls: admin access logs, suspicious login alerts, rate - limit / abuse stats.
// -  Finance / usage(if relevant): subscription metrics, coupon impact, churn signals.
// -  MVP rule: start with KPI cards + user management + moderation queue + audit log + basic alerts.


// ** Add These Admin Modules **
// - ** AI Review Queue:** every new/edited problem goes here first; show status (`pending`, `approved`, `needs-edit`, `rejected`).
// - ** AI Solution Generator:** generate draft solutions + step - by - step explanations; admins can edit before publishing.
// - ** Problem Library(All Problems):** searchable table of all problems with filters(topic, difficulty, source, status, author, date).
// - ** Problem Editor:** create new problems, clone existing ones, version history, and “save as draft”.(inside problem library)
// - ** Bulk Actions:** approve many, assign reviewer, tag, archive, delete, re - run AI check.

// ** For AI Quality / Safety **
// - ** Validation checks:** correctness, ambiguity, duplicate detection, level / difficulty match, formatting / LaTeX quality.
// - ** Confidence score + flags:** show why AI is uncertain and force human review for low - confidence items.
// - ** Human -in -the - loop:** AI never auto - publishes without rule - based thresholds or admin approval.
// - ** Audit log:** track who approved / edited what and when.
