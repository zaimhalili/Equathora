import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import './AchievementsLayout.css';
import AchievementsDD from '../../assets/images/AchievementsDD.svg';
import Statistics from '../../assets/images/statistics.svg';
import Events from '../../assets/images/specialEvents.svg';

const AchievementsLayout = () => {
  return (
    <>
      <header>
        <Navbar></Navbar>
      </header>

      <main className='achievements-body'>
        <div className="achievements-image-body">
          <h1>Your Learning <span id='prg-hover'>Progress</span></h1>
          <h3>Exploring your time on Equathora</h3>
          <div className="achievements-filter">
            <Link to="recent" className='achievements-link'>
              <img src={AchievementsDD} alt="achievements" />
              All Achievements
            </Link>

            <Link to="stats" className='achievements-link'>
              <img src={Statistics} alt="statistics" />
              Statistics
            </Link>

            <Link to="events" className='achievements-link'>
              <img src={Events} alt="achievements" />
              Special Events
            </Link>
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