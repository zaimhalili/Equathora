import React from 'react';
import Navbar from '../components/Navbar';
import applyMen from '../assets/images/applyMentor.svg';
import skate from '../assets/images/skate.svg';
import parents from '../assets/images/parents.svg';
import teachers from '../assets/images/teachers.svg';

const ApplyMentor = () => {
  return (
    <div className='bg-white text-black font-[Inter]'>
      <header><Navbar></Navbar></header>
      <section className='flex justify-center flex-col'>
        <h1 className='text-[clamp(2.4rem,5vw,4rem)] font-medium'>Apply To Be a <span className='font-bold text-[var(--dark-accent-color)]'>Mentor</span></h1>
        <h2>Guide, support, and inspire students in logic and mathematics</h2>

        <article className='flex'>
          <img src={applyMen} alt="mentors" />
          <div>
            <p>Join us in building the future of math and logic education. <br />
              Your guidance could be a reason a student falls in love with problem-solving.
            </p>
            <button type="submit" className='bg-[var(--accent-color)] rounded-2xl'>Apply Now</button>
          </div>
        </article>
      </section>
      <hr />
      <section>
        <h3>Who can <span>apply?</span></h3>
        <article>
          <div>
            <h5>Community Mentors</h5>
            <p>Do you enjoy helping others understand logic and math?
              As a community mentor, you’ll guide students publicly, answer questions, and share solutions that inspire everyone on the platform.</p>
            <img src={skate} alt="community" />
          </div>
          <div>
            <h5>Teachers</h5>
            <p>Equathora was built with classrooms in mind. Teachers can directly track their students’ progress, assign problem sets, and provide personalized feedback to help them grow.</p>
            <img src={teachers} alt="community" />
          </div>
          <div>
            <h5>Parents</h5>
            <p>Parents can join as mentors too but with a focus on support and oversight. You’ll be able to see how much time your child spends solving problems, how many exercises they’ve completed, and where they might need encouragement.</p>
            <img src={parents} alt="community" />
          </div>
        </article>
      </section>
      <hr />
      <hr />
    </div>
  );
};

export default ApplyMentor;