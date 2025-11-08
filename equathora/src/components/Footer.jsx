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
        </div>

        <div className="links-wrapper">
          <div className="links-column">
            <h3 className="footer-column-title">Platform</h3>
            <ul className="links">
              <li><Link to="/learn" className='footer-links'>Learn</Link></li>
              <li><Link to="/discover" className='footer-links'>Discover</Link></li>
              <li><Link to="/achievements" className='footer-links'>Achievements</Link></li>
              <li><Link to="/notifications" className='footer-links'>Notifications</Link></li>
              <li><Link to="/profile/myprofile" className='footer-links'>My Profile</Link></li>
            </ul>
          </div>
          <div className="links-column">
            <h3 className="footer-column-title">Company</h3>
            <ul className="links">
              <li><Link to="/about" className='footer-links'>About Us</Link></li>
              <li><Link to="/" className='footer-links'>Legal & Policies</Link></li>
              <li><Link to="/" className='footer-links'>Cookie Policy</Link></li>
              <li><Link to="/" className='footer-links'>FAQs</Link></li>
              <li><Link to="/" className='footer-links'>Report</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 equathora. All rights reserved.</p>
          <p className="footer-credit">
            Page design inspired by <a href="https://exercism.org" target="_blank" rel="noopener noreferrer" aria-label="Exercism">Exercism</a> - free coding platform
          </p>
        </div>

      </footer>
    </>
  );
};

export default Footer;