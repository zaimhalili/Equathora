//Imports
import React, { useState } from 'react';
import Logo from '../assets/logo/TransparentFullLogo.png';
import { Link } from 'react-router-dom';
import { FaBell, FaTrophy, FaUser } from 'react-icons/fa';
import GuestAvatar from '../assets/images/guestAvatar.png';
import Sidebar from './Sidebar';
import Menu from '../assets/images/menu.svg';
import Dropdown from './Dropdown';
import OverflowChecker from "../pages/OverflowChecker";
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
import Symbol from '../assets/logo/TransparentSymbol.png';

const Navbar = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Later to be implemented with real-time data and user authentication in the backend
  let numberOfProblems = 5;
  let randomId = Math.floor(Math.random() * numberOfProblems) + 1;

  const learnItems = [
    {
      to: `/problems/1/${randomId}`,
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
      to: "/learn",
      text: "Favourite Problems",
      description: "Quickly revisit starred problems.",
      image: Favourite,
      state: { filter: 'favourite' }
    }
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
    }
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
      notificationsNo: "4"
    },
    {
      to: '/notifications',
      text: "From Teachers/Mentors",
      description: "Messages or assignments from mentors.",
      image: Teacher,
      notificationsNo: "1"
    },
    {
      to: '/notifications',
      text: "System Update",
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
    },
    {
      to: '/settings',
      text: "Settings",
      description: "Manage your preferences",
      image: Settings
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
      <header className='w-full max-w-screen bg-[var(--main-color)] h-[9vh] flex items-center justify-between px-[30px] lg:px-5 xl:px-0 py-0 shadow-[0_10px_25px_rgba(0,0,0,0.18)] sticky top-0 z-[1000] overflow-visible box-border'>
        <ul className='flex justify-start items-center list-none flex-1 min-w-0 overflow-visible xl:pl-[12vw]'>
          <li>
            <Link to="/dashboard" className='text-[var(--secondary-color)] flex justify-center items-center list-none font-bold'>
              <img src={Logo} alt="Logo" className='w-40 object-scale-down' />
            </Link>
          </li>
          <li className='pl-4 lg:pl-2 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>
            <Dropdown
              label="Learn"
              items={learnItems} />
          </li>
          <li className='pl-4 lg:pl-2 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>
            <Dropdown
              label="Discover"
              items={discoverItems}
            />
          </li>
          <li className='pl-4 lg:pl-2 shrink-0 max-md:hidden  text-[var(--secondary-color)]'><Dropdown
            label="More"
            items={moreItems} />
          </li>
        </ul>

        <div className='flex justify-end items-center shrink-0'>
          <ul className='flex items-center list-none h-[9vh] overflow-visible xl:pr-[12vw]'>
            <li className='pl-4 lg:pl-2 shrink-0 max-md:hidden text-[var(--secondary-color)]'>
              <Dropdown
                label={<FaBell size={24} />}
                items={notificationItems}
                alignRight={true}
              />
            </li>
            <li className='pl-4 lg:pl-2 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>
              <Dropdown
                label={<FaTrophy size={24} />}
                items={achievementItems}
                alignRight={true}
              />
            </li>
            <li className='pl-4 lg:pl-2 shrink-0 max-md:hidden  text-[var(--secondary-color)]'>
              <Dropdown
                label={<FaUser size={24} />}
                items={profileItems}
                alignRight={true}
              />
            </li>
            <li className='pl-4 lg:pl-2'>
              <aside className='h-[9vh] flex flex-col items-center justify-center gap-[1vh] transition-all duration-200 hover:scale-y-150 cursor-pointer' onClick={() => setSidebarOpen(true)}>
                <img src={Menu} alt="sidebar" className='hidden max-md:block h-[30px] w-[30px]' />
              </aside>
            </li>
          </ul>
        </div>


      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;