import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TopSolversLeaderboard.css';

const TopSolversLeaderboard = () => {
    // Mock data - replace with real data from your backend
    //     1. Filters / Dropdowns

    //     Problem / Problem Set → lets users select a specific problem or set of problems.

    //         Difficulty → Easy / Medium / Hard / Expert.

    //             Timeframe → Today / This Week / This Month / All - Time.

    //                 Category / Topic → Algebra, Logic, Geometry, etc.

    // Leaderboard Type → Fastest, Most Efficient, Most Accurate.

    // UI idea: a row of dropdowns at the top.Example:

    //     [Problem Set ▼][Difficulty ▼][Timeframe ▼][Metric ▼]

    //     2. Table / List

    // Columns you could have:

    //     Rank → 1, 2, 3…

    //     Username / Avatar → clickable to profile

    //     Metric / Score → depends on selected leaderboard type(time, efficiency, points)

    //     Date / Time Solved → when they solved it(optional)

    //     Attempts → optional, shows how many tries it took

    // Example Table:

    // Rank	User	Time	Attempts	Date
    //     1	ZaimHalili	2: 15	1	25 /09 / 2025
    //     2	Alice	2: 50	2	25 /09 / 2025
    //     3	Bob	3:00	1	25 /09 / 2025
    //     3. Search / Quick Filter

    // Search by username to see friends or top solvers specifically.

    //         Optional: a toggle to “Only show friends” for context.

    // 4. Highlight / Badges

    // Show a small “Top Solver” badge for users currently in top 3 for that problem.

    //         Optional: show historical bests, like “Fastest Ever” or “Most Efficient Ever.”

    //     5. Pagination / Infinite Scroll

    // If your problem has lots of solvers, paginate(10–20 per page) or allow infinite scroll.

    // 6. Extra Features(optional but engaging)

    //     Export / Share button → let users share leaderboard snapshots.

    //         Filter by your own attempts → “Where do I rank ?”

    //     Weekly / Monthly “Top Solvers Hall of Fame” → encourages returning users.
    const user = { id: 4, name: 'Zaim', problemsSolved: 80, xp: 1500, }
    // Mock data - replace with real data from your backend
    const players = [
        { id: 1, name: 'Alice', problemsSolved: 80, xp: 1500, },
        { id: 2, name: 'Bob', problemsSolved: 195, xp: 1900 },
        { id: 3, name: 'Charlie', problemsSolved: 20, xp: 2100 },
        { id: 4, name: 'Charlie', problemsSolved: 20, xp: 2100 },
        { id: 5, name: 'Charlie', problemsSolved: 20, xp: 2100 },
        { id: 6, name: 'Charlie', problemsSolved: 100, xp: 3244 },
        { id: 7, name: 'Charlie', problemsSolved: 20, xp: 2100 },
        { id: 8, name: 'Charlie', problemsSolved: 20, xp: 2100 },
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
    ProblemsSolved = players.slice().sort((a, b) => b.problemsSolved - a.problemsSolved);

    //Sort by xp
    let Xp = [];
    Xp = players.slice().sort((a, b) => b.xp - a.xp);

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
            <h2>Top Solvers</h2>

            <div className='flex flex-col'>
                <div className='w-full flex justify-end'>
                    <select value={value} onChange={handleChange} name="filter-rankings" id="filter-rankings">
                        <option value="ProblemsSolved">Problems Solved</option>
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

export default TopSolversLeaderboard;