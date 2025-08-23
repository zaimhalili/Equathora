import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <footer id='footer-container'>
        <div id="footer-top">
          <div id="left">
            <Link to="/learn" className='footer-links'>Learn</Link>
            <Link to="/discover" className='footer-links'>Discover</Link>
            <Link to="/achievements" className='footer-links'>Achievements</Link>
            <Link to="/notifications" className='footer-links'>Notifications</Link>
            <Link to="/profile" className='footer-links'>My Profile</Link>
          </div>
          <div className="center">
            <h1>
              Your contribution helps us keep this learning platform available for <span style={{ color:'var(--dark-accent-color)'}}>students worldwide</span>
            </h1>
            <div id="socialMedia-container">
              <a href="#" className='socialMedia'></a>
              <a href="#" className='socialMedia'></a>
              <a href="#" className='socialMedia'></a>
            </div>
            <h2>Equatora</h2>
          </div>
          <div id="right">
            <Link to="/" className='footer-links'>About Us</Link>
            <Link to="/" className='footer-links'>Legal & Policies</Link>
            <Link to="/" className='footer-links'>Cookie Policy</Link>
            <Link to="/" className='footer-links'>FAQS</Link>
            <Link to="/" className='footer-links'>Report</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;