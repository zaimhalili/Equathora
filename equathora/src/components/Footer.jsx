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

        <div id="center">
          <h1>
            Your contribution helps us keep this learning platform available for <span className='rotated-bg'>students worldwide</span>
          </h1>
          <div id="socialMedia-container">
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
              href="https://www.instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className='socialMedia'
            >
              <FaInstagram />
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
          <h2>equathora</h2>
          <p style={{
            fontFamily: "'Times New Roman', serif, sans-serif"
          }}>&#169;2025 equathora. All rights reserved.</p>
        </div>
        <div className="links-wrapper">
          <ul className="links" id='links-left'>
            <li><Link to="/learn" className='footer-links'>Learn</Link></li>
            <li><Link to="/discover" className='footer-links'>Discover</Link></li>
            <li><Link to="/achievements" className='footer-links'>Achievements</Link></li>
            <li><Link to="/notifications" className='footer-links'>Notifications</Link></li>
            <li><Link to="/profile" className='footer-links'>My Profile</Link></li>
          </ul>
          <ul className="links" id='links-right'>
            <li><Link to="/" className='footer-links'>About Us</Link></li>
            <li><Link to="/" className='footer-links'>Legal & Policies</Link></li>
            <li><Link to="/" className='footer-links'>Cookie Policy</Link></li>
            <li><Link to="/" className='footer-links'>FAQS</Link></li>
            <li><Link to="/" className='footer-links'>Report</Link></li>
          </ul>
        </div>

      </footer>
    </>
  );
};

export default Footer;