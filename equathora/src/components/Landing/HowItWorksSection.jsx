import React from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaPencilAlt, FaChartLine, FaTrophy } from 'react-icons/fa';

const HowItWorksSection = () => {
    const steps = [
        {
            step: '01',
            title: 'Choose your topic',
            description: 'Browse through algebra, calculus, logic, and more. Pick what matches your current goals.',
            icon: FaBookOpen,
            color: 'from-blue-500 to-blue-600',
        },
        {
            step: '02',
            title: 'Solve problems',
            description: 'Work through carefully crafted challenges. Use hints when stuck, learn from solutions.',
            icon: FaPencilAlt,
            color: 'from-[var(--accent-color)] to-[var(--dark-accent-color)]',
        },
        {
            step: '03',
            title: 'Track progress',
            description: 'Watch your stats grow. Maintain streaks, earn achievements, see improvement over time.',
            icon: FaChartLine,
            color: 'from-green-500 to-green-600',
        },
        {
            step: '04',
            title: 'Master concepts',
            description: 'Build real intuition through consistent practice. Math becomes your strength.',
            icon: FaTrophy,
            color: 'from-yellow-500 to-orange-500',
        },
    ];

    return (
        <section className="w-full bg-[#fafbfc] relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
                {/* Dot pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, var(--secondary-color) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                />

                {/* Gradient orbs */}
                <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[var(--accent-color)]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-7 sm:py-14 md:py-16 lg:py-18 relative z-10" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
                    {/* Section header - Centered */}
                    <motion.div
                        className="flex flex-col gap-3 sm:gap-4 text-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <span className="inline-flex items-center gap-2 text-[var(--accent-color)] text-xs sm:text-sm font-semibold uppercase tracking-wider">
                            <span className="w-6 sm:w-8 h-[2px] bg-[var(--accent-color)]"></span>
                            Simple process
                            <span className="w-6 sm:w-8 h-[2px] bg-[var(--accent-color)]"></span>
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--secondary-color)] px-4">
                            How it works
                        </h2>
                        <p className="text-[var(--mid-main-secondary)] text-base sm:text-lg max-w-xl px-4">
                            Four simple steps to transform your math skills
                        </p>
                    </motion.div>

                    {/* Steps grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                        {steps.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <motion.div
                                    key={item.step}
                                    className="relative flex flex-col gap-4 sm:gap-5 p-6 sm:p-7 md:p-8 bg-white rounded border border-gray-100 shadow-sm transition-all"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                                >
                                    {/* Connector line */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-16 -right-3 w-6 h-[2px] bg-gray-200 z-10" />
                                    )}

                                    {/* Step number */}
                                    <div className="flex items-center justify-between">
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                                            <IconComponent className="text-xl sm:text-2xl text-white" />
                                        </div>
                                        <span className="text-3xl sm:text-4xl font-bold text-gray-100">{item.step}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-lg sm:text-xl font-bold text-[var(--secondary-color)]">{item.title}</h3>
                                        <p className="text-[var(--mid-main-secondary)] text-xs sm:text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
