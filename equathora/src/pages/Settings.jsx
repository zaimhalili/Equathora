import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Settings = () => {
    return (
        <div className=''>
            <Navbar />
            <h1>Settings</h1>
            <Link to="/dashboard">Go to Dashboard</Link>
            <Footer />
        </div>
    );
};

export default Settings;