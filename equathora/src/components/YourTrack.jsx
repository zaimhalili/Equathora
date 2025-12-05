import React from 'react';
import LilArrow from '../assets/images/lilArrow.svg';
import Mentor from '../assets/images/mentoring.svg';
import { Link } from 'react-router-dom';

const YourTrack = () => {
    const solved = 30;
    const total = 50;
    const percentage = (solved / total) * 100;
    const nextMilestone = Math.ceil(solved / 10) * 10;
    const toNextMilestone = nextMilestone - solved;

    // Additional stats
    const currentStreak = 5;
    const bestStreak = 8;
    const avgAccuracy = 87;

    return (
        <article className="flex flex-col lg:flex-row items-start justify-center w-full text-[var(--secondary-color)] px-[4vw] xl:px-[12vw] mt-8 pb-[6vh] gap-8">
            <div className="flex flex-col w-full lg:w-[55%] gap-3 p-0">
                <div className="flex items-center justify-between p-0">
                    <h3 className="font-[Inter] text-[var(--secondary-color)] text-3xl font-bold">
                        Your Track
                    </h3>
                    <span className="text-sm font-semibold text-[var(--accent-color)] bg-[rgba(217,4,41,0.1)] px-3 py-1 rounded-md">
                        Level {Math.floor(solved / 10) + 1}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between w-full gap-3 p-0">
                    <Link
                        to="/problems"
                        className="flex-1 h-6 bg-[var(--french-gray)] rounded-md flex items-center relative transition-all duration-300 overflow-hidden group"
                    >
                        <div
                            className="h-full rounded-md bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] transition-all duration-500 relative"
                            style={{ width: `${percentage}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </Link>
                    <Link
                        to="/problems"
                        className="w-10 h-10 flex items-center justify-center transition-transform duration-300 ease-in hover:translate-x-2 hover:scale-110"
                    >
                        <img src={LilArrow} alt="arrow" className="w-full h-full" />
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between p-0">
                    <div className="font-[Inter] text-base">
                        <span className="font-bold text-lg">{solved}</span>{' '}/{' '}{total}
                        <span className="text-sm pl-1">Problems Solved</span>
                    </div>
                    <div className="text-s">
                        <span className="font-semibold">{toNextMilestone}</span> to next milestone
                    </div>
                </div>

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mt-2 p-0">
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-[3px] border border-[rgba(43,45,66,0.1)] shadow-[0_10px_10px_rgba(141,153,174,0.3)] p-3">
                        <div className="text-xs text-[var(--secondary-color)] font-medium mb-1">Current Streak</div>
                        <div className="text-2xl font-bold text-[var(--accent-color)] flex items-center gap-1">
                            🔥 {currentStreak}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-[3px] border border-[rgba(43,45,66,0.1)] shadow-[0_10px_10px_rgba(141,153,174,0.3)] p-3">
                        <div className="text-xs text-[var(--secondary-color)] font-medium mb-1">Best Streak</div>
                        <div className="text-2xl font-bold text-[var(--secondary-color)] flex items-center gap-1">
                            ⚡ {bestStreak}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-[3px] border border-[rgba(43,45,66,0.1)] shadow-[0_10px_10px_rgba(141,153,174,0.3)] p-3">
                        <div className="text-xs text-[var(--secondary-color)] font-medium mb-1">Accuracy</div>
                        <div className="text-2xl font-bold text-[var(--secondary-color)]">
                            {avgAccuracy}%
                        </div>
                    </div>
                </div>
            </div>
            {/* Mentor CTA Section */}
            <div className="w-full lg:w-[45%] p-0">
                <div className="w-full bg-white border border-[rgba(43,45,66,0.12)] rounded-[3px] p-8">
                    {/* Header with Badge */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="font-[Inter] font-semibold text-xl text-[var(--secondary-color)] mb-1.5 leading-[1.3]">
                                Become a Mentor
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-[var(--accent-color)] bg-[rgba(217,4,41,0.08)] rounded py-1 px-2">
                                    FREE TO JOIN
                                </span>
                            </div>
                        </div>
                        <img src={Mentor} alt="Mentor" className="opacity-90 w-14 h-14" />
                    </div>

                    {/* Value Proposition */}
                    <p className="font-[Inter] text-[0.9375rem] text-[var(--secondary-color)] leading-relaxed opacity-90 mb-6">
                        Guide learners, reinforce your expertise, and make a meaningful impact in the mathematics community.
                    </p>

                    {/* Benefits List */}
                    <div className="flex flex-col gap-2.5 mb-6">
                        <div className="flex items-start gap-2.5">
                            <span className="text-[var(--accent-color)] font-bold text-sm mt-0.5">✓</span>
                            <span className="font-[Inter] text-sm text-[var(--secondary-color)] opacity-80">Flexible scheduling that fits your lifestyle</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="text-[var(--accent-color)] font-bold text-sm mt-0.5">✓</span>
                            <span className="font-[Inter] text-sm text-[var(--secondary-color)] opacity-80">Strengthen understanding through teaching</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="text-[var(--accent-color)] font-bold text-sm mt-0.5">✓</span>
                            <span className="font-[Inter] text-sm text-[var(--secondary-color)] opacity-80">Build your professional portfolio</span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-3">
                        <Link
                            to="/applymentor"
                            className="font-[Inter] font-semibold text-[0.9375rem] !text-white bg-[var(--secondary-color)] rounded-[3px] no-underline transition-all duration-200 hover:bg-[var(--raisin-black)] text-center flex-1 py-3 px-6"
                        >
                            Apply Now
                        </Link>
                        <Link
                            to="/applymentor"
                            className="font-[Inter] font-medium text-[0.9375rem] text-[var(--secondary-color)] bg-transparent border border-[rgba(43,45,66,0.2)] rounded-[3px] no-underline transition-all duration-200 hover:border-[var(--secondary-color)] hover:bg-[rgba(43,45,66,0.02)] text-center py-3 px-6"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default YourTrack;