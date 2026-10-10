import React from 'react';
import { FaEnvelope, FaCalendar, FaBook } from 'react-icons/fa';

const ProfileComponent = () => {
    return (
        <section className='gap-20 flex flex-col bg-(--white)'>
            <div className="flex flex-col gap-2 font-medium">
                <h2 className='text-2xl'>Profile</h2>
                <h3 className='text-md'>Manage your profile details, cookie preferences, and account access.</h3>
            </div>

            {/* Profile */}
            <article className='rounded-2xl border-(--main-color) overflow-hidden flex flex-col gap-5'>
                <div className="bg-blue-800 w-full h-full min-h-25 max-h-25 relative">
                    <div className="w-20 h-20 rounded-full absolute bg-green-700 left-10 -bottom-8"></div> 
                </div>
                <div className="flex gap-10 bg-(--white) w-full px-5 py-5">
                    {/* Left Side Data */}
                    <div className="flex flex-col text-(--secondary-color)/70 flex-1 max-w-2/5">
                        <h4 className='text-(--black)! text-xl pb-2 font-medium'>Name Surname</h4>
                        <div className="flex gap-2 items-center">
                            <FaEnvelope />
                            emailbroo@gmail.com
                        </div>
                        <div className="flex gap-2 items-center">
                            <FaCalendar />
                            Joined September 9, 2026
                        </div>
                        <div className="flex gap-2 items-center">
                            <FaBook />
                            Student/Teacher status
                        </div>
                    </div>
                    {/* Right Side Boxes */}
                    <div className="flex flex-col flex-1 gap-3 max-w-3/5">
                        <div className="flex gap-3">
                            <div className="flex flex-col bg-(--main-color) rounded-2xl px-5 py-2 flex-1 justify-between">
                                <p className='text-sm text-(--secondary-color)/70'>Current Streak</p>
                                <p className='text-lg text-(--black)'>0 days</p>
                            </div>
                            <div className="flex flex-col bg-(--main-color) rounded-2xl flex-1 px-5 py-2 justify-between">
                                <p className='text-sm text-(--secondary-color)/70'>Longest Streak</p>
                                <p className='text-lg text-(--black)'>6 days</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex flex-col bg-(--main-color) rounded-2xl flex-1 px-5 py-2 justify-between">
                                <p className='text-sm text-(--secondary-color)/70'>Total study time</p>
                                <p className='text-lg text-(--black)'>2h 27min</p>
                            </div>
                            <div className="flex flex-col bg-(--main-color) rounded-2xl flex-1 px-5 py-2 justify-between">
                                <p className='text-sm text-(--secondary-color)/70'>Favorite Subject</p>
                                <p className='text-lg text-(--black)'>Exponentials</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </article>
        </section>
    );
};

export default ProfileComponent;