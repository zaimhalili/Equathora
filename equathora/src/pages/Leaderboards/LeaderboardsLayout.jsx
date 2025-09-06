import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './LeaderboardsLayout.css';

const LeaderboardsLayout = () => {
    return (
        <div className="leaderboards-layout">
            <nav className="leaderboards-nav">
                <NavLink to="global" activeClassName="active">Global Leaderboard</NavLink>
                <NavLink to="friends" activeClassName="active">Friends Leaderboard</NavLink>
                <NavLink to="top-solvers" activeClassName="active">Top Solvers</NavLink>
            </nav>
            <div className="leaderboards-content">
                <Outlet />
            </div>
        </div>
    );
};

export default LeaderboardsLayout;