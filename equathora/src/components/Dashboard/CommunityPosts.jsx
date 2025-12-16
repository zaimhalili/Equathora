import React from 'react';
import { Link } from 'react-router-dom';
import Autumn from '../../assets/images/autumn.jpg';
import Journey from '../../assets/images/journey.jpg';
import Shapes from '../../assets/images/redShapes.jpg';
import LilArrow from '../../assets/images/lilArrow.svg';

const CommunityPosts = () => {
  return (
    <div>
      <article className='flex flex-col lg:flex-row justify-center items-center  py-4 lg:py-6'>
        <div className='flex w-full px-[4vw] xl:px-[6vw] max-w-[1500px] flex-col'>
          <article className='w-full lg:w-[70%] flex flex-col gap-3'>
            <h3 className="text-[var(--secondary-color)] font-[Inter] text-2xl font-bold text-center md:text-left">
              Announcements & Discussions
            </h3>
            <div className='flex gap-3 flex-wrap'>
              {/* <Link to="" className='bg-white rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] w-1/3 py-3 md:py-5 px-6 flex gap-3 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all cursor-pointer hover:scale-105 duration-200 ease-out min-w-50 flex-1'>
                <img src={Autumn} alt="" className='rounded-md max-h-45 md:h-1/2' />
                <p className='text-md text-left lg:text-lg font-[Inter] text-[var(--secondary-color)] font-bold cursor-pointer'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                <p className='text-[var(--mid-main-secondary)] font-[Inter]'>Zaim ⋅ 1 week ago</p>
              </Link> */}

              <Link to="/waitlist" className='bg-white rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] w-1/3 py-5 px-6 flex gap-3 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out hover:scale-105 cursor-pointer min-w-50'>
                <img src={Journey} alt="" className='rounded-md max-h-45 md:h-1/2' />
                <p className='text-md text-left lg:text-lg cursor-pointer font-[Inter] text-[var(--secondary-color)] font-bold'>Join our waitlist to recieve weekly updates</p>
                <p className='text-[var(--mid-main-secondary)] font-[Inter]'>Zaim ⋅ 1 day ago</p>
              </Link>

              {/* <Link to="" className='bg-white cursor-pointer rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] w-1/3 py-5 px-6 flex gap-3 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out  min-w-50 hover:scale-105 flex-1'>
                <img src={Shapes} alt="" className='rounded-md max-h-45 md:h-1/2' />
                <p className='text-md text-left lg:text-lg cursor-pointer font-[Inter] text-[var(--secondary-color)] font-bold'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                <p className='text-[var(--mid-main-secondary)] font-[Inter]'>Zaim ⋅ 2 weeks ago</p>
              </Link> */}
            </div>
            {/* <div className='w-full flex items-center justify-center'>
              <Link to="" className='text-lg !text-blue-500 !font-bold font-[Inter] pt-2 '>Explore more →</Link>
            </div> */}
          </article>

        </div>
      </article>
    </div>
  );
};

export default CommunityPosts;