import React from 'react';
import './ProblemCard.css';
import { Link } from 'react-router-dom';
import { FaStar, FaCrown, FaCheckCircle, FaRegCircle, FaAdjust, FaChartBar, FaLayerGroup } from 'react-icons/fa';
import { generateProblemSlug } from '../lib/slugify';
import { formatTopicLabel } from '../lib/utils';

const ProblemCard = ({ problem }) => {
    const getDifficultyColor = (difficulty) => {
        switch ((difficulty || '').toLowerCase()) {
            case 'beginner': return '#38bdf8';
            case 'easy': return '#22c55e';
            case 'standard':
            case 'intermediate': return '#14b8a6';
            case 'medium': return '#e59e0b';
            case 'challenging': return '#f97316';
            case 'hard': return '#ef4444';
            case 'advanced':
            case 'expert': return '#8b5cf6';
            default: return 'var(--mid-main-secondary)';
        }
    };

    const getDifficultyLabel = (difficulty) => {
        return (difficulty || 'Unknown').charAt(0).toUpperCase() + (difficulty || 'unknown').slice(1);
    };

    const problemSlug = problem.slug || generateProblemSlug(problem.title, problem.id);
    const difficultyColor = getDifficultyColor(problem.difficulty);

    return (
        <Link
            to={`/problems/${problemSlug}`}
            className={`problem-card minimal ${problem.completed ? 'is-completed' : ''}`}
        >
            <div className="pc-top-row">
                <div className="pc-topic">
                    <FaLayerGroup className="pc-icon-sm" />
                    <span>{problem.topic ? formatTopicLabel(problem.topic) : 'General'}</span>
                </div>
                <div className="pc-actions">
                    {problem.premium && <FaCrown className="pc-icon-premium" title="Premium Equivalent" />}
                    {problem.favourite && <FaStar className="pc-icon-fav" title="Favourite" />}
                </div>
            </div>

            <div className="pc-title-wrapper">
                <h3 className="pc-title">{problem.title}</h3>
            </div>

            <div className="pc-bottom-row">
                <div className="pc-difficulty" style={{ '--diff-color': difficultyColor }}>
                    <FaChartBar className="pc-icon-diff" />
                    <span>{getDifficultyLabel(problem.difficulty)}</span>
                </div>
                <div className="pc-status">
                    {problem.completed ? (
                        <div className="pc-status-item success">
                            <FaCheckCircle className="pc-icon-status" />
                            <span>Done</span>
                        </div>
                    ) : problem.inProgress ? (
                        <div className="pc-status-item warning">
                            <FaAdjust className="pc-icon-status" />
                            <span>In Progress</span>
                        </div>
                    ) : (
                        <div className="pc-status-item neutral">
                            <FaRegCircle className="pc-icon-status" />
                            <span>Start</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProblemCard;