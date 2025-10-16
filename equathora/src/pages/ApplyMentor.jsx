import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import mathTeacher from '../assets/images/oldTeacher.png';
import skate from '../assets/images/skate.svg';
import parents from '../assets/images/parents.svg';
import teachers from '../assets/images/teachers.svg';
import { Link } from 'react-router-dom';

const ApplyMentor = () => {
  return (
    <div className='text-black font-[Inter] w-full bg-[var(--french-gray)]'>
      <header><Navbar></Navbar></header>
      <section className='bg-white flex justify-center flex-col px-8 py-5 sm:px-20 sm:py-10 min-h-[50vh] w-full shadow-gray-400 shadow-xl'>
        <h1 className='text-[clamp(2.4rem,5vw,3.4rem)] font-bold text-center'>
          Apply To Be a <span className='text-[var(--dark-accent-color)]'>Mentor</span>
        </h1>
        <h2 className='text-center font-light text-[clamp(1rem,3vw,1.25rem)] md:pb-7'>
          Guide, support, and inspire students in logic and mathematics
        </h2>

        {/* First section */}
        <article className='flex flex-col md:flex-row justify-center md:items-center gap-5 md:gap-6 pt-5'>
          <img src={mathTeacher} alt="math teacher" className='w-full max-w-[600px] md:w-1/2 xl:w-4/5' />

          <div className='flex flex-col md:w-1/2 lg:1/3 xl:w-1/5 gap-7 h-full justify-between'>
            <p className='text-[clamp(1.2rem,3vw,1.65rem)] w-full text-center md:text-left'>
              Join us in building the future of math and logic education.
              Your guidance could be a reason a student falls in love with problem-solving.
            </p>
            <div className='flex gap-5'>
              <Link
                to='/signup'
                className='bg-[var(--accent-color)] rounded-sm shadow-gray-500 hover:shadow-gray-600
                text-white py-3 cursor-pointer hover:bg-[var(--dark-accent-color)] transition-colors w-2/3
                shadow-lg font-bold text-center no-underline'
                style={{ color: 'white', textDecoration: 'none' }}
              >
                Sign up to apply
              </Link>
              <Link
                to='/login'
                className='rounded-sm shadow-gray-500 hover:shadow-gray-600 
                text-[var(--accent-color)] py-3 cursor-pointer
                border-2 border-[var(--accent-color)] hover:bg-gray-200
                transition-colors w-1/3 shadow-lg font-bold text-center no-underline'
                style={{ color: 'var(--accent-color)', textDecoration: 'none' }}
              >
                Log In
              </Link>
            </div>
          </div>
        </article>
      </section>
      {/* Who can apply Section */}
      <section className='flex flex-col w-full px-8 py-5 sm:px-20 sm:py-10 min-h-[50vh] xl:gap-4'>
        <br />
        <h3 className='text-[clamp(1.7rem,3vw,2.5rem)] text-center font-bold'>
          Who can <span className='text-[var(--dark-accent-color)]'>apply?</span>
        </h3><br />


        <article className='flex flex-col gap-10 lg:flex-row'>
          {/* Community Mentor */}
          <div className='group rounded-sm shadow-gray-500 shadow-lg flex flex-col items-center 
          px-3 py-8 gap-4 sm:px-5 lg:px-8 flex-1 justify-around hover:-translate-y-2
          transition-all duration-300 hover:shadow-2xl'>
            <h5 className='text-center font-bold text-[clamp(1.3rem,3vw,1.4rem)]'>Community Mentors</h5>
            <p className='text-center text-[clamp(1.1rem,3vw,1.3rem)]'>Do you enjoy helping others understand logic and math?
              As a community mentor, you’ll guide students publicly, answer questions, and share solutions that inspire everyone on the platform.</p>
            <img src={skate} alt="community" className='group-hover:scale-105 transition-transform duration-300 w-full max-w-xs' />
          </div>
          {/* Teachers */}
          <div className='group rounded-sm shadow-gray-500 shadow-lg flex flex-col 
          items-center px-3 py-8 gap-4 sm:px-5 lg:px-8 flex-1 justify-around hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl'>
            <h5 className='text-center font-bold text-[clamp(1.3rem,3vw,1.4rem)]'>Teachers</h5>
            <p className='text-center text-[clamp(1.1rem,3vw,1.3rem)]'>Equathora was built with classrooms in mind. Teachers can directly track their students’ progress, assign problem sets, and provide personalized feedback to help them grow.</p>
            <img src={teachers} alt="community" className='group-hover:scale-105 
            transition-transform duration-300 w-full max-w-xs' />
          </div>
          {/* Parents */}
          <div className='group rounded-sm shadow-lg shadow-gray-500 flex flex-col 
          items-center px-3 py-8 gap-4 sm:px-5 lg:px-8 flex-1 justify-around hover:-translate-y-2
          transition-all duration-300 hover:shadow-2xl'>
            <h5 className='text-center font-bold text-[clamp(1.3rem,3vw,1.4rem)]'>Parents</h5>
            <p className='text-center text-[clamp(1.1rem,3vw,1.3rem)]'>Parents can join as mentors too but with a focus on support and oversight. You’ll be able to see how much time your child spends solving problems, how many exercises they’ve completed, and where they might need encouragement.</p>
            <img src={parents} alt="community" className='group-hover:scale-105 
            transition-transform duration-300 w-full max-w-xs' />
          </div>
        </article>
      </section>
      <hr />

      {/* Footer */}
      <footer><Footer></Footer></footer>
      <div className='w-full h-full bg-[var(--secondary-color)] border border-t-white flex justify-center underline text-sm font-serif font-semibold pt-2'><a href="https://storyset.com/education" target="_blank">Education illustrations by Storyset</a></div>

    </div>
  );
};

export default ApplyMentor;