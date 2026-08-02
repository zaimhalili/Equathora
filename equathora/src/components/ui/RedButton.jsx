import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RedButton = ({text, to}) => {
    return (
        <Link to={to} className='py-2 md:py-3 bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] font-bold !text-white rounded-md transition-all duration-300 cursor-pointer active:scale-95 hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] w-full text-center max-w-fit px-6'>{text}</Link>
    );
};

export default RedButton;