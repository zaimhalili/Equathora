import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Settings = () => {
    return (
        <div >
            <Navbar />
            <main className='min-h-screen flex flex-col bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] items-center'>
                <h1 className='font-[Public Sans,cursive] font-bold text-[var(--secondary-color)] text-2xl pt-2'>Settings & Customization</h1>
                <section>
                    <h2>Profile</h2>
                    <div>
                        <div>
                            <p>Name</p>
                            <input type="text" name="" id="" />
                        </div>
                        <div>
                            <p>Location</p>
                            <input type="text" name="" id="" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <textarea name="" id=""></textarea>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Settings;