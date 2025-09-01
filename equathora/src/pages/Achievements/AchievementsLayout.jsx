import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import './AchievementsLayout.css';

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
        </div>
        <div className="achievements-filter">

        </div>
        <div className='achievements-content'>

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