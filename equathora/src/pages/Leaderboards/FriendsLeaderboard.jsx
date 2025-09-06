import React from 'react';
import './FriendsLeaderboard.css';
import { Link } from 'react-router-dom';

const FriendsLeaderboard = () => {
    // Mock data - replace with real data from your backend
    const users = [
        { id: 1, name: 'Alice', problemsSolved: 120, xp: 1500 },
        { id: 2, name: 'Bob', problemsSolved: 95, xp: 1200 },
        { id: 3, name: 'Charlie', problemsSolved: 80, xp: 1100 },
        // Add more users as needed
    ];

    // Function to determine tier based on problems solved
    const getTier = (problemsSolved) => {
        if (problemsSolved >= 100) return 'Diamond';
        if (problemsSolved >= 75) return 'Gold';
        if (problemsSolved >= 50) return 'Silver';
        return 'Bronze';
    };

    return (
        <div className="friends-leaderboard">
            <h2>Friends Leaderboard</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id} className={`tier-${getTier(user.problemsSolved).toLowerCase()}`}>
                        <Link to={`/profile/${user.id}`}>
                            {user.name} - {user.problemsSolved} Problems Solved - {user.xp} XP
                        </Link>
                        <span className="tier-badge">{getTier(user.problemsSolved)}</span>
                    </li>
                ))}
            </ul>
            <div className="motivational-message">
                Compete with your friends and climb the ranks!
            </div>
        </div>
    );
};

export default FriendsLeaderboard;