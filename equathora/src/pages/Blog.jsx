import React from 'react';
import Navbar from '../components/Navbar.jsx';
import FeebackBanner from '../components/FeedbackBanner.jsx';
import { Link } from 'react-router-dom';
import ProfilePic from '../assets/images/autumn.jpg';
import Footer from '../components/Footer.jsx';

const Blog = () => {
    return (
        <div>
            <FeebackBanner />
            <Navbar />
            <main className='flex bg-blue-800 font-[Inter] flex-col min-h-screen w-full'>
                <section className='flex flex-col lg:flex-row justify-start px-[4vw] xl:px-[6vw] w-full max-w-[1500px] pt-4 lg:pt-6 gap-8 bg-purple-600'>
                    <section className='bg-blue-200 w-full pt-10 flex flex-col gap-8'>
                        {/* Header and Profile Picture of the one who posts */}
                        <div className='flex w-full justify-between items-center'>
                            <div className='gap-2 flex flex-col'>
                                <h1 className='text-6xl font-bold font-[DynaPuff]'>Lorem ipsum dolor sit amet consectetur elit.</h1>
                                <div className='flex gap-2 font-medium text-2xl text-[var(--french-gray)]'>
                                    <p>@Zaim</p>
                                    {/* <p>Reputation</p> */}
                                    <p>~ Recently</p>
                                </div>
                            </div>
                            <div>
                                <img src={ProfilePic} alt="Profile picture" className='rounded-full h-30 w-30' />
                            </div>
                        </div>
                        {/* Share Link Container */}
                        <div className='flex bg-gray-600 max-w-3/4 rounded-tr-2xl rounded-tl-2xl px-8 py-6 gap-2'>
                            <div className='flex items-center gap-4 justify-between w-full '>
                                <div className='flex items-center gap-2'>
                                    <img src={ProfilePic} alt="Profile picture" className='rounded-full h-20 w-20' />
                                    <div>
                                        <h3>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</h3>
                                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste.</p>
                                    </div>
                                </div>
                            </div>
                            <button type="button">Share</button>
                        </div>
                    </section>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;