import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Aashrun from "../../assets/images/aashrun.jpg";
import { FaArrowLeft } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa';


const TestimonialsSection = () => {
    const [index, setIndex] = useState(0);

    const next = () => {
        setIndex((prev) => (prev + 1) % testimonials.length);
    }

    const prev = () => {
        setIndex((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
    }

    const testimonials = [
        {
            image: Aashrun,
            name: "Aashrun Gautam",
            role: "Founder of SleepLeads - Reddit \"High-Intent\" Lead SaaS",
            text: (
                <>
                    It’s actually <span className='font-bold'>well-designed</span>. <br />And it lets you practice math{" "}
                    <span className='font-bold'>chapter by chapter</span>, with a <span className=''>HUGE database of questions</span>{" "}
                    without wanting to throw your laptop out the window.
                </>
            ),
            link: "https://www.linkedin.com/posts/aashrun-gautam-72572a1a5_equathora-master-math-through-practice-activity-7423286785453174785-mgSJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAADJeKOABNdzq_bUV8CWEUZirbIav6hZpjJk",
        },
        {
            image: Aashrun,
            name: "Aashrun Gautam",
            role: "Founder of SleepLeads - Reddit \"High-Intent\" Lead SaaS",
            text: (
                <>
                    It’s actually <span className='font-bold'>well-designed</span>. <br />And it lets you practice math{" "}
                    <span className='font-bold'>chapter by chapter</span>, with a <span className=''>HUGE database of questions</span>{" "}
                    without wanting to throw your laptop out the window.
                </>
            ),
            link: "https://www.linkedin.com/posts/aashrun-gautam-72572a1a5_equathora-master-math-through-practice-activity-7423286785453174785-mgSJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAADJeKOABNdzq_bUV8CWEUZirbIav6hZpjJk",
        },
    ]
    return (
        <>
            <section className='flex justify-center text-[var(--secondary-color)] font-[Sansation,Arial]'>
                <div className='max-w-[1400px] mx-auto w-full bg-white relative overflow-hidden flex flex-col lg:flex-row justify-center px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-7 sm:py-14 md:py-16 lg:py-18 gap-8 lg:gap-10'>

                    {/* Left Side - Header & Navigation Arrows */}
                    <div className='flex flex-col w-full lg:w-1/2 pr-0 lg:pr-36'>
                        <h2 className='text-3xl sm:text-3xl md:text-4xl lg:text-4xl text-[var(--secondary-color)] pb-4 font-extrabold'>From our <br /><span className='font-black'>community.</span></h2>
                        <p className='text-[var(--secondary-color)] font-light text-sm sm:text-xl md:text-2xl max-w-3xl'>What students say before and after Equathora are two different stories.</p>

                        {/* Arrow Buttons */}
                        <div className='pt-6 flex gap-3'>
                            <button type="button"
                                onClick={next}
                                className='rounded-full border border-[var(--french-gray)] p-3 cursor-pointer hover:bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]
                            transition-opacity duration-150 text-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color)] hover:text-[var(--main-color)] hover:border-[var(--main-color)] active:scale-95'>
                                <FaArrowLeft className='w-6 h-6' />
                            </button>
                            <button
                                type="button"
                                onClick={prev}
                                className='rounded-full border border-[var(--french-gray)] p-3 cursor-pointer hover:bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]
                            transition-opacity duration-150 text-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color)] hover:text-[var(--main-color)] hover:border-[var(--main-color)] active:scale-95'>
                                <FaArrowRight className='w-6 h-6' />
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Testimonial Slider */}
                    <div className='w-full lg:w-1/2 flex relative min-h-64 md:min-h-60 lg:min-h-80'>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className='flex flex-col gap-6 absolute inset-0 w-full'
                            >
                                <p className='text-lg sm:text-xl md:text-2xl xl:text-3xl font-light'>
                                    {testimonials[index].text}
                                </p>
                                {testimonials[index].link.length === 0 ? (
                                    <div className='flex gap-3 items-center'>
                                        <img
                                            src={testimonials[index].image}
                                            className='rounded-full w-16 h-16'
                                        />
                                        <div>
                                            <p className='text-lg font-bold'>
                                                {testimonials[index].name}
                                            </p>
                                            <p className='text-sm font-light'>
                                                {testimonials[index].role}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <a href={testimonials[index].link} className='flex gap-3 items-center' target="_blank" rel="noopener noreferrer hover: text-blue-500">
                                        <img
                                            src={testimonials[index].image}
                                            className='rounded-full w-16 h-16'
                                        />
                                        <div>
                                            <p className='text-lg font-bold'>
                                                {testimonials[index].name}
                                            </p>
                                            <p className='text-sm font-light'>
                                                {testimonials[index].role}
                                            </p>
                                        </div>
                                    </a>
                                )
                                }
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TestimonialsSection;
