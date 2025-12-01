import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Studying from '../../assets/images/studying.svg';

const HeroSection = () => {
    return (
        <section className="w-full bg-gray-50 border-b border-gray-100">
            <div className="max-w-6xl px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-16" style={{ margin: '0 auto' }}>
                <motion.div
                    className="flex flex-col gap-8 flex-1 text-center md:text-left"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.p
                        className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-color)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Built for students
                    </motion.p>
                    <motion.h1
                        className="text-4xl font-extrabold leading-tight sm:text-5xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Turn logic into your
                        <span className="block text-[var(--accent-color)]">superpower.</span>
                    </motion.h1>
                    <motion.p
                        className="text-base text-gray-600 sm:text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Equathora helps you master math through focused practice, gentle guidance, and a calm learning experience inspired by platforms like Exercism.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link
                            to="/getstarted"
                            className="rounded-md bg-[var(--accent-color)] px-8 py-3 text-center text-white transition-colors hover:bg-[var(--dark-accent-color)]"
                        >
                            Start solving
                        </Link>
                        <Link
                            to="/about"
                            className="rounded-md border border-gray-300 px-8 py-3 text-center text-gray-700 transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                        >
                            How it works
                        </Link>
                    </motion.div>
                    <motion.div
                        className="flex justify-between gap-8 pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        {[
                            { label: 'Problems', value: '50+' },
                            { label: 'Achievements', value: '30+' },
                            { label: 'Topics', value: '20+' },
                        ].map((item, index) => (
                            <motion.div
                                key={item.label}
                                className="flex flex-col text-center md:text-left"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                whileHover={{ scale: 1.1 }}
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
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <motion.div
                        className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <img src={Studying} alt="Student learning" className="w-full max-w-md" loading="lazy" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
