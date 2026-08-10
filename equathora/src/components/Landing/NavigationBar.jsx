import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import SidebarLanding from './SidebarLanding';
import Sigma from '../../assets/logo/TransparentSymbol.png';

const NavigationBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <motion.header
                className='w-full bg-[var(--main-color)] h-[7.5vh] shadow-[0_10px_25px_rgba(0,0,0,0.18)] fixed top-0 z-[1000] overflow-visible box-border'
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <nav aria-label="Primary" className='w-full h-full flex justify-center'>
                    <div className='w-full h-full mx-auto flex items-center justify-between px-[4vw] xl:px-[6vw] max-w-[1500px]'>
                        <ul className='flex justify-start items-center list-none flex-1 min-w-0 overflow-visible'>
                            <li className='shrink-0'>
                                <a href='/' className='!text-[var(--secondary-color)] flex justify-center items-center list-none font-bold relative' title='Home'>
                                    <img src={Sigma} alt="Logo" className='w-6 h-6 shrink-0' />
                                    <p className='font-[Sansation,Arial] text-lg font-black'>Equathora</p>
                                </a>
                            </li>
                        </ul>

                        <div className='flex justify-end items-center shrink-0'>
                            <ul className='flex items-center list-none h-full overflow-visible'>
                                <li className='pl-3 sm:pl-4 lg:pl-4 shrink-0 hidden md:block text-[var(--secondary-color)]'>
                                    <Link to="/about"
                                        className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-sm sm:text-base text-center text-gray-700 transition-all hover:border-[var(--accent-color)] hover:!text-[var(--accent-color)]">About Equathora</Link>
                                </li>
                                <li className='pl-3 sm:pl-4 lg:pl-4 shrink-0 hidden md:block text-[var(--secondary-color)]'>
                                    <Link
                                        to="/login"
                                        className="relative inline-block px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-sm sm:text-base text-center 
                                        !text-[var(--accent-color)] hover:!text-white transition-colors duration-150 group"
                                        style={{ isolation: 'isolate' }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 rounded-[inherit] p-[2px] 
                                            bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]
                                            transition-opacity duration-150"
                                            style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}
                                        />
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100
                                            bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]
                                            transition-opacity duration-150 -z-10 hover:border-none"
                                        />
                                        Get Started
                                    </Link>
                                </li>
                                <li className='pl-6 lg:pl-4 shrink-0'>
                                    <button
                                        type="button"
                                        className='h-full flex items-center justify-center transition-colors duration-200 cursor-pointer bg-transparent border-none text-[var(--secondary-color)] hover:text-[var(--accent-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]'
                                        onClick={() => setSidebarOpen(true)}
                                        aria-label="Open navigation menu"
                                        aria-expanded={sidebarOpen}
                                        aria-controls="mobile-navigation"
                                    >
                                        <FaBars size={24} className='block md:hidden' aria-hidden="true" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </motion.header>

            <SidebarLanding isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    );
};

export default NavigationBar;
