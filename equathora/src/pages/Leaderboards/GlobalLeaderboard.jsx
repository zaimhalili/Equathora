import React, { useState } from 'react';
import './GlobalLeaderboard.css';
import { Link } from 'react-router-dom';

const GlobalLeaderboard = () => {
    //     Extra Ideas
    // Add filter in the select menu for example: rank on topic, rank on time used
    // Add ranking numbers before each user(1st, 2nd, 3rd).

    // Add XP / progress bars to visualize growth.

    // Highlight the current logged -in user with a subtle background glow.

    const user = { id: 4, name: 'Zaim', problemsSolved: 80, xp: 1500, }
    // Mock data - replace with real data from your backend
    const players = [
        { id: 1, name: 'Alice', problemsSolved: 80, xp: 1500, },
        { id: 2, name: 'Bob', problemsSolved: 195, xp: 1900 },
        { id: 3, name: 'Charlie', problemsSolved: 20, xp: 2100 },
        { id: 3, name: 'Charlie', problemsSolved: 20, xp: 2100 },
        { id: 3, name: 'Charlie', problemsSolved: 20, xp: 2100 },
        { id: 3, name: 'Charlie', problemsSolved: 20, xp: 2100 },
        { id: 3, name: 'Charlie', problemsSolved: 20, xp: 2100 },
        { id: 3, name: 'Charlie', problemsSolved: 20, xp: 2100 },
        // Add more users as needed
    ];

    // Function to determine tier based on problems solved
    const getTier = (problemsSolved) => {
        if (problemsSolved >= 100) return 'Diamond';
        if (problemsSolved >= 75) return 'Gold';
        if (problemsSolved >= 50) return 'Silver';
        return 'Bronze';
    };


    //Sort by no of problems solved
    let ProblemsSolved = [];
    ProblemsSolved = players.toSorted((a, b) => a.problemsSolved - b.problemsSolved);
    ProblemsSolved.reverse();

    //Sort by xp
    let Xp = [];
    Xp = players.toSorted((a, b) => a.xp - b.xp);
    Xp.reverse();

    const getInitialState = () => {
        const value = "Problems Solved";
        return value;
    };

    const [value, setValue] = useState(getInitialState);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <article className="global-leaderboard">
            <h2>Global Leaderboard</h2>

            <div className='flex flex-col'>
                <div className='w-full flex justify-end'>
                    <select value={value} onChange={handleChange} name="filter-rankings" id="filter-rankings">
                        <option value="ProblemsSolved" selected>Problems Solved</option>
                        <option value="Xp">Xp</option>
                    </select>
                </div>

                <ul className='leaderboard'>
                    {(value === "ProblemsSolved" ? ProblemsSolved : Xp).map(user => (
                        <li key={user.id} className={`tier-${getTier(user.problemsSolved).toLowerCase()}`}>
                            <Link to={`/profile/${user.id}`}>
                                {user.name} - {user.problemsSolved} Problems Solved - {user.xp} XP
                            </Link>
                            <span className="tier-badge" style={{ fontWeight: "bold" }}>{getTier(user.problemsSolved)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <ul>
                <li key={user.id} className={`tier-${getTier(user.problemsSolved).toLowerCase()}`}>
                    <Link to={`/profile/${user.id}`}>
                        {user.name} - {user.problemsSolved} Problems Solved - {user.xp} XP
                    </Link>
                    <span className="tier-badge" style={{ fontWeight: "bold" }}>{getTier(user.problemsSolved)}</span>
                </li>
            </ul>
            <div className="motivational-message">
                Aim for the top and become a global leader!
            </div>
        </article>
    );
};

export default GlobalLeaderboard;