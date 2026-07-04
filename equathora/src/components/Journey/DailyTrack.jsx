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
        <section className="w-full rounded-2xl bg-[var(--main-color)] border border-white/10 p-6">

            <div className="flex items-center justify-between">
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

                <div className="hidden md:flex items-center gap-2 text-yellow-400 font-bold">
                    🔥 15 Day Streak
                </div>
            </div>

            {/* Progress */}

            <div className="pt-6">

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

            <div className="pt-8 rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

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

                        <div className="flex items-center gap-2 text-yellow-400">
                            <FaBolt />
                            +40 XP
                        </div>

                    </div>

                </div>

                <Link
                    to="/problem/1"
                    className="px-8 py-3 rounded-xl bg-[linear-gradient(0deg,var(--accent-color),var(--dark-accent-color))] !text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
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