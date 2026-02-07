import React, { useState, useEffect } from 'react';
import Logo from '../assets/logo/TransparentFullLogo.png';
import { Link } from 'react-router-dom';
import { FaBell, FaTrophy, FaUser, FaBars } from 'react-icons/fa';
import GuestAvatar from '../assets/images/guestAvatar.png';
import Sidebar from './Sidebar';
import Dropdown from './Dropdown';
import OverflowChecker from "../pages/OverflowChecker";
import { supabase } from '../lib/supabaseClient';
import { clearUserData } from '../lib/userStorage';
import { getStreakData } from '../lib/databaseService';
//Dropdown svgs
import Daily from '../assets/images/questionMark.svg';
import Leaderboards from '../assets/images/leaderboards.svg';
import Favourite from '../assets/images/favourite.svg';
import Premium from '../assets/images/Premium.svg';
import Progress from '../assets/images/Progress.svg';
import Choice from '../assets/images/choice.svg';
import Journey from '../assets/images/journey.svg';
import Mentoring from '../assets/images/mentoring.svg';
import Faq from '../assets/images/faq.svg';
import AboutUs from '../assets/images/about.svg';
import LogoutIMG from '../assets/images/logout.svg';
import Statistics from '../assets/images/statistics.svg';
import Settings from '../assets/images/settings.svg';
import Updates from '../assets/images/updates.svg';
import Notifications from '../assets/images/notificationsDD.svg';
import Teacher from '../assets/images/teacher.svg';
import Achievements from '../assets/images/achievementsDD.svg';
import Events from '../assets/images/specialEvents.svg';
import { getDailyProblemSlug } from '../lib/utils';
import Books from '../assets/images/learningBooks.svg';

const Navbar = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dailyProblemSlug, setDailyProblemSlug] = useState('');
  const [currentStreak, setCurrentStreak] = useState(0);

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

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const streakData = await getStreakData();
        setCurrentStreak(streakData?.current_streak || 0);
      } catch (error) {
        console.error('Failed to fetch streak:', error);
      }
    };
    fetchStreak();

    // Refresh streak on focus
    window.addEventListener('focus', fetchStreak);
    return () => window.removeEventListener('focus', fetchStreak);
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
    //   to: '/tracks',
    //   text: "Tracks",
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
    {
      to: '/notifications',
      text: "All Notifications",
      description: "View everything at once.",
      image: Notifications,
      notificationsNo: ""
    },
    {
      to: '/systemupdates',
      text: "System Updates",
      description: "Check out our new features",
      image: Updates,
      notificationsNo: ""
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
    },
    {
      to: '/settings',
      text: "Settings",
      description: "Manage your account and preferences",
      image: Settings
    },
    {
      text: "Sign Out",
      description: "Securely log out of your account",
      image: LogoutIMG,
      isButton: true,
      onClick: async () => {
        await clearUserData();
        await supabase.auth.signOut();
        window.location.href = '/login';
      }
    }
    // Hidden for MVP
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
      <header className='w-full bg-[var(--main-color)] h-[7.5vh] shadow-[0_10px_25px_rgba(0,0,0,0.18)] sticky top-0 z-[1000] overflow-visible box-border'>
        <nav aria-label="Primary" className='w-full h-full flex justify-center'>
          <div className='w-full h-full mx-auto flex items-center justify-between px-[4vw] xl:px-[6vw] max-w-[1500px]'>
            <ul className='flex justify-start items-center list-none flex-1 min-w-0 overflow-visible'>
              <li>
                <Link to="/dashboard" className='text-[var(--secondary-color)] flex justify-center items-center list-none font-bold'>
                  <img src={Logo} alt="Logo" className='w-40 object-scale-down object-center scale-110' />
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
                <li className='pl-6 lg:pl-4 shrink-0 max-md:hidden text-[var(--secondary-color)]'>
                  <Link to="/achievements/stats" className='flex items-center gap-2 hover:text-[var(--accent-color)] transition-colors'>
                    <svg className="w-6 h-6" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="icon-gradient-fire-navbar" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="var(--dark-accent-color)" />
                          <stop offset="100%" stopColor="var(--accent-color)" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#icon-gradient-fire-navbar)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
                    </svg>
                    <span className='font-bold'>{currentStreak}</span>
                  </Link>
                </li>
                <li className='pl-6 lg:pl-4 shrink-0 max-md:hidden text-[var(--secondary-color)]'>
                  <Dropdown
                    label={<FaBell size={24} />}
                    ariaLabel="Notifications menu"
                    items={notificationItems}
                    alignRight={true}
                  />
                </li>
                <li className='pl-6 lg:pl-4 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>
                  <Dropdown
                    label={<FaTrophy size={24} />}
                    ariaLabel="Achievements menu"
                    items={achievementItems}
                    alignRight={true}
                  />
                </li>
                <li className='pl-6 lg:pl-4 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>
                  <Dropdown
                    label={<FaUser size={24} />}
                    ariaLabel="Profile menu"
                    items={profileItems}
                    alignRight={true}
                  />
                </li>
                <li className='pl-6 lg:pl-4'>
                  <button
                    type="button"
                    className='h-[7.5vh] flex items-center justify-center transition-colors duration-200 cursor-pointer bg-transparent border-none text-[var(--secondary-color)] hover:text-[var(--accent-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]'
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
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;