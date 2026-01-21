import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import GuestAvatar from '../../assets/images/guestAvatar.png';


const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const testimonials = [
        {
            quote: "The problem explanations are really clear and the hints help when I get stuck. It's been great for my algebra practice.",
            author: "Alessandro Rinaldi",
            role: "High School Student",
            avatar: GuestAvatar,
            rating: 5
        },
        {
            quote: "I like how straightforward everything is. No unnecessary features, just solving problems and tracking my progress.",
            author: "Marco Olivieri",
            role: "College Freshman",
            avatar: GuestAvatar,
            rating: 5
        },
        {
            quote: "Clean Sansationface and well-structured problems. Looking forward to seeing more content added as the platform grows.",
            author: "Sofia Gasparov",
            role: "Math Enthusiast",
            avatar: GuestAvatar,
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

            <div className="max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-7 sm:py-14 md:py-16 lg:py-18 w-full relative z-10" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 items-center justify-center w-full">

                    {/* Section header - Centered */}
                    <motion.div
                        className="flex flex-col gap-4 sm:gap-5 text-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <span className="inline-flex items-center gap-2 text-[var(--accent-color)] text-xs font-semibold uppercase tracking-wider">
                            <span className="w-6 sm:w-8 h-[2px] bg-[var(--accent-color)]"></span>
                            Student feedback
                            <span className="w-6 sm:w-8 h-[2px] bg-[var(--accent-color)]"></span>
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white px-6">
                            Trusted by genius people
                        </h2>
                        <p className="text-white/60 max-w-lg text-xs sm:text-sm px-6">
                            Hear from students who are building their math skills with us.
                        </p>
                    </motion.div>

                    {/* Crafto-style layout: Big stat on left, cards on right */}
                    <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                        {/* Left column - big percentage */}
                        <motion.div
                            className="lg:w-2/5 flex flex-col items-center lg:items-start text-center lg:text-left"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="text-8xl sm:text-9xl lg:text-[10rem] font-bold text-[var(--accent-color)] leading-none">
                                99%
                            </span>
                            <p className="text-white/80 text-lg sm:text-xl leading-relaxed pt-4">
                                Student's complete their practice successfully.
                            </p>
                        </motion.div>

                        {/* Right column - testimonial carousel */}
                        <div className="lg:w-3/5 w-full">
                            <div className="relative">
                                <AnimatePresence initial={false} custom={direction} mode="wait">
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
                                    >
                                        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 sm:p-10">
                                            <p className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed pb-8">
                                                "{testimonials[currentIndex].quote}"
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={testimonials[currentIndex].avatar}
                                                    alt={testimonials[currentIndex].author}
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-[var(--accent-color)]/40"
                                                />
                                                <div>
                                                    <p className="font-bold text-white text-base sm:text-lg">
                                                        {testimonials[currentIndex].author}
                                                    </p>
                                                    <p className="text-sm text-white/60">
                                                        {testimonials[currentIndex].role}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Navigation arrows */}
                            <div className="flex items-center gap-3 pt-8">
                                <button
                                    onClick={() => paginate(-1)}
                                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)]"
                                >
                                    <FaChevronLeft className="text-base" />
                                </button>
                                <button
                                    onClick={() => paginate(1)}
                                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)]"
                                >
                                    <FaChevronRight className="text-base" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
