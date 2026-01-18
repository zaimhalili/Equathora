import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaStar, FaQuoteLeft } from 'react-icons/fa';

const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const testimonials = [
        {
            quote: "The problem explanations are really clear and the hints help when I get stuck. It's been great for my algebra practice.",
            author: "Michael Chen",
            role: "High School Student",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
            rating: 5
        },
        {
            quote: "I like how straightforward everything is. No unnecessary features, just solving problems and tracking my progress.",
            author: "Alex Rivera",
            role: "College Freshman",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
            rating: 5
        },
        {
            quote: "Clean interface and well-structured problems. Looking forward to seeing more content added as the platform grows.",
            author: "Jordan Williams",
            role: "Math Enthusiast",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
            rating: 5
        }
    ];

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 200 : -200,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 200 : -200,
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

    return (
        <section className="w-full bg-[var(--secondary-color)] relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-color)]/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            <div className="max-w-[1400px] px-4 sm:px-6 md:px-[4vw] xl:px-[6vw] py-16 sm:py-20 md:py-24 mx-auto relative z-10">
                <div className="flex flex-col gap-12 sm:gap-14 md:gap-16 items-center justify-center">

                    {/* Section header - Centered */}
                    <motion.div
                        className="flex flex-col gap-3 sm:gap-4 text-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 text-[var(--accent-color)] text-xs sm:text-sm font-semibold uppercase tracking-wider">
                            <span className="w-6 sm:w-8 h-[2px] bg-[var(--accent-color)]"></span>
                            Student feedback
                            <span className="w-6 sm:w-8 h-[2px] bg-[var(--accent-color)]"></span>
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white px-4">
                            What students say
                        </h2>
                        <p className="text-white/60 max-w-lg text-base sm:text-lg px-4">
                            Hear from students who are building their math skills with us.
                        </p>
                    </motion.div>

                    {/* Testimonials carousel */}
                    <div className="relative max-w-3xl mx-auto w-full px-8 sm:px-12">
                        {/* Navigation buttons */}
                        <button
                            onClick={() => paginate(-1)}
                            className="absolute left-0 sm:left-4 md:left-0 top-1/2 -translate-y-1/2 -translate-x-0 sm:-translate-x-4 lg:-translate-x-16 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/20 z-10"
                        >
                            <FaChevronLeft className="text-sm sm:text-base" />
                        </button>
                        <button
                            onClick={() => paginate(1)}
                            className="absolute right-0 sm:right-4 md:right-0 top-1/2 -translate-y-1/2 translate-x-0 sm:translate-x-4 lg:translate-x-16 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/20 z-10"
                        >
                            <FaChevronRight className="text-sm sm:text-base" />
                        </button>

                        {/* Testimonial card */}
                        <div className="relative min-h-[320px] sm:min-h-[300px] overflow-hidden">
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
                                    <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 p-6 sm:p-8 md:p-12 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                                        {/* Quote icon */}
                                        <FaQuoteLeft className="text-2xl sm:text-3xl md:text-4xl text-[var(--accent-color)]/30" />

                                        {/* Rating stars */}
                                        <div className="flex gap-1">
                                            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                                <FaStar key={i} className="text-yellow-400 text-base sm:text-lg" />
                                            ))}
                                        </div>

                                        {/* Quote */}
                                        <p className="text-base sm:text-lg md:text-xl text-center text-white leading-relaxed max-w-xl px-2">
                                            "{testimonials[currentIndex].quote}"
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <img
                                                src={testimonials[currentIndex].avatar}
                                                alt={testimonials[currentIndex].author}
                                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[var(--accent-color)]/30"
                                            />
                                            <div className="text-left">
                                                <p className="font-bold text-white text-sm sm:text-base">
                                                    {testimonials[currentIndex].author}
                                                </p>
                                                <p className="text-xs sm:text-sm text-white/60">
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
                                    className={`w-3 h-3 rounded-full transition-all ${currentIndex === index
                                            ? 'bg-[var(--accent-color)] w-8'
                                            : 'bg-white/30 hover:bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
