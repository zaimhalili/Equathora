import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GuestAvatar from '../assets/images/guestAvatar.png';

const Profile = () => {
  const { profile } = useParams();

  // Mock user data - will be replaced with real data from backend
  const [userData] = useState({
    name: 'Alex Thompson',
    username: profile || 'alexthompson',
    title: 'Problem Solver ∑',
    status: 'Online',
    stats: {
      problemsSolved: 127,
      accuracy: 89,
      currentStreak: 15,
      totalPoints: 2450
    },
    mathTopics: ['Algebra', 'Geometry', 'Calculus', 'Number Theory']
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--raisin-black)' }}>
      <Navbar />
      <main className='flex-1 bg-white py-8'>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center text-center">
            <img src={GuestAvatar} alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-[var(--accent-color)]" />
            <h1 className="text-3xl font-bold mt-4">{userData.name}</h1>
            <p className="text-gray-600">@{userData.username}</p>
            <p className="text-lg mt-2">{userData.title}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {userData.status}
            </span>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-bold">{userData.stats.problemsSolved}</p>
                <p className="text-sm text-gray-600">Problems Solved</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-bold">{userData.stats.accuracy}%</p>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-bold">{userData.stats.currentStreak}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-bold">{userData.stats.totalPoints}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            </div>

            {/* Math Topics */}
            <div className="mt-8 w-full">
              <h2 className="text-xl font-semibold mb-4">Math Topics</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {userData.mathTopics.map((topic, index) => (
                  <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;