import React from 'react';
import { Link } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';

const PremiumButton = () => {
    return (
        <Link to={'/premium'} className='bg-gradient-to-b from-amber-500 to-amber-400 px-3 md:px-4 rounded-md cursor-pointer text-xs md:text-sm transition-all duration-200 flex items-center gap-1.5 h-9 md:h-10 text-[var(--secondary-color)] hover:to-amber-500 active:!scale-95'>
            <FaCrown></FaCrown>
            <span className='lg:flex hidden'>Upgrade</span>
        </Link>
    );
};

export default PremiumButton;