//Imports
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Logo from '../../assets/logo/TransparentFullLogo.png';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import GuestAvatar from '../../assets/images/guestAvatar.png';
import Sidebar from '../Sidebar';
import Dropdown from '../Dropdown';
import OverflowChecker from "../../pages/OverflowChecker";
//Dropdown svgs
import Daily from '../../assets/images/questionMark.svg';
import Leaderboards from '../../assets/images/leaderboards.svg';
import Favourite from '../../assets/images/favourite.svg';
import Mentoring from '../../assets/images/mentoring.svg';
import Faq from '../../assets/images/faq.svg';
import AboutUs from '../../assets/images/about.svg';
import Statistics from '../../assets/images/statistics.svg';
import Updates from '../../assets/images/updates.svg';
import Notifications from '../../assets/images/notificationsDD.svg';
import Achievements from '../../assets/images/achievementsDD.svg';
import Events from '../../assets/images/specialEvents.svg';
import { getDailyProblemSlug } from '../../lib/utils';
import Books from '../../assets/images/learningBooks.svg';

const NavigationBar = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dailyProblemSlug, setDailyProblemSlug] = useState('');

    useEffect(() => {
        const loadDailyProblem = async () => {
            try {
                const slug = await getDailyProblemSlug();
                setDailyProblemSlug(slug);
            } catch (error) {
                console.error('Failed to load daily problem:', error);
            }
        };
        loadDailyProblem();
    }, []);

    const learnItems = [
        {
            to: `/problems/${dailyProblemSlug}`,
            text: "Daily Problem",
            description: "Solve a fresh daily challenge.",
            image: Daily
        },
        // Hidden for MVP - will be added after launch
        // {
        //   to: '/learn',
        //   text: "Your Track",
        //   description: "Track topics and problems solved.",
        //   image: Journey
        // },
        {
            to: '/learn',
            text: "Browse Problems",
            description: "Explore all available challenges.",
            image: Books
        },
        // {
        //   to: "/learn",
        //   text: "Favourite Problems",
        //   description: "Quickly revisit starred problems.",
        //   image: Favourite,
        //   state: { filter: 'favourite' }
        // }
    ]

    const discoverItems = [
        // Hidden for MVP - will be added after launch
        // {
        //   to: '/recommended',
        //   text: "Recommended for You",
        //   description: "Personalized problem suggestions.",
        //   image: Choice
        // },
        {
            to: '/leaderboards/global',
            text: "Leaderboards",
            description: "Join competitions and leaderboards.",
            image: Leaderboards
        },
        {
            to: "/learn",
            text: "Favourite Problems",
            description: "Quickly revisit starred problems.",
            image: Favourite,
            state: { filter: 'favourite' }
        },
        {
            to: '/waitlist',
            text: "Join Waitlist",
            description: "Get early access to full launch.",
            image: Daily
        },
        // Hidden for MVP - will be added after launch
        // {
        //   to: "/",
        //   text: "Learning Paths",
        //   description: "Curated sequences of related problems.",
        //   image: Progress
        // }
    ]

    const moreItems = [
        {
            to: '/applymentor',
            text: "Teacher/Mentor Mode",
            description: "Monitor students or children's progress.",
            image: Mentoring
        },
        {
            to: '/helpCenter',
            text: "Help Center",
            description: "FAQs and platform support.",
            image: Faq
        },
        {
            to: "/about",
            text: "About equathora",
            description: "Learn about its mission and vision.",
            image: AboutUs
        }
    ]

    const notificationItems = [
        // {
        //     to: '/notifications',
        //     text: "All Notifications",
        //     description: "View everything at once.",
        //     image: Notifications,
        //     notificationsNo: "4"
        // },
        {
            to: '/systemupdates',
            text: "System Updates",
            description: "Check out our new features",
            image: Updates,
            notificationsNo: "3"
        }
    ];

    const achievementItems = [
        {
            to: '/achievements/recent',
            text: "All Achievements & Badges",
            description: "See all unlocked badges.",
            image: Achievements
        },
        {
            to: '/achievements/stats',
            text: "Statistics",
            description: "Your learning progress overview",
            image: Statistics
        },
        {
            to: '/achievements/events',
            text: "Special Events",
            description: "Seasonal or limited-time achievements.",
            image: Events
        }
    ];

    const profileItems = [
        {
            to: '/profile/myprofile',
            text: "My Profile",
            description: "View and edit your profile",
            image: GuestAvatar
        }
        // Hidden for MVP
        // {
        //   to: '/logout',
        //   text: "Sign Out",
        //   description: "Securely log out of your account",
        //   image: LogoutIMG
        // },
        // {
        //   to: '/premium',
        //   text: "Upgrade to Premium",
        //   description: "Access unlimited mentor guidance and exam-mode practice.",
        //   image: Premium
        // }
    ];

    return (
        <>
            <OverflowChecker></OverflowChecker>
            <motion.header
                className='w-full bg-[var(--main-color)] h-[60px] sm:h-[70px] md:h-[7.5vh] shadow-[0_10px_25px_rgba(0,0,0,0.18)] fixed top-0 z-[1000] overflow-visible box-border'
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <nav aria-label="Primary" className='w-full h-full flex justify-center'>
                    <div className='w-full h-full flex items-center justify-between px-4 sm:px-6 md:px-[4vw] xl:px-[6vw] max-w-[1500px]' style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                        <ul className='flex justify-start items-center list-none flex-1 min-w-0 overflow-visible'>
                            <li>
                                <Link to="/dashboard" className='text-[var(--secondary-color)] flex justify-center items-center list-none font-bold'>
                                    <img src={Logo} alt="Logo" className='w-28 sm:w-32 md:w-36 lg:w-40 object-scale-down object-center scale-110' />
                                </Link>
                            </li>
                            <li className='pl-6 lg:pl-4 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>
                                <Dropdown
                                    label="Learn"
                                    items={learnItems} />
                            </li>
                            <li className='pl-6 lg:pl-4 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>
                                <Dropdown
                                    label="Discover"
                                    items={discoverItems}
                                />
                            </li>
                            <li className='pl-6 lg:pl-4 shrink-0 max-md:hidden  text-[var(--secondary-color)]'><Dropdown
                                label="More"
                                items={moreItems} />
                            </li>
                        </ul>

                        <div className='flex justify-end items-center shrink-0'>
                            <ul className='flex items-center list-none h-[7.5vh] overflow-visible'>
                                <li className='pl-3 sm:pl-4 lg:pl-4 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>
                                    <Link to="/about"
                                        className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-sm sm:text-base text-center text-gray-700 transition-colors hover:border-[var(--accent-color)] hover:!text-[var(--accent-color)]">Learn More</Link>
                                </li>
                                <li className='pl-3 sm:pl-4 lg:pl-4 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>
                                    <Link to="/learn"
                                        className=" border-3 border-[var(--accent-color)] !text-[var(--accent-color)] px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-sm sm:text-base text-center transition-all duration-150 hover:!text-[var(--dark-accent-color)]  hover:border-[var(--dark-accent-color)] ">Explore Problems</Link>
                                </li>
                                <li className='pl-3 sm:pl-4 lg:pl-4 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>
                                    <Link to="/learn"
                                        className="border-3 border-[var(--mid-main-secondary)] !text-black bg-[var(--mid-main-secondary)] px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-sm sm:text-base text-center transition-all hover:border-[var(--mid-main-secondary)]/10 hover:bg-[var(--mid-main-secondary)]/70">Start Learning</Link>


                                </li>
                                <li className='pl-6 lg:pl-4 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>

                                </li>
                                <li className='pl-6 lg:pl-4'>
                                    <button
                                        type="button"
                                        className='h-[7.5vh] flex items-center justify-center transition-colors duration-200 cursor-pointeration bg-transparent border-none text-[var(--secondary-color)] hover:text-[var(--accent-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]'
                                        onClick={() => setSidebarOpen(true)}
                                        aria-label="Open navigation menu"
                                        aria-expanded={sidebarOpen}
                                        aria-controls="mobile-navigation"
                                    >
                                        <FaBars size={24} className='hidden max-md:block' aria-hidden="true" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </motion.header>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    );
};

export default NavigationBar;