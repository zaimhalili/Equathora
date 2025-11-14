import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Settings = () => {
    let userName = "MyPotential"
    let userHandle = "MyPotential";
    let userLocation = "";
    return (
        <div >
            <Navbar />
            <main className='min-h-screen flex flex-col bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] items-center text-[var(--secondary-color)] px-8'>
                <h1 className='font-[Public Sans,cursive] font-bold text-[var(--secondary-color)] text-2xl pt-5 pb-5'>Settings & Customization</h1>
                <section className='bg-white shadow-gray-500 shadow-2xl rounded-xl w-full px-5 pt-3 pb-5'>
                    <h2 className='font-bold text-xl text-[var(--secondary-color)] pb-3'>Profile</h2>
                    <div>
                        <div className='flex flex-col gap-2 pb-3'>
                            <p className='text-xs font-medium'>Name</p>
                            <input type="text" name="name" id="name_input" value={userName} className='border rounded-lg px-3 py-2 w-full border-[var(--french-gray)] focus:shadow-[var(--accent-color)]' required />
                        </div>
                        <div className='flex flex-col gap-2 pb-3'>
                            <p className='text-xs font-medium'>Location</p>
                            <input type="text" name="location" id="location_input" value={userLocation} className='border rounded-lg px-3 py-2 w-full border-[var(--french-gray)] focus:shadow-[var(--accent-color)]' />
                        </div>
                    </div>
                    <div>
                        <div className='flex flex-col gap-2 pb-3'>
                            <p className='text-xs font-medium'>BIO</p>
                            <textarea name="" id="" className='border rounded-lg px-3 py-2 w-full border-[var(--french-gray)] focus:shadow-[var(--accent-color)] h-10 max-h-20'></textarea>
                            <p className='text-xs'>Tell the world about you! Be proud!</p>
                        </div>
                    </div>
                    <div>
                        <div className='w-full flex flex-col gap-2 pb-3'>
                            <p className='text-xs font-medium'>Seniority</p>
                            <select name="" id="" className='cursor-pointer py-2 border rounded-lg border-[var(--french-gray)]'>
                                <option value="absBeginner" className='py-2 border border-[var(--french-gray)]'>Absolute Beginner</option>
                                <option value="beginner" className='py-2'>Beginner</option>
                                <option value="highschool" className='py-2'>High School Student</option>
                                <option value="phd" className='py-2'>PHD</option>
                            </select>
                        </div>
                    </div>
                    <hr className='pb-3'/>
                    <button type="submit" className='cursor-pointer py-2 px-4 bg-[var(--accent-color)] text-white font-bold text-md rounded-lg shadow-md shadow-gray-400 border-1 border-black hover:bg-[var(--dark-accent-color)] transition-all duration-150 max-w-[180px]'>Save profile data</button>
                </section>
                <section>
                    <h2>Change Your handle</h2>
                    <div>
                        <input type="text" name="" id="" value={` @ ${userHandle}`} required />
                    </div>
                    <div>
                        <button type="submit">Change handle</button>
                    </div>
                </section>
                <section className='flex gap-5'>
                    <div className='w-1/2 border-3 border-[var(--dark-accent-color)] rounded-3xl 
                    bg-[var(--really-light-accent)] px-5 py-5'>
                        <h4 className='font-bold'>Reset Account</h4>
                        <p>Resetting your account will reset your progress on all tracks,
                            reset all exercises and remove access to all your previous mentoring.</p>
                        <button type="submit">Reset account</button>
                    </div>

                    <div className='w-1/2'>
                        <h4>Delete Account</h4>
                        <p>This option will eliminate your account entirely with all data.
                            You’ll get a chance to confirm your choice.</p>
                        <button type="submit">Delete account</button>
                    </div>
                </section>
            </main>
            <Footer />
        </div >
    );
};

export default Settings;