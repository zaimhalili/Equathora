import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Settings = () => {
    return (
        <div className='h-screen flex flex-col'>
            <Navbar />
            <h1 className='font-[Inter]'>Settings</h1>
            <Link to="/dashboard">Go to Dashboard</Link>
            <Footer />
        </div>
    );
};

export default Settings;