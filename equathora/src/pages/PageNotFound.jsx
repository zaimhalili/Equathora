import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PageNotFound.css';    

const PageNotFound = () => {
    const navigate = useNavigate();
    return (
        <div className='page-not-found theme-lock'>
            <div className='not-found-content'>
                <div className='error-code'>404</div>
                <h1 className='error-title'>Page Not Found</h1>
                <p className='error-message'>
                    Oops! The page you're looking for doesn't exist.
                    It might have been moved or deleted.
                </p>
                <div className='error-actions'>
                    <button onClick={() => navigate(-1)} className='btn-primary'>
                        Go Back
                    </button>
                    <Link to='/dashboard' className='btn-secondary'>
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;