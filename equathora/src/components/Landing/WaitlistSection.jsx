import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowRight } from 'react-icons/fa';

const WaitlistSection = () => {
    return (
        <section className="w-full bg-[#fafbfc] relative overflow-hidden">
            <div className="max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-10 md:py-12 relative z-10" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <motion.div
                    className="flex flex-col md:flex-row items-center gap-6 sm:gap-7 md:gap-8 p-6 sm:p-8 md:p-12 bg-gradient-to-r from-[var(--secondary-color)] to-[#1a1a2e] rounded-3xl shadow-xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl bg-[var(--accent-color)]/20 flex items-center justify-center">
                            <FaEnvelope className="text-3xl sm:text-3xl md:text-4xl text-[var(--accent-color)]" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white pb-1.5 sm:pb-2">
                            Join our waitlist
                        </h3>
                        <p className="text-white/70 text-base sm:text-lg">
                            Get weekly updates on new problems, features, and math learning tips.
                        </p>
                    </div>

                    {/* CTA */}
                    <Link
                        to="/waitlist"
                        className="flex-shrink-0 group flex items-center gap-2 rounded-full bg-[var(--accent-color)] px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 !text-white text-sm sm:text-base font-semibold transition-all hover:bg-[var(--dark-accent-color)] shadow-lg shadow-[var(--accent-color)]/30"
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
