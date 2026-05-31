import React from 'react';
import { motion } from 'framer-motion';
import Problem from '../../../assets/images/problemSC.png';
import ScrollReveal from '../ScrollReveal';
import Sigma from '../../../assets/logo/TransparentSymbol.png';

const AboutIdentitySection = () => {
    return (
        <section className="w-full flex justify-center py-14 sm:py-16 md:py-20 bg-[var(--main)]">
            <div className="w-full max-w-[1500px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 ">
                <ScrollReveal direction="up" className="w-full pb-8 sm:pb-10">
                    <div className="flex flex-col gap-2 text-center items-center">
                        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-2">
                            Brand Identity
                        </h2>
                        <p className="text-sm sm:text-xl md:text-2xl max-w-3xl font-light">
                            Learn how the name and design language support mathematical reasoning, focused practice, and long-term student progress.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="flex flex-col items-center gap-10">
                    <div className="relative flex justify-center">
                        <p className='font-[Sansation,Arial] pl-6 text-8xl font-black text-[var(--secondary-color)] relative select-none translate-x-10'>
                            <img src={Sigma} alt="Logo" className='w-fit h-30 absolute -left-20 -top-[27px] pointer-events-none' />
                            Equathora
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-center">
                        <div className="rounded-md bg-[var(--main-color)] px-4 py-3">
                            <h3 className="text-sm font-bold text-[var(--secondary-color)] pb-1">Sigma mark</h3>
                            <p className="text-xs md:text-sm text-[var(--mid-main-secondary)]">Signals summation, series, and the idea of building mastery step by step.</p>
                        </div>
                        <div className="rounded-md bg-[var(--main-color)] px-4 py-3">
                            <h3 className="text-sm font-bold text-[var(--secondary-color)] pb-1">Equat</h3>
                            <p className="text-xs md:text-sm text-[var(--mid-main-secondary)]">Rooted in equations and structure: the part where problems become solvable.</p>
                        </div>
                        <div className="rounded-md bg-[var(--main-color)] px-4 py-3">
                            <h3 className="text-sm font-bold text-[var(--secondary-color)] pb-1">Hora</h3>
                            <p className="text-xs md:text-sm text-[var(--mid-main-secondary)]">Time, rhythm, and cadence: the habit of consistent practice.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutIdentitySection;
