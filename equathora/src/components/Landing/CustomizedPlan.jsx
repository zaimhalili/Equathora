import React from 'react';
import { Link } from 'react-router-dom';
import ScreenshotLight from "../../assets/images/SigmaStepLight.png";
import { FaCalendar } from 'react-icons/fa';

const CustomizedPlan = () => {
    return (
        <div className='flex justify-center'>
            <section className='max-w-[1500px] mx-auto w-full bg-[var(--white)] relative overflow-hidden flex justify-center flex-col px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16 md:py-20 lg:py-24 gap-10'>
                <article className='flex flex-col gap-10'>
                    {/* Top Section */}
                    <div className="flex gap-3 w-full">
                        <div className="flex flex-col gap-3 lg:max-w-3/5 w-full">
                            <h3 className='text-lg sm:text-xl font-bold text-[var(--secondary-color)] flex gap-3 items-center'>
                                <span className='bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] p-3 rounded-md text-white'><FaCalendar /></span>
                                Study Planner</h3>
                            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-2">Know your weak spots<br /> before test day</h2>
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
                        <div className="flex lg:max-w-2/5 items-center justify-end">
                            <p className='text-sm sm:text-xl md:text-2xl max-w-3xl font-light'>Each week's schedule is built from your test date and latest activity. The plan recalibrates as your accuracy changes.</p>
                        </div>
                    </div>
                    {/* Image details */}
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-3 max-w-2/3 p-4 rounded-2xl bg-[var(--main-color)] overflow-hidden">
                            <img src={ScreenshotLight} alt="" className='rounded-md' />
                            <div className="flex flex-col gap-2">
                                <h4 className='text-lg sm:text-xl font-bold text-[var(--secondary-color)]'>Know exactly where you stand</h4>
                                <p className='text-[var(--secondary-color)] font-light text-sm sm:text-base'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati, incidunt. Aperiam neque ipsa incidunt sint?</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 max-w-1/3">
                            <div className="flex flex-col gap-3 p-4 rounded-2xl overflow-hidden bg-[var(--main-color)]">
                                <img src={ScreenshotLight} alt="" className='rounded-md' />
                                <div className="flex flex-col gap-2">
                                    <h4 className='text-lg sm:text-xl font-bold text-[var(--secondary-color)]'>Know exactly where you stand</h4>
                                    <p className='text-[var(--secondary-color)] font-light text-sm sm:text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 p-4 rounded-2xl overflow-hidden bg-[var(--main-color)]">
                                <img src={ScreenshotLight} alt="" className='rounded-md' />
                                <div className="flex flex-col gap-2">
                                    <h4 className='text-lg sm:text-xl font-bold text-[var(--secondary-color)]'>Know exactly where you stand</h4>
                                    <p className='text-[var(--secondary-color)] font-light text-sm sm:text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
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