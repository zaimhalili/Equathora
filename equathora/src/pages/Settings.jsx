import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { resetAllUserProgress } from '../lib/progressStorage';

const Settings = () => {
    const navigate = useNavigate();
    // Use state to manage input values
    const [userName, setUserName] = useState("MyPotential");
    const [userHandle, setUserHandle] = useState("MyPotential");
    const [userLocation, setUserLocation] = useState("");
    const [userBio, setUserBio] = useState("");
    const [seniority, setSeniority] = useState("absBeginner");
    const [isResetting, setIsResetting] = useState(false);
    const [resetMessage, setResetMessage] = useState('');

    const handleResetAccount = async () => {
        if (!window.confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
            return;
        }

        if (!window.confirm('This will delete all your solved problems, streaks, XP, and achievements. Are you absolutely sure?')) {
            return;
        }

        setIsResetting(true);
        setResetMessage('Resetting progress...');

        try {
            const result = await resetAllUserProgress();
            if (result.success) {
                setResetMessage('✅ Progress reset successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/dashboard');
                    window.location.reload();
                }, 1500);
            } else {
                setResetMessage(`❌ Reset failed: ${result.message}`);
            }
        } catch (error) {
            setResetMessage(`❌ Error: ${error.message}`);
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div >
            <Navbar />
            <main className='min-h-screen flex flex-col gap-5 xl:gap-8 bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] items-center text-[var(--secondary-color)] px-8 sm:px-12 md:px-20 lg:px-30 xl:px-72'>
                <h1 className='font-[Sansation,cursive] font-bold text-[var(--secondary-color)] text-2xl lg:text-3xl pt-5'>Settings & Customization</h1>

                {/* Profile Section */}
                <section className='bg-white shadow-gray-500 shadow-2xl rounded-xl w-full px-5 pt-3 pb-5 max-w-[800px]'>
                    <h2 className='font-bold text-xl lg:text-3xl text-[var(--secondary-color)] pb-3'>Profile</h2>
                    <div>
                        <div className='flex flex-col gap-2 pb-3'>
                            <p className='text-xs lg:text-lg font-medium'>Name</p>
                            <input
                                type="text"
                                name="name"
                                id="name_input"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className='text-md border rounded-lg px-3 py-2 lg:py-4 w-full border-[var(--french-gray)] focus:shadow-[var(--accent-color)]'
                                required
                                minLength={4}
                                maxLength={16}
                            />
                        </div>
                        <div className='flex flex-col gap-2 pb-3'>
                            <p className='text-xs lg:text-lg font-medium'>Location</p>
                            <input
                                type="text"
                                name="location"
                                id="location_input"
                                value={userLocation}
                                onChange={(e) => setUserLocation(e.target.value)}
                                className=' text-md border rounded-lg px-3 py-2 lg:py-4 w-full border-[var(--french-gray)] focus:shadow-[var(--accent-color)]'
                                minLength={4}
                                maxLength={16}
                            />
                        </div>
                    </div>
                    <div>
                        <div className='flex flex-col gap-2 pb-3'>
                            <p className='text-xs lg:text-lg font-medium'>BIO</p>
                            <textarea
                                name=""
                                id=""
                                value={userBio}
                                onChange={(e) => setUserBio(e.target.value)}
                                className='text-md xl:text-lg border rounded-lg px-3 py-2 w-full border-[var(--french-gray)] focus:shadow-[var(--accent-color)] h-24 lg:h-32 resize-none scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100'
                                placeholder="Tell the world about yourself..."
                            ></textarea>
                            <p className='text-xs lg:text-md'>Tell the world about you! Be proud!</p>
                        </div>
                    </div>
                    <div>
                        <div className='w-full flex flex-col gap-2 pb-3'>
                            <p className='text-xs lg:text-lg font-medium'>Seniority</p>
                            <select
                                name=""
                                id=""
                                value={seniority}
                                onChange={(e) => setSeniority(e.target.value)}
                                className="text-md cursor-pointeration px-3 py-2 lg:py-4 border rounded-lg border-[var(--french-gray)] appearance-none bg-white pr-10"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundSize: '1.2em'
                                }}
                            >
                                <option value="absBeginner" className='py-2 border border-[var(--french-gray)]'>Absolute Beginner</option>
                                <option value="beginner" className='py-2'>Beginner</option>
                                <option value="Sansationmediate" className='py-2'>Sansationmediate</option>
                                <option value="highschool" className='py-2'>High School Student</option>
                                <option value="undergraduate" className='py-2'>Undergraduate Student</option>
                                <option value="advanced" className='py-2'>Advanced</option>
                                <option value="graduate" className='py-2'>Graduate Student</option>
                                <option value="professional" className='py-2'>Professional</option>
                                <option value="phd" className='py-2'>PhD</option>
                            </select>
                        </div>
                    </div>
                    <hr className='pb-3' />
                    <button type="submit" className='cursor-pointeration py-2 px-3 bg-[var(--accent-color)] text-white font-bold text-md rounded-lg shadow-md shadow-gray-400 border-1 border-black hover:bg-[var(--dark-accent-color)] transition-all duration-150 max-w-[180px]'>Save profile data</button>
                </section>

                {/* Handle Section */}
                <section className='bg-white shadow-gray-500 shadow-2xl rounded-xl w-full px-5 pt-3 pb-5 flex flex-col gap-2 lg:gap-4 max-w-[800px]'>
                    <h1 className='font-[Sansation,cursive] font-bold text-[var(--secondary-color)] text-2xl pt-5 lg:text-3xl'>Change your handle</h1>
                    <div>
                        <input
                            type="text"
                            name="handle"
                            id="handle_input"
                            className='border rounded-lg px-3 py-2 lg:py-4 w-full border-[var(--french-gray)] focus:shadow-[var(--accent-color)] text-md'
                            value={`@${userHandle}`}
                            onChange={(e) => setUserHandle(e.target.value.replace('@', ''))}
                            required
                            minLength={4}
                            maxLength={16}
                        />
                    </div>
                    <div>
                        <button type="submit" className='cursor-pointeration py-2 px-3 bg-[var(--accent-color)] text-white font-bold text-md rounded-lg shadow-md shadow-gray-400 border-1 border-black hover:bg-[var(--dark-accent-color)] transition-all duration-150 max-w-[180px]'>Change handle</button>
                    </div>
                </section>

                {/* Reset & Delete Account */}
                <section className='flex gap-4 flex-col lg:flex-row pt-4 pb-7 max-w-[800px]'>
                    <div className='w-full lg:w-1/2 border-2 border-[var(--dark-accent-color)] rounded-md 
                    bg-[var(--really-light-accent)] px-5 py-5 gap-3 flex flex-col shadow-lg shadow-gray-600'>
                        <h4 className='font-[Sansation,cursive] font-bold text-[var(--secondary-color)] text-lg lg:text-2xl'>Reset Progress</h4>
                        <p className='text-md'>Resetting your progress will clear all solved problems, streaks, XP, and achievements. This cannot be undone.</p>
                        {resetMessage && (
                            <p className={`text-sm ${resetMessage.includes('✅') ? 'text-green-600' : resetMessage.includes('❌') ? 'text-red-600' : 'text-gray-600'}`}>
                                {resetMessage}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={handleResetAccount}
                            disabled={isResetting}
                            className='cursor-pointeration py-2 px-3 bg-[var(--accent-color)] text-white font-bold text-md border-1 border-black hover:bg-[var(--dark-accent-color)] transition-all rounded-xs duration-200 lg:max-w-[180px] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isResetting ? 'Resetting...' : 'Reset Progress'}
                        </button>
                    </div>

                    <div className='w-full border-2 border-[var(--dark-accent-color)] rounded-md lg:w-1/2
                    bg-[var(--really-light-accent)] px-5 py-5 gap-3 flex flex-col shadow-lg shadow-gray-600'>
                        <h4 className='font-[Sansation,cursive] font-bold text-[var(--secondary-color)] text-lg lg:text-2xl'>Delete Account</h4>
                        <p className='text-md'>This option will eliminate your account entirely with all data.
                            You’ll get a chance to confirm your choice.</p>
                        <button type="submit" className='cursor-pointeration py-2 px-3 rounded-xs bg-[var(--accent-color)] text-white font-bold text-md border-1 border-black hover:bg-[var(--dark-accent-color)] transition-all duration-200 hover:-translate-y-1 lg:max-w-[180px]'>Delete account</button>
                    </div>
                </section>
            </main>
            <Footer />
        </div >
    );
};

export default Settings;