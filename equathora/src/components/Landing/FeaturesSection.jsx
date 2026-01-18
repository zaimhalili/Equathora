import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaGraduationCap, FaChartLine, FaBrain } from 'react-icons/fa';

const FeaturesSection = () => {
    const containerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 100 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const imageX = useTransform(x, [-400, 400], [30, -30]);
    const imageY = useTransform(y, [-400, 400], [30, -30]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                mouseX.set(e.clientX - rect.left - rect.width / 2);
                mouseY.set(e.clientY - rect.top - rect.height / 2);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            return () => container.removeEventListener('mousemove', handleMouseMove);
        }
    }, [mouseX, mouseY]);

    const features = [
        {
            number: '01',
            title: 'Step-by-step guidance',
            description: 'Every problem comes with hints and detailed solutions to help you understand the underlying concepts.',
            icon: FaGraduationCap,
        },
        {
            number: '02',
            title: 'Track your progress',
            description: 'Monitor your improvement with statistics, streaks, and achievements that celebrate your growth.',
            icon: FaChartLine,
        },
        {
            number: '03',
            title: 'Build real intuition',
            description: 'Move beyond memorization. Develop problem-solving skills that transfer to any challenge.',
            icon: FaBrain,
        },
    ];

    return (
        <section
            ref={containerRef}
            className="w-full bg-white relative overflow-hidden"
        >
            {/* Background decorations - Light theme */}
            <div className="absolute inset-0">
                {/* Dot pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, var(--secondary-color) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                />

                {/* Gradient orb */}
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[var(--accent-color)]/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />

                {/* Decorative circles */}
                <div className="absolute top-20 right-20 w-32 h-32 border border-gray-100 rounded-full" />
                <div className="absolute bottom-20 left-10 w-20 h-20 border border-[var(--accent-color)]/10 rounded-full" />
            </div>

            <div className="max-w-[1400px] px-[4vw] xl:px-[6vw] py-24 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center justify-center">

                    {/* Left side - Student Image with 3D effect */}
                    <motion.div
                        className="flex-1 relative flex justify-center items-center min-h-[450px]"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Main student image */}
                        <motion.div
                            className="relative z-20"
                            style={{ x: imageX, y: imageY }}
                        >
                            <img
                                src="https://img.freepik.com/free-photo/portrait-young-student-happy-be-back-university_23-2148586577.jpg?w=740"
                                alt="Happy student"
                                className="w-[300px] lg:w-[380px] h-auto rounded-3xl shadow-2xl object-cover"
                                loading="lazy"
                            />
                        </motion.div>

                        {/* Floating badge */}
                        <motion.div
                            className="absolute -bottom-4 -right-4 lg:right-8 z-30"
                            style={{
                                x: useTransform(imageX, v => -v * 0.8),
                                y: useTransform(imageY, v => -v * 0.8)
                            }}
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="px-6 py-4 bg-white rounded-2xl shadow-2xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 text-xl">✓</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--secondary-color)]">Certified</p>
                                        <p className="text-sm text-[var(--mid-main-secondary)]">Quality content</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Background circle */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border-2 border-[var(--accent-color)]/10 z-10"
                            style={{ x: useTransform(imageX, v => v * 0.3), y: useTransform(imageY, v => v * 0.3) }}
                        />
                    </motion.div>

                    {/* Right side - Features - Centered */}
                    <div className="flex-1 flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">
                        {/* Section header */}
                        <motion.div
                            className="flex flex-col gap-4 items-center lg:items-start"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-2 text-[var(--accent-color)] text-sm font-semibold uppercase tracking-wider">
                                <span className="w-8 h-[2px] bg-[var(--accent-color)]"></span>
                                Why Equathora
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[var(--secondary-color)] leading-tight">
                                Built for real learning.
                            </h2>
                            <p className="text-[var(--mid-main-secondary)] leading-relaxed max-w-lg text-lg">
                                A focused environment where practice leads to genuine understanding.
                            </p>
                        </motion.div>

                        {/* Features list */}
                        <div className="flex flex-col gap-6 w-full">
                            {features.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <motion.div
                                        key={feature.number}
                                        className="flex gap-5 items-start p-5 rounded-2xl bg-gray-50 border border-gray-100 transition-all"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.4 }}
                                    >
                                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[var(--accent-color)]/10 flex items-center justify-center">
                                            <IconComponent className="text-2xl text-[var(--accent-color)]" />
                                        </div>
                                        <div className="flex flex-col gap-1 text-left">
                                            <span className="text-xs text-[var(--accent-color)] font-bold">{feature.number}</span>
                                            <h3 className="text-xl font-bold text-[var(--secondary-color)]">{feature.title}</h3>
                                            <p className="text-[var(--mid-main-secondary)] text-sm leading-relaxed">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
