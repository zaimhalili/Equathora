import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import Achieve from '../../../assets/images/Mathematics-amico.svg';
import ScrollReveal from '../ScrollReveal';

const AboutCtaSection = () => {
    return (
        <section className="w-full bg-(--main-color) pt-20 pb-40 relative overflow-hidden flex justify-center">
            <div className="relative z-10 w-full max-w-375 px-[4vw] xl:px-[6vw]">
                {/* Main Block */}
                <div className="flex w-full min-w-full min-h-100 h-100">
                    {/* Left */}
                    <div className="flex bg-gray-500 max-w-2/5 h-full flex-1 rounded-l-2xl"></div>

                    {/* Right red part */}
                    <div className="flex bg-(--dark-accent-color) max-w-3/5 h-full flex-1 rounded-r-2xl flex-col justify-center gap-5 p-5 relative">
                        {/* Left triangle */}
                        <div className="rotate-30 bg-red-400 h-full absolute -left-30 w-30 min-w-30">
                                
                        </div>
                        <h3 className='max-w-2/3 text-white font-medium text-4xl'>Get in touch</h3>
                        <h5 className='max-w-2/3 text-white font-semibold text-5xl'>Join our community <br />of school partners</h5>
                        <p className='max-w-2/3 text-white text-sm leading-relaxed'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident dignissimos tempora incidunt temporibus excepturi possimus!</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutCtaSection;
