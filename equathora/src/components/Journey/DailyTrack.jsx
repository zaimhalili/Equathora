import React from 'react';
import {
    FaBullseye,
    FaPlay,
    FaClock,
    FaBolt,
    FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DailyTrack = () => {
    return (
        <section className="w-full rounded-2xl bg-[var(--main-color)] border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between">
                {/*  */}
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-[var(--accent-color)] flex items-center justify-center text-white">
                        <FaBullseye size={20} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">
                            Daily Mission
                        </h2>
                        <p className="text-sm text-[var(--secondary-color)]">
                            Stay consistent and keep your streak alive.
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 text-[var(--secondary-color)] font-bold">
                    <svg className="w-4 h-4" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="icon-gradient-fire-sidebar" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                <stop offset="100%" stopColor="var(--accent-color)" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#icon-gradient-fire-sidebar)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
                    </svg> 15 Day Streak
                </div>
            </div>

            {/* Progress */}

            <div className="py-6">
                <div className="flex justify-between pb-2">
                    <span className="font-semibold">
                        Today's Goal
                    </span>

                    <span className="text-[var(--secondary-color)]">
                        12 / 20 min
                    </span>
                </div>
                <div className="h-3 rounded-full bg-[var(--secondary-color)]/30 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent-color),var(--dark-accent-color))]"
                        style={{ width: "60%" }}
                    />
                </div>

            </div>

            {/* Continue */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col md:flex-row md:justify-between gap-5 md:items-end">
                <div>
                    <div className="text-xs uppercase tracking-wider opacity-70 pb-2">
                        Continue Learning
                    </div>

                    <h3 className="text-xl font-bold">
                        Modular Arithmetic #6
                    </h3>

                    <div className="pt-3 flex flex-wrap gap-5 text-[var(--secondary-color)]">

                        <div className="flex items-center gap-2">
                            <FaClock />
                            ~10 min
                        </div>

                        <div className="flex items-center gap-2 text-[var(--rare-blue)]">
                            <FaBolt />
                            + 40 XP
                        </div>

                    </div>

                </div>

                <Link
                    to="/problem/1"
                    className="px-8 py-3 rounded-xl bg-[linear-gradient(0deg,var(--accent-color),var(--dark-accent-color))] !text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-[linear-gradient(0deg,var(--dark-accent-color),var(--dark-accent-color))]"
                >
                    <FaPlay />
                    Continue
                    <FaArrowRight />
                </Link>

            </div>

        </section>
    );
};

export default DailyTrack;