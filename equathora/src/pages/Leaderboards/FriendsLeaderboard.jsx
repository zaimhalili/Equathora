import React, { useState } from 'react';
import './GlobalLeaderboard.css';
import { Link } from 'react-router-dom';
import Smily from "../../assets/images/smily.svg";

const FriendsLeaderboard = () => {
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

    const sortedPlayers = players.sort((a, b) => b.xp - a.xp);

    return (
        <article className="global-leaderboard">
            <img src={Smily} alt="smily face" className='smily' />
            <h2>Friends Leaderboard</h2>

            <div className="leaderboard-container">
                <ul className='leaderboard'>
                    {sortedPlayers.map(player => (
                        <li key={player.id} className="leaderboard-item">
                            <Link to={`/profile/${player.id}`}>
                                {player.name} - {player.problemsSolved} Problems Solved - {player.xp} XP
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="user-stats">
                <div className="leaderboard-item">
                    <Link to={`/profile/${user.id}`}>
                        {user.name} - {user.problemsSolved} Problems Solved - {user.xp} XP
                    </Link>
                </div>
            </div>

            <div className="motivational-message">
                Aim for the top and become a global leader!
            </div>
        </article>
    );
};

export default FriendsLeaderboard;