import React from 'react';
import './ProblemCard.css';
import { Link } from 'react-router-dom';
import { generateProblemSlug } from '../lib/slugify';
import MathJaxRenderer from './MathJaxRenderer';

const StarIcon = ({ className, ...props }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        <path d="M12 2l2.9 6.6 7.1.6-5.3 4.6 1.6 7-6.3-3.7-6.3 3.7 1.6-7L2 9.2l7.1-.6L12 2z" />
    </svg>
);

const CrownIcon = ({ className, ...props }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        <path d="M4 7l4 4 4-6 4 6 4-4v10H4z" />
        <path d="M4 20h16v2H4z" />
    </svg>
);

const CheckCircleIcon = ({ className, ...props }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

const ClockIcon = ({ className, ...props }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
    </svg>
);

const TagIcon = ({ className, ...props }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        <path d="M20.59 13.41L11 3H3v8l9.59 9.59a2 2 0 0 0 2.82 0l5.18-5.18a2 2 0 0 0 0-2.82z" />
        <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
);

const ProblemCard = ({ problem }) => {
    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return '#22c55e';
            case 'medium':
                return '#e59e0b';
            case 'hard':
                return '#a3142c';
            default:
                return '#6b7280';
        }
    };

    // Generate slug for the problem URL
    const problemSlug = problem.slug || generateProblemSlug(problem.title, problem.id);

    return (
        <Link
            to={`/problems/${problemSlug}`}
            className={`problem-card ${problem.completed ? 'completed' : ''}`}
        >
            <div className="problem-card-header">
                <h3 className="problem-title">{problem.title}</h3>
                <div className="problem-icons">
                    {problem.favourite && (
                        <StarIcon className="favourite-icon" />
                    )}
                    {problem.premium && (
                        <CrownIcon className="premium-icon" />
                    )}
                </div>
            </div>

            <MathJaxRenderer
                content={problem.description}
                className="problem-description"
                as="p"
            />

            <div className="problem-footer">
                <div className="footer-left">
                    <span
                        className="difficulty-badge"
                        style={{
                            backgroundColor: `${getDifficultyColor(problem.difficulty)}20`,
                            color: getDifficultyColor(problem.difficulty)
                        }}
                    >
                        {problem.difficulty}
                    </span>
                    {problem.topic && (
                        <span className="topic-badge">
                            <TagIcon className="topic-icon" />
                            {problem.topic}
                        </span>
                    )}
                </div>

                <div className="status-badge">
                    {problem.completed && (
                        <span className="status completed-status">
                            <CheckCircleIcon /> Completed
                        </span>
                    )}
                    {problem.inProgress && !problem.completed && (
                        <span className="status progress-status">
                            <ClockIcon /> In Progress
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