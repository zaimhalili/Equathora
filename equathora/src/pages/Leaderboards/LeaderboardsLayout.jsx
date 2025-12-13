import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, Outlet } from 'react-router-dom';
import './LeaderboardsLayout.css';
import Navbar from '../../components/Navbar.jsx';
import Race from '../../assets/images/race.svg';
import Footer from '../../components/Footer.jsx';

const LeaderboardsLayout = () => {
    return (
        <div className="leaderboards-layout">
            <Navbar />
            <main className="leaderboards-main">
                <motion.nav
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="leaderboard-opt-container"
                >
                    <NavLink to="global" className={({ isActive }) =>
                        isActive ? 'lb-option active' : 'lb-option'
                    }>
                        Global Leaderboard
                    </NavLink>
                    <NavLink to="friends" className={({ isActive }) =>
                        isActive ? 'lb-option active' : 'lb-option'
                    }>
                        Friends Leaderboard
                    </NavLink>
                    <NavLink to="top-solvers" className={({ isActive }) =>
                        isActive ? 'lb-option active' : 'lb-option'
                    }>
                        Top Solvers
                    </NavLink>
                </motion.nav>
                {/* <div className="leaderboards-content" style={{ backgroundImage: `url(${Race})`, backgroundSize: 'cover', backgroundPosition: 'center', backdropFilter: 'blur(8px)' }}> */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="leaderboards-content"
                >
                    <Outlet />
                </motion.div>
            </main>
            <footer><Footer /></footer>
        </div>
    );
};

export default LeaderboardsLayout;