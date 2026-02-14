
import React from 'react';
import { motion } from 'framer-motion';
import { Outlet, NavLink } from 'react-router-dom'; // Change Link to NavLink
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import './AchievementsLayout.css';
import AchievementsDD from '../../assets/images/achievementsDD.svg';
import Statistics from '../../assets/images/statistics.svg';
import Events from '../../assets/images/specialEvents.svg';

const AchievementsLayout = () => {
  return (
    <>
      <header><Navbar /></header>

      <main className='achievements-body'>
        <motion.div
          className="achievements-image-body"
        >
          <h1>Your Learning <span id='prg-hover'>Progress</span></h1>
          <h3>Exploring your time on Equathora</h3>

          <div className="scroll-indicator">
            <span className="scroll-text">Scroll to explore</span>
            <div className="scroll-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="achievements-filter"
          >
            <NavLink
              to="recent"
              className={({ isActive }) =>
                isActive ? 'achievements-link active  active:scale-95' : 'achievements-link active:scale-95'
              }
            >
              <img src={AchievementsDD} alt="achievements" />
              All Achievements
            </NavLink>

            <NavLink
              to="stats"
              className={({ isActive }) =>
                isActive ? 'achievements-link active  active:scale-95' : 'achievements-link active:scale-95'
              }
            >
              <img src={Statistics} alt="statistics" />
              Statistics
            </NavLink>

            <NavLink
              to="events"
              className={({ isActive }) =>
                isActive ? 'achievements-link active active:scale-95' : 'achievements-link active:scale-95'
              }
            >
              <img src={Events} alt="achievements" />
              Special Events
            </NavLink>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className='achievements-content'
        >
          <Outlet></Outlet>
        </motion.div>
      </main>

      <footer>
        <Footer></Footer>
        <a href="http://www.freepik.com" id='freepik-link' target="_blank"
          rel="noopener noreferrer"
          aria-label="Freepik">Designed by upklyak / Freepik</a>
      </footer>
    </>
  );
};

export default AchievementsLayout;