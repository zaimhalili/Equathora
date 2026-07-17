import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './InsightPanel.css';
import { FaCheck } from 'react-icons/fa';

/**
 * InsightPanel -- Navbar-attached feedback ribbon
 *
 * Appears below the navbar after a correct answer. Slides down with a
 * subtle animation, shows a one-line insight, topic/difficulty tags,
 * and action buttons. Auto-dismisses after a configurable duration.
 */
const InsightPanel = ({
    insight = '',
    topic = '',
    difficulty = '',
    nextProblemPath = null,
    onViewSolution = null,
    onDismiss = null,
    autoDismissSeconds = 12,
    title = 'Correct',
    primaryLabel = 'Next problem',
}) => {
    const [visible, setVisible] = useState(true);
    const [closing, setClosing] = useState(false);

    const handleDismiss = useCallback(() => {
        setClosing(true);
        setTimeout(() => {
            setVisible(false);
            if (onDismiss) onDismiss();
        }, 280);
    }, [onDismiss]);

    // Auto-dismiss timer
    useEffect(() => {
        if (autoDismissSeconds <= 0) return;
        const timer = setTimeout(handleDismiss, autoDismissSeconds * 1000);
        return () => clearTimeout(timer);
    }, [autoDismissSeconds, handleDismiss]);

    if (!visible) return null;

    return (
        <div className="insight-panel-overlay">
            <div className={`insight-panel${closing ? ' closing' : ''}`}>
                <div className="insight-panel-inner">

                    <div className="insight-content">
                        {/* Row 1: Status + Actions */}
                        <div className="insight-top-row">
                            <div className="insight-status">
                                <div className="insight-check-icon">
                                    <FaCheck className='h-3 w-3 !text-white'></FaCheck>
                                </div>
                                <span className="insight-title">{title}</span>
                            </div>

                            <div className="insight-actions">
                                {onViewSolution && (
                                    <button
                                        type="button"
                                        className="insight-btn-secondary"
                                        onClick={() => {
                                            if (onViewSolution) onViewSolution();
                                            handleDismiss();
                                        }}
                                    >
                                        View full solution
                                    </button>
                                )}

                                {nextProblemPath ? (
                                    <Link
                                        to={nextProblemPath}
                                        className="insight-btn-primary"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        {primaryLabel}
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <button type="button" className="insight-btn-primary" disabled style={{ opacity: 0.5, cursor: 'default' }}>
                                        {primaryLabel}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="insight-dismiss"
                                    onClick={handleDismiss}
                                    aria-label="Dismiss"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Row 2: Insight text + tags */}
                        <div className="insight-bottom-row">
                            <p className="insight-text">{insight}</p>
                        </div>
                    </div>
                </div>

                {/* Auto-dismiss progress bar */}
                {autoDismissSeconds > 0 && (
                    <div className="insight-progress">
                        <div
                            className="insight-progress-bar"
                            style={{ '--duration': `${autoDismissSeconds}s` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsightPanel;
