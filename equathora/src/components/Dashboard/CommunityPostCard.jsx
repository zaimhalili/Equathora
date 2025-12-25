import React from 'react'
import { Link } from 'react-router-dom';
import Autumn from '../../assets/images/autumn.jpg';
import Journey from '../../assets/images/journey.jpg';
import Shapes from '../../assets/images/redShapes.jpg';

const CommunityPostCard = () => {
    return (
        <div>
            <Link to="/waitlist" className='bg-white rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] w-1/3 py-5 px-6 flex gap-3 flex-col hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 ease-out hover:scale-105 cursor-pointer min-w-50 flex-1 max-w-80'>
                <img src={Journey} alt="" className='rounded-md max-h-45 md:h-1/2' />
                <p className='text-md text-left lg:text-lg cursor-pointer font-[Inter] text-[var(--secondary-color)] font-bold'>Join our waitlist to recieve weekly updates</p>
                <p className='text-[var(--mid-main-secondary)] font-[Inter]'>Zaim ⋅ Recently</p>
            </Link>
        </div>
    );
};

export default CommunityPostCard;