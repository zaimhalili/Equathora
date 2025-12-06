import React from 'react';
import { Link } from 'react-router-dom';
import Autumn from '../../assets/images/autumn.jpg';

const CommunityPosts = () => {
  return (
    <div>
      <article className='flex flex-col lg:flex-row justify-center items-center  py-4 lg:py-6'>
        <div className='flex w-full px-[4vw] xl:px-[6vw] max-w-[1500px] flex-col'>
          <article className='w-full lg:w-[70%]'>
            <h3 className="text-[var(--secondary-color)] font-[Inter] text-2xl font-bold pb-2 text-center md:text-left">
              Community Posts
            </h3>
            <div className='flex gap-3'>
              <Link to="" className='bg-white rounded-[3px] shadow-[0_10px_10px_rgba(141,153,174,0.3)] w-1/3 py-5 px-6 flex gap-3 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out'>
                <img src={Autumn} alt="" className='rounded-[3px]'/>
                <p className='text-md text-left lg:text-lg cursor-default font-[Inter] text-[var(--secondary-color)] font-bold'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </Link>
              <Link to="" className='bg-white rounded-[3px] shadow-[0_10px_10px_rgba(141,153,174,0.3)] w-1/3 py-5 px-6 flex gap-3 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out'>
                <img src={Autumn} alt="" className='rounded-[3px]' />
                <p className='text-md text-left lg:text-lg cursor-default font-[Inter] text-[var(--secondary-color)] font-bold'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </Link>
              <Link to="" className='bg-white rounded-[3px] shadow-[0_10px_10px_rgba(141,153,174,0.3)] w-1/3 py-5 px-6 flex gap-3 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out  hover:scale-105'>
                <img src={Autumn} alt="" className='rounded-[3px]' />
                <p className='text-md text-left lg:text-lg cursor-default font-[Inter] text-[var(--secondary-color)] font-bold '>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </Link>
            </div>
          </article>
          
        </div>
      </article>
    </div>
  );
};

export default CommunityPosts;