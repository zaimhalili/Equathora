import React from 'react';
import { motion } from 'framer-motion';
import { FaTerminal, FaCode, FaChartBar } from 'react-icons/fa';

const ExercisesSection = () => {
    const exercises = [
        {
            title: 'Linear Equations',
            description: 'Master the fundamentals of solving linear equations. Learn to isolate variables and understand the balance method.',
            topics: ['Algebra', 'Functions', 'Graphs'],
            moreCount: 40,
        },
        {
            title: 'Quadratic Formula',
            description: 'Given the coefficients of a quadratic equation, determine its roots using the quadratic formula and discriminant.',
            topics: ['Algebra', 'Polynomials', 'Calculus'],
            moreCount: 60,
        },
        {
            title: 'Pythagorean Puzzle',
            description: 'Can you find all Pythagorean triples below a given number? Explore the relationships between right triangle sides.',
            topics: ['Geometry', 'Number Theory', 'Algebra'],
            moreCount: 70,
        },
    ];

    const features = [
        {
            icon: <FaTerminal className="text-3xl text-[var(--accent-color)]" />,
            title: 'Practice locally, on your own',
            description: 'Equathora integrates with your workflow. Solve problems and keep your skills sharp.',
        },
        {
            icon: <FaCode className="text-3xl text-[var(--accent-color)]" />,
            title: 'Use the Equathora in-browser solver',
            description: 'Don\'t want to set anything up? Our in-browser math editor supports all problem types with instant feedback.',
        },
        {
            icon: <FaChartBar className="text-3xl text-[var(--accent-color)]" />,
            title: 'Get automated analysis on your solutions',
            description: 'Not sure how well you did? We provide instant feedback with step-by-step solutions and improvement suggestions.',
        },
    ];

    return (
        <section className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary),var(--main-color)20%)] relative overflow-hidden flex justify-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--accent-color)]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[var(--secondary-color)]/5 to-transparent rounded-full blur-3xl" />

            <div className="max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10">
                {/* Section header */}
                <motion.div
                    className="text-center pb-12 sm:pb-16 md:pb-20 flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <h2 className="text-3xl sm:text-3xl md:text-5xl lg:text-5xl font-extrabold text-[var(--secondary-color)] pb-4 sm:pb-6">
                        Over 100 math exercises.
                    </h2>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--mid-main-secondary)] pb-4 sm:pb-5">
                        From "Algebra Basics" to "Calculus Puzzles".
                    </p>
                    <p className="text-base sm:text-lg md:text-xl text-[var(--mid-main-secondary)] leading-relaxed max-w-3xl">
                        Learn by doing. Get better at mathematics through fun problem-solving that builds your understanding of concepts.
                    </p>
                </motion.div>

                {/* Exercise cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pb-16 sm:pb-20 md:pb-24">
                    {exercises.map((exercise, index) => (
                        <motion.div
                            key={exercise.title}
                            className="bg-white rounded-xl border-2 border-gray-100 hover:border-[var(--accent-color)]/30 transition-all duration-300 p-6 sm:p-8 hover:shadow-xl group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                        >
                            {/* Exercise icon/image placeholder */}
                            <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent-color)]/10 to-[var(--accent-color)]/5 rounded-lg mb-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl font-bold text-[var(--accent-color)]">
                                    {exercise.title.charAt(0)}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl sm:text-2xl font-bold text-[var(--secondary-color)] pb-3">
                                {exercise.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[var(--mid-main-secondary)] leading-relaxed pb-5 text-sm sm:text-base">
                                {exercise.description}
                            </p>

                            {/* Topics */}
                            <div className="flex flex-wrap gap-2 pb-3">
                                {exercise.topics.map((topic, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs sm:text-sm rounded-full font-medium"
                                    >
                                        {topic}
                                    </span>
                                ))}
                            </div>

                            {/* More count */}
                            <p className="text-[var(--mid-main-secondary)] text-sm">
                                +{exercise.moreCount} more topics
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Features list */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            className="flex flex-col items-start text-left"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                        >
                            {/* Icon */}
                            <div className="pb-5 sm:pb-6">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl sm:text-2xl font-bold text-[var(--secondary-color)] pb-3 sm:pb-4">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[var(--mid-main-secondary)] leading-relaxed text-sm sm:text-base">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExercisesSection;
