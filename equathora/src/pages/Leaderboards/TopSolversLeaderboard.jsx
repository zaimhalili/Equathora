import React from 'react';
import { Link } from 'react-router-dom';
import './TopSolversLeaderboard.css';

const TopSolversLeaderboard = () => {
    // Mock data - replace with real data from your backend
    const topSolvers = [
        { id: 1, name: 'Alice', problemsSolved: 150, xp: 2000 },
        { id: 2, name: 'Bob', problemsSolved: 140, xp: 1900 },
        { id: 3, name: 'Charlie', problemsSolved: 130, xp: 1800 },
        // Add more users as needed
    ];

    return (
        <div className="top-solvers-leaderboard">
            <h2>Top Solvers Leaderboard</h2>
            <ul>
                {topSolvers.map(solver => (
                    <li key={solver.id}>
                        <Link to={`/profile/${solver.id}`}>
                            {solver.name} - {solver.problemsSolved} Problems Solved - {solver.xp} XP
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="motivational-message">
                Congratulations to our top solvers! Keep up the great work!
            </div>
        </div>
    );
};

export default TopSolversLeaderboard;