import React from 'react';
import './ProblemCard.css';
import { Link } from 'react-router-dom';
import { FaStar, FaCrown, FaCheckCircle, FaRegCircle, FaAdjust, FaChartBar, FaLayerGroup } from 'react-icons/fa';
import { generateProblemSlug } from '../lib/slugify';
import { formatTopicLabel } from '../lib/utils';
import { getDifficultyColor } from '@/hooks/useStatisticsColors';

const ProblemCard = ({ problem }) => {

    const getDifficultyLabel = (difficulty) => {
        return (difficulty || 'Unknown').charAt(0).toUpperCase() + (difficulty || 'unknown').slice(1);
    };

    const problemSlug = problem.slug || generateProblemSlug(problem.title, problem.id);
    const difficultyColor = getDifficultyColor(problem.difficulty);
    const isPremium = problem.is_premium ?? problem.premium;

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
                    {isPremium && (
                        <FaCrown className="text-amber-500" title="Premium Equivalent" />
                    )}
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
                            <span>Solved</span>
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