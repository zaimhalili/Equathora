import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import FeebackBanner from '../components/FeedbackBanner.jsx';
import Footer from '../components/Footer.jsx';
import { getAllBlogPosts } from '../data/blogPosts.js';

const BlogList = () => {
    const blogPosts = getAllBlogPosts();

    return (
        <div>
            <FeebackBanner />
            <Navbar />
            <main className='flex bg-[var(--main-color)] font-[Inter] flex-col min-h-screen w-full items-center py-12'>
                <section className='px-[4vw] xl:px-[6vw] w-full max-w-[1500px]'>
                    <h1 className='text-4xl font-bold font-[Inter] text-[var(--secondary-color)] mb-8'>
                        Equathora Blog
                    </h1>
                    <p className='text-lg text-gray-600 mb-12'>
                        Updates, insights, and thoughts on mathematical reasoning and education.
                    </p>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {blogPosts.map(post => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug}`}
                                className='bg-white rounded-lg shadow-[0_10px_10px_rgba(141,153,174,0.3)] overflow-hidden hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out hover:scale-105 cursor-pointer flex flex-col'
                            >
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className='w-full max-h-40 object-cover'
                                />
                                <div className='p-6 flex flex-col gap-3 flex-1'>
                                    <div className='flex items-center gap-2 text-sm text-[var(--mid-main-secondary)]'>
                                        <span className='px-3 py-1 bg-[var(--accent-color)] text-white rounded-full text-xs'>
                                            {post.category}
                                        </span>
                                        {post.readTime && <span>· {post.readTime}</span>}
                                    </div>
                                    <h2 className='text-xl font-bold font-[Inter] text-[var(--secondary-color)] line-clamp-2'>
                                        {post.title}
                                    </h2>
                                    <p className='text-gray-600 text-sm line-clamp-3 flex-1'>
                                        {post.description}
                                    </p>
                                    <div className='flex items-center gap-2 pt-3 border-t border-gray-200'>
                                        <img
                                            src={post.author.profilePic}
                                            alt={post.author.name}
                                            className='w-8 h-8 rounded-full object-contain'
                                        />
                                        <div className='text-sm'>
                                            <p className='font-medium text-gray-800'>{post.author.name}</p>
                                            <p className='text-gray-500'>{post.date}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
            <div className='w-full bg-[var(--secondary-color)] border-t border-white/10 flex justify-center py-5 text-white/60 text-xs'>
                <a href="https://storyset.com/education" target="_blank" rel="noopener noreferrer" className='hover:text-white/80 transition-colors no-underline'>
                    Education illustrations by Storyset
                </a>
            </div>
        </div>
    );
};

export default BlogList;
