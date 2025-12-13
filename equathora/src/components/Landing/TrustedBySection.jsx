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
        <section className="w-full bg-white border-b border-gray-100">
            <div className="max-w-6xl px-8 py-16" style={{ margin: '0 auto' }}>
                <motion.div
                    className="flex flex-col gap-8 items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                >
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                        Inspired by industry leaders
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                        {organizations.map((org, index) => {
                            const IconComponent = org.icon;
                            return (
                                <motion.div
                                    key={org.name}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-all"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                                >
                                    <IconComponent
                                        className="text-5xl"
                                        style={{ color: org.color }}
                                    />
                                    <p className="text-sm font-semibold text-gray-700 text-center">{org.name}</p>
                                    <p className="text-xs text-gray-500 text-center">{org.description}</p>
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
