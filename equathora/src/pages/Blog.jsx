import React from 'react';
import Navbar from '../components/Navbar.jsx';
import FeebackBanner from '../components/FeedbackBanner.jsx';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Journey from '../assets/images/journey.jpg';
import { getAllBlogPosts } from '../data/blogPosts.js';

const Blog = () => {
    const blogPosts = getAllBlogPosts();

    return (
        <div>
            <FeebackBanner />
            <Navbar />
            <main className='flex bg-[var(--main-color)] font-[Inter] flex-col w-full items-center'>
                {/* Header Section */}
                <section className='w-full flex flex-col items-center bg-[linear-gradient(180deg,var(--secondary-color),var(--accent-color)110%)] shadow-2xl shadow-black/20 py-12 md:py-16'>
                    <div className='px-[4vw] xl:px-[6vw] w-full max-w-[1500px] flex flex-col items-center'>
                        <h1 className='text-4xl font-bold font-[DynaPuff] text-white'>
                            Equathora Blog
                        </h1>
                        <p className='text-lg text-[var(--french-gray)] pt-2'>
                            Updates, insights, and thoughts on mathematical reasoning and education
                        </p>
                    </div>
                </section>

                {/* Blog Posts Grid */}
                <section className='w-full flex flex-col items-center py-8'>
                    <article className='px-[4vw] xl:px-[6vw] w-full max-w-[1500px] flex flex-col gap-6'>
                        <h2 className='text-2xl font-bold font-[Inter] text-[var(--secondary-color)]'>
                            Latest Posts
                        </h2>

                        <div className='flex gap-4 flex-wrap justify-center md:justify-start'>
                            {/* Waitlist Card */}
                            <Link to="/waitlist" className='bg-white rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] py-6 px-6 flex gap-2 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out hover:scale-105 cursor-pointer min-w-50 flex-1 max-w-80'>
                                <img src={Journey} alt="" className='rounded-md w-full object-cover h-40 max-h-40' />
                                <p className='text-md text-left lg:text-lg cursor-pointer font-[Inter] text-[var(--secondary-color)] font-bold'>Join our waitlist to receive weekly updates</p>
                                <p className='text-[var(--mid-main-secondary)] font-[Inter]'>Zaim ⋅ Recently</p>
                            </Link>

                            {/* Blog Post Cards */}
                            {blogPosts.map(post => (
                                <Link
                                    key={post.id}
                                    to={`/blog/${post.slug}`}
                                    className='bg-white rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] py-3 px-6 flex gap-2 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out hover:scale-105 cursor-pointer min-w-50 flex-1 max-w-80'
                                >
                                    <img src={post.thumbnail} alt={post.title} className='rounded-md w-full object-cover max-h-40' />
                                    <p className='text-md text-left lg:text-lg cursor-pointer font-[Inter] text-[var(--secondary-color)] font-bold line-clamp-2'>
                                        {post.title}
                                    </p>
                                    <p className='text-[var(--mid-main-secondary)] font-[Inter]'>
                                        {post.author.name} ⋅ {post.date}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </article>
                </section>
            </main>

            <Footer />
            <div className='w-full bg-[var(--secondary-color)] border-t border-white/10 flex justify-center py-3 text-white/60 text-xs'>
                <a href="https://storyset.com/education" target="_blank" rel="noopener noreferrer" className='hover:text-white/80 transition-colors no-underline'>
                    Education illustrations by Storyset
                </a>
            </div>
        </div>
    );
};

export default Blog;
