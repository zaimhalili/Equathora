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
            <main className='flex bg-white font-[Inter] flex-col min-h-screen w-screen'>
                <section className='flex flex-col lg:flex-row justify-start px-[4vw] xl:px-[6vw] w-full max-w-[1500px] pt-4 lg:pt-6 gap-8 bg-[linear-gradient(180deg,var(--secondary-color),var(--accent-color)90%)] shadow-2xl shadow-black/20 relative'>
                    {/* header section */}
                    <header className=' w-full pt-10 flex flex-col gap-8'>
                        {/* Header and Profile Picture of the one who posts */}
                        <div className='flex w-full justify-between items-center'>
                            <div className='gap-2 flex flex-col'>
                                <h1 className='text-6xl font-bold font-[DynaPuff] text-white'>Lorem ipsum dolor sit amet consectetur elit.</h1>
                                <div className='flex gap-2 font-medium text-xl text-[var(--french-gray)]'>
                                    <p>@Zaim</p>
                                    {/* <p>Reputation</p> */}
                                    <p>~ Recently</p>
                                </div>
                            </div>
                            <img src={ProfilePic} alt="Profile picture" className='rounded-full h-30 w-30' />
                        </div>
                        {/* Share Link Container */}
                        <div className='flex max-w-3/4 rounded-tr-2xl rounded-tl-2xl px-8 py-6 gap-2 bg-white text-black items-center'>
                            <div className='flex items-center gap-4 justify-between w-full '>
                                <div className='flex items-center gap-8'>
                                    <img src={ProfilePic} alt="Profile picture" className='rounded-full h-20 w-20' />
                                    <div>
                                        <h3 className='font-bold text-xl'>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</h3>
                                        <p className='text-lg'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste.</p>
                                    </div>
                                </div>
                            </div>
                            <button type="button" className="button border-[var(--accent-color)] border-2 h-3/4 text-center px-4 text-xl font-medium rounded-sm shadow-lg cursor-pointer">Share</button>
                        </div>
                    </header>
                </section>
                {/* Blog Content Section */}
                <section className='flex flex-col lg:flex-row justify-start px-[4vw] xl:px-[6vw] w-full max-w-[1500px] gap-8 bg-[var(--main-color)]'>
                    <article className='bg-white max-w-3/4 px-8 py-6 gap-1 text-black flex flex-col shadow-2xl'>
                        <h2 className='text-3xl font-medium font-[Inter]'>Introduction</h2>
                        <p className='text-black pb-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
                        <hr />
                        <h2 className='text-3xl font-medium font-[Inter] pt-4'>So let's do it!</h2>
                        <p className='text-black'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
                    </article>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;