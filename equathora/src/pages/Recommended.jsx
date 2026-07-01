import React, { useState } from 'react';
import Navbar from '@/components/Navbar';

const Recommended = () => {
    return (
        <main className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen">
            <header>
                <Navbar />
            </header>

            {/* Hero Section */}
            <div className='flex w-full justify-center items-center pb-6'>
                <div className='flex flex-col lg:flex-row justify-start items-center lg:items-start px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-6 gap-8'>
                    <section className="flex flex-col">

                    </section>
                </div>
            </div>
        </main>
    )
};

export default Recommended;

// Add icons and some graphics
// I need to add the daily calendar
// Below add some of the suggested problems
// On the sides: goals, topics, maybe time of day to solve those problems
// Filter the problems based on needs/skill and also time it takes to solve them based on their level of difficulty
// Make the thing that drives their progress more visible in this page: "You have achieved a 15 day streak. You're on fire!"
// For guidance level suggest Premium if they want full guidance etc

// Leave the other data for future updates

// Add a button to retake these choice and go back to GetStarted.jsx / Add this in the settings too