import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaTrophy } from 'react-icons/fa';
import MaleStudent from '../../assets/images/yng_student.png';

const FeaturesSection = () => {
    const features = [
        {
            icon: <FaBrain className="text-3xl text-[var(--accent-color)]" />,
            title: 'Adaptive Learning',
            description: 'Problems that evolve with your skill level. Practice at your own pace with intelligent problem selection.',
        },
        {
            icon: <FaChartLine className="text-3xl text-[var(--accent-color)]" />,
            title: 'Track Progress',
            description: 'Monitor your improvement with detailed statistics and insights. See where you excel and where to focus.',
        },
        {
            icon: <FaTrophy className="text-3xl text-[var(--accent-color)]" />,
            title: 'Earn Achievements',
            description: 'Unlock badges and milestones as you master new concepts. Celebrate your learning journey.',
        },
    ];

    return (
        <section className="w-full bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[var(--accent-color)]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[var(--secondary-color)]/5 to-transparent rounded-full blur-3xl" />

            <div className="max-w-[1400px] px-4 sm:px-6 md:px-[4vw] xl:px-[6vw] py-16 sm:py-20 md:py-24 mx-auto relative z-10">

                {/* Section header - CENTERED */}
                <motion.div
                    className="text-center mb-12 sm:mb-14 md:mb-16 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-flex items-center gap-2 text-[var(--accent-color)] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4">
                        <span className="w-6 sm:w-8 h-[2px] bg-[var(--accent-color)]"></span>
                        What we offer
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--secondary-color)] leading-tight mb-3 sm:mb-4 px-4">
                        Built for real learning
                    </h2>
                    <p className="text-[var(--mid-main-secondary)] leading-relaxed max-w-2xl text-sm sm:text-base px-4">
                        Equathora gives you the tools to master mathematics at your own pace, with features designed for genuine understanding.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 items-center justify-center">

                    {/* Left side - Image with tilt on hover */}
                    <motion.div
                        className="flex-1 relative flex items-center justify-center max-lg:hidden"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Student image with 3D tilt effect on hover */}
                        <motion.div
                            className="relative z-20 cursor-pointer"
                            whileHover={{
                                rotateY: 0,
                                rotateX: 0,
                                scale: 1.05,
                            }}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = (e.clientX - rect.left) / rect.width - 0.5;
                                const y = (e.clientY - rect.top) / rect.height - 0.5;
                                e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 30}deg) rotateX(${-y * 30}deg) scale(1.05)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <img
                                src={MaleStudent}
                                alt="Male student learning"
                                className="w-[350px] md:w-[450px] h-auto object-contain rounded-lg drop-shadow-2xl"
                            />
                        </motion.div>

                        {/* Decorative circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-2 border-[var(--accent-color)]/10 rounded-full z-10" />
                    </motion.div>

                    {/* Right side - Feature cards (CENTERED) */}
                    <div className="flex-1 flex flex-col gap-4 sm:gap-5 md:gap-6 items-center justify-center w-full">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="group relative bg-white border border-gray-100 rounded-2xl p-6 sm:p-7 md:p-8 shadow-md hover:shadow-xl transition-all cursor-pointer w-full max-w-md"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                                whileHover={{
                                    rotateY: 0,
                                    rotateX: 0,
                                    scale: 1.02,
                                }}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                                    e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.02)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
                                }}
                            >
                                {/* Icon */}
                                <div className="mb-3 sm:mb-4 text-2xl sm:text-3xl">
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-lg sm:text-xl font-bold text-[var(--secondary-color)] mb-1.5 sm:mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-[var(--mid-main-secondary)] leading-relaxed text-sm sm:text-base">
                                    {feature.description}
                                </p>

                                {/* Hover accent line */}
                                <div className="absolute bottom-0 left-0 w-0 h-1 bg-[var(--accent-color)] group-hover:w-full transition-all duration-300" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
