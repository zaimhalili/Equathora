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
import CommunityPosts from '../components/Dashboard/CommunityPosts.jsx';
import Mentor from '../assets/images/mentoring.svg';

const Dashboard = () => {
  // Later to be implemented with real-time data and user authentication in the backend
  let numberOfProblems = 5;
  let randomProblemId = Math.floor(Math.random() * numberOfProblems) + 1;
  let username = "Friend";
  return (
    <>
      <FeedbackBanner />
      <main className="w-full bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] min-h-screen ">
        <header>
          <Navbar />
        </header>

        {/* Hero Section */}
        <div className='flex w-full justify-center items-center'>
          <div className='flex justify-center items-center px-[4vw] xl:px-[6vw] max-w-[1500px] lg:py-6 gap-8'>
            <section className="flex flex-col items-center lg:items-start justify-center w-[70%]">
              <article className="text-[var(--secondary-color)] font-[Inter] w-full cursor-default flex flex-col items-center md:items-start">
                <h1 className="text-4xl text-center md:text-left pb-2 cursor-default font-[DynaPuff] font-medium">
                  Welcome Back, <span className="text-[var(--secondary-color)]">{username}</span>!
                </h1>
                <h4 className="text-lg font-normal leading-[1.2] w-4/5 lg:w-[90%] cursor-default">
                  Tackle fun math and logic challenges with guided support to master your topics. <span className="font-semibold">Equathora is open, student-centered, and built to grow with you.</span>
                </h4>

                {/* Where To Start Section */}
                <div className="flex flex-col text-center md:text-left pt-8 pb-8">
                  <h3 className="text-[var(--secondary-color)] font-[Inter] text-2xl font-bold pb-2">
                    Where To Start...
                  </h3>

                  {/* Blocks - Squares */}
                  <div className="w-full pt-2 gap-0.5 lg:gap-[2px] flex flex-wrap justify-center md:justify-start lg:w-auto">
                    <Link
                      to={`/problems/1/${randomProblemId}`}
                      className="w-40 h-35 lg:w-[11rem] lg:h-[10rem] bg-white transition-all duration-200 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-[3px] shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(141,153,174,0.7)]"
                    >
                      <img src={QuestionMark} alt="daily-challenge" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                      <h6 className="text-[var(--secondary-color)] font-[Inter] text-lg font-normal w-full text-center flex items-center justify-center">
                        Solve the daily challenge
                      </h6>
                    </Link>

                    <Link
                      to="/learn"
                      className="w-40 h-35 lg:w-[11rem] lg:h-[10rem] bg-white transition-all duration-200 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-[3px] shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(141,153,174,0.7)]"
                    >
                      <img src={Books} alt="books" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                      <h6 className="text-[var(--secondary-color)] font-[Inter] text-lg font-normal w-full text-center flex items-center justify-center">
                        Continue where you left
                      </h6>
                    </Link>

                    <Link
                      to="/applyMentor"
                      className="w-40 h-35 lg:w-[11rem] lg:h-[10rem] bg-white transition-all duration-200 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-[3px] shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(141,153,174,0.7)]"
                    >
                      <img src={Mentoring} alt="mentoring" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                      <h6 className="text-[var(--secondary-color)] font-[Inter] text-lg font-normal w-full text-center flex items-center justify-center">
                        Try mentoring
                      </h6>
                    </Link>

                    <Link
                      to="/leaderboards/global"
                      className="w-40 h-35 lg:w-[11rem] lg:h-[10rem] bg-white transition-all duration-200 ease-out flex justify-center items-center flex-col p-4 gap-3 cursor-pointer overflow-hidden rounded-[3px] shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(141,153,174,0.7)]"
                    >
                      <img src={Leaderboards} alt="leaderboards" className="h-[50%] lg:h-[40%] w-[60%] lg:w-[60%]" />
                      <h6 className="text-[var(--secondary-color)] font-[Inter] text-lg font-normal w-full text-center flex items-center justify-center">
                        Join the race
                      </h6>
                    </Link>
                  </div>
                </div>
              </article>
              <YourTrack />

            </section>

            {/* Aside Section - Image and Apply to be a Mentor */}
            <aside className='flex flex-col w-[30%] gap-8'>
              <figure className="hidden lg:flex justify-center">
                <img src={Teacher} alt="teacher" loading='lazy' className="" />
              </figure>

              {/* Become a Mentor Section */}
              <div className="w-full">
                <div className="w-full bg-white border border-[rgba(43,45,66,0.12)] rounded-[3px] p-8">
                  {/* Header with Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-[Inter] font-semibold text-xl text-[var(--secondary-color)] mb-1.5 leading-[1.3]">
                        Become a Mentor
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[var(--accent-color)] bg-[rgba(217,4,41,0.08)] rounded py-1 px-2">
                          FREE TO JOIN
                        </span>
                      </div>
                    </div>
                    <img src={Mentor} alt="Mentor" className="opacity-90 w-14 h-14" />
                  </div>

                  {/* Value Proposition */}
                  <p className="font-[Inter] text-[0.9375rem] text-[var(--secondary-color)] leading-relaxed opacity-90 mb-6">
                    Guide learners, reinforce your expertise, and make a meaningful impact in the mathematics community.
                  </p>

                  {/* Benefits List */}
                  <div className="flex flex-col gap-2.5 mb-6">
                    <div className="flex items-start gap-2.5">
                      <span className="text-[var(--accent-color)] font-bold text-sm mt-0.5">✓</span>
                      <span className="font-[Inter] text-sm text-[var(--secondary-color)] opacity-80">Flexible scheduling that fits your lifestyle</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-[var(--accent-color)] font-bold text-sm mt-0.5">✓</span>
                      <span className="font-[Inter] text-sm text-[var(--secondary-color)] opacity-80">Strengthen understanding through teaching</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-[var(--accent-color)] font-bold text-sm mt-0.5">✓</span>
                      <span className="font-[Inter] text-sm text-[var(--secondary-color)] opacity-80">Build your professional portfolio</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Link
                      to="/applymentor"
                      className="font-[Inter] font-semibold text-[0.9375rem] !text-white bg-[var(--secondary-color)] rounded-[3px] no-underline transition-all duration-200 hover:bg-[var(--raisin-black)] text-center flex-1 py-3 px-6"
                    >
                      Apply Now
                    </Link>
                    <Link
                      to="/applymentor"
                      className="font-[Inter] font-medium text-[0.9375rem] text-[var(--secondary-color)] bg-transparent border border-[rgba(43,45,66,0.2)] rounded-[3px] no-underline transition-all duration-200 hover:border-[var(--secondary-color)] hover:bg-[rgba(43,45,66,0.02)] text-center py-3 px-6"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      
        <article>
          <CommunityPosts />
        </article>

        <footer>
          <Footer />
        </footer>
      </main>
    </>
  );
};

export default Dashboard;