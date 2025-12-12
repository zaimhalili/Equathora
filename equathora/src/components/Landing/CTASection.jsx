import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const CTASection = () => {
    return (
        <section className="w-full relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--dark-accent-color) 100%)',
        }}>
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }}></div>
            <div className="max-w-6xl px-8 py-20 relative" style={{ margin: '0 auto' }}>
                <motion.div
                    className="flex flex-col items-center gap-8 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.h2
                        className="text-3xl font-bold sm:text-5xl text-white"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                    >
                        Ready to build confidence?
                    </motion.h2>
                    <motion.p
                        className="max-w-2xl text-white text-lg opacity-95 leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.95 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                    >
                        Pick a track, solve at your own pace, and watch your math intuition grow. No ads. No fluff. Just thoughtful practice.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    >
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-3 rounded-xl bg-white px-10 py-4 text-lg font-semibold text-[var(--accent-color)] transition-all hover:bg-gray-100 hover:gap-4 shadow-xl hover:shadow-2xl"
                        >
                            Start for free
                            <FaArrowRight />
                        </Link>
                    </motion.div>
                    <motion.p
                        className="text-white text-sm opacity-75"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.75 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25, duration: 0.3 }}
                    >
                        No credit card required • Free forever
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
