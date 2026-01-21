import React from 'react';
import { motion } from 'framer-motion';
import { SiExercism, SiLeetcode, SiCodeforces } from 'react-icons/si';
import { FaLightbulb } from 'react-icons/fa';

const TrustedBySection = () => {
    const organizations = [
        {
            name: "Exercism",
            description: "Code practice & mentorship",
            icon: SiExercism,
            color: "#009CAB"
        },
        {
            name: "Brilliant",
            description: "Interactive learning",
            icon: FaLightbulb,
            color: "#FFB800"
        },
        {
            name: "LeetCode",
            description: "Coding challenges",
            icon: SiLeetcode,
            color: "#FFA116"
        },
        {
            name: "CodeForces",
            description: "Competitive programming",
            icon: SiCodeforces,
            color: "#1F8ACB"
        }
    ];

    return (
        <section className="w-full bg-white relative overflow-hidden">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />

            <div className="max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-10 mx-auto relative z-10">
                <motion.div
                    className="flex flex-col gap-6 sm:gap-8 items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--mid-main-secondary)]">
                        Inspired by industry leaders
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 w-full">
                        {organizations.map((org, index) => {
                            const IconComponent = org.icon;
                            return (
                                <motion.div
                                    key={org.name}
                                    className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl transition-all"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                >
                                    <IconComponent
                                        className="text-3xl sm:text-4xl md:text-5xl"
                                        style={{ color: org.color }}
                                    />
                                    <p className="text-sm sm:text-base font-semibold text-[var(--secondary-color)]">{org.name}</p>
                                    <p className="text-xs sm:text-sm text-[var(--mid-main-secondary)]">{org.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TrustedBySection;
