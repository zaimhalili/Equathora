import React from 'react';
import { motion } from 'framer-motion';
import GuestAvatar from '../../assets/images/guestAvatar.png';


const TestimonialsSection = () => {

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

                    {/* Marquee carousel of testimonial cards */}
                    <style>{`
                        @keyframes marqueeScroll {
                            0% { transform: translateX(0%); }
                            100% { transform: translateX(-50%); }
                        }

                        .marquee-inner {
                            animation: marqueeScroll 25s linear infinite;
                        }

                        .marquee-reverse {
                            animation-direction: reverse;
                        }
                    `}</style>

                    <div className="w-full flex flex-col gap-0">
                        {/* First marquee row */}
                        <div className="marquee-row w-full mx-auto overflow-hidden relative">
                            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[var(--secondary-color)] to-transparent"></div>
                            <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
                                {[...testimonials, ...testimonials].map((testimonial, index) => (
                                    <div key={index} className="p-4 rounded-lg mx-4 shadow-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-xl transition-all duration-200 w-72 shrink-0">
                                        <div className="flex gap-2">
                                            <img className="w-11 h-11 rounded-full" src={testimonial.avatar} alt="User Image" />
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1">
                                                    <p className="text-white font-semibold">{testimonial.author}</p>
                                                    <svg className="mt-0.5 fill-[var(--accent-color)]" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs text-white/50">{testimonial.role}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm py-4 text-white/80">{testimonial.quote}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[var(--secondary-color)] to-transparent"></div>
                        </div>

                        {/* Second marquee row (reverse direction) */}
                        <div className="marquee-row w-full mx-auto overflow-hidden relative">
                            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[var(--secondary-color)] to-transparent"></div>
                            <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-5 pb-10">
                                {[...testimonials, ...testimonials].map((testimonial, index) => (
                                    <div key={index} className="p-4 rounded-lg mx-4 shadow-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-xl transition-all duration-200 w-72 shrink-0">
                                        <div className="flex gap-2">
                                            <img className="w-11 h-11 rounded-full" src={testimonial.avatar} alt="User Image" />
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1">
                                                    <p className="text-white font-semibold">{testimonial.author}</p>
                                                    <svg className="mt-0.5 fill-[var(--accent-color)]" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs text-white/50">{testimonial.role}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm py-4 text-white/80">{testimonial.quote}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[var(--secondary-color)] to-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
