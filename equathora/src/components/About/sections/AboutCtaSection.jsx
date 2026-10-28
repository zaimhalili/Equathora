import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import Student from '../../../assets/images/teenStudent.webp';
import Spiral from '../../../assets/doodles/spiralVector.svg';

const AboutCtaSection = () => {
    return (
        <section className="w-full bg-(--white) pt-20 pb-40 max-md:pt-10 max-md:pb-16 relative overflow-hidden flex justify-center">
            <div className="relative z-10 w-full max-w-375 px-[4vw] xl:px-[6vw]">
                {/* Main Block */}
                <div className="flex w-full min-w-full min-h-100 h-100 overflow-hidden max-md:h-auto max-md:min-h-0 max-md:flex-col max-md:rounded-2xl">
                    {/* Left */}
                    <div className="flex bg-(--main-color) max-w-1/3 h-full flex-1 rounded-l-2xl overflow-hidden relative max-md:h-64 max-md:w-full max-md:max-w-none max-md:flex-none max-md:rounded-b-none max-md:bg-(--white) max-md:pt-10">
                        <img src={Student} alt="Teen student" className='-rotate-10 absolute md:-bottom-15 lg:-bottom-12 xl:-bottom-16 -right-12 object-contain md:object-cover md:h-110 lg:h-100 xl:h-110 brightness-95 saturation-80 select-none max-md:left-1/2 max-md:right-auto max-md:-bottom-10 max-md:h-82 max-md:w-auto max-md:max-w-none max-md:translate-x-[-50%] max-md:rotate-0' draggable='false' loading="lazy" decoding="async" />
                    </div>

                    {/* Right red part */}
                    <div className="flex bg-(--dark-accent-color) max-w-2/3 h-full flex-1 rounded-r-2xl flex-col justify-center gap-5 p-5 relative max-md:w-full max-md:max-w-none max-md:flex-none max-md:gap-3 max-md:rounded-2xl max-md:px-5 max-md:pt-25 max-md:pb-20">
                        {/* Left triangle */}
                        <div className="rotate-15 bg-(--dark-accent-color) h-120 absolute -left-13 w-40 min-w-40 max-md:hidden">

                        </div>
                        <h3 className='max-w-2/3 text-white font-medium text-4xl relative z-10 max-md:max-w-full max-md:text-xl'>Learn together</h3>
                        <h5 className='max-w-2/3 text-white font-semibold text-5xl relative z-10 max-md:max-w-full max-md:pr-2 max-md:text-2xl max-md:leading-tight leading-normal'>Help every student reach their potential</h5>
                        <p className='max-w-2/3 text-white text-sm leading-relaxed relative z-10 max-md:max-w-full max-md:pr-2'>Support students with guided practice, while giving teachers a clearer view of progress and the next steps to take.</p>
                        <img src={Spiral} alt="" aria-hidden="true" className="absolute bottom-4 right-4 z-0 h-28 w-28 brightness-0 invert pointer-events-none select-none max-md:bottom-3 max-md:right-3 max-md:h-20 max-md:w-20" />
                        {/* White Block Top Right */}
                        <div className="absolute top-0 right-0 pl-4 pb-4 min-h-0 h-1/4 sm:h-1/3 aspect-square rounded-bl-2xl bg-(--white)">
                            {/* Left rounded corner */}
                            <div className="absolute -left-full top-0 h-full min-h-0 aspect-square bg-(--white) rounded-b-2xl flex items-center justify-center">
                                <div className="bg-(--dark-accent-color) rounded-tr-2xl h-full w-full"></div>
                            </div>
                            {/* Right bottom rounded corner */}
                            <div className="absolute -bottom-full right-0 h-full min-h-0 aspect-square bg-(--white) rounded-b-2xl flex items-center justify-center">
                                <div className="bg-(--dark-accent-color) rounded-tr-2xl h-full w-full"></div>
                            </div>
                            {/* Inside button */}
                            <Link to='/dashboard' className="rounded-2xl flex items-center justify-center w-full min-h-0 h-full bg-(--dark-accent-color) text-white! hover:text-(--dark-accent-color)! hover:bg-(--main-color) transition-all shadow-xl active:scale-95">
                                <FaArrowRight className='text-4xl sm:text-5xl -rotate-45' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutCtaSection;
