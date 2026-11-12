import { motion } from 'framer-motion';
import { testimonials } from '../Landing/testimonialsData';

const MotionArticle = motion.article;
const testimonialColumns = [
    testimonials.slice(0, 1),
    testimonials.slice(1, 2),
    testimonials.slice(2, 3)
];

const TestimonialCard = ({ testimonial, index }) => (
    <MotionArticle
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, delay: index * 0.08 }}
        className="flex flex-col gap-4 rounded-[20px] border border-[#e9e9e9] bg-white p-4 sm:p-[18px]"
    >
        <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="font-medium text-(--dark-accent-color)">Equathora community</span>
        </div>
        <p className="text-[13px] leading-[1.55] text-[#333] sm:text-[14px]">
            {testimonial.text}
        </p>
        <a
            href={testimonial.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 no-underline"
            aria-label={`Read more from ${testimonial.name}`}
        >
            <img
                src={testimonial.image}
                alt=""
                draggable={false}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                loading="lazy"
            />
            <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[14px] font-medium leading-tight text-[#171717]">{testimonial.name}</span>
                <span className="text-[10px] leading-[1.4] text-[#777]">{testimonial.role}</span>
            </span>
        </a>
    </MotionArticle>
);

const Testimonials = () => (
    <section className="flex w-full justify-center py-12 sm:py-16">
        <div className="flex w-full max-w-[1500px] flex-col gap-8 px-[4vw] xl:px-[6vw]">
            <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="max-w-[520px] text-[27px] font-medium leading-[1.15] tracking-tight text-[#171717] sm:text-[31px]">
                    What our community says about Equathora
                </h2>
                <p className="max-w-[560px] text-[14px] leading-[1.5] text-[#777] sm:text-[15px]">
                    Students and educators share how Equathora makes learning and teaching math more engaging.
                </p>
            </div>

            <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:gap-4">
                {testimonialColumns.map((column, columnIndex) => (
                    <div key={columnIndex} className="flex w-full min-w-0 flex-1 flex-col gap-3 sm:gap-4">
                        {column.map((testimonial, index) => (
                            <TestimonialCard
                                key={testimonial.name}
                                testimonial={testimonial}
                                index={index + columnIndex}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Testimonials;
