import React from 'react';
import LilArrow from '../assets/images/lilArrow.svg';
import Mentor from '../assets/images/mentoring.svg';
import { Link } from 'react-router-dom';

const YourTrack = () => {
    const solved = 10;
    const total = 50;
    const percentage = (solved / total) * 100;
    const nextMilestone = Math.ceil(solved / 10) * 10;
    const toNextMilestone = nextMilestone - solved;

    // Additional stats
    const currentStreak = 5;
    const bestStreak = 8;
    const avgAccuracy = 87;

    return (
        <article className="flex flex-col lg:flex-row items-start justify-center w-full text-[var(--secondary-color)] px-[4vw] xl:px-[12vw]" style={{ marginTop: '2rem', paddingBottom: '6vh', gap: '2rem' }}>
            <div className="flex flex-col w-full lg:w-[55%]" style={{ gap: '0.75rem', padding: '0' }}>
                <div className="flex items-center justify-between" style={{ padding: '0' }}>
                    <h3 className="font-[Inter] text-[var(--secondary-color)] text-3xl font-bold">
                        Your Track
                    </h3>
                    <span className="text-sm font-semibold text-[var(--accent-color)] bg-[rgba(217,4,41,0.1)] px-3 py-1 rounded-md">
                        Level {Math.floor(solved / 10) + 1}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between w-full" style={{ gap: '0.75rem', padding: '0' }}>
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
                <div className="flex items-center justify-between" style={{ padding: '0' }}>
                    <div className="font-[Inter] text-base">
                        <span className="font-bold text-lg">{solved}</span>{' '}/{' '}{total}
                        <span className="text-sm pl-1">Problems Solved</span>
                    </div>
                    <div className="text-s">
                        <span className="font-semibold">{toNextMilestone}</span> to next milestone
                    </div>
                </div>

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-3" style={{ gap: '0.75rem', marginTop: '0.5rem', padding: '0' }}>
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md border border-[rgba(43,45,66,0.1)] shadow-sm" style={{ padding: '0.75rem' }}>
                        <div className="text-xs text-[var(--french-gray)] font-medium" style={{ marginBottom: '0.25rem' }}>Current Streak</div>
                        <div className="text-2xl font-bold text-[var(--accent-color)] flex items-center" style={{ gap: '0.25rem' }}>
                            🔥 {currentStreak}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md border border-[rgba(43,45,66,0.1)] shadow-sm" style={{ padding: '0.75rem' }}>
                        <div className="text-xs text-[var(--french-gray)] font-medium" style={{ marginBottom: '0.25rem' }}>Best Streak</div>
                        <div className="text-2xl font-bold text-[var(--secondary-color)] flex items-center" style={{ gap: '0.25rem' }}>
                            ⚡ {bestStreak}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[rgba(237,242,244,0.8)] to-white rounded-md border border-[rgba(43,45,66,0.1)] shadow-sm" style={{ padding: '0.75rem' }}>
                        <div className="text-xs text-[var(--french-gray)] font-medium" style={{ marginBottom: '0.25rem' }}>Accuracy</div>
                        <div className="text-2xl font-bold text-[var(--secondary-color)]">
                            {avgAccuracy}%
                        </div>
                    </div>
                </div>
            </div>
            {/* Mentor CTA Section */}
            <div className="w-full lg:w-[45%]" style={{ padding: '0' }}>
                <div className="w-full bg-white border border-[rgba(43,45,66,0.12)] rounded-md" style={{ padding: '2rem' }}>
                    {/* Header with Badge */}
                    <div className="flex items-start justify-between" style={{ marginBottom: '1rem' }}>
                        <div>
                            <h3 className="font-[Inter] font-semibold text-xl text-[var(--secondary-color)]" style={{ marginBottom: '0.375rem', lineHeight: '1.3' }}>
                                Become a Mentor
                            </h3>
                            <div className="flex items-center" style={{ gap: '0.5rem' }}>
                                <span className="text-xs font-medium text-[var(--accent-color)] bg-[rgba(217,4,41,0.08)] rounded" style={{ padding: '0.25rem 0.5rem' }}>
                                    FREE TO JOIN
                                </span>
                            </div>
                        </div>
                        <img src={Mentor} alt="Mentor" className="opacity-90" style={{ width: '56px', height: '56px' }} />
                    </div>

                    {/* Value Proposition */}
                    <p className="font-[Inter] text-[0.9375rem] text-[var(--secondary-color)] leading-relaxed opacity-90" style={{ marginBottom: '1.5rem' }}>
                        Guide learners, reinforce your expertise, and make a meaningful impact in the mathematics community.
                    </p>

                    {/* Benefits List */}
                    <div className="flex flex-col" style={{ gap: '0.625rem', marginBottom: '1.5rem' }}>
                        <div className="flex items-start" style={{ gap: '0.625rem' }}>
                            <span className="text-[var(--accent-color)] font-bold" style={{ fontSize: '0.875rem', marginTop: '0.125rem' }}>✓</span>
                            <span className="font-[Inter] text-[0.875rem] text-[var(--secondary-color)] opacity-80">Flexible scheduling that fits your lifestyle</span>
                        </div>
                        <div className="flex items-start" style={{ gap: '0.625rem' }}>
                            <span className="text-[var(--accent-color)] font-bold" style={{ fontSize: '0.875rem', marginTop: '0.125rem' }}>✓</span>
                            <span className="font-[Inter] text-[0.875rem] text-[var(--secondary-color)] opacity-80">Strengthen understanding through teaching</span>
                        </div>
                        <div className="flex items-start" style={{ gap: '0.625rem' }}>
                            <span className="text-[var(--accent-color)] font-bold" style={{ fontSize: '0.875rem', marginTop: '0.125rem' }}>✓</span>
                            <span className="font-[Inter] text-[0.875rem] text-[var(--secondary-color)] opacity-80">Build your professional portfolio</span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex" style={{ gap: '0.75rem' }}>
                        <Link
                            to="/applymentor"
                            className="font-[Inter] font-semibold text-[0.9375rem] !text-white bg-[var(--secondary-color)] rounded no-underline transition-all duration-200 hover:bg-[var(--raisin-black)] text-center flex-1"
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            Apply Now
                        </Link>
                        <Link
                            to="/applymentor"
                            className="font-[Inter] font-medium text-[0.9375rem] text-[var(--secondary-color)] bg-transparent border border-[rgba(43,45,66,0.2)] rounded no-underline transition-all duration-200 hover:border-[var(--secondary-color)] hover:bg-[rgba(43,45,66,0.02)] text-center"
                            style={{ padding: '0.75rem 1.5rem' }}
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