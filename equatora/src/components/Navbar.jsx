import React from 'react';
import './Navbar.css';
import Logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <header id='navbar'>
        <div id="navbar-left">
          <img src={Logo} alt="Logo" />
          <h3 id='navbar-name'>equatora</h3>
        </div>

        <div id="navbar-middle">
          <Link to="/learn" className="navbar-learn" id='navbar-learn'>
            Learn
          </Link>
          <Link to="/discover" className="navbar-discover" id='navbar-discover'>
            Discover
          </Link>
          <Link to="/more" className="navbar-more" id='navbar-more'>
            More
          </Link>
          {/* <button></button> */}
        </div>
        <div id="navbar-right">
          <Link to="/notifications" className="navbar-notifications" id='navbar-notifications'>
            <img src="" alt="" />
          </Link>
          <Link to="/achievements" className="navbar-achievements" id='navbar-achievements'>
            <img src="" alt="" />
          </Link>
          <Link to="/profile" className="navbar-profile" id='navbar-profile'>
            <img src="" alt="" />
          </Link>
        </div>
      </header>
    </>
  );
};

export default Navbar;