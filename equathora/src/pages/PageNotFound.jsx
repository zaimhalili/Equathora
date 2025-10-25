import React from 'react';
import { Link } from 'react-router-dom';
import './PageNotFound.css';

const PageNotFound = () => {
    return (
        <div className='page-not-found'>
            <div className='not-found-content'>
                <div className='error-code'>404</div>
                <h1 className='error-title'>Page Not Found</h1>
                <p className='error-message'>
                    Oops! The page you're looking for doesn't exist.
                    It might have been moved or deleted.
                </p>
                <div className='error-actions'>
                    <Link to='/dashboard' className='btn-primary'>
                        Go to Dashboard
                    </Link>
                    <Link to='/' className='btn-secondary'>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;