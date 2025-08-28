// Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css';
import Logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';
import { FaBell, FaTrophy } from 'react-icons/fa';
import GuestAvatar from '../assets/images/guestAvatar.png';
import Sidebar from './Sidebar';
import Menu from '../assets/images/menu.svg';
import Dropdown from './Dropdown';

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

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const learnItems = [
    {
      to: "/",
      text: "Daily Problem",
      description: "Solve a fresh daily challenge.",
      image: Daily
    },
    {
      to: '/learn',
      text: "Your Track",
      description: "Track topics and problems solved.",
      image: Journey
    },
    {
      to: "/",
      text: "Favourite Problems",
      description: "Quickly revisit starred problems.",
      image: Favourite
    }
  ]

  const discoverItems = [
    {
      to: '/learn',
      text: "Recommended for You",
      description: "Personalized problem suggestions.",
      image: Choice
    },
    {
      to: '/learn',
      text: "Leaderboards",
      description: "Join competitions and leaderboards.",
      image: Leaderboards
    },
    {
      to: "/",
      text: "Learning Paths",
      description: "Curated sequences of related problems.",
      image: Progress
    }
  ]

  const moreItems = [
    {
      to: '/learn',
      text: "Teacher/Mentor Mode",
      description: "Monitor students or children's progress.",
      image: Mentoring
    },
    {
      to: '/learn',
      text: "Help Center",
      description: "FAQs and platform support.",
      image: Faq
    },
    {
      to: "/",
      text: "About Equatora",
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
      to: '/achievements/badges',
      text: "Special Events",
      description: "Seasonal or limited-time achievements.",
      image: Events
    }
  ];

  const profileItems = [
    {
      to: '/profile',
      text: "My Profile",
      description: "View and edit your profile",
      image: GuestAvatar
    },
    {
      to: '/settings',
      text: "Settings",
      description: "Manage your preferences",
      image: Settings
    },
    {
      to: '/logout',
      text: "Sign Out",
      description: "Securely log out of your account",
      image: LogoutIMG
    },
    {
      to: '/logout',
      text: "Upgrade to Premium",
      description: "Access unlimited mentor guidance and exam-mode practice.",
      image: Premium
    }
  ];

  return (
    <>
      <header id="navbar">
        <ul id="navbar-left">
          <li>
            <Link to="/dashboard" className="navbar-dashboard">
              <img src={Logo} alt="Logo" id="navbar-logo" />
            </Link>
          </li>
          <li><Link to="/dashboard"><h3 id="navbar-name">equatora</h3></Link></li>
          <li className='hide-navbar'><Dropdown
            label="Learn"
            items={learnItems} /></li>
          <li className='hide-navbar'>
            <Dropdown
              label="Discover"
              items={discoverItems}
            /></li>
          <li className='hide-navbar'><Dropdown
            label="More"
            items={moreItems} /></li>
        </ul>

        <div id='nb-sb'>
          <ul id="navbar-right">
            <li className='hide-navbar'>
              <Dropdown
                label={<FaBell size={24} />}
                items={notificationItems}
              />
            </li>
            <li className='hide-navbar'>
              <Dropdown
                label={<FaTrophy size={24} />}
                items={achievementItems}
              />
            </li>
            <li className='hide-navbar'>
              <Dropdown
                label={<img src={GuestAvatar} alt="avatar" id='avatarIMG' />}
                items={profileItems}
              />
            </li>
            <li>
              <aside id="sidebar-icon" onClick={() => setSidebarOpen(true)}>
                <img src={Menu} alt="sidebar" id='menu-icon' />
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