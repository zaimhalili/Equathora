import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './LeaderboardsLayout.css';
import Navbar from '../../components/Navbar.jsx';
import Race from '../../assets/images/race.svg';

const LeaderboardsLayout = () => {
    return (
        <div className="leaderboards-layout">
            <header>
                <Navbar></Navbar>
            </header>
            <nav className="leaderboard-opt-container">
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
            </nav>
            <div className="leaderboards-content" style={{ backgroundImage: `url(${Race})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default LeaderboardsLayout;