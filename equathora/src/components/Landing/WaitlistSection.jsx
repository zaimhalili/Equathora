import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowRight } from 'react-icons/fa';

const WaitlistSection = () => {
    return (
        <section className="w-full bg-[#fafbfc] relative overflow-hidden">
            <div className="max-w-[1400px] px-[4vw] xl:px-[6vw] py-16 mx-auto relative z-10">
                <motion.div
                    className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 bg-gradient-to-r from-[var(--secondary-color)] to-[#1a1a2e] rounded-3xl shadow-xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-[var(--accent-color)]/20 flex items-center justify-center">
                            <FaEnvelope className="text-4xl text-[var(--accent-color)]" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Join our waitlist
                        </h3>
                        <p className="text-white/70 text-lg">
                            Get weekly updates on new problems, features, and math learning tips.
                        </p>
                    </div>

                    {/* CTA */}
                    <Link
                        to="/waitlist"
                        className="flex-shrink-0 group flex items-center gap-2 rounded-full bg-[var(--accent-color)] px-8 py-4 text-white font-semibold transition-all hover:bg-[var(--dark-accent-color)] shadow-lg shadow-[var(--accent-color)]/30"
                    >
                        Subscribe now
                        <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <FaArrowRight />
                        </motion.span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default WaitlistSection;
