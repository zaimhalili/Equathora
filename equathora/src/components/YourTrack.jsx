import React from 'react';
import LilArrow from '../assets/images/lilArrow.svg';
import Mentor from '../assets/images/mentoring.svg';
import { Link } from 'react-router-dom';

const YourTrack = () => {
    const solved = 10;
    const total = 50;
    const percentage = (solved / total) * 100;

    return (
        <article className="mt-8 w-full text-[var(--secondary-color)] px-[4vw] xl:px-[12vw] pb-[6vh] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0">
            <div className="flex flex-col gap-2 w-full lg:w-1/2 items-cente">
                <h3 className="font-[Inter] text-[var(--secondary-color)] text-3xl font-bold w-full text-center lg:text-left">
                    Your Track
                </h3>
                <div className="flex items-center justify-between w-full">
                    <Link
                        to="/problems"
                        className="w-full sm:w-[80%] h-5 bg-[var(--french-gray)] rounded-2xl flex items-center relative transition-all duration-300 overflow-hidden group"
                    >
                        <div
                            className="h-full rounded-2xl bg-[var(--dark-accent-color)] transition-all duration-300"
                            style={{ width: `${percentage}%`}}
                        />
                    </Link>
                    <Link
                        to="/problems"
                        className="w-1/5 sm:w-auto h-8 flex items-center justify-center sm:justify-start transition-transform duration-300 ease-in sm:ml-4 hover:translate-x-[15px]"
                    >
                        <img src={LilArrow} alt="arrow" className="h-full w-12" />
                    </Link>
                </div>
                <div className="font-[Inter] text-base lg:pl-[2vw] text-center lg:text-left">
                    <span className="font-bold">{solved}</span>/
                    <span>{total}</span> Problems Solved
                </div>
            </div>

            <div className="w-60 lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
                <div className="w-full max-w-[500px] flex justify-center flex-col bg-white shadow-[0_10px_10px_rgba(141,153,174,0.3)] rounded-[3px] text-center items-center p-6">
                    <img src={Mentor} alt="Mentoring icon" className="w-[100px] h-[100px]" />
                    <p className="font-[Public_Sans] font-bold text-lg text-[var(--secondary-color)] pt-5">
                        Become a mentor
                    </p>
                    <p className="font-[Public_Sans] text-md font-normal text-[var(--secondary-color)] pb-2.5">
                        Mentoring is a great way to reinforce your own learning, and help students learn and discover the things they don't know.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
                        <Link
                            to="/applymentor"
                            className="font-[Inter] text-[0.95rem] font-semibold py-3 px-6 rounded-[3px] no-underline transition-all duration-300 cursor-pointer shadow-[inset_0_0_5px_black] bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:-translate-y-0.5 w-full sm:w-auto text-center"
                        >
                            Try mentoring now
                        </Link>
                        <Link
                            to="/applymentor"
                            className="font-[Inter] text-[0.95rem] font-semibold py-3 px-6 rounded-[3px] no-underline transition-all duration-300 cursor-pointer shadow-[inset_0_0_5px_black] bg-transparent text-[var(--secondary-color)] border-[var(--secondary-color)] hover:bg-[var(--french-gray)] hover:-translate-y-0.5 w-full sm:w-auto text-center"
                        >
                            Learn more
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default YourTrack;