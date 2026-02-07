import React from 'react';
import { motion } from 'framer-motion';
import Screenshot from "../../assets/images/sc.png";

const ExercisesSection = () => {
    const exercises = [
        {
            icon: <svg className="w-6 h-6" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="icon-gradient-pencil" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-pencil)" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
            </svg>,
            title: 'Linear Equations',
            description: 'Master the fundamentals of solving linear equations.',
            topics: ['Algebra', 'Functions', 'Graphs'],
            // moreCount: 40,
        },
        {
            icon: <svg className="w-6 h-6" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="icon-gradient-buffer" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-buffer)" d="M427.84 380.67l-196.5 97.82a18.6 18.6 0 01-14.67 0L20.16 380.67c-4-2-4-5.28 0-7.29L67.22 350a18.65 18.65 0 0114.69 0l134.57 67a18.66 18.66 0 0014.67 0l134.57-67a18.65 18.65 0 0114.69 0l47.06 23.41c4 2 4 5.29 0 7.29zM427.84 244l-196.5 97.82a18.6 18.6 0 01-14.67 0L20.16 244c-4-2-4-5.28 0-7.29L67.22 213.33a18.65 18.65 0 0114.69 0l134.57 67a18.66 18.66 0 0014.67 0l134.57-67a18.65 18.65 0 0114.69 0L427.84 236.71c4 2 4 5.29 0 7.29zM427.84 107.33l-196.5 97.82a18.6 18.6 0 01-14.67 0L20.16 107.33c-4-2-4-5.28 0-7.29L67.22 76.67a18.65 18.65 0 0114.69 0l134.57 67a18.66 18.66 0 0014.67 0l134.57-67a18.65 18.65 0 0114.69 0L427.84 100c4 2 4 5.29 0 7.29z" />
            </svg>,
            title: 'Quadratic Formula',
            description: 'Given the coefficients of a quadratic equation, determine its roots.',
            topics: ['Algebra', 'Polynomials', 'Calculus'],
            // moreCount: 60,
        },
        {
            icon: <svg className="w-6 h-6" viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="icon-gradient-ruler" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-ruler)" d="M0 48C0 21.5 21.5 0 48 0h160c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48zM80 224c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H80zm0-96c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H80zm0 192c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H80zm0 96c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H80z" />
            </svg>,
            title: 'Pythagorean Puzzle',
            description: 'Can you find all Pythagorean triples below a given number?',
            topics: ['Geometry', 'Number Theory', 'Algebra'],
            // moreCount: 70,
        },
    ];

    const features = [
        {
            icon: <svg className="w-[30px] h-[30px]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="icon-gradient-terminal" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-terminal)" d="M9.372 40.837a16.017 16.017 0 00-5.925 11.597V470.42a16.017 16.017 0 005.925 11.597l272.75 103.31a16.017 16.017 0 0015.75 0L562.628 482.017a16.017 16.017 0 005.925-11.597V52.434a16.017 16.017 0 00-5.925-11.597L287.122 0a16.017 16.017 0 00-15.75 0L9.372 40.837zM480 416H96v-64h384v64zm0-96H96v-64h384v64zm0-96H96v-64h384v64zM64 112v64h32v-64H64zm64 0v64h32v-64h-32zm64 0v64h32v-64h-32zm64 0v64h32v-64h-32z" />
            </svg>,
            title: 'Practice locally, on your own',
            description: 'Equathora integrates with your workflow. Solve problems and keep your skills sharp.',
        },
        {
            icon: <svg className="w-[30px] h-[30px]" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="icon-gradient-code" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-code)" d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L522.2 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.8 12.1 5.1 17 .5z" />
            </svg>,
            title: 'Use the Equathora in-browser solver',
            description: 'Don\'t want to set anything up? Our in-browser math editor supports all problem types with instant feedback.',
        },
        {
            icon: <svg className="w-[30px] h-[30px]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="icon-gradient-chart" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" />
                    </linearGradient>
                </defs>
                <path fill="url(#icon-gradient-chart)" d="M332.8 320h38.4c6.6 0 12-5.4 12-12v-184c0-6.6-5.4-12-12-12h-38.4c-6.6 0-12 5.4-12 12v184c0 6.6 5.4 12 12 12zm96 0h38.4c6.6 0 12-5.4 12-12V160c0-6.6-5.4-12-12-12h-38.4c-6.6 0-12 5.4-12 12v148c0 6.6 5.4 12 12 12zm-192 0h38.4c6.6 0 12-5.4 12-12V96c0-6.6-5.4-12-12-12h-38.4c-6.6 0-12 5.4-12 12v212c0 6.6 5.4 12 12 12zm-96 0h38.4c6.6 0 12-5.4 12-12v-72c0-6.6-5.4-12-12-12h-38.4c-6.6 0-12 5.4-12 12v72c0 6.6 5.4 12 12 12zM496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" />
            </svg>,
            title: 'Get automated analysis on your solutions',
            description: 'Not sure how well you did? We provide instant feedback with step-by-step solutions and improvement suggestions.',
        },
    ];

    return (
        <section className="w-full bg-white relative overflow-hidden flex justify-center flex-col px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16 md:py-20 lg:py-24 gap-10">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--accent-color)]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[var(--secondary-color)]/5 to-transparent rounded-full blur-3xl" />

            <article className='w-full  relative z-10 flex gap-10 flex-col'>
                <div className="w-full flex flex-col lg:flex-row gap-6">
                    {/* Section header */}
                    <motion.div
                        className="pb-3 flex flex-col lg:w-1/2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className='flex flex-col'>
                            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-2">
                                Over {' '}
                                <span className="text-[var(--secondary-color)] relative inline-block">
                                    210 math exercises.
                                    <motion.svg
                                        className="absolute -bottom-2 left-0 w-full"
                                        viewBox="0 0 200 8"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                    >
                                        <motion.path
                                            d="M0 4 Q50 0 100 4 Q150 8 200 4"
                                            fill="none"
                                            stroke="var(--secondary-color)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ delay: 0.8, duration: 0.8 }}
                                        />
                                    </motion.svg>
                                </span>
                            </h2>
                            <p className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-4">
                                From "Algebra Basics" to "Calculus Puzzles".
                            </p>
                            <p className="text-sm sm:text-xl md:text-2xl max-w-3xl font-light">
                                Learn by doing. Get better at mathematics through fun problem-solving that builds your understanding of concepts.
                            </p>
                        </div>

                    </motion.div>

                    {/* Exercise cards grid */}
                    <div className="flex flex-col gap-3 lg:w-1/2">
                        {exercises.map((exercise, index) => (
                            <motion.div
                                key={exercise.title}
                                className="bg-white rounded-md transition-all duration-300 p-3 sm:py-3 px-5 shadow-[10px_0_25px_rgba(141,153,174,0.3)] flex items-center gap-6 h-22"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                            >
                                <div className='flex'>
                                    {exercise.icon}
                                </div>
                                <div className='flex flex-col justify-center w-full'>
                                    {/* Title */}
                                    <h3 className="text-lg sm:text-xl font-bold text-[var(--secondary-color)]">
                                        {exercise.title}
                                    </h3>
                                    {/* Description */}
                                    <p className="text-[var(--secondary-color)] font-light text-sm sm:text-base">
                                        {exercise.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className='w-full'>
                    <img src={Screenshot} alt="List of the problems" className='rounded-md w-full shadow-[10px_0_25px_rgba(141,153,174,0.3)]' />
                </div>
            </article>

            {/* Features list */}
            <div className="flex gap-8 sm:gap-10 md:gap-12 flex-col lg:flex-row ">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        className="flex flex-col items-start text-left w-full lg:w-1/3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                    >
                        {/* Icon */}
                        <div className="pb-2 sm:pb-4">
                            {feature.icon}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-[var(--secondary-color)] pb-1 sm:pb-2">
                            {feature.title}
                        </h3>

                        {/* Description */}
                        <p className="text-[var(--secondary-color)] font-light text-sm sm:text-base">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ExercisesSection;
