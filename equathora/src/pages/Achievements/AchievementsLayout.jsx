import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import './AchievementsLayout.css';

const AchievementsLayout = () => {
  return (
    <>
      <header>
        <Navbar></Navbar>
      </header>
      <main className='achievements-body'>
        <div className="achievements-image-body"></div>
        <div className="achievements-filter">

        </div>
      </main>
      <footer>
        <a href="http://www.freepik.com">Designed by upklyak / Freepik</a>
      </footer>
    </>
  );
};

export default AchievementsLayout;