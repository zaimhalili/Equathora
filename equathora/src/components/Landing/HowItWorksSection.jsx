import React from 'react';
import { motion } from 'framer-motion';
import GradientText from '../ui/GradientText.jsx';
import Journey from '../../assets/images/journey.svg';
import Achievements from '../../assets/images/achievements.svg';
import Choice from '../../assets/images/choice.svg';
import LearningBooks from '../../assets/images/learningBooks.svg';
import Progress from '../../assets/images/Progress.svg';
import Race from '../../assets/images/race.svg';

const HowItWorksSection = () => {
    const steps = [
        {
            step: '01',
            title: 'Choose your track',
            description: 'Browse through various math topics and select a track that matches your current level and learning goals. From basic algebra to advanced calculus.',
            image: Choice,
            direction: 'left',
            tags: ['Multiple Topics', 'Skill Levels', 'Curated Content']
        },
        {
            step: '02',
            title: 'Solve problems',
            description: 'Work through carefully crafted problems at your own pace. Use hints when stuck, and receive detailed explanations for every solution.',
            image: LearningBooks,
            direction: 'right',
            tags: ['Step-by-Step', 'Hints Available', 'Detailed Solutions']
        },
        {
            step: '03',
            title: 'Track progress',
            description: 'Monitor your improvement with statistics, achievements, and leaderboards. Celebrate milestones and maintain your learning streak.',
            image: Progress,
            direction: 'left',
            tags: ['Statistics', 'Achievements', 'Leaderboards']
        },
        {
            step: '04',
            title: 'Master concepts',
            description: 'Build solid understanding through repetition and progressive difficulty. Watch your confidence grow as math becomes your superpower.',
            image: Race,
            direction: 'right',
            tags: ['Practice', 'Build Confidence', 'Grow Skills']
        },
    ];

    return (
        <section className="w-full bg-white border-b border-gray-100 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-20 right-10 w-32 h-32 opacity-5"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <img src={Journey} alt="" className="w-full h-full" />
                </motion.div>
                <motion.div
                    className="absolute bottom-20 left-10 w-40 h-40 opacity-5"
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -10, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <img src={Achievements} alt="" className="w-full h-full" />
                </motion.div>
            </div>

            <div className="max-w-6xl px-8 py-24 relative z-10" style={{ margin: '0 auto' }}>
                <div className="flex flex-col gap-16">
                    <motion.div
                        className="flex flex-col gap-4 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                    >
                        <GradientText
                            className="text-3xl font-bold sm:text-5xl"
                            colors={['#d90429', '#2b2d42', '#d90429']}
                            animationSpeed={6}
                        >
                            How it works
                        </GradientText>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">Simple steps to start your learning journey</p>
                    </motion.div>

                    <div className="flex flex-col gap-12">
                        {steps.map((item, index) => (
                            <motion.div
                                key={item.step}
                                className={`flex flex-col ${item.direction === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center`}
                                initial={{ opacity: 0, x: item.direction === 'left' ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                {/* Image Side */}
                                <motion.div
                                    className="flex-1 flex justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] opacity-10 blur-2xl rounded-full"></div>
                                        <div className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow">
                                            <img src={item.image} alt={item.title} className="w-80 h-80 object-contain" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Content Side */}
                                <div className="flex-1 flex flex-col gap-6">
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--dark-accent-color)] shadow-lg"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <span className="text-2xl font-bold text-white">{item.step}</span>
                                        </motion.div>
                                        <h3 className="text-3xl font-bold text-[var(--secondary-color)]">{item.title}</h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>

                                    {/* Feature highlights */}
                                    <motion.div
                                        className="flex flex-wrap gap-2"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.15, duration: 0.3 }}
                                    >
                                        {item.tags.map((tag) => (
                                            <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
