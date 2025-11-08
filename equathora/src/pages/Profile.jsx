import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Autumn from '../assets/images/autumn.jpg';

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
      totalPoints: 2450,
      gloabalRank: 3573765,
    },
    mathTopics: ['Algebra', 'Geometry', 'Calculus', 'Number Theory']
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className='bg-[var(--french-gray)] h-screen px-3 py-3'>
        {/* <h1 className="text-3xl font-bold mt-4">{userData.name}</h1> */}
        <section className='bg-[var(--main-color)] min-h-screen rounded-xl shadow-2xl px-5 py-4 flex flex-col gap-3'>
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


            <button type="button" className='w-full py-2 bg-[rgba(94,235,0,0.28)] font-bold text-green-700 rounded-md cursor-pointer hover:bg-[rgba(94,235,0,0.42)] transition-all duration-300'>Edit Profile</button>
            <hr className='border-t-2 border-[var(--french-gray)]'/>
          </div>

          {/* Community Stats */}
          <div className='text-[var(--secondary-color)]'>
            <h5 className='font-bold text-xl'>Community Stats</h5>
          </div>

        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;