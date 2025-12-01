import React, { useState, useEffect } from 'react';

const TestimonialsSection = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const testimonials = [
        {
            quote: "Equathora transformed how I approach math problems. The structured paths and instant feedback helped me improve my calculus grade from C to A.",
            author: "Sarah Chen",
            role: "Engineering Student"
        },
        {
            quote: "The achievement system keeps me motivated every day. I've solved over 100 problems in just two months and finally feel confident with algebra.",
            author: "Marcus Johnson",
            role: "High School Senior"
        },
        {
            quote: "As a teacher, I recommend Equathora to all my students. The explanations are clear, and the progression is perfectly paced.",
            author: "Dr. Emily Rodriguez",
            role: "Math Professor"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="w-full bg-gray-50 border-b border-gray-100 overflow-hidden">
            <div className="max-w-6xl px-8 py-20" style={{ margin: '0 auto' }}>
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-4 text-center">
                        <h2 className="text-3xl font-bold sm:text-4xl" style={{
                            background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--dark-accent-color) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Loved by learners worldwide
                        </h2>
                        <p className="text-gray-600 text-lg">See what our community has to say</p>
                    </div>

                    <div className="relative flex items-center justify-center min-h-[280px]">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="absolute w-full transition-all duration-700 ease-in-out"
                                style={{
                                    opacity: currentTestimonial === index ? 1 : 0,
                                    transform: currentTestimonial === index ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.9)',
                                    pointerEvents: currentTestimonial === index ? 'auto' : 'none'
                                }}
                            >
                                <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow max-w-3xl" style={{ margin: '0 auto' }}>
                                    <p className="text-xl text-center text-gray-700 leading-relaxed italic">"{testimonial.quote}"</p>
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="font-bold text-[var(--secondary-color)]">{testimonial.author}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentTestimonial(index)}
                                className="w-3 h-3 rounded-full transition-all"
                                style={{
                                    backgroundColor: currentTestimonial === index ? 'var(--accent-color)' : '#d1d5db'
                                }}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
