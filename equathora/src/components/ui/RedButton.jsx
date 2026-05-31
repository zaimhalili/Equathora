import React, { useState } from 'react';

const RedButton = ({}) => {
    return (
        <button type='button' className='py-2 md:py-3 bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] font-bold text-white rounded-md transition-all duration-300 cursor-pointer active:scale-95 hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] w-full sm:w-2/3 md:w-1/3 lg:w-1/5' onClick={() => setIsBriefsModalOpen(true)}>Get weekly updates</button>
    );
};

export default RedButton;