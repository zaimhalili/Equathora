import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import Teacher from '../assets/images/teacher.svg';
import YourTrack from '../components/YourTrack.jsx';
import Books from '../assets/images/learningBooks.svg';
import Mentoring from '../assets/images/mentoring.svg';
import QuestionMark from '../assets/images/questionMark.svg';
import Leaderboards from '../assets/images/leaderboards.svg'
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Later to be implemented with real-time data and user authentication in the backend
  let numberOfProblems = 5;
  let randomProblemId = Math.floor(Math.random() * numberOfProblems) + 1;
  let username = "Friend";
  return (
    <>
      <FeedbackBanner />
      <main className="w-full bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] min-h-screen">
        <header>
          <Navbar />
        </header>

        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center lg:items-start justify-center px-[4vw] xl:px-[12vw] pt-[5vh] text-center lg:text-left">
          <article className="text-[var(--secondary-color)] font-[Inter] w-full lg:w-[60%] cursor-default flex flex-col">
            <h1 className="text-[clamp(1.5rem,5vw,2.6rem)] mb-[2vh] cursor-default font-[DynaPuff] font-medium">
              Welcome Back, <span className="text-[var(--secondary-color)]">{username}</span>!
            </h1>
            <h4 className="text-[clamp(1.5rem,2.5vw,1.5rem)] font-normal leading-[1.2] w-full lg:w-[90%] cursor-default">
              Tackle fun math and logic challenges with guided support to master your topics. <span className="font-semibold">Equathora is open, student-centered, and built to grow with you.</span>
            </h4>
          </article>

          <figure className="hidden lg:flex pl-[5%] pb-[2vh] w-[40%] justify-center">
            <img src={Teacher} alt="teacher" loading='lazy' className="max-w-[95%] max-h-[95%]" />
          </figure>
        </section>

        {/* Where To Start Section */}
        <article className="px-[4vw] xl:px-[12vw] flex flex-col my-[8vh] lg:pb-[5vh] text-center lg:text-left">
          <h3 className="text-[var(--secondary-color)] font-[Inter] text-[2rem] font-bold">
            Where To Start...
          </h3>

          <div className="mt-2 w-full lg:w-auto lg:max-w-[calc(13rem*4+8px)] gap-2 lg:gap-[2px] flex flex-wrap justify-center lg:justify-start lg:h-[12rem]">
            <Link
              to={`/problems/1/${randomProblemId}`}
              className="flex-[1_0_calc(50%-0.5rem)] sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-none lg:w-[13rem] lg:h-[12rem] bg-white transition-all duration-200 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-[3px] shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(141,153,174,0.7)]"
            >
              <img src={QuestionMark} alt="daily-challenge" className="h-[60%] lg:h-[40%] w-[60%] lg:w-[60%]" />
              <h6 className="text-[var(--secondary-color)] font-[Public_Sans] text-[clamp(0.9rem,3vw,1.1rem)] font-normal w-full text-center flex items-center justify-center">
                Solve the daily challenge
              </h6>
            </Link>

            <Link
              to="/learn"
              className="flex-[1_0_calc(50%-0.5rem)] sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-none lg:w-[13rem] lg:h-[12rem] bg-white transition-all duration-200 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-[3px] shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(141,153,174,0.7)]"
            >
              <img src={Books} alt="books" className="h-[60%] lg:h-[40%] w-[60%] lg:w-[60%]" />
              <h6 className="text-[var(--secondary-color)] font-[Public_Sans] text-[clamp(0.9rem,3vw,1.1rem)] font-normal w-full text-center flex items-center justify-center">
                Continue where you left
              </h6>
            </Link>

            <Link
              to="/applyMentor"
              className="flex-[1_0_calc(50%-0.5rem)] sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-none lg:w-[13rem] lg:h-[12rem] bg-white transition-all duration-200 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-[3px] shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(141,153,174,0.7)]"
            >
              <img src={Mentoring} alt="mentoring" className="h-[60%] lg:h-[40%] w-[60%] lg:w-[60%]" />
              <h6 className="text-[var(--secondary-color)] font-[Public_Sans] text-[clamp(0.9rem,3vw,1.1rem)] font-normal w-full text-center flex items-center justify-center">
                Try mentoring
              </h6>
            </Link>

            <Link
              to="/leaderboards/global"
              className="flex-[1_0_calc(50%-0.5rem)] sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-none lg:w-[13rem] lg:h-[12rem] bg-white transition-all duration-200 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-[3px] shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(141,153,174,0.7)]"
            >
              <img src={Leaderboards} alt="leaderboards" className="h-[60%] lg:h-[40%] w-[60%] lg:w-[60%]" />
              <h6 className="text-[var(--secondary-color)] font-[Public_Sans] text-[clamp(0.9rem,3vw,1.1rem)] font-normal w-full text-center flex items-center justify-center">
                Join the race
              </h6>
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