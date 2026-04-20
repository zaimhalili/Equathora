import React from 'react';
import { motion } from 'framer-motion';
import Problem from '../../../assets/images/problemSC.png';
import ScrollReveal from '../ScrollReveal';

const AboutIdentitySection = () => {
    return (
        <section className="w-full flex justify-center py-14 sm:py-16 md:py-20 bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))]">
            <div className="w-full max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                <ScrollReveal direction="up" className="w-full pb-8 sm:pb-10">
                    <div className="flex flex-col gap-2 text-center items-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] text-[var(--secondary-color)]">
                            Equathora Brand Identity and Learning Approach
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg font-light text-[var(--secondary-color)]/80 leading-relaxed max-w-2xl">
                            Learn how the Equathora name and design language support mathematical reasoning, focused practice, and long-term student progress.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start">
                    <ScrollReveal direction="left" className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-[var(--secondary-color)]/55">The name</p>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-[1.15] text-[var(--secondary-color)]">
                                Meaning Behind the Name Equathora
                            </h3>
                        </div>

                        <div className="w-full flex justify-center lg:justify-start">
                            <img src={Problem} alt="Problem Screenshot" className="object-contain rounded-md w-full max-w-[560px] drop-shadow-2xl" />
                        </div>

                        <div className="flex flex-col gap-4 sm:gap-5 border-l-2 border-[var(--secondary-color)]/12 pl-4 sm:pl-5">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-col gap-1"
                            >
                                <div className="text-xl sm:text-2xl font-black text-[var(--secondary-color)]">Equat-</div>
                                <p className="text-sm sm:text-base md:text-lg font-light text-[var(--secondary-color)]/80 leading-relaxed max-w-2xl">
                                    From <span className="font-bold text-[var(--secondary-color)]">"Equation"</span>, representing mathematical structure and logical reasoning.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col gap-1"
                            >
                                <div className="text-xl sm:text-2xl font-black text-[var(--secondary-color)]">-hora</div>
                                <p className="text-sm sm:text-base md:text-lg font-light text-[var(--secondary-color)]/80 leading-relaxed max-w-2xl">
                                    From the Greek <span className="font-bold text-[var(--secondary-color)]">"hora"</span>, meaning time, reflecting steady and intentional learning.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col gap-1"
                            >
                                <div className="text-xl sm:text-2xl font-black text-[var(--secondary-color)]">Equathora</div>
                                <p className="text-sm sm:text-base md:text-lg font-light text-[var(--secondary-color)]/80 leading-relaxed max-w-2xl">
                                    Together, the name reflects time invested in equations to build stronger thinking and lasting confidence.
                                </p>
                            </motion.div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="right" delay={0.2} className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-[var(--secondary-color)]/55">The color</p>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-[1.1] text-[var(--secondary-color)]">
                                Why Red Is Used in the Equathora Interface
                            </h3>
                            <p className="text-sm sm:text-base md:text-lg font-light text-[var(--secondary-color)]/80 leading-relaxed max-w-2xl">
                                Red is used as a functional signal to highlight priority information and reinforce attention during problem solving.
                            </p>
                        </div>

                        <div className="flex flex-col divide-y divide-[var(--secondary-color)]/10">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="flex items-start gap-3 py-4"
                            >
                                <div className="flex items-center justify-center w-9 h-9 flex-shrink-0">
                                    <svg className="w-5 h-5" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="icon-gradient-bolt-about" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                                <stop offset="100%" stopColor="var(--accent-color)" />
                                            </linearGradient>
                                        </defs>
                                        <path fill="url(#icon-gradient-bolt-about)" d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-base sm:text-lg font-bold text-[var(--secondary-color)]">Focus</h4>
                                    <p className="text-sm sm:text-base md:text-lg font-light text-[var(--secondary-color)]/80 leading-relaxed">
                                        Red naturally draws attention to key concepts and important problem-solving steps.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex items-start gap-3 py-4"
                            >
                                <div className="flex items-center justify-center w-9 h-9 flex-shrink-0">
                                    <svg className="w-5 h-5" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="icon-gradient-fire-about" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                                <stop offset="100%" stopColor="var(--accent-color)" />
                                            </linearGradient>
                                        </defs>
                                        <path fill="url(#icon-gradient-fire-about)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-base sm:text-lg font-bold text-[var(--secondary-color)]">Urgency</h4>
                                    <p className="text-sm sm:text-base md:text-lg font-light text-[var(--secondary-color)]/80 leading-relaxed">
                                        It signals importance, from handwritten corrections to moments that need immediate attention.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="flex items-start gap-3 py-4"
                            >
                                <div className="flex items-center justify-center w-9 h-9 flex-shrink-0">
                                    <svg className="w-5 h-5" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="icon-gradient-star-about" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                                <stop offset="100%" stopColor="var(--accent-color)" />
                                            </linearGradient>
                                        </defs>
                                        <path fill="url(#icon-gradient-star-about)" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-base sm:text-lg font-bold text-[var(--secondary-color)]">Clarity</h4>
                                    <p className="text-sm sm:text-base md:text-lg font-light text-[var(--secondary-color)]/80 leading-relaxed">
                                        It marks decisive points of insight and helps learners separate signal from noise.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
};

export default AboutIdentitySection;
