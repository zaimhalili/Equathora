import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaRocket } from 'react-icons/fa';
import Progress from '../../../assets/images/progressAbs.svg';
import ScrollReveal from '../ScrollReveal';

const AboutMissionSection = () => {
    return (
        <section className="w-full flex justify-center bg-gradient-to-b from-[var(--white)] to-[var(--main-color)] py-20">
            <div className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw]">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <ScrollReveal direction="left" className="lg:w-1/2">
                        <motion.div className="relative">
                            <img
                                src={Progress}
                                alt="Progress tracking"
                                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                    </ScrollReveal>

                    <ScrollReveal direction="right" className="lg:w-1/2">
                        <div className="flex items-center gap-3 pb-6">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--secondary-color)]">
                                Our <span className="text-transparent bg-clip-text bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]">Mission</span>
                            </h2>
                        </div>
                        <p className="text-sm sm:text-xl md:text-2xl font-light text-[var(--secondary-color)]">
                            Transform how students approach mathematics, not as a subject to fear, but as a <span className="font-bold text-transparent bg-clip-text bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]">journey of discovery</span>.
                        </p>
                        <p className="text-sm sm:text-xl md:text-2xl font-light text-[var(--secondary-color)]">
                            We provide an interactive platform where learners build <span className="font-bold text-[var(--secondary-color)]">confidence through step-by-step guidance</span> and achievement-based motivation.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-8">
                            <motion.div className="cursor-default pointer-events-none flex items-center gap-2 bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-white px-5 py-3 rounded-md shadow-lg">
                                <FaGraduationCap className="text-xl" />
                                <span className="font-semibold">Student-First</span>
                            </motion.div>
                            <motion.div className="cursor-default pointer-events-none flex items-center gap-2 bg-[var(--white)] border-2 border-[var(--accent-color)] text-[var(--accent-color)] px-5 py-3 rounded-md shadow-lg theme-lock">
                                <FaRocket className="text-xl" />
                                <span className="font-semibold text-transparent bg-clip-text bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]">Growth-Oriented</span>
                            </motion.div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
};

export default AboutMissionSection;
