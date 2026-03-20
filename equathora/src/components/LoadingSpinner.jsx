import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Just a moment..." }) => {
    return (
        <div className="loading-spinner-container">
            <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            <p className="loading-message">{message}</p>
        </div>
    );
};

export default LoadingSpinner;