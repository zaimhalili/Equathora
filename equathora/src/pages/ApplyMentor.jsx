import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import mathTeacher from '../assets/images/oldTeacher.png';
import skate from '../assets/images/skate.svg';
import parents from '../assets/images/parents.svg';
import teachers from '../assets/images/teachers.svg';

const ApplyMentor = () => {
  return (
    <div className='text-black font-[Inter] w-full' style={{ background: 'linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)' }}>
      <header><Navbar></Navbar></header>
      <section className='flex justify-center flex-col px-8 py-5 sm:px-20 sm:py-10 min-h-[50vh] w-full'>
        <h1 className='text-[clamp(2.4rem,5vw,4rem)] font-medium text-center'>Apply To Be a <span className='font-bold text-[var(--dark-accent-color)]'>Mentor</span></h1>
        <h2 className='text-center font-light text-[clamp(1rem,3vw,1.4rem)] md:pb-7'>Guide, support, and inspire students in logic and mathematics</h2>

        <article className='flex flex-col md:flex-row justify-center md:items-center gap-5 md:gap-6 pt-5'>
          <img src={mathTeacher} alt="mentors" className='w-full max-w-2xl md:w-1/2 lg:w-3/5' />
          
          <div className='flex flex-col md:w-1/2 lg:w-2/5 lg:px-[50px] xl:px-[120px] gap-7 h-full justify-between'>
            <p className='text-[clamp(1.2rem,3vw,1.65rem)] w-full text-center md:text-left'>
              Join us in building the future of math and logic education.
              Your guidance could be a reason a student falls in love with problem-solving.
            </p>
            <button type="submit" className='bg-[var(--accent-color)] rounded-2xl w-full text-white py-3 cursor-pointer hover:bg-[var(--dark-accent-color)] transition-colors'>Apply Now</button>
          </div>
        </article>
      </section>
      <hr />
      <section className='flex flex-col w-full px-8 py-5 sm:px-20 sm:py-10 min-h-[50vh] xl:gap-4'>
        <br />
        <h3 className='text-[clamp(1.7rem,3vw,2.5rem)] text-center font-semibold'>
          Who can <span className='text-[var(--dark-accent-color)]'>apply?</span>
        </h3><br />

        <article className='flex flex-col gap-10 lg:flex-row'>
          <div className='group rounded-2xl shadow-lg bg-white flex flex-col items-center px-3 py-8 gap-4 sm:px-5 lg:px-8 flex-1 justify-around hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl'>
            <h5 className='text-center font-medium text-[clamp(1.3rem,3vw,1.4rem)]'>Community Mentors</h5>
            <p className='text-center text-[clamp(1.1rem,3vw,1.3rem)]'>Do you enjoy helping others understand logic and math?
              As a community mentor, you’ll guide students publicly, answer questions, and share solutions that inspire everyone on the platform.</p>
            <img src={skate} alt="community" className='group-hover:scale-105 transition-transform duration-300 w-full max-w-xs' />
          </div>

          <div className='group rounded-2xl shadow-lg  bg-white flex flex-col items-center px-3 py-8 gap-4 sm:px-5 lg:px-8 flex-1 justify-around hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl'>
            <h5 className='text-center font-medium text-[clamp(1.3rem,3vw,1.4rem)]'>Teachers</h5>
            <p className='text-center text-[clamp(1.1rem,3vw,1.3rem)]'>Equathora was built with classrooms in mind. Teachers can directly track their students’ progress, assign problem sets, and provide personalized feedback to help them grow.</p>
            <img src={teachers} alt="community" className='group-hover:scale-105 transition-transform duration-300 w-full max-w-xs' />
          </div>

          <div className='group rounded-2xl shadow-lg  bg-white flex flex-col items-center px-3 py-8 gap-4 sm:px-5 lg:px-8 flex-1 justify-around hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl'>
            <h5 className='text-center font-medium text-[clamp(1.3rem,3vw,1.4rem)]'>Parents</h5>
            <p className='text-center text-[clamp(1.1rem,3vw,1.3rem)]'>Parents can join as mentors too but with a focus on support and oversight. You’ll be able to see how much time your child spends solving problems, how many exercises they’ve completed, and where they might need encouragement.</p>
            <img src={parents} alt="community" className='group-hover:scale-105 transition-transform duration-300 w-full max-w-xs' />
          </div>
        </article>
      </section>
      <hr />
      <footer><Footer></Footer></footer>
      <div className='w-full h-full bg-[var(--secondary-color)] border border-t-white flex justify-center underline text-sm font-serif font-semibold pt-2'><a href="https://storyset.com/education" target="_blank">Education illustrations by Storyset</a></div>
      
    </div>
  );
};

export default ApplyMentor;