import React from 'react';
import './Dashboard.css';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Teacher from '../assets/images/teacher.svg';
import YourTrack from '../components/YourTrack.jsx';
import Books from '../assets/images/learningBooks.svg';
import Mentoring from '../assets/images/mentoring.svg';
import QuestionMark from '../assets/images/questionMark.svg';
import Leaderboards from '../assets/images/leaderboards.svg'
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <>
      <main id='body-dashboard'>
        <header>
          <Navbar />
        </header>

        <section id='hero-dashboard'>
          <article id='welcome-dashboard'>
            <h1>Welcome Back, <br /> <span id='user-name'>User</span>!</h1>
            <h4>Tackle fun math and logic challenges with guided support to master your topics. <span style={{ fontWeight: 600 }}>Equathora is open, student-centered, and built to grow with you.</span> </h4>
          </article>

          <figure id='teacher-container'>
            <img src={Teacher} alt="teacher" loading='lazy' />
          </figure>
        </section>

        <article id='whereToStart-container'>
          <h3>
            Where To Start...
          </h3>

          <div id='whereToStart-options'>
            <Link to="/" className="whereToStart-block">
              <img src={QuestionMark} alt="daily-challenge" />
              <h6>Solve a Fresh Daily Challenge</h6>
            </Link>
            <Link to="/learn" className="whereToStart-block">
              <img src={Books} alt="books" />
              <h6>Continue Where You Left</h6>
            </Link>
            <Link to="/" className="whereToStart-block">
              <img src={Mentoring} alt="mentoring" />
              <h6>Try Mentoring</h6>
            </Link>
            <Link to="/leaderboards" className="whereToStart-block">
              <img src={Leaderboards} alt="leaderboards" />
              <h6>Join the Race</h6>
            </Link>
          </div>

        </article>

        <article>
          <YourTrack />
        </article>

        <footer>
          <Footer />
        </footer>
      </main>
    </>
  );
};

export default Dashboard;