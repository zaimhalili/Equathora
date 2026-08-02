import React from 'react';
import { motion } from 'framer-motion';
import Problem from '../../../assets/images/problemSC.png';
import ScrollReveal from '../ScrollReveal';
import { Link } from 'react-router-dom';
import CurvyArrow from '../../../assets/doodles/curvyArrow.svg';
import TwoUnder from '../../../assets/doodles/twoUnder.svg';
import { FaMehRollingEyes, FaArrowRight, FaBullseye, FaTrophy } from 'react-icons/fa';

const AboutIdentitySection = () => {
    return (
        <section className="w-full flex justify-center py-14 sm:py-16 md:py-20 !text-[var(--secondary-color)]">
            <div className="w-full max-w-[1500px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 flex flex-col gap-10">
                <div className="flex lg:gap-10 flex-col lg:flex-row">
                    <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[var(--secondary-color)] pb-2 lg:w-3/5 text-center lg:text-left">
                        An <span className='text-[var(--accent-color)] relative inline-block'>Easy
                            <img src={TwoUnder} alt="" className='absolute left-0 -bottom-3 w-full' />
                        </span> Way <br /> to make Math Fun
                    </h2>
                    <p className="text-md sm:text-xl md:text-2xl max-w-3xl font-light lg:w-2/5 text-center lg:text-left relative">
                        We are a next-generation math platform that replaces the classroom grind with dynamic, challenge-based problem solving to build true mathematical intuition.
                        <img src={CurvyArrow} alt="arrow doodle" className='h-8 lg:h-14 -right-10 lg:-left-30 bottom-0 absolute' />
                    </p>
                </div>
                {/* Three Blocks Container */}
                <div className='flex gap-10 flex-col lg:flex-row'>
                    {/* Block 1 */}
                    <div className="flex flex-col bg-[var(--main-color)] rounded-2xl flex-1 pl-6 sm:pl-10 pt-8">
                        <h3 className='text-2xl lg:text-3xl xl:text-4xl font-bold pr-6 sm:pr-10 pb-3'>Math needs to be <span className='text-[var(--accent-color)]'>engaging</span> and fun</h3>
                        <p className='text-base xl:text-lg pr-6 sm:pr-10'>Changing your view of math from 'boring' to 'beautiful'</p>
                        <div className="flex justify-between items-center pt-3">
                            <FaMehRollingEyes className='text-5xl text-[var(--secondary-color)] -rotate-15' />
                            <div className='flex items-center justify-center p-4 rounded-tl-2xl bg-[var(--white)] relative'>
                                <div className="absolute -left-10 bottom-0 bg-[var(--white)] h-10 w-10 z-10">
                                    <div className="h-full bg-[var(--main-color)] rounded-br-2xl"></div>
                                </div>
                                <Link to="/learn" className='p-5 bg-[var(--main-color)] rounded-full !text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:!text-white transition-all duration-150 hover:scale-110 overflow-visible shadow-xl'>
                                    <FaArrowRight className=' text-2xl text-center -rotate-45' />
                                </Link>
                                <div className="absolute right-0 -top-10 bg-[var(--white)] h-10 w-10 z-10">
                                    <div className="h-full bg-[var(--main-color)] rounded-br-2xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Block 2 */}
                    <div className="flex flex-col bg-[var(--main-color)] rounded-2xl flex-1 pl-6 sm:pl-10 pb-8">
                        <div className="flex justify-between items-center pb-3">
                            <FaTrophy className='text-5xl text-[var(--secondary-color)] rotate-15' />
                            <div className='flex items-center justify-center p-4 rounded-bl-2xl bg-[var(--white)] relative '>
                                <div className="absolute -left-10 top-0 bg-[var(--white)] h-10 w-10 z-10">
                                    <div className="h-full bg-[var(--main-color)] rounded-tr-2xl"></div>
                                </div>
                                <Link to="/learn" className='p-5 bg-[var(--main-color)] rounded-full !text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:!text-white transition-all duration-150 hover:scale-110 overflow-visible shadow-xl'>
                                    <FaArrowRight className=' text-2xl text-center -rotate-45' />
                                </Link>
                                <div className="absolute right-0 -bottom-10 bg-[var(--white)] h-10 w-10 z-10">
                                    <div className="h-full bg-[var(--main-color)] rounded-tr-2xl"></div>
                                </div>
                            </div>
                        </div>
                        <h3 className='text-2xl lg:text-3xl xl:text-4xl font-bold pr-6 sm:pr-10 pb-3'><span className='text-[var(--accent-color)]'>Learn</span> through pure victory</h3>
                        <p className='text-base xl:text-lg pr-6 sm:pr-10'>Experience the rush of conquering tough concepts</p>

                    </div>
                    {/* Block 3 */}
                    <div className="flex flex-col bg-[var(--main-color)] rounded-2xl flex-1 pl-6 sm:pl-10 pt-8">
                        <h3 className='text-2xl lg:text-3xl xl:text-4xl font-bold pr-6 sm:pr-10 pb-3'>Stop <span className='text-[var(--accent-color)]'>guessing</span> what to study next</h3>
                        <p className='text-base xl:text-lg pr-6 sm:pr-10'>We target your weak spots and turn them into strengths</p>
                        <div className="flex justify-between items-center pt-3">
                            <FaBullseye className='text-5xl text-[var(--secondary-color)]  skew-5' />
                            <div className='flex items-center justify-center p-4 rounded-tl-2xl bg-[var(--white)] relative'>
                                <div className="absolute -left-10 bottom-0 bg-[var(--white)] h-10 w-10 z-10">
                                    <div className="h-full bg-[var(--main-color)] rounded-br-2xl"></div>
                                </div>
                                <Link to="/learn" className='p-5 bg-[var(--main-color)] rounded-full !text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:!text-white transition-all duration-150 hover:scale-110 overflow-visible shadow-xl'>
                                    <FaArrowRight className=' text-2xl text-center -rotate-45' />
                                </Link>
                                <div className="absolute right-0 -top-10 bg-[var(--white)] h-10 w-10 z-10">
                                    <div className="h-full bg-[var(--main-color)] rounded-br-2xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section >
    );
};

export default AboutIdentitySection;
