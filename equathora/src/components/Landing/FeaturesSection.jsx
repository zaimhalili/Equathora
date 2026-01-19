import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaTrophy } from 'react-icons/fa';
import MaleStudent from '../../assets/images/yng_student.png';
import MouseFollower from './MouseFollower';

const FeaturesSection = () => {
    const features = [
        {
            icon: <FaBrain className="text-2xl text-[var(--accent-color)]" />,
            title: 'Adaptive Learning',
            description: 'Problems that evolve with your skill level. Practice at your own pace with intelligent problem selection.',
        },
        {
            icon: <FaChartLine className="text-2xl text-[var(--accent-color)]" />,
            title: 'Track Progress',
            description: 'Monitor your improvement with detailed statistics and insights. See where you excel and where to focus.',
        },
        {
            icon: <FaTrophy className="text-2xl text-[var(--accent-color)]" />,
            title: 'Earn Achievements',
            description: 'Unlock badges and milestones as you master new concepts. Celebrate your learning journey.',
        },
    ];

    return (
        <section className="w-full bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[var(--accent-color)]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[var(--secondary-color)]/5 to-transparent rounded-full blur-3xl" />

            <div className="max-w-[1400px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-20 sm:py-24 md:py-28 lg:py-32 relative z-10" style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                {/* Section header - CENTERED */}
                <motion.div
                    className="text-center pb-16 sm:pb-20 md:pb-24 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-flex items-center gap-2 text-[var(--accent-color)] text-xs font-semibold uppercase tracking-wider pb-4 sm:pb-5">
                        <span className="w-6 sm:w-8 h-[2px] bg-[var(--accent-color)]"></span>
                        What we offer
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--secondary-color)] leading-tight pb-4 sm:pb-5 px-6">
                        Built for real learning
                    </h2>
                    <p className="text-[var(--mid-main-secondary)] leading-relaxed max-w-2xl text-xs sm:text-sm px-6">
                        Equathora gives you the tools to master mathematics at your own pace, with features designed for genuine understanding.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 items-center justify-center">

                    {/* Left side - Student with circle (matching hero style) */}
                    <div className="flex-1 relative flex justify-center items-center max-lg:hidden">
                        <MouseFollower
                            intensity={25}
                            scale={1.05}
                            rotateEnabled={true}
                            translateEnabled={true}
                            className="relative z-20 w-full h-full flex items-center justify-center"
                        >
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <motion.div
                                    className="relative"
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {/* Full circle backdrop */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border-2 border-[var(--accent-color)]/15 bg-[var(--accent-color)]/5 backdrop-blur-sm z-0" />
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-[var(--accent-color)]/10 z-0" />

                                    {/* Student image positioned inside/aligned with circle */}
                                    <div className="relative w-[360px] h-[440px] flex items-end justify-center z-10">
                                        <div className="w-full h-[400px] overflow-hidden relative" style={{ borderRadius: '0 0 180px 180px' }}>
                                            <img
                                                src={MaleStudent}
                                                alt="Student learning"
                                                className="w-full h-full object-cover object-top drop-shadow-2xl"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </MouseFollower>
                    </div>

                    {/* Right side - Feature cards (CENTERED) */}
                    <div className="flex-1 flex flex-col gap-4 sm:gap-5 md:gap-6 items-center justify-center w-full">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="group relative bg-white border border-gray-100 rounded-2xl p-8 sm:p-9 md:p-10 shadow-md hover:shadow-xl transition-all cursor-pointer w-full max-w-md"
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
                                <div className="pb-4 sm:pb-5 text-xl sm:text-2xl">
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-base sm:text-lg font-bold text-[var(--secondary-color)] pb-2 sm:pb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-[var(--mid-main-secondary)] leading-relaxed text-xs sm:text-sm">
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
