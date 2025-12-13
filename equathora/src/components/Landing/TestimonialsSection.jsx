import React, { useState, useEffect } from 'react';

const TestimonialsSection = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const testimonials = [
        {
            quote: "The problem explanations are really clear and the hints help when I get stuck. It's been great for my algebra practice.",
            author: "Sarah M.",
            role: "Beta Tester"
        },
        {
            quote: "I like how straightforward everything is. No unnecessary features, just solving problems and tracking my progress.",
            author: "Alex K.",
            role: "Early User"
        },
        {
            quote: "Clean interface and well-structured problems. Looking forward to seeing more content added as the platform grows.",
            author: "Jordan P.",
            role: "Beta Tester"
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
                    <div className="flex flex-col gap-4 text-center text-3xl font-bold sm:text-4xl text-[var(--secondary-color)]">
                        Early feedback from our beta community
                        <p className="text-gray-600 text-lg">What our early testers are saying</p>
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
