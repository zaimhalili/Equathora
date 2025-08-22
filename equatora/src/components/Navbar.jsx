// Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css';
import Logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';
import Notifications from '../assets/images/notifications.png';
import Achievements from '../assets/images/achievements.png';
import GuestAvatar from '../assets/images/guestAvatar.png';
import Sidebar from './Sidebar';

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
          <li className='hide-navbar'><Link to="/learn" className='navbar-pages'>Learn</Link></li>
          <li className='hide-navbar'><Link to="/discover" className='navbar-pages'>Discover</Link></li>
          <li className='hide-navbar'><Link to="/more" className='navbar-pages'>More</Link></li>
        </ul>

        <div id='nb-sb'>
          <ul id="navbar-right">
            <li className='hide-navbar'><Link to="/notifications"><img src={Notifications} alt="notifications" /></Link></li>
            <li className='hide-navbar'><Link to="/achievements"><img src={Achievements} alt="achievements" /></Link></li>
            <li className='hide-navbar'><Link to="/profile"><img src={GuestAvatar} alt="avatar" id='avatarIMG' /></Link></li>
            <li><aside id="sidebar-icon" onClick={() => setSidebarOpen(true)}>
              <div className="sidebar-icon-line" />
              <div className="sidebar-icon-line" />
              <div className="sidebar-icon-line" />
            </aside></li>
          </ul>
          
        </div>
        

      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;