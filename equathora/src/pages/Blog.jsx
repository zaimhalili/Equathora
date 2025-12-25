import React, { useState } from 'react';
import ShareButton from '../components/ui/ShareButton.jsx';
import Navbar from '../components/Navbar.jsx';
import FeebackBanner from '../components/FeedbackBanner.jsx';
import { Link } from 'react-router-dom';
import ProfilePic from '../assets/images/autumn.jpg';
import Footer from '../components/Footer.jsx';
import CommunityPosts from '../components/Dashboard/CommunityPosts.jsx';

const Blog = () => {
    return (
        <div>
            <FeebackBanner />
            <Navbar />
            <main className='flex bg-white font-[Inter] flex-col min-h-screen w-full items-center'>
                <section className='flex flex-col w-full items-center lg:flex-row justify-center bg-[linear-gradient(180deg,var(--secondary-color),var(--accent-color)110%)] shadow-2xl shadow-black/20 relative'>
                    {/* header section */}
                    <header className=' w-full flex flex-col px-[4vw] xl:px-[6vw] max-w-[1500px] lg:pt-6 gap-8'>
                        {/* Header and Profile Picture of the one who posts */}
                        <div className='flex w-full flex-col md:flex-row justify-between items-start md:items-center pt-8 gap-4'>
                            <div className='gap-2 flex flex-col flex-1'>
                                <h1 className='text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-medium font-[DynaPuff] text-white'>What Equathora Is Trying to Fix in Math & Logic Learning</h1>
                                <div className='flex flex-wrap gap-2 font-medium text-base sm:text-lg md:text-xl text-[var(--french-gray)]'>
                                    <p>@Zaim</p>
                                    {/* <p>Reputation</p> */}
                                    <p>~ Recently</p>
                                </div>
                            </div>
                            <img src={ProfilePic} alt="Profile picture" className='rounded-full h-20 w-20 md:h-24 md:w-24 lg:h-30 lg:w-30 flex-shrink-0' />
                        </div>
                        {/* Share Link Container */}
                        <div className='flex flex-col sm:flex-row max-w-3/4 rounded-tr-2xl rounded-tl-2xl px-4 sm:px-8 py-6 gap-4 bg-white text-black items-center'>
                            <div className='flex items-center gap-4 justify-between w-full flex-1'>
                                <div className='flex items-center gap-3 sm:gap-8'>
                                    <img src={ProfilePic} alt="Profile picture" className='rounded-full h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0' />
                                    <div className='flex flex-col gap-1'>
                                        <h3 className='font-bold text-base sm:text-xl'>Find the post interesting or useful?</h3>
                                        <p className='text-sm sm:text-lg'>Share it around and have others benefit too!</p>
                                    </div>
                                </div>
                            </div>
                            <ShareButton
                                text="Check out this awesome blog post on Equathora!"
                                url={window.location.href}
                            />
                        </div>
                    </header>
                </section>
                {/* Blog Content Section */}
                <section className='flex flex-col lg:flex-row justify-center bg-[var(--main-color)] w-full'>
                    <article className='px-[4vw] xl:px-[6vw] w-full max-w-[1500px] pb-6 gap-1 text-black flex flex-col'>
                        <div className='flex w-full sm:max-w-3/4 bg-white flex-col px-4 sm:px-8 pt-6 pb-10 gap-2 rounded-b-2xl'>
                            <h2 className='text-xl sm:text-2xl font-bold font-[Inter]'>Why most math practice fails</h2>
                            <p className='text-black pb-4 text-sm sm:text-base'>
                                Most online math platforms focus on repetition and memorization. Students learn to recognize patterns instead of developing real problem-solving and <strong>logical reasoning skills.</strong> When problems change format, performance drops.
                                A lot of math practice today turns into repetition. You learn how to recognize a template, apply a formula, and move on. It works for tests, but it rarely teaches you how to think when the problem doesn't look familiar.
                            </p>
                            <hr />
                            <h2 className='text-xl sm:text-2xl font-bold font-[Inter] pt-2'>The idea behind Equathora</h2>
                            <p className='text-black text-sm sm:text-base'>Equathora is a problem-solving platform built around logic and mathematical reasoning. Instead of template-based exercises, problems require step-by-step thinking and allow <strong>multiple</strong> valid solution paths. The focus is on understanding, not speed.</p>
                            <hr />
                            <h2 className='text-xl sm:text-2xl font-bold font-[Inter] pt-2'>What the Equathora MVP includes</h2>
                            <p className='text-black text-sm sm:text-base'>The current MVP focuses on core features only. Users can solve logic and math problems organized by topic, read full solution explanations, and track progress through a simple scoring system. The interface is intentionally <strong>clean</strong> to reduce distractions and keep attention on reasoning.</p>
                            <hr />
                            <h2 className='text-xl sm:text-2xl font-bold font-[Inter] pt-2'>Planned features and roadmap</h2>
                            <p className='text-black text-sm sm:text-base'>Future updates will introduce partial-credit solutions, mentor and teacher monitoring, and light gamification through <strong>achievements</strong> and <strong>timers.</strong> Most content will remain free, while advanced guidance and feedback will be unlocked through a token-based system.</p>
                            <hr />
                            <h2 className='text-xl sm:text-2xl font-bold font-[Inter] pt-2'>Get involved</h2>
                            <p className='text-black text-sm sm:text-base'>
                                If you’re interested in improving logical thinking and math problem-solving skills, you can follow development updates and <strong>early access</strong> here: <br />
                                <Link to="/waitlist" className='!underline !text-[var(--dark-accent-color)]'> Join the Equathora waitlist</Link>
                                <br /><br />
                                This forum isn’t just for updates. Feedback matters. If something feels missing, unnecessary, or poorly designed, say it. Equathora is meant to be shaped through discussion. <br /><br />

                                <strong>The goal? <br />
                                    Not more problems. Better thinking.
                                </strong>

                            </p>
                            <hr />
                            <p className='text-[var(--mid-main-secondary)] text-sm sm:text-base'>20th Aug 2025 · Found it useful?</p>
                            <ShareButton />
                        </div>

                    </article>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;