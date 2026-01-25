import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowRight } from 'react-icons/fa';

const WaitlistSection = () => {
    return (
        <section className="w-full bg-gradient-to-br from-[var(--secondary-color)] to-[var(--raisin-black)] relative overflow-hidden flex justify-center ">
            <div className="max-w-[1400px] relative z-10 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-10">
                <motion.div
                    className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white pb-2 sm:pb-3">
                            Stay updated
                        </h3>
                        <p className="text-white/70 text-base sm:text-lg md:text-xl">
                            Weekly problem drops, learning tips, and platform updates delivered to your inbox.
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
