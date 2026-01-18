import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import { ParallaxLayer } from './MouseFollower';

const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const testimonials = [
        {
            quote: "The problem explanations are really clear and the hints help when I get stuck. It's been great for my algebra practice.",
            author: "Sarah Mitchell",
            role: "High School Student",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            rating: 5
        },
        {
            quote: "I like how straightforward everything is. No unnecessary features, just solving problems and tracking my progress.",
            author: "Alex Kim",
            role: "College Freshman",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
            rating: 5
        },
        {
            quote: "Clean interface and well-structured problems. Looking forward to seeing more content added as the platform grows.",
            author: "Jordan Parker",
            role: "Math Enthusiast",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
            rating: 5
        }
    ];

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const trustedLogos = [
        { name: 'Brilliant', color: '#FFB800' },
        { name: 'Khan Academy', color: '#14BF96' },
        { name: 'Coursera', color: '#0056D2' },
        { name: 'Duolingo', color: '#58CC02' },
    ];

    return (
        <section className="w-full bg-[#fafbfc] relative overflow-hidden">
            {/* Background decoration */}
            <ParallaxLayer depth={0.3} className="absolute top-20 left-10 pointer-events-none">
                <motion.div
                    className="w-64 h-64 rounded-full bg-[var(--accent-color)]/5 blur-3xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
            </ParallaxLayer>

            <div className="max-w-[1400px] px-[4vw] xl:px-[6vw] py-24 mx-auto relative z-10">
                <div className="flex flex-col gap-16">
                    
                    {/* Section header */}
                    <motion.div
                        className="flex flex-col gap-4 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center justify-center gap-2 text-[var(--accent-color)] text-sm font-semibold uppercase tracking-wider">
                            <span className="w-8 h-[2px] bg-[var(--accent-color)]"></span>
                            Student feedback
                            <span className="w-8 h-[2px] bg-[var(--accent-color)]"></span>
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--secondary-color)]">
                            Trusted by genius people.
                        </h2>
                        <p className="text-[var(--mid-main-secondary)] max-w-lg mx-auto">
                            Hear from students who have transformed their math skills with our platform.
                        </p>
                    </motion.div>

                    {/* Testimonials carousel */}
                    <div className="relative max-w-3xl mx-auto w-full">
                        {/* Navigation buttons */}
                        <button
                            onClick={() => paginate(-1)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 lg:-translate-x-16 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-[var(--secondary-color)] hover:bg-[var(--accent-color)] hover:text-white hover:border-[var(--accent-color)] transition-all z-10"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={() => paginate(1)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 lg:translate-x-16 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-[var(--secondary-color)] hover:bg-[var(--accent-color)] hover:text-white hover:border-[var(--accent-color)] transition-all z-10"
                        >
                            <FaChevronRight />
                        </button>

                        {/* Testimonial card */}
                        <div className="relative h-[320px] overflow-hidden">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="absolute w-full"
                                >
                                    <div className="flex flex-col items-center gap-6 p-8 md:p-12 bg-white rounded-3xl border border-gray-100 shadow-xl">
                                        {/* Rating stars */}
                                        <div className="flex gap-1">
                                            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                                <FaStar key={i} className="text-yellow-400 text-lg" />
                                            ))}
                                        </div>

                                        {/* Quote */}
                                        <p className="text-xl text-center text-[var(--secondary-color)] leading-relaxed max-w-xl">
                                            "{testimonials[currentIndex].quote}"
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={testimonials[currentIndex].avatar}
                                                alt={testimonials[currentIndex].author}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-[var(--accent-color)]/20"
                                            />
                                            <div className="text-left">
                                                <p className="font-bold text-[var(--secondary-color)]">
                                                    {testimonials[currentIndex].author}
                                                </p>
                                                <p className="text-sm text-[var(--mid-main-secondary)]">
                                                    {testimonials[currentIndex].role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Dots indicator */}
                        <div className="flex justify-center gap-2 mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > currentIndex ? 1 : -1);
                                        setCurrentIndex(index);
                                    }}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        currentIndex === index 
                                            ? 'bg-[var(--accent-color)] w-8' 
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Trusted logos */}
                    <motion.div
                        className="flex flex-col gap-6 items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <p className="text-sm text-[var(--mid-main-secondary)] uppercase tracking-wider">
                            Inspired by industry leaders
                        </p>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                            {trustedLogos.map((logo, index) => (
                                <motion.div
                                    key={logo.name}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white hover:shadow-md transition-all"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: logo.color }}
                                    />
                                    <span className="text-[var(--secondary-color)] font-semibold">
                                        {logo.name}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
