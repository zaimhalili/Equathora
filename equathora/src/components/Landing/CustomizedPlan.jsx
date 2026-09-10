import React from 'react';
import { Link } from 'react-router-dom';
import ScreenshotLight from "../../assets/images/SigmaStepLight.png";

const CustomizedPlan = () => {
    return (
        <div className='flex justify-center'>
            <section className='max-w-[1500px] mx-auto w-full bg-[var(--white)] relative overflow-hidden flex justify-center flex-col px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16 md:py-20 lg:py-24 gap-10'>
                <article className='flex flex-col'>
                    {/* Top Section */}
                    <div className="flex">
                        <div className="flex flex-col">
                            <h3>Advanced Analytics</h3>
                            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-2">Know your weak spots before test day</h2>
                            <Link to='/signup' className='rounded-full bg-red-800 py-3 px-4 w-fit !text-white'>Get started for free</Link>
                        </div>
                        <div className="flex">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam accusantium, reprehenderit error sint eaque sed libero totam.</p>
                        </div>
                    </div>
                    {/* Image details */}
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-3 max-w-2/3 p-4 rounded-md bg-[var(--main-color)] overflow-hidden">
                            <img src={ScreenshotLight} alt="" />
                            <h4>Know exactly where you stand</h4>   
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor labore sequi, nam perferendis dolores vitae.</p>
                        </div>
                        <div className="flex flex-col gap-3 max-w-1/3">
                            <div className="flex flex-col gap-3 p-4 rounded-md overflow-hidden bg-[var(--main-color)]">
                                <img src={ScreenshotLight} alt="" />
                                <h4>Know exactly where you stand</h4>
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor labore sequi, nam perferendis dolores vitae.</p>
                            </div>
                            <div className="flex flex-col gap-3 p-4 rounded-md overflow-hidden bg-[var(--main-color)]">
                                <img src={ScreenshotLight} alt="" />
                                <h4>Know exactly where you stand</h4>
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor labore sequi, nam perferendis dolores vitae.</p>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
};

export default CustomizedPlan;