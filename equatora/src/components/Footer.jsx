import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import {
  FaInstagram,
  FaLinkedin,
  FaFacebook
} from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      <footer id='footer-container'>
          <div id="left">
            <Link to="/learn" className='footer-links'>Learn</Link>
            <Link to="/discover" className='footer-links'>Discover</Link>
            <Link to="/achievements" className='footer-links'>Achievements</Link>
            <Link to="/notifications" className='footer-links'>Notifications</Link>
            <Link to="/profile" className='footer-links'>My Profile</Link>
          </div>
          <div id="center">
            <h1>
              Your contribution helps us keep this learning platform available for <span style={{ color:'var(--dark-accent-color)'}}>students worldwide</span>
            </h1>
            <div id="socialMedia-container">
            <a
              href="https://www.instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className='socialMedia'
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with us on LinkedIn"
              className='socialMedia'
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Like us on Facebook"
              className='socialMedia'
            >
              <FaFacebook />
            </a>
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
      </footer>
    </>
  );
};

export default Footer;