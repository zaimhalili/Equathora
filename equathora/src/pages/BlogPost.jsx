import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ShareButton from '../components/ui/ShareButton.jsx';
import Navbar from '../components/Navbar.jsx';
import NavigationBar from '@/components/Landing/NavigationBar.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import FeebackBanner from '../components/FeedbackBanner.jsx';
import Footer from '../components/Footer.jsx';
import Journey from '../assets/images/journey.webp';
import { getBlogPostBySlug, getAllBlogPosts } from '../data/blogPosts.js';
import { getCanonicalUrl } from '../lib/seoMetadata.js';

const BlogPost = () => {
    const { user } = useAuth();
    const { slug } = useParams();
    const post = getBlogPostBySlug(slug);

    useEffect(() => {
        if (!post) return undefined;

        const pageUrl = getCanonicalUrl(`/blog/${post.slug}`);
        const imageUrl = new URL(post.thumbnail, window.location.origin).href;
        const metadata = [
            ['meta[name="description"]', 'content', post.description],
            ['meta[name="keywords"]', 'content', (post.keywords || []).join(', ')],
            ['meta[property="og:type"]', 'content', 'article'],
            ['meta[property="og:title"]', 'content', `${post.title} | Equathora`],
            ['meta[property="og:description"]', 'content', post.description],
            ['meta[property="og:url"]', 'content', pageUrl],
            ['meta[property="og:image"]', 'content', imageUrl],
            ['meta[name="twitter:card"]', 'content', 'summary_large_image'],
            ['meta[name="twitter:title"]', 'content', `${post.title} | Equathora`],
            ['meta[name="twitter:description"]', 'content', post.description],
            ['meta[name="twitter:image"]', 'content', imageUrl],
        ];
        const previousValues = metadata.map(([selector, attribute, value]) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            const previousValue = element.getAttribute(attribute);
            element.setAttribute(attribute, value);
            return { element, attribute, previousValue };
        }).filter(Boolean);

        const previousTitle = document.title;
        document.title = `${post.title} | Equathora`;

        const canonicalLink = document.querySelector('link[rel="canonical"]');
        const previousCanonical = canonicalLink?.getAttribute('href');
        canonicalLink?.setAttribute('href', pageUrl);

        const schemaElement = document.createElement('script');
        schemaElement.type = 'application/ld+json';
        schemaElement.dataset.blogPostSchema = 'true';
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            image: imageUrl,
            datePublished: post.publishedAt,
            author: {
                '@type': 'Organization',
                name: post.author.name,
                url: 'https://equathora.com'
            },
            publisher: {
                '@type': 'Organization',
                name: 'Equathora',
                url: 'https://equathora.com'
            },
            mainEntityOfPage: pageUrl,
            keywords: post.keywords?.join(', '),
            video: post.videoId ? {
                '@type': 'VideoObject',
                name: post.videoTitle,
                description: post.description,
                thumbnailUrl: imageUrl,
                embedUrl: `https://www.youtube-nocookie.com/embed/${post.videoId}`
            } : undefined
        };
        schemaElement.textContent = JSON.stringify(schema);
        document.head.appendChild(schemaElement);

        return () => {
            document.title = previousTitle;
            previousValues.forEach(({ element, attribute, previousValue }) => {
                if (previousValue === null) element.removeAttribute(attribute);
                else element.setAttribute(attribute, previousValue);
            });
            if (previousCanonical === null) canonicalLink?.removeAttribute('href');
            else if (previousCanonical) canonicalLink?.setAttribute('href', previousCanonical);
            schemaElement.remove();
        };
    }, [post]);

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
                    <h2 key={index} className='text-xl sm:text-2xl font-medium  pt-2'>
                        {contentItem.text}
                    </h2>
                );
            case 'paragraph':
                return (
                    <p
                        key={index}
                        className='text-(--secondary-color) text-sm sm:text-base'
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
                        className='!underline !text-(--dark-accent-color)'
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
                        className='rounded-xl w-full py-4'
                    />
                );
            case 'video':
                return (
                    <div key={index} className="my-4 aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(contentItem.videoId)}`}
                            title={contentItem.title}
                            className="h-full w-full border-0"
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {user ? <Navbar /> : (
                <>
                    <div className="flex pt-10"></div>
                    <NavigationBar />
                </>
            )}
            <main className='flex bg-white  flex-col min-h-screen w-full items-center'>
                {/* Header Section */}
                <section className='flex flex-col w-full items-center lg:flex-row justify-center bg-[linear-gradient(180deg,var(--secondary-color),var(--accent-color)110%)] shadow-2xl shadow-black/20 relative theme-lock'>
                    <header className='w-full flex flex-col px-[4vw] xl:px-[6vw] max-w-[1500px] lg:pt-6 gap-8'>
                        {/* Header and Profile Picture */}
                        <div className='flex w-full flex-col md:flex-row justify-between items-start md:items-center pt-8 gap-4'>
                            <div className='gap-2 flex flex-col flex-1'>
                                <h1 className='text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-medium  text-white'>
                                    {post.title}
                                </h1>
                                <div className='flex flex-wrap gap-2 font-medium text-base sm:text-lg md:text-xl text-(--french-gray)'>
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
                        <div className='flex flex-col sm:flex-row w-full sm:max-w-3/4 rounded-tr-2xl rounded-tl-2xl px-4 sm:px-8 py-6 gap-4 bg-(--white) text-(--secondary-color) items-center'>
                            <div className='flex items-center gap-4 justify-between w-full flex-1'>
                                <div className='flex items-center gap-3 sm:gap-8'>
                                    <img
                                        src={post.author.profilePic}
                                        alt="Profile picture"
                                        className='rounded-full h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 object-cover object-bottom'
                                    />
                                    <div className='flex flex-col gap-1'>
                                        <h3 className='font-medium text-base sm:text-xl text-(--secondary-color)'>Find the post interesting or useful?</h3>
                                        <p className='text-sm sm:text-lg text-(--secondary-color)'>Share it around and have others benefit too!</p>
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
                <section className='flex flex-col md:flex-row justify-center bg-(--main-color) w-full'>
                    <article className='px-[4vw] xl:px-[6vw] w-full max-w-[1500px] pb-6 gap-1 text-(--secondary-color) flex flex-col'>
                        <div className='flex w-full sm:max-w-3/4 bg-(--white) flex-col px-4 sm:px-8 pt-6 pb-10 gap-2 rounded-b-2xl'>
                            {/* Render dynamic content */}
                            {post.content.map((contentItem, index) => renderContent(contentItem, index))}

                            <hr />
                            <p className='text-(--mid-main-secondary) text-sm sm:text-base'>
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
                <section className='w-full flex flex-col bg-(--main-color) items-center py-4'>
                    <article className='px-[4vw] xl:px-[6vw] w-full max-w-[1500px] pb-6 text-(--secondary-color) flex flex-col gap-4'>
                        <h1 className='text-xl sm:text-2xl font-medium  text-(--secondary-color)'>Other Posts You Might Like</h1>
                        <div className='flex w-full gap-4 flex-wrap'>
                            {otherPosts.map(otherPost => (
                                <Link
                                    key={otherPost.id}
                                    to={`/blog/${otherPost.slug}`}
                                    className='bg-(--white) rounded-xl shadow-[0_10px_10px_rgba(141,153,174,0.3)] py-6 px-6 flex gap-2 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out hover:scale-105 cursor-pointer min-w-50 flex-1 max-w-80'
                                >
                                    <img src={otherPost.thumbnail} alt="" className='rounded-xl w-full max-h-40 object-cover' />
                                    <p className='text-md text-left lg:text-lg cursor-pointer  text-(--secondary-color) font-medium'>
                                        {otherPost.title}
                                    </p>
                                    <p className='text-(--mid-main-secondary) '>
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
