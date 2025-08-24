import React from 'react';
import './ProblemCard.css';
import { Link } from 'react-router-dom';

const ProblemCard = ({ problem }) => {  
    return (
        <div className='problem-card'>
            <Link
                to={`/problems/${problem.groupId}/${problem.id}`} 
                className="problem-card-link"
            >
                <div className="problem-card-content">
                    <h3>{problem.title}</h3>
                    <div className="problem-meta">
                        <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                            {problem.difficulty}
                        </span>
                        <span className={`description ${problem.description.toLowerCase()}`}>
                            {problem.description}
                        </span>
                        <span className="solved-status">
                            {problem.solved ? '✅ Solved' : '❌ Unsolved'}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProblemCard;