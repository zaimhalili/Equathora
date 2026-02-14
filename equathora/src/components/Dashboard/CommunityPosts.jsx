import React from 'react';
import { Link } from 'react-router-dom';
import Autumn from '../../assets/images/autumn.jpg';
import Journey from '../../assets/images/journey.jpg';
import Waitlist from '../../assets/images/email.svg';
import Shapes from '../../assets/images/redShapes.jpg';
import LilArrow from '../../assets/images/lilArrow.svg';
import { getAllBlogPosts } from '../../data/blogPosts.js';

const CommunityPosts = () => {
  const blogPosts = getAllBlogPosts();
  const displayedPosts = blogPosts.slice(0, 3);
  const hasMorePosts = blogPosts.length > 3;

  return (
    <div>
      <article className='flex flex-col lg:flex-row justify-center items-center py-4 lg:py-6'>
        <div className='flex w-full px-[4vw] xl:px-[6vw] max-w-[1500px] flex-col'>
          <article className='w-full lg:w-[70%] flex flex-col gap-3'>
            <h3 className="text-[var(--secondary-color)] font-[Sansation] text-2xl font-bold text-center md:text-left">
              Announcements & Discussions
            </h3>
            <div className='flex gap-3 flex-wrap justify-center md:justify-start'>
              {/* Blog Post Cards */}
              {displayedPosts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className='bg-white rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] w-1/3 py-6 px-6 flex gap-2 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out hover:scale-103 cursor-pointer min-w-50 flex-1 max-w-80 active:scale-100'
                >
                  <img src={post.thumbnail} alt={post.title} className='rounded-md w-full max-h-40 object-cover' />
                  <p className='text-md text-left lg:text-lg cursor-pointer font-[Sansation] text-[var(--secondary-color)] font-bold line-clamp-2'>
                    {post.title}
                  </p>
                  <p className='text-[var(--mid-main-secondary)] font-[Sansation]'>
                    {post.author.name} ⋅ {post.date}
                  </p>
                </Link>
              ))}

              {/* Waitlist Card */}
              <Link to="/waitlist" className='bg-white rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] w-1/3 py-6 px-6 flex gap-2 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out hover:scale-105 cursor-pointer min-w-50 flex-1 max-w-80 active:scale-100'>
                <img src={Waitlist} alt="" className='rounded-md w-full max-h-40 object-cover' />
                <p className='text-md text-left lg:text-lg cursor-pointer font-[Sansation] text-[var(--secondary-color)] font-bold'>Join our waitlist to recieve weekly updates</p>
                <p className='text-[var(--mid-main-secondary)] font-[Sansation]'>Zaim ⋅ Recently</p>
              </Link>
            </div>

            {/* View All Link - shown only if there are more than 3 posts */}
            {hasMorePosts && (
              <div className='w-full flex items-center justify-center md:justify-start'>
                <Link to="/blogs" className='text-lg !text-blue-500 hover:!text-blue-700 !font-bold font-[Sansation] pt-2 transition-colors'>View All Posts →</Link>
              </div>
            )}
          </article>

        </div>
      </article>
    </div>
  );
};

export default CommunityPosts;