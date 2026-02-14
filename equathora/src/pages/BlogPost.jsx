import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ShareButton from '../components/ui/ShareButton.jsx';
import Navbar from '../components/Navbar.jsx';
import FeebackBanner from '../components/FeedbackBanner.jsx';
import Footer from '../components/Footer.jsx';
import Journey from '../assets/images/journey.jpg';
import { getBlogPostBySlug, getAllBlogPosts } from '../data/blogPosts.js';

const BlogPost = () => {
    const { slug } = useParams();
    const post = getBlogPostBySlug(slug);

    // If post not found, redirect to 404 or blog list
    if (!post) {
        return <Navigate to="/404" replace />;
    }

    // Get other posts for suggestions (exclude current post)
    const otherPosts = getAllBlogPosts()
        .filter(p => p.id !== post.id);

    // Render content based on type
    const renderContent = (contentItem, index) => {
        switch (contentItem.type) {
            case 'heading':
                return (
                    <h2 key={index} className='text-xl sm:text-2xl font-bold font-[Sansation] pt-2'>
                        {contentItem.text}
                    </h2>
                );
            case 'paragraph':
                return (
                    <p
                        key={index}
                        className='text-black text-sm sm:text-base'
                        dangerouslySetInnerHTML={{ __html: contentItem.text }}
                    />
                );
            case 'divider':
                return <hr key={index} />;
            case 'link':
                return (
                    <Link
                        key={index}
                        to={contentItem.url}
                        className='!underline !text-[var(--dark-accent-color)]'
                    >
                        {contentItem.text}
                    </Link>
                );
            case 'image':
                return (
                    <img
                        key={index}
                        src={contentItem.src}
                        alt={contentItem.alt || ''}
                        className='rounded-md w-full my-4'
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <FeebackBanner />
            <Navbar />
            <main className='flex bg-white font-[Sansation] flex-col min-h-screen w-full items-center'>
                {/* Header Section */}
                <section className='flex flex-col w-full items-center lg:flex-row justify-center bg-[linear-gradient(180deg,var(--secondary-color),var(--accent-color)110%)] shadow-2xl shadow-black/20 relative'>
                    <header className='w-full flex flex-col px-[4vw] xl:px-[6vw] max-w-[1500px] lg:pt-6 gap-8'>
                        {/* Header and Profile Picture */}
                        <div className='flex w-full flex-col md:flex-row justify-between items-start md:items-center pt-8 gap-4'>
                            <div className='gap-2 flex flex-col flex-1'>
                                <h1 className='text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-medium font-[Sansation] text-white'>
                                    {post.title}
                                </h1>
                                <div className='flex flex-wrap gap-2 font-medium text-base sm:text-lg md:text-xl text-[var(--french-gray)]'>
                                    <p>{post.author.username}</p>
                                    <p>~ {post.date}</p>
                                    {post.readTime && <p>· {post.readTime}</p>}
                                </div>
                            </div>
                            <img
                                src={post.author.profilePic}
                                alt="Profile picture"
                                className='rounded-full h-20 w-20 md:h-24 md:w-24 lg:h-30 lg:w-30 flex-shrink-0 object-cover object-bottom hidden md:flex'
                            />
                        </div>

                        {/* Share Link Container */}
                        <div className='flex flex-col sm:flex-row w-full sm:max-w-3/4 rounded-tr-2xl rounded-tl-2xl px-4 sm:px-8 py-6 gap-4 bg-white text-black items-center'>
                            <div className='flex items-center gap-4 justify-between w-full flex-1'>
                                <div className='flex items-center gap-3 sm:gap-8'>
                                    <img
                                        src={post.author.profilePic}
                                        alt="Profile picture"
                                        className='rounded-full h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 object-cover object-bottom'
                                    />
                                    <div className='flex flex-col gap-1'>
                                        <h3 className='font-bold text-base sm:text-xl'>Find the post interesting or useful?</h3>
                                        <p className='text-sm sm:text-lg'>Share it around and have others benefit too!</p>
                                    </div>
                                </div>
                            </div>
                            <ShareButton
                                text={`Check out "${post.title}" on Equathora!`}
                                url={window.location.href}
                                className="active:scale-95"
                            />
                        </div>
                    </header>
                </section>

                {/* Blog Content Section */}
                <section className='flex flex-col md:flex-row justify-center bg-[var(--main-color)] w-full'>
                    <article className='px-[4vw] xl:px-[6vw] w-full max-w-[1500px] pb-6 gap-1 text-black flex flex-col'>
                        <div className='flex w-full sm:max-w-3/4 bg-white flex-col px-4 sm:px-8 pt-6 pb-10 gap-2 rounded-b-2xl'>
                            {/* Render dynamic content */}
                            {post.content.map((contentItem, index) => renderContent(contentItem, index))}

                            <hr />
                            <p className='text-[var(--mid-main-secondary)] text-sm sm:text-base'>
                                {post.date} · Found it useful?
                            </p>
                            <ShareButton
                                text={`Check out "${post.title}" on Equathora!`}
                                url={window.location.href}
                                popupPosition="left"
                            />
                        </div>
                    </article>
                </section>

                {/* Other Community Posts */}
                <section className='w-full flex flex-col bg-[var(--main-color)] items-center py-4'>
                    <article className='px-[4vw] xl:px-[6vw] w-full max-w-[1500px] pb-6 text-black flex flex-col gap-4'>
                        <h1 className='text-xl sm:text-2xl font-bold font-[Sansation] text-black'>Other Posts You Might Like</h1>
                        <div className='flex w-full gap-4 flex-wrap'>
                            {otherPosts.map(otherPost => (
                                <Link
                                    key={otherPost.id}
                                    to={`/blog/${otherPost.slug}`}
                                    className='bg-white rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] py-6 px-6 flex gap-2 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out hover:scale-105 cursor-pointer min-w-50 flex-1 max-w-80'
                                >
                                    <img src={otherPost.thumbnail} alt="" className='rounded-md w-full max-h-40 object-cover' />
                                    <p className='text-md text-left lg:text-lg cursor-pointer font-[Sansation] text-[var(--secondary-color)] font-bold'>
                                        {otherPost.title}
                                    </p>
                                    <p className='text-[var(--mid-main-secondary)] font-[Sansation]'>
                                        {otherPost.author.name} ⋅ {otherPost.date}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </article>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPost;
