import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading next experience..." }) => {
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