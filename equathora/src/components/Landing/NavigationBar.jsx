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
                className='w-full bg-[var(--main-color)] py-2 fixed top-0 z-[1000] overflow-visible box-border border-b-2 border-[var(--french-gray)]/70 flex justify-center'
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <nav aria-label="Primary" className='w-full h-full mx-auto flex items-center justify-between px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 max-w-[1500px]'>
                    <ul className='flex justify-start items-center list-none flex-1 min-w-0 overflow-visible'>
                        <li className='shrink-0'>
                            <a href='/' className='!text-[var(--secondary-color)] list-none font-bold  text-lg relative pl-5' title='Home'>
                                <img src={Sigma} alt="Logo" className='w-6 h-6 shrink-0 absolute -left-[1px] -top-[5px]' />
                                quathora
                            </a>
                        </li>
                    </ul>

                    <ul className='flex list-none h-full overflow-visible justify-end items-center shrink-0'>
                        <li className='shrink-0 hidden md:block text-[var(--secondary-color)]'>
                            <Link to="/about"
                                className="px-3 sm:py-2 text-xs sm:text-sm text-center !text-[var(--secondary-color)]/70
                                        hover:!text-[var(--secondary-color)] transition-all hover:border-[var(--accent-color)] !font-medium">
                                Learn More
                            </Link>
                        </li>
                        <li className='shrink-0 hidden md:block text-[var(--secondary-color)]'>
                            <Link to="/premium"
                                className="px-3 pr-10 py-1.5 sm:py-2 text-xs sm:text-sm text-center !text-[var(--secondary-color)]/70
                                        hover:!text-[var(--secondary-color)] transition-all hover:border-[var(--accent-color)] !font-medium">
                                Pricing
                            </Link>
                        </li>
                        <li className='shrink-0 hidden md:block text-[var(--secondary-color)]'>
                            <Link
                                to="/signup"
                                className="relative inline-block px-3 sm:px-4 lg:px-5 py-1 text-xs sm:text-sm text-center !text-[var(--secondary-color)]/70 hover:!text-[var(--secondary-color)] transition-all group bg-[var(--white)] rounded-lg brightness-90 hover:brightness-85 !font-medium"
                                style={{ isolation: 'isolate' }}>
                                Log in
                            </Link>
                        </li>
                        <li className='pl-2 shrink-0 text-[var(--secondary-color)]'>
                            <Link
                                to="/signup"
                                className="relative inline-block px-3 sm:px-4 lg:px-5 py-1 text-xs sm:text-sm text-center 
                                        !text-white transition-all group bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] rounded-lg !font-medium hover:bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))]"
                                style={{ isolation: 'isol   ate' }}>
                                Sign up
                            </Link>
                        </li>
                        <li className='pl-6 lg:pl-4 shrink-0'>
                            <button
                                type="button"
                                className='h-full flex items-center justify-center transition-colors duration-200 cursor-pointer bg-transparent border-none text-[var(--secondary-color)] hover:text-[var(--accent-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]'
                                onClick={() => setSidebarOpen(true)}
                                aria-label="Open navigation menu"
                                aria-expanded={sidebarOpen}
                                aria-controls="mobile-navigation">
                                <FaBars size={24} className='block md:hidden' aria-hidden="true" />
                            </button>
                        </li>
                    </ul>
                </nav>
            </motion.header>

            <SidebarLanding isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    );
};

export default NavigationBar;