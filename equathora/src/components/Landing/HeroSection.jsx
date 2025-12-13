import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Studying from '../../assets/images/studying.svg';

const HeroSection = () => {
    return (
        <section className="font-[Inter] w-full bg-gray-50 border-b border-gray-100">
            <div className="px-[4vw] xl:px-[6vw] max-w-[1500px] py-4 lg:py-6 gap-8 flex flex-col md:flex-row items-center justify-between" style={{ margin: '0 auto' }}>
                <motion.div
                    className="flex flex-col gap-5 flex-1 text-center md:text-left"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <motion.p
                        className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-color)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                    >
                        Built for students
                    </motion.p>
                    <motion.h1
                        className="text-4xl font-bold leading-none sm:text-5xl font-[DynaPuff]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                    >
                        Turn logic into your
                        <span className="block text-[var(--accent-color)]">superpower.</span>
                    </motion.h1>
                    <motion.p
                        className="text-base text-[var(--secondary-color)]/80 sm:text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        Master mathematics through focused practice, step-by-step guidance, and a distraction-free learning environment designed for your success.
                    </motion.p>
                    <motion.div
                        className="flex gap-4 justify-center items-center md:justify-start"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.3 }}
                    >
                        <Link
                            to="/getstarted"
                            className="rounded-md bg-[var(--accent-color)] px-8 py-2 sm:py-3 text-center !text-white transition-colors hover:bg-[var(--dark-accent-color)]"
                        >
                            Start solving
                        </Link>
                        <Link
                            to="/about"
                            className="rounded-md border border-gray-300 px-8 py-2 sm:py-3 text-center text-gray-700 transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                        >
                            How it works
                        </Link>
                    </motion.div>
                    <motion.div
                        className="flex justify-between gap-8 pt-4 px-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                    >
                        {[
                            { label: 'Problems', value: '30+' },
                            { label: 'Achievements', value: '30+' },
                            { label: 'Topics', value: '5+' },
                        ].map((item, index) => (
                            <motion.div
                                key={item.label}
                                className="flex flex-col text-center md:text-left"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 + index * 0.05, duration: 0.25 }}
                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            >
                                <p className="text-2xl font-bold text-[var(--accent-color)]">{item.value}</p>
                                <p className="text-sm text-gray-500">{item.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
                <motion.div
                    className="flex justify-center items-center flex-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                >
                    <motion.div
                        className="rounded-3xl border border-gray-200 bg-white p-6 transition-shadow"
                    >
                        <img src={Studying} alt="Student learning" className="w-full max-w-md" loading="lazy" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
