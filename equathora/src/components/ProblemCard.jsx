import React from 'react';
import './ProblemCard.css';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaCrown, FaCheckCircle, FaClock } from 'react-icons/fa';

const ProblemCard = ({ problem }) => {
    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return '#22c55e';
            case 'medium':
                return '#f59e0b';
            case 'hard':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    return (
        <Link
            to={`/problems/${problem.groupId}/${problem.id}`}
            className={`problem-card ${problem.completed ? 'completed' : ''}`}
        >
            <div className="problem-card-header">
                <h3 className="problem-title">{problem.title}</h3>
                <div className="problem-icons">
                    {problem.favourite && (
                        <FaStar className="favourite-icon" />
                    )}
                    {problem.premium && (
                        <FaCrown className="premium-icon" />
                    )}
                </div>
            </div>

            <p className="problem-description">{problem.description}</p>

            <div className="problem-footer">
                <span
                    className="difficulty-badge"
                    style={{
                        backgroundColor: `${getDifficultyColor(problem.difficulty)}20`,
                        color: getDifficultyColor(problem.difficulty)
                    }}
                >
                    {problem.difficulty}
                </span>

                <div className="status-badge">
                    {problem.completed && (
                        <span className="status completed-status">
                            <FaCheckCircle /> Completed
                        </span>
                    )}
                    {problem.inProgress && !problem.completed && (
                        <span className="status progress-status">
                            <FaClock /> In Progress
                        </span>
                    )}
                    {!problem.completed && !problem.inProgress && (
                        <span className="status unsolved-status">
                            Not Started
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProblemCard;