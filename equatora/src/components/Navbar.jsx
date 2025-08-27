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
              { to: '/learn', text:"Your Track" },
              { to: "/", text: "Home" }
            ]} /></li>
          <li className='hide-navbar'>
            <Dropdown
              label="Discover"
              items={[
                { text: "Your Track", to: "/discover" },
                { text: "Web Dev", to: "/discover" }
              ]}
            /></li>
          <li className='hide-navbar'><Dropdown
            label="More"
            items={[
              { text: "Web Dev", to: "/discover" },
              { text: "Web Dev", to: "/discover" }
            ]} /></li>
        </ul>

        <div id='nb-sb'>
          <ul id="navbar-right">
            <li className='hide-navbar'>
              <Link to="/notifications" id='notifications' className='navbar-icon-link'>
                <FaBell size={24} />
              </Link>
            </li>
            <li className='hide-navbar'>
              <Link to="/achievements" id='achievements' className='navbar-icon-link'>
                <FaTrophy size={24} />
              </Link>
            </li>
            <li className='hide-navbar'><Link to="/profile"><img src={GuestAvatar} alt="avatar" id='avatarIMG' /></Link></li>
            <li><aside id="sidebar-icon" onClick={() => setSidebarOpen(true)}>
              <img src={Menu} alt="sidebar" id='menu-icon' />
            </aside></li>
          </ul>

        </div>


      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;