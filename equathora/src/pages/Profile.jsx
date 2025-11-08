import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Autumn from '../assets/images/autumn.jpg';
import { FaFire, FaCheckCircle, FaTrophy, FaChartLine } from 'react-icons/fa';

const Profile = () => {
  const { profile } = useParams();

  // Mock user data - will be replaced with real data from backend
  const [userData] = useState({
    name: 'Alex Thompson',
    username: 'alexthompson',
    title: 'Problem Solver ∑',
    status: 'Online',
    stats: {
      problemsSolved: 127,
      accuracy: 89,
      currentStreak: 15,
      reputation: 2450,
      globalRank: 3573765,
    },
    mathTopics: ['Algebra', 'Geometry', 'Calculus I', 'Number Theory', 'Probability', 'Graphs', 'Calculus II'],
    problemsSolved: ['I loved her', 'Pretty Eyes', 'Just once more', 'Where are you?', 'Smile please', 'Unreal situation', 'Obvious choice', 'Tough Decisions', 'First time', 'I make my choices']
  });


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className='bg-[var(--french-gray)] px-3 pt-5 pb-20'>
        <section className='bg-[var(--main-color)] min-h-screen rounded-xl shadow-2xl shadow-gray-500 px-5 py-4 flex flex-col gap-3'>
          {/* First Section: profile picture, name, username, rank, 'edit profile' button */}
          <div className='flex flex-col gap-4'>
            <div className='flex'>
              <img src={Autumn} alt="Profile Picture" className='rounded-md h-20 w-20' />
              <div className='px-3 text-[var(--secondary-color)] font-[Inter] flex flex-col justify-between'>
                <div>
                  <h5 className='font-bold text-xl'>{userData.name}</h5>
                  <h5 className='font-light text-md'>{userData.username}</h5>
                </div>
                <h6 className='text-md'>Rank <span className='font-bold'>{userData.stats.gloabalRank}</span></h6>
              </div>
            </div>


            <button type="button" className='w-full py-2 bg-[var(--accent-color)] font-bold text-white rounded-md cursor-pointer hover:bg-[var(--dark-accent-color)] transition-all duration-300'>Edit Profile</button>
            <hr className='border-t-2 border-[var(--french-gray)]' />
          </div>

          {/* Community Stats */}
          <div className='text-[var(--secondary-color)] flex flex-col gap-4'>
            <h5 className='font-bold text-xl'>Community Stats</h5>

            <div className='flex gap-2 align-center'>
              {/* Streak Icon */}
              <div className=' text-orange-500 text-2xl'><FaFire /></div>
              <div className='w-5/6 flex flex-col '>
                <p>Streak <span className='font-bold'>{userData.stats.currentStreak}</span></p>
              </div>
            </div>

            <div className='flex gap-2 align-center'>
              {/* Solution Icon */}
              <div className=' text-green-500 text-2xl'><FaCheckCircle /></div>
              <div className='w-5/6 flex flex-col '>
                <p>Solved <span className='font-bold'>{userData.stats.problemsSolved}</span></p>
              </div>
            </div>

            <div className='flex gap-2 align-center'>
              {/* Reputation Icon */}
              <div className=' text-yellow-500 text-2xl'><FaTrophy /></div>
              <div className='w-5/6 flex flex-col '>
                <p>Reputation <span className='font-bold'>{userData.stats.reputation}</span></p>
              </div>
            </div>

            <div className='flex gap-2 align-center'>
              {/* Accuracy Icon */}
              <div className=' text-blue-500 text-2xl'><FaChartLine /></div>
              <div className='w-5/6 flex flex-col '>
                <p>Accuracy <span className='font-bold'>{userData.stats.accuracy}%</span></p>
              </div>
            </div>
            <hr className='border-t-2 border-[var(--french-gray)]' />
          </div>

          {/* Topics */}
          <div className='text-[var(--secondary-color)] flex flex-col gap-4'>
            <h5 className='font-bold text-xl'>Topics</h5>
            <div className='flex gap-2 flex-wrap'>
              {userData.mathTopics.map((topic, i) => (
                <p key={i} className='rounded-2xl bg-[var(--french-gray)] px-3 py-1 max-h-8 hover:scale-105 duration-150 transition-all'>{topic}</p>
              )
              )}
            </div>

            <hr className='border-t-2 border-[var(--french-gray)]' />
          </div>

          {/* Stats */}
          <div className='text-[var(--secondary-color)] flex flex-col gap-4'>
            <h5 className='font-bold text-xl'>Statistics</h5>
            <div className='flex justify-between'>
              <div className='flex flex-col w-4/5 justify-center align-center font-medium text-center cursor-default'>
                <p className='text-xl'><span className='text-4xl font-bold'>21</span>/376</p>
                <div className='flex justify-center gap-1 items-center'>
                  <FaCheckCircle className='text-green-500' />
                  <p>Solved</p>
                </div>
              </div>

              <div className='w-1/5 min-w-25 max-w-25 flex flex-col gap-3'>
                <div className='bg-[var(--french-gray)] rounded-lg text-center flex flex-col font-bold py-1'>
                  <p className='text-teal-700'>Easy:</p>
                  <p>6/1943</p>
                </div>

                <div className='bg-[var(--french-gray)] rounded-lg text-center flex flex-col font-bold py-1'>
                  <p className='text-yellow-700'>Medium:</p>
                  <p>6/1943</p>
                </div>

                <div className='bg-[var(--french-gray)] rounded-lg text-center flex flex-col font-bold py-1'>
                  <p className='text-[var(--dark-accent-color)]'>Hard:</p>
                  <p>6/1943</p>
                </div>
              </div>
            </div>

            <hr className='border-t-2 border-[var(--french-gray)]' />
          </div>

          {/* Solved Problems List */}
          <div className='text-[var(--secondary-color)] flex flex-col gap-4'>
            <h5 className='font-bold text-xl'>Solved Problems</h5>
            <div className='flex flex-col'>
              {userData.problemsSolved.map((problem, i) => (
                <Link
                  key={i}
                  to="/*"
                  className={`w-full px-5 py-5 hover:scale-99 transition-all  duration-300 bg-[var(--french-gray)] rounded-sm text-md text-[var(--secondary-color)] ${i % 2 === 0 ? 'bg-[var(--dark-accent-color)]' : 'bg-[var(--main-color)]'}`}>{problem}</Link>
              )
              )}
            </div>
          </div>
        </section>


      </main>
      <Footer />
    </div>
  );
};

export default Profile;