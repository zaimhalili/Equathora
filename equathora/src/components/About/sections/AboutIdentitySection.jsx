import React from 'react';
import { motion } from 'framer-motion';
import Problem from '../../../assets/images/problemSC.png';
import ScrollReveal from '../ScrollReveal';
import Sigma from '../../../assets/logo/TransparentSymbol.png';

const AboutIdentitySection = () => {
    return (
        <section className="w-full flex justify-center py-14 sm:py-16 md:py-20 bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] ">
            <div className="w-full max-w-[1500px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                <ScrollReveal direction="up" className="w-full pb-8 sm:pb-10">
                    <div className="flex flex-col gap-2 text-center items-center">
                        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-2">
                            Equathora Brand Identity and Learning Approach
                        </h2>
                        <p className="text-sm sm:text-xl md:text-2xl max-w-3xl font-light">
                            Learn how the Equathora name and design language support mathematical reasoning, focused practice, and long-term student progress.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="flex justify-center gap-8">
                    <p className='font-[Sansation,Arial] pl-6 text-8xl font-black text-[var(--secondary-color)] relative select-none translate-x-10'>
                        <img src={Sigma} alt="Logo" className='w-fit h-30 absolute -left-20 -top-[27px] pointer-events-none' />
                        Equathora
                    </p>
                </div>
                <div className=''></div>
            </div>
        </section>
    );
};

export default AboutIdentitySection;
