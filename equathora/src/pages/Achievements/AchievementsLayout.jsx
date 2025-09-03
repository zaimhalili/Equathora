
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom'; // Change Link to NavLink
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import './AchievementsLayout.css';
import AchievementsDD from '../../assets/images/AchievementsDD.svg';
import Statistics from '../../assets/images/statistics.svg';
import Events from '../../assets/images/specialEvents.svg';

const AchievementsLayout = () => {
  return (
    <>
      <header><Navbar /></header>

      <main className='achievements-body'>
        <div className="achievements-image-body">
          <h1>Your Learning <span id='prg-hover'>Progress</span></h1>
          <h3>Exploring your time on Equathora</h3>

          <div className="achievements-filter">
            <NavLink
              to="recent"
              className={({ isActive }) =>
                isActive ? 'achievements-link active' : 'achievements-link'
              }
            >
              <img src={AchievementsDD} alt="achievements" />
              All Achievements
            </NavLink>

            <NavLink
              to="stats"
              className={({ isActive }) =>
                isActive ? 'achievements-link active' : 'achievements-link'
              }
            >
              <img src={Statistics} alt="statistics" />
              Statistics
            </NavLink>

            <NavLink
              to="events"
              className={({ isActive }) =>
                isActive ? 'achievements-link active' : 'achievements-link'
              }
            >
              <img src={Events} alt="achievements" />
              Special Events
            </NavLink>
          </div>
        </div>

        <div className='achievements-content'>
          <Outlet></Outlet>
        </div>
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