import React from 'react';
import './Navbar.css';
import Logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';
import Notifications from '../assets/images/notifications.png';
import DarkMode from '../assets/images/dark_mode.png';
import Achievements from '../assets/images/achievements.png';
import GuestAvatar from '../assets/images/guestAvatar.png';

const Navbar = () => {
  return (
    <>
      <header id='navbar'>
        <ul id="navbar-left">
          <Link to="/dashboard" className="navbar-dashboard" id='navbar-dashboard'>
            <li><img src={Logo} alt="Logo" id='navbar-logo' /></li>
            <li><h3 id='navbar-name'>equatora</h3></li>
          </Link>
          
          <li>
            <Link to="/learn" className="navbar-pages" id='navbar-learn'>
              Learn
            </Link>
          </li>

          <li>
            <Link to="/discover" className="navbar-pages" id='navbar-discover'>
              Discover
            </Link>
          </li>

          <li>
            <Link to="/more" className="navbar-pages" id='navbar-more'>
              More
            </Link>
          </li>

          {/* <button></button> */}
        </ul>
        <ul id="navbar-right">
          <li>
            <Link to="/notifications" className="navbar-pages" id='navbar-notifications'>
              <img src={Notifications} alt="notifications" id='notificationsIMG' />
            </Link>
          </li>

          <li>
            <Link to="/achievements" className="navbar-pages" id='navbar-achievements'>
              <img src={Achievements} alt="achievements" id='achievementsIMG' />
            </Link>
          </li>

          <li>
            <Link to="/profile" className="navbar-pages" id='navbar-profile'>
              <img src={GuestAvatar} alt="avatar" id='avatarIMG' />
            </Link>
          </li>

        </ul>
      </header>
    </>
  );
};

export default Navbar;