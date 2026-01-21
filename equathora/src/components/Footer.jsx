import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import Symbol from '../assets/logo/TransparentSymbol.png';
import {
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaReddit,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      <footer id='footer-container'>

        <div id="center">
          <h1>
            Your contribution helps us keep this learning platform available for{' '}
            <span className='rotated-bg'>students</span> <span className='rotated-bg'>worldwide</span>
          </h1>
          <div id="socialMedia-container">
            <a
              href="https://www.linkedin.com/in/zaimhalili/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with us on LinkedIn"
              className='socialMedia'
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.instagram.com/equathora/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className='socialMedia'
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.reddit.com/user/Equathora/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Reddit"
              className='socialMedia'
            >
              <FaReddit />
            </a>
          </div>
          <div className="w-full flex justify-center"><Link to="/dashboard" className='cursor-pointeration w-14'><img src={Symbol} alt="Equathora" className="footer-logo" style={{ height: '60px', width: '60px', margin: '1rem auto', borderRadius: '10px' }} /></Link></div>


        </div>

        <div className="links-wrapper">
          <div className="links-column">
            <h3 className="footer-column-title">Platform</h3>
            <ul className="links">
              <li><Link to="/learn" className='footer-links'>Learn</Link></li>
              {/* <li><Link to="/discover" className='footer-links'>Discover</Link></li> */}
              <li><Link to="/achievements" className='footer-links'>Achievements</Link></li>
              <li><Link to="/notifications" className='footer-links'>Notifications</Link></li>
              <li><Link to="/profile/myprofile" className='footer-links'>My Profile</Link></li>
            </ul>
          </div>
          <div className="links-column">
            <h3 className="footer-column-title">Company</h3>
            <ul className="links">
              <li><Link to="/about" className='footer-links'>About Us</Link></li>
              <li><Link to="/cookie-policy" className='footer-links'>Cookie Policy</Link></li>
              <li><Link to="/helpCenter" className='footer-links'>FAQs</Link></li>
              <li><Link to="/report" className='footer-links'>Report</Link></li>
              <li><Link to="/privacy-policy" className='footer-links'>Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className='footer-links'>Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 equathora. All rights reserved.</p>
          <p className="footer-credit">
            Page design inspired by <a href="https://exercism.org" target="_blank" rel="noopener noreferrer" aria-label="Exercism">Exercism</a> - code practice & mentorship
          </p>
        </div>

      </footer>
    </>
  );
};

export default Footer;