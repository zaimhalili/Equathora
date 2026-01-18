import React from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaChartLine, FaLightbulb } from 'react-icons/fa';
import MouseFollower, { FloatingElement, ParallaxLayer } from './MouseFollower';

const FeaturesSection = () => {
    const features = [
        {
            number: '01',
            icon: FaBookOpen,
            title: 'Guided practice',
            text: 'Solve curated problem sets with structured hints and clear explanations. Every problem is carefully designed to build your understanding.',
        },
        {
            number: '02',
            icon: FaChartLine,
            title: 'Progress tracking',
            text: 'Track streaks, achievements, and improvement without distractions. Visualize your growth with detailed statistics.',
        },
        {
            number: '03',
            icon: FaLightbulb,
            title: 'Instant feedback',
            text: 'Get immediate validation with detailed explanations. Learn from mistakes in real-time and improve faster.',
        },
    ];

    return (
        <section className="w-full bg-[#fafbfc] relative overflow-hidden">
            {/* Subtle background pattern */}
            <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, var(--secondary-color) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Floating decorative elements */}
            <ParallaxLayer depth={0.5} className="absolute top-20 right-20 pointer-events-none">
                <motion.div
                    className="w-32 h-32 rounded-full border-2 border-[var(--accent-color)]/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
            </ParallaxLayer>

            <div className="max-w-[1400px] px-[4vw] xl:px-[6vw] py-24 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    
                    {/* Left side - Image with floating elements */}
                    <motion.div
                        className="flex-1 relative"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <MouseFollower intensity={6} className="relative">
                            <div className="relative">
                                {/* Main image */}
                                <motion.div
                                    className="rounded-3xl overflow-hidden shadow-xl"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=500&fit=crop"
                                        alt="Student studying with focus"
                                        className="w-full object-cover"
                                        loading="lazy"
                                    />
                                </motion.div>

                                {/* Floating label */}
                                <FloatingElement
                                    className="absolute -bottom-6 -right-6"
                                    floatRange={8}
                                    duration={4}
                                    cursorIntensity={12}
                                >
                                    <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] flex items-center justify-center">
                                                <span className="text-white text-lg">✓</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-[var(--secondary-color)]">Guaranteed</p>
                                                <p className="text-sm text-[var(--mid-main-secondary)]">& certified</p>
                                            </div>
                                        </div>
                                    </div>
                                </FloatingElement>

                                {/* Background accent */}
                                <div className="absolute -z-10 -bottom-8 -left-8 w-full h-full rounded-3xl bg-[var(--accent-color)]/10"></div>
                            </div>
                        </MouseFollower>
                    </motion.div>

                    {/* Right side - Content */}
                    <div className="flex-1 flex flex-col gap-8">
                        {/* Section header */}
                        <motion.div
                            className="flex flex-col gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-2 text-[var(--accent-color)] text-sm font-semibold uppercase tracking-wider">
                                <span className="w-8 h-[2px] bg-[var(--accent-color)]"></span>
                                Why choose us
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[var(--secondary-color)] leading-tight">
                                Online learning wherever and whenever.
                            </h2>
                        </motion.div>

                        {/* Features list */}
                        <div className="flex flex-col gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.number}
                                    className="group flex gap-5 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[var(--accent-color)]/30 hover:shadow-lg transition-all cursor-default"
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    whileHover={{ x: 8 }}
                                >
                                    {/* Number */}
                                    <div className="flex-shrink-0">
                                        <span className="text-4xl font-bold text-[var(--accent-color)]/20 group-hover:text-[var(--accent-color)]/40 transition-colors">
                                            {feature.number}
                                        </span>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] group-hover:bg-[var(--accent-color)] group-hover:text-white transition-all"
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <feature.icon />
                                            </motion.div>
                                            <h3 className="text-lg font-bold text-[var(--secondary-color)]">
                                                {feature.title}
                                            </h3>
                                        </div>
                                        <p className="text-[var(--mid-main-secondary)] leading-relaxed">
                                            {feature.text}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative background shape */}
            <motion.div
                className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[var(--accent-color)]/5 to-transparent rounded-full blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity }}
            />
        </section>
    );
};

export default FeaturesSection;
