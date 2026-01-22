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
        <section className="w-full bg-[var(--main-color)] relative overflow-hidden flex justify-center">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[var(--accent-color)]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[var(--secondary-color)]/5 to-transparent rounded-full blur-3xl" />

            <div className="max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-7 sm:py-14 md:py-16 lg:py-18 relative z-10">

                {/* Section header - CENTERED */}
                <motion.div
                    className="text-center pb-7 sm:pb-20 md:pb-24 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <span className="flex items-center gap-6 text-[var(--accent-color)] text-xs font-semibold uppercase tracking-wider pb-2 sm:pb-3">
                        Features
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--secondary-color)] leading-tight pb-4 sm:pb-5 px-6">
                        Tools for serious learners
                    </h2>
                    <p className="text-[var(--mid-main-secondary)] leading-relaxed max-w-2xl text-xs sm:text-sm px-6">
                        Everything you need to improve, all in one place
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 items-center justify-center">

                    {/* Left side - Student with circle (matching hero style) */}
                    <div className="flex-1 relative flex justify-center items-center">
                        <MouseFollower
                            intensity={25}
                            scale={1.05}
                            rotateEnabled={true}
                            translateEnabled={true}
                            className="relative z-20 w-full h-full flex items-center justify-center"
                        >
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {/* Circle container with image clipped inside */}
                                <div
                                    className="
                                        relative
                                        w-[320px]
                                        sm:w-[380px]
                                        md:w-[420px]
                                        lg:w-[500px]
                                        aspect-square
                                        rounded-full
                                        overflow-hidden
                                        z-10
                                        bg-gradient-to-b
                                        from-white
                                        to-gray-200
                                    "
                                >
                                    {/* Inner subtle circle */}
                                    <div className="absolute inset-[18%] rounded-full bg-white z-0" />

                                    {/* Student image – clipped by the circle */}
                                    <img
                                        src={MaleStudent}
                                        alt="Student with books"
                                        className="
                                            absolute
                                            inset-0
                                            w-full
                                            h-full
                                            object-cover
                                            object-top
                                            drop-shadow-2xl
                                            z-10
                                        "
                                        loading="eager"
                                    />
                                </div>
                            </motion.div>
                        </MouseFollower>
                    </div>

                    {/* Right side - Feature cards */}
                    <div className="flex-1 w-full relative">
                        <div className="grid grid-cols-1 gap-12 sm:gap-16 md:gap-20">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    className={`relative flex flex-col items-center text-center w-full max-w-lg ${index === 0 ? 'mx-auto' :
                                            index === 1 ? 'ml-auto mr-0 lg:mr-12' :
                                                'mx-auto'
                                        }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                                >
                                    {/* Large background number */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] md:text-[280px] lg:text-[320px] font-bold text-[var(--french-gray)] opacity-5 select-none pointer-events-none z-0 leading-none">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    {/* Icon */}
                                    <div className="pb-5 sm:pb-6 text-3xl sm:text-4xl relative z-10">
                                        {feature.icon}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--secondary-color)] pb-3 sm:pb-4 relative z-10">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[var(--mid-main-secondary)] leading-relaxed text-sm sm:text-base relative z-10">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
