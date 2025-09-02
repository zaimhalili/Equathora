import React from 'react';
import './AchievementsLayout.css';

const RecentAchievements = () => {
  const achievements = 5;
  return (
    <div className='rec-achievements'>
      <h2>Your Achievements</h2>
      <p>You have come a long way</p>
      <div className="block-container">
        <div className="block">{achievements} <br />
          Achievements Completed
        </div>
        <div className="block">{achievements} <br />
          Achievements Completed
        </div>
        <div className="block">{achievements} <br />
          Achievements Completed
        </div>
      </div>

      <div className="achievements-list">
        <div className="a-list-component">
          <h3>You have completed 5 problems</h3>
        </div>
        <div className="a-list-component">
          <h3>You have completed 5 problems</h3>
        </div>
        <div className="a-list-component">
          <h3>You have completed 5 problems</h3>
        </div>
      </div>
      
    </div>
  );
};

export default RecentAchievements;