import React from 'react';
import { motion as Motion } from 'framer-motion';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';

const LeaderboardsLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-[linear-gradient(360deg,var(--mid-main-secondary)_15%,var(--main-color))] bg-fixed">
            <Navbar />
            <main className="flex flex-1 flex-col">
                <Motion.nav
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-2 border-b border-white bg-(--main-color) px-2 py-4 sm:px-4 sm:py-6"
                >
                    <NavLink to="global" className={({ isActive }) =>
                        `rounded-xl border px-4 py-2.5 text-center text-sm font-semibold transition duration-150 ease-in-out active:scale-95 ${isActive ? ' -translate-y-0.5 border-(--accent-color) bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'border-black/10 text-(--secondary-color) hover:border-white/20 hover:bg-black/10'}`
                    }>
                        Global Leaderboard
                    </NavLink>
                    <NavLink to="friends" className={({ isActive }) =>
                        `rounded-xl border px-4 py-2.5 text-center text-sm font-semibold transition duration-150 ease-in-out active:scale-95 ${isActive ? ' -translate-y-0.5 border-(--accent-color) bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'border-black/10 text-(--secondary-color) hover:border-white/20 hover:bg-black/10'}`
                    }>
                        Friends Leaderboard
                    </NavLink>
                    {/* <NavLink to="top-solvers" className={({ isActive }) =>
                        isActive ? 'lb-option active bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]' : 'lb-option'
                    }>
                        Performance Board
                    </NavLink> */}
                </Motion.nav>
                <Motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex w-full flex-1 items-start justify-center p-2 sm:p-4 lg:p-6"
                >
                    <Outlet />
                </Motion.div>
            </main>
            <footer><Footer /></footer>
        </div>
    );
};

export default LeaderboardsLayout;