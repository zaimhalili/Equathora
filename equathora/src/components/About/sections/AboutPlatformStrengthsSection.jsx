import React from 'react';
import { motion } from 'framer-motion';
import Teacher from '../../../assets/images/teacher.svg';
import Progress from '../../../assets/images/progressAbs.svg';
import Achieve from '../../../assets/images/achieveAbs.svg';
import Study from '../../../assets/images/studyAbs.svg';
import ScrollReveal from '../ScrollReveal';

const AboutPlatformStrengthsSection = () => {
    return (
        <section className="w-full flex justify-center py-16">
            <div className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw]">
                <ScrollReveal direction="up">
                    <div className="flex flex-col items-center justify-center w-full pb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--secondary-color)] pb-4">
                            What Equathora{' '}
                            <span className="text-[var(--secondary-color)] relative inline-block">
                                Does Best
                                <motion.svg
                                    className="absolute -bottom-0 left-0 w-full"
                                    viewBox="0 0 200 8"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                >
                                    <motion.path
                                        d="M0 4 Q50 0 100 4 Q150 8 200 4"
                                        fill="none"
                                        stroke="var(--secondary-color)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                    />
                                </motion.svg>
                            </span>
                        </h2>
                        <p className="text-sm sm:text-xl md:text-2xl font-light text-[var(--secondary-color)] max-w-3xl text-center">
                            Practice-first learning designed to build real mathematical confidence. The platform focuses on clarity, progression, and measurable improvement.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { img: Study, title: 'Adaptive practice', desc: 'Problems evolve with your skill level so you always train at the right difficulty.', direction: 'left', delay: 0 },
                        { img: Teacher, title: 'Guided solutions', desc: 'Clear explanations and structured hints help you learn the method, not just the answer.', direction: 'left', delay: 0.1 },
                        { img: Progress, title: 'Progress insights', desc: 'Track growth, spot weak areas, and stay motivated with focused progress metrics.', direction: 'right', delay: 0.2 },
                        { img: Achieve, title: 'Achievement flow', desc: 'Earn badges and milestones that celebrate consistency and mastery.', direction: 'right', delay: 0.3 }
                    ].map((feature, idx) => (
                        <ScrollReveal key={idx} direction={feature.direction} delay={feature.delay}>
                            <div className="flex flex-col items-center group">
                                <motion.div
                                    className="w-full h-32 flex items-center justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <img
                                        src={feature.img}
                                        alt={feature.title}
                                        className="w-24 h-24 object-contain drop-shadow-lg"
                                    />
                                </motion.div>
                                <motion.div
                                    whileHover={{ y: -5, boxShadow: '0 20px 30px rgba(141,153,174,0.4)' }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="relative flex flex-col bg-[var(--[var(--white)])] rounded-md border border-[var(--mid-main-secondary)] shadow-lg hover:shadow-2xl duration-300 ease-out p-6 w-full min-h-[160px]"
                                >
                                    <h3 className="text-lg font-bold text-[var(--secondary-color)] pb-2">{feature.title}</h3>
                                    <p className="text-sm text-[var(--mid-main-secondary)] leading-relaxed">
                                        {feature.desc}
                                    </p>
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[var(--accent-color)]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </motion.div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutPlatformStrengthsSection;
