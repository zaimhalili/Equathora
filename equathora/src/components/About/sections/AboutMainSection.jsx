import React from 'react';
import { Link } from 'react-router-dom';
import Student from '../../../assets/images/yng_student.png';
import Arrow from '../../../assets/doodles/curvyArrow.svg';
import Underline from '../../../assets/doodles/twoUnder.svg';
import BookStack from '../../../assets/images/stackBooks.jpeg';
import { FaBookOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutMainSection = () => {
    return (
        <section className="w-full relative bg-(--white) overflow-hidden flex justify-center">
            <div className="relative z-10 w-full flex justify-center">
                <div className="w-full max-w-375 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 pt-20 sm:pt-24 md:pt-30 lg:pt-20 xl:pt-20 pb-14 sm:pb-16 md:pb-18 lg:pb-20 flex justify-center gap-5 sm:gap-3">
                    {/* Left side (main heading etc) */}
                    <div className="flex flex-col max-w-3/5 flex-1">
                    
                        <h1 className='text-(--secondary-color) text-7xl font-semibold text-left pb-5 leading-normal'>One <span className='relative z-10'>Problem <img src={Underline} className='absolute -bottom-5 w-55 right-0 left-3 select-none' draggable="false" loading='lazy' /></span><br /> at a Time</h1>

                        <p className='max-w-md text-(--secondary-color)/70 text-left relative leading-relaxed pb-5'>We help students learn math online with a step-by-step workspace, structured practice, and Sigma AI guidance that turns confusion into confidence.
                            <img src={Arrow} draggable="false" className='absolute -right-45 top-10 h-15 rotate-x-180 -rotate-45 select-none' loading='lazy' />
                        </p>

                        <div className="flex gap-3">
                            <Link to={'/dashboard'} className='bg-(--light-accent-color) text-white! font-medium! px-10 py-3 w-fit rounded-t-xl rounded-bl-xl text-sm transition-all hover:bg-(--accent-color)'>Get Started</Link>
                            <Link to={'/equathora-briefs'} className='text-(--secondary-color)/70! hover:text-(--secondary-color)! font-medium! px-10 py-3 w-fit rounded-b-xl rounded-tr-xl text-sm transition-all hover:bg-(--main-color)'>Join Equathora Briefs</Link>
                        </div>

                        
                        {/* Two Gray Blocks */}
                        <div className="flex gap-3 justify-between flex-1 min-h-0 pt-10 pl-30">
                            {/* Left Block */}
                            <div className="min-h-full w-full flex-1 rounded-2xl bg-(--main-color)"></div>

                            {/* Right Block */}
                            <div className="relative flex-1 h-full bg-(--main-color) rounded-2xl">
                                <img src={BookStack} alt="Books" draggable='false' className='select-none rounded-3xl object-contain z-1000 relative p-3 max-w-2/3' loading='lazy' />
                                <p className='p-3 relative z-10 text-xl font-medium'>Lorem ipsum dolor sit, amet consectetur adipisicing.</p>
                                <div className="flex h-1/3 w-1/3 bg-(--white) absolute right-0 top-0 rounded-bl-2xl">
                                    {/* Left rounded corner mask */}
                                    <div className="absolute -left-full flex h-full w-full min-h-0 items-center justify-center bg-(--white) ">
                                        <div className="h-full w-full flex rounded-tr-2xl bg-(--main-color)"></div>
                                    </div>
                                    {/* Bottom rounded corner mask */}
                                    <div className="absolute -bottom-full right-0 flex h-full w-full min-h-0 items-center justify-center bg-(--white)">
                                        <div className="h-full w-full flex rounded-tr-2xl bg-(--main-color)"></div>
                                    </div>
                                    {/* Little top right square with icon */}
                                    <div className="absolute flex pl-3 pb-3 left-0 right-0 w-full h-full min-h-0">
                                        <div className="flex items-center justify-center bg-(--main-color) w-full h-full min-h-0 rounded-2xl text-3xl">
                                            <FaBookOpen/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right side (student image) */}
                    <div className="flex flex-col max-w-2/5 flex-1 gap-3 pt-20">
                        <div className="flex flex-1 bg-(--dark-accent-color) rounded-2xl min-h-50 max-w-1/2 w-1/2 self-end"></div>
                        <div className="flex flex-1 bg-(--dark-accent-color) rounded-2xl min-h-50"></div>
                        <div className="flex flex-1 bg-(--dark-accent-color) rounded-2xl min-h-50 relative">
                            <img src={Student} alt="Student" className='absolute bottom-0 h-185 object-cover -right-10 pointer-events-none select-none' draggable="false" loading='lazy' />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMainSection;