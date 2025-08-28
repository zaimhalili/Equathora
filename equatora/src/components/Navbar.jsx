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

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const notificationItems = [
    {
      to: '/notifications',
      text: "New Achievement",
      description: "You've completed 5 problems!",
      image: GuestAvatar
    },
    {
      to: '/notifications',
      text: "Daily Reminder",
      description: "Don't forget your daily problem",
      image: GuestAvatar
    },
    {
      to: '/notifications',
      text: "System Update",
      description: "Check out our new features",
      image: GuestAvatar
    }
  ];

  const achievementItems = [
    {
      to: '/achievements/recent',
      text: "Recent Achievements",
      description: "View your latest accomplishments",
      image: GuestAvatar
    },
    {
      to: '/achievements/stats',
      text: "Statistics",
      description: "Your learning progress overview",
      image: GuestAvatar
    },
    {
      to: '/achievements/badges',
      text: "Badges",
      description: "Collection of earned badges",
      image: GuestAvatar
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
      image: GuestAvatar
    },
    {
      to: '/logout',
      text: "Sign Out",
      description: "Securely log out of your account",
      image: GuestAvatar
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
            items={[
              {
                to: '/learn',
                text: "Your Track",
                description: "Track topics and problems solved.",
                image: GuestAvatar
              },
              {
                to: "/",
                text: "Daily Problem",
                description: "Solve a fresh daily challenge.",
                image: GuestAvatar
              },
              {
                to: "/",
                text: "Saved Problems",
                description: "Quickly revisit starred problems.",
                image: GuestAvatar
              }
            ]} /></li>
          <li className='hide-navbar'>
            <Dropdown
              label="Discover"
              items={[
                {
                  to: '/learn',
                  text: "Recommended for You",
                  description: "Personalized problem suggestions.",
                  image: GuestAvatar
                },
                {
                  to: '/learn',
                  text: "Leaderboards",
                  description: "Join competitions and leaderboards.",
                  image: GuestAvatar
                },
                {
                  to: "/",
                  text: "Learning Paths",
                  description: "Curated sequences of related problems.",
                  image: GuestAvatar
                }
              ]}
            /></li>
          <li className='hide-navbar'><Dropdown
            label="More"
            items={[
              {
                to: '/learn',
                text: "Teacher/Tutor Mode",
                description: "Monitor students or children's progress.",
                image: GuestAvatar
              },
              {
                to: '/learn',
                text: "Help Center",
                description: "FAQs and platform support.",
                image: GuestAvatar
              },
              {
                to: "/",
                text: "About Equatora",
                description: "Learn about mission and vision.",
                image: GuestAvatar
              }
            ]} /></li>
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