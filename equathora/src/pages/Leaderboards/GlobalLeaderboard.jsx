import React from 'react';
import './GlobalLeaderboard.css';
import { Link } from 'react-router-dom';

const GlobalLeaderboard = () => {
    //     Extra Ideas

    // Add ranking numbers before each user(1st, 2nd, 3rd).

    // Add XP / progress bars to visualize growth.

    // Highlight the current logged -in user with a subtle background glow.


    // Mock data - replace with real data from your backend
    const users = [
        { id: 1, name: 'Alice', problemsSolved: 120, xp: 1500, },
        { id: 2, name: 'Bob', problemsSolved: 95, xp: 1200 },
        { id: 3, name: 'Charlie', problemsSolved: 20, xp: 1100 },
        // Add more users as needed
    ];

    // Function to determine tier based on problems solved
    const getTier = (problemsSolved) => {
        if (problemsSolved >= 100) return 'Diamond';
        if (problemsSolved >= 75) return 'Gold';
        if (problemsSolved >= 50) return 'Silver';
        return 'Bronze';
    };

    let sortable = [];
    for (var rank in users) {
        sortable.push([rank, users[rank]]);
    }

    sortable.sort(function (a, b) {
        return a[1] - b[1];
    })

    return (
        <div className="global-leaderboard">
            <h2>Global Leaderboard</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id} className={`tier-${getTier(user.problemsSolved).toLowerCase()}`}>
                        <Link to={`/profile/${user.id}`}>
                            {user.name} - {user.problemsSolved} Problems Solved - {user.xp} XP
                        </Link>
                        <span className="tier-badge" style={{fontWeight:"bold"}}>{getTier(user.problemsSolved)}</span>
                    </li>
                ))}
            </ul>
            <div className="motivational-message">
                Aim for the top and become a global leader!
            </div>
        </div>
    );
};

export default GlobalLeaderboard;