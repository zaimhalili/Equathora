import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className='bg-red-200 flex flex-col text-black font-bold justify-center items-center min-h-screen font-[Public Sans, monospace]'>
            <h1>404 Page not found</h1>
            <h2>Return to Dashboard</h2>
            <Link to='/dashboard'>Dashboard</Link>
        </div>
    );
};

export default PageNotFound;