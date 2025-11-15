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
            <main className='min-h-screen flex flex-col gap-5 bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] items-center text-[var(--secondary-color)] px-8 sm:px-12 md:px-20 lg:px-30 xl:px-72'>
                <h1 className='font-[Public Sans,cursive] font-bold text-[var(--secondary-color)] text-2xl lg:text-3xl pt-5'>Settings & Customization</h1>
                <section className='bg-white shadow-gray-500 shadow-2xl rounded-xl w-full px-5 pt-3 pb-5'>
                    <h2 className='font-bold text-xl lg:text-3xl text-[var(--secondary-color)] pb-3'>Profile</h2>
                    <div>
                        <div className='flex flex-col gap-2 pb-3'>
                            <p className='text-xs lg:text-lg font-medium'>Name</p>
                            <input type="text" name="name" id="name_input" value={userName} className='text-md border rounded-lg px-3 py-2 lg:py-4 w-full border-[var(--french-gray)] focus:shadow-[var(--accent-color)]' required minLength={4} maxLength={16}/>
                        </div>
                        <div className='flex flex-col gap-2 pb-3'>
                            <p className='text-xs lg:text-lg font-medium'>Location</p>
                            <input type="text" name="location" id="location_input" value={userLocation} className=' text-md border rounded-lg px-3 py-2 lg:py-4 w-full border-[var(--french-gray)] focus:shadow-[var(--accent-color)]' minLength={4} maxLength={16} />
                        </div>
                    </div>
                    <div>
                        <div className='flex flex-col gap-2 pb-3'>
                            <p className='text-xs lg:text-lg font-medium'>BIO</p>
                            <textarea name="" id="" className='text-md border rounded-lg px-3 py-2 lg:py-4 w-full border-[var(--french-gray)] focus:shadow-[var(--accent-color)] h-10 max-h-20 overflow-auto min-h-10 text-md/normal'></textarea>
                            <p className='text-xs'>Tell the world about you! Be proud!</p>
                        </div>
                    </div>
                    <div>
                        <div className='w-full flex flex-col gap-2 pb-3'>
                            <p className='text-xs font-medium'>Seniority</p>
                            <select name="" id="" className='cursor-pointer px-3 py-2 border rounded-lg border-[var(--french-gray)]'>
                                <option value="absBeginner" className='py-2 border border-[var(--french-gray)]'>Absolute Beginner</option>
                                <option value="beginner" className='py-2'>Beginner</option>
                                <option value="highschool" className='py-2'>High School Student</option>
                                <option value="phd" className='py-2'>PHD</option>
                            </select>
                        </div>
                    </div>
                    <hr className='pb-3'/>
                    <button type="submit" className='cursor-pointer py-2 px-3 bg-[var(--accent-color)] text-white font-bold text-md rounded-lg shadow-md shadow-gray-400 border-1 border-black hover:bg-[var(--dark-accent-color)] transition-all duration-150 max-w-[180px]'>Save profile data</button>
                </section>
                <section className='bg-white shadow-gray-500 shadow-2xl rounded-xl w-full px-5 pt-3 pb-5 flex flex-col gap-2 lg:gap-4'>
                    <h1 className='font-[Public Sans,cursive] font-bold text-[var(--secondary-color)] text-2xl pt-5 lg:text-3xl'>Change your handle</h1>
                    <div>
                        <input type="text" name="handle" id="handle_input" className='border rounded-lg px-3 py-2 lg:py-4 w-full border-[var(--french-gray)] focus:shadow-[var(--accent-color)] text-md' value={` @ ${userHandle}`} required minLength={4} maxLength={16} />
                    </div>
                    <div>
                        <button type="submit" className='cursor-pointer py-2 px-3 bg-[var(--accent-color)] text-white font-bold text-md rounded-lg shadow-md shadow-gray-400 border-1 border-black hover:bg-[var(--dark-accent-color)] transition-all duration-150 max-w-[180px]'>Change handle</button>
                    </div>
                </section>

                {/* Reset & Delete Account */}
                <section className='flex gap-4 flex-col pt-4 pb-7'>
                    <div className='w-full border-2 border-[var(--dark-accent-color)] rounded-md 
                    bg-[var(--really-light-accent)] px-5 py-5 gap-3 flex flex-col shadow-lg shadow-gray-600'>
                        <h4 className='font-[Public Sans,cursive] font-bold text-[var(--secondary-color)] text-lg lg:text-2xl'>Reset Account</h4>
                        <p className='text-md'>Resetting your account will reset your progress on all tracks,
                            reset all exercises and remove access to all your previous mentoring.</p>
                        <button type="submit" className='cursor-pointer py-2 px-3 bg-[var(--accent-color)] text-white font-bold text-md border-1 border-black hover:bg-[var(--dark-accent-color)] transition-all duration-150 lg:max-w-[180px]'>Reset account</button>
                    </div>

                    <div className='w-full border-2 border-[var(--dark-accent-color)] rounded-md 
                    bg-[var(--really-light-accent)] px-5 py-5 gap-3 flex flex-col shadow-lg shadow-gray-600'>
                        <h4 className='font-[Public Sans,cursive] font-bold text-[var(--secondary-color)] text-lg lg:text-2xl'>Delete Account</h4>
                        <p className='text-md'>This option will eliminate your account entirely with all data.
                            You’ll get a chance to confirm your choice.</p>
                        <button type="submit" className='cursor-pointer py-2 px-3 bg-[var(--accent-color)] text-white font-bold text-md border-1 border-black hover:bg-[var(--dark-accent-color)] transition-all duration-150 lg:max-w-[180px]'>Delete account</button>
                    </div>
                </section>
            </main>
            <Footer />
        </div >
    );
};

export default Settings;