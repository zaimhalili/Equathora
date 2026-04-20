import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import Achieve from '../../../assets/images/achieveAbs.svg';
import ScrollReveal from '../ScrollReveal';

const AboutCtaSection = () => {
    return (
        <section className="w-full bg-[var(--secondary-color)] py-12 relative overflow-hidden flex justify-center theme-lock">
            <div className="relative z-10 w-full max-w-[1500px] px-[4vw] xl:px-[6vw]">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <ScrollReveal direction="left" className="lg:w-1/2 text-[var(--white)]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex justify-center items-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-center bg-[var(--white)]/20 backdrop-blur-sm rounded-full">
                                <span className="text-sm font-bold text-[var(--white)]">Join 300+ Students</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--white)] py-6">
                                Ready to Master <br />
                                <span className="text-transparent bg-clip-text bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]">Mathematics?</span>
                            </h2>
                            <p className="text-lg md:text-xl text-[var(--white)]/90 pb-8 leading-relaxed">
                                Start solving problems today, track your progress, and unlock your mathematical potential with personalized learning paths.
                            </p>
                            <div className="flex flex-wrap gap-4 pb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-pulse"></div>
                                    <span className="text-sm text-[var(--white)]/80">Free Forever</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-pulse"></div>
                                    <span className="text-sm text-[var(--white)]/80">No Credit Card</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-pulse"></div>
                                    <span className="text-sm text-[var(--white)]/80">200+ Problems</span>
                                </div>
                            </div>
                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/learn"
                                    className="group flex items-center gap-2 rounded-full !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-center !text-[var(--white)] font-semibold transition-all ease-in hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] shadow-lg shadow-[var(--raisin-black)]/30 active:translate-y-1 w-fit"
                                >
                                    Get Started Free
                                    <motion.span
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <FaArrowRight className="text-xs sm:text-sm" />
                                    </motion.span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </ScrollReveal>

                    <ScrollReveal direction="right" className="lg:w-1/2 flex justify-center">
                        <motion.div className="relative">
                            <div className="absolute inset-0 bg-[var(--white)]/20 rounded-full blur-3xl"></div>
                            <img
                                src={Achieve}
                                alt="Achievement"
                                className="relative z-10 w-full max-w-md h-auto object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
};

export default AboutCtaSection;
