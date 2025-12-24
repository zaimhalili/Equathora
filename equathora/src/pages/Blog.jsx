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
            <main className='flex flex-col items-center min-h-screen'>
                <section className=' bg-green-700 w-full'>
                    <div className=''>
                        <div><h1>Lorem ipsum dolor sit amet.</h1>
                            <div>
                                <p>Zaim</p>
                                {/* <p>Reputation</p> */}
                                <p>Recently</p>
                            </div>
                        </div>

                        <div><img src={ProfilePic} alt="Profile picture" className='rounded-full h-30 w-30' /></div>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <img src={ProfilePic} alt="Profile picture" className='rounded-full h-30 w-30' />
                                        <div>
                                            <h3>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</h3>
                                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste.</p>
                                        </div>
                                    </div>
                                </div>

                                <div></div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Blog;