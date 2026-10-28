import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Student from '../../../assets/images/yng_student.webp';
import ChalkDoodle from '../../../assets/doodles/ChalkDoodle.png';
import Arrow from '../../../assets/doodles/curvyArrow.svg';
import Underline from '../../../assets/doodles/twoUnder.svg';
import BookStack from '../../../assets/images/stackBooks.webp';
import { FaBookOpen } from 'react-icons/fa';
// motion is used in JSX member expressions, which no-unused-vars does not detect.
// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from 'framer-motion';
import Teacher from '../../../assets/images/teacherReal.webp';
import Spiral from '../../../assets/doodles/spiralVector.svg';



const chalkBackground = (position) => ({
    backgroundImage: `url(${ChalkDoodle})`,
    backgroundPosition: `right ${position}`,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto calc(305% + 0.5rem)',
});

const AboutMainSection = () => {
    const [bookImageLoaded, setBookImageLoaded] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const staggerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: prefersReducedMotion ? 0 : 0.12 },
        },
    };
    const fadeUpVariants = {
        hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 18 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: prefersReducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] },
        },
    };
    const slideLeftVariants = {
        hidden: { opacity: prefersReducedMotion ? 1 : 0, x: prefersReducedMotion ? 0 : -28 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: prefersReducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] },
        },
    };
    const slideRightVariants = {
        hidden: { opacity: prefersReducedMotion ? 1 : 0, x: prefersReducedMotion ? 0 : 28 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: prefersReducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <section className="w-full relative bg-(--white) overflow-hidden flex justify-center">
            <div className="relative z-10 w-full flex justify-center">
                <div className="w-full max-w-375 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 pt-10 sm:pt-15 md:pt-15 lg:pt-20 xl:pt-20 pb-14 sm:pb-16 md:pb-18 lg:pb-20 flex justify-center lg:flex-row flex-col gap-5 sm:gap-5 md:gap-20 lg:gap-5">
                    {/* Left side (main heading etc) */}
                    <motion.div
                        variants={staggerVariants}
                        initial={prefersReducedMotion ? false : 'hidden'}
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        className="flex flex-col lg:max-w-3/5 flex-1 items-center lg:items-start"
                    >

                        <motion.h1 variants={fadeUpVariants} className='text-(--secondary-color) text-4xl sm:text-5xl lg:text-7xl font-semibold text-center pb-5 leading-normal lg:text-left'>One <span className='relative z-100'>Problem <img src={Underline} className='absolute -bottom-3 lg:-bottom-5 w-55 right-0 lg:left-3 select-none z-10!' draggable="false" loading='lazy' /></span><br /> at a Time</motion.h1>

                        <motion.h5 variants={fadeUpVariants} className='lg:text-left text-center max-w-md text-(--secondary-color)/70 relative leading-relaxed pb-5'>We help students learn math online with a step-by-step workspace, structured practice, and Sigma AI guidance that turns confusion into confidence.
                            <img src={Arrow} draggable="false" className='hidden md:block absolute -right-45 top-10 h-15 rotate-x-180 -rotate-45 select-none lg:-right-30 xl:-right-45 z-5' loading='lazy' />
                        </motion.h5>

                        <motion.div variants={fadeUpVariants} className="flex gap-3 justify-center">
                            <Link to={'/dashboard'} className='bg-(--light-accent-color) text-white! font-medium! px-5 lg:px-10 py-3 w-fit rounded-t-xl rounded-bl-xl text-sm transition-all hover:bg-(--accent-color) min-w-fit'>Get Started</Link>
                            <Link to={'/equathora-briefs'} className='text-(--secondary-color)/70! hover:text-(--secondary-color)! font-medium! px-5 lg:px-10 py-3 w-fit rounded-b-xl rounded-tr-xl text-sm transition-all hover:bg-(--main-color) min-w-fit'>Join Equathora Briefs</Link>
                        </motion.div>


                        {/* Two Gray Blocks */}
                        <motion.div variants={staggerVariants} className="flex gap-4 justify-between flex-1 min-h-0 pt-10 md:pl-15 md:flex-row flex-col">
                            {/* Left Block */}
                            <motion.div variants={slideLeftVariants} className="min-h-30 md:min-h-full w-full flex-1 rounded-2xl bg-(--main-color) relative flex flex-col justify-between">
                                <img src={Teacher} alt="teacher" loading="lazy" decoding="async" className='select-none absolute -left-10 xs:-left-10 md:-left-20 h-32 sm:h-50 md:h-55 lg:h-75 bottom-0 rotate-y-180 brightness-90 saturate-85 mask-[linear-gradient(to_bottom,black_96%,transparent_100%)] object-cover' draggable='false' />
                                <p className='text-lg lg:text-xl xl:text-2xl font-medium flex px-4 md:pl-12 pt-4 md:pr-4 align-end text-right w-full justify-end'>Best teachers worldwide</p>
                                <div className="flex flex-col pl-12 pb-4 pr-4 items-end w-full">
                                    <p className='text-2xl lg:text-4xl xl:text-5xl font-medium text-(--accent-color) text-right'>30+</p>
                                    <p className='text-xs xl:text-sm font-medium text-(--secondary-color)/70 md:pl-20 text-right'>Teachers already joined us</p>
                                </div>
                            </motion.div>

                            {/* Right Block */}
                            <motion.div variants={slideRightVariants} className="relative flex-1 h-full bg-(--main-color) rounded-2xl">
                                <div className="relative z-10 w-2/3 aspect-[1600/897] p-4">
                                    <div
                                        aria-hidden="true"
                                        className={`absolute inset-4 rounded-2xl bg-(--white)/60 transition-opacity duration-300 ${bookImageLoaded ? 'opacity-0' : 'animate-pulse opacity-100'}`}
                                    />
                                    <img
                                        src={BookStack}
                                        alt="Books"
                                        width="1600"
                                        height="897"
                                        draggable="false"
                                        loading="lazy"
                                        decoding="async"
                                        onLoad={() => setBookImageLoaded(true)}
                                        onError={() => setBookImageLoaded(true)}
                                        className={`relative h-full w-full select-none rounded-2xl object-cover transition-opacity duration-300 ${bookImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                </div>
                                <img src={Spiral} alt="spiral" loading='lazy' draggable='false' className='absolute bottom-4 right-4 h-10 select-none pointer-events-none' />
                                <p className='p-4 relative z-10 text-lg lg:text-xl xl:text-2xl font-medium pr-8 xs:pr-4'>Transforming schools into a, amet consectetur adipisicing.</p>
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
                                    <div className="absolute flex pl-4 pb-4 left-0 right-0 w-full h-full min-h-0">
                                        <div className="flex items-center justify-center bg-(--main-color) w-full h-full min-h-0 rounded-2xl text-3xl">
                                            <FaBookOpen />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                    {/* Right side (student image) */}
                    <motion.div
                        variants={staggerVariants}
                        initial={prefersReducedMotion ? false : 'hidden'}
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        className="flex flex-col lg:max-w-2/5 flex-1 gap-4 pt-20"
                    >
                        <motion.div variants={slideRightVariants} style={chalkBackground('top')} className="flex flex-1 bg-(--dark-accent-color) rounded-2xl min-h-30 lg:min-h-50 max-w-1/2 w-1/2 self-end relative">
                            {/* Decorating three lines */}
                            <motion.div variants={fadeUpVariants} className="flex w-12 sm:w-15 h-2.5 sm:h-3 rounded-full bg-amber-500 absolute -left-30 xs:-left-40 sm:-left-60 md:-left-80 lg:-left-50 bottom-8 -rotate-10 z-10"></motion.div>
                            <motion.div variants={fadeUpVariants} className="flex w-15 sm:w-20 h-2.5 sm:h-3 rounded-full bg-amber-500 absolute -left-30 xs:-left-40 sm:-left-60 md:-left-80 lg:-left-50 bottom-23 rotate-25 z-10"></motion.div>
                            <motion.div variants={fadeUpVariants} className="flex w-15 sm:w-20 h-2.5 sm:h-3 rounded-full bg-amber-500 absolute -left-20 xs:-left-40 sm:-left-50 md:-left-70 lg:-left-40 bottom-37 rotate-50 z-10"></motion.div>
                        </motion.div>
                        <motion.div variants={slideRightVariants} style={chalkBackground('center')} className="flex flex-1 bg-(--dark-accent-color) rounded-2xl min-h-30 lg:min-h-50"></motion.div>
                        <motion.div variants={slideRightVariants} style={chalkBackground('bottom')} className="relative z-20 flex flex-1 bg-(--dark-accent-color) rounded-2xl min-h-30 lg:min-h-50">
                            <img src={Student} alt="Student" width="1400" height="1400" className='absolute z-10 bottom-0 h-100 object-cover sm:object-contain md:h-130 lg:h-185 sm:left-5 min-w-full lg:object-cover lg:-right-12 pointer-events-none select-none' draggable="false" loading="lazy" decoding="async" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutMainSection;