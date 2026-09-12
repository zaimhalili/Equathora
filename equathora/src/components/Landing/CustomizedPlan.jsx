import React from 'react';
import { Link } from 'react-router-dom';
import ScreenshotLight from "../../assets/images/SigmaStepLight.png";
import { FaCalendar } from 'react-icons/fa';
import JourneyDark from '../../assets/images/JourneyDark.png';
import JourneyLight from '../../assets/images/JourneyLight.png';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

const CustomizedPlan = () => {
    const theme = useCurrentTheme();

    return (
        <div className='flex justify-center'>
            <section aria-labelledby="journey-planner-heading" className='max-w-[1500px] mx-auto w-full bg-[var(--white)] relative overflow-hidden flex justify-center flex-col px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16 md:py-20 lg:py-24 gap-10'>
                <article className='flex flex-col gap-10'>
                    {/* Top Section */}
                    <div className="flex flex-col lg:flex-row gap-6 w-full">
                        <div className="flex flex-col gap-3 lg:w-3/5 w-full">
                            <p className='text-lg sm:text-xl font-bold text-[var(--secondary-color)] flex gap-3 items-center'>
                                <span aria-hidden="true" className='bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] p-3 rounded-md text-white'><FaCalendar /></span>
                                Your personalized math journey</p>
                            <h2 id="journey-planner-heading" className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-2">Stop wondering what to study next</h2>
                            <Link
                                to="/learn"
                                className="group inline-flex items-center gap-2 rounded-full !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 !text-white text-base sm:text-lg font-semibold transition-all hover:!bg-[var(--accent-color)] shadow-lg shadow-[var(--raisin-black)]/30 active:translate-y-1 w-fit"
                            >
                                Get started for free
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="icon-gradient-arrow" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="white" />
                                            <stop offset="100%" stopColor="white" />
                                        </linearGradient>
                                    </defs>
                                    <path fill="url(#icon-gradient-arrow)" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                                </svg>
                            </Link>
                        </div>
                        <div className="flex lg:w-2/5 items-center justify-end">
                            <p className='text-sm sm:text-xl md:text-2xl max-w-3xl font-light'>Your Journey turns your goals and current level into a focused math study path.</p>
                        </div>
                    </div>
                    {/* Image details */}
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3 items-stretch">
                        {/* Left Image */}
                        <div className="flex flex-col gap-3 lg:col-span-1 lg:h-full min-w-0 min-h-0 p-3 rounded-2xl bg-[var(--main-color)] overflow-hidden md:max-h-160">
                            <div className="w-full min-w-0 overflow-hidden rounded-md lg:flex-1 lg:min-h-0">
                                <img src={theme === 'dark' ? JourneyDark : JourneyLight} alt="Preview of a personalized math learning path with recommended problems" className='block w-full max-w-full lg:h-full lg:object-cover' loading="lazy" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className='text-lg sm:text-xl font-bold text-[var(--secondary-color)]'>A clear path through every topic</h3>
                                <p className='text-[var(--secondary-color)] font-light text-sm sm:text-base'>Follow every subject and topic with clear progress toward your next problem.</p>
                            </div>
                        </div>
                        {/* Two images on the right */}
                        <div className="flex min-w-0 flex-col gap-3 md:max-h-160">
                            <div className="flex flex-col gap-3 p-3 rounded-2xl overflow-hidden bg-[var(--main-color)]">
                                <img src={ScreenshotLight} alt="Preview of a daily math mission with recommended problems" className='rounded-md' loading="lazy" />
                                <div className="flex flex-col gap-2">
                                    <h3 className='text-lg sm:text-xl font-bold text-[var(--secondary-color)]'>A realistic mission for today</h3>
                                    <p className='text-[var(--secondary-color)] font-light text-sm sm:text-base'>Get level-matched problems sized to your weekly study commitment.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 p-3 rounded-2xl overflow-hidden bg-[var(--main-color)]">
                                <img src={ScreenshotLight} alt="Preview of topic progress and recommended math problems" className='rounded-md' loading="lazy" />
                                <div className="flex flex-col gap-2">
                                    <h3 className='text-lg sm:text-xl font-bold text-[var(--secondary-color)]'>Recommendations that move with you</h3>
                                    <p className='text-[var(--secondary-color)] font-light text-sm sm:text-base'>Your recommendations update as you solve problems and your goals change.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
};

export default CustomizedPlan;