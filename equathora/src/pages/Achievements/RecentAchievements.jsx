import React, { useEffect, useState } from 'react';
import './RecentAchievements.css';

const RecentAchievements = () => {
  const achievements = 120;

  const [isAnimated, setIsAnimated] = useState(false);
    useEffect(() => {
      setIsAnimated(true);
    }, []);
  
  
  return (
    <section className='rec-achievements'>
      <article className="a-top">
        <h2>Your Achievements</h2>
        <p>You have come a long way</p>
        <div className="block-container">
          <div className={`block ${isAnimated ? "animate-in" : ''}`}><span style={{ fontSize: " clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--dark-accent-color)" }}>{51}</span> <br />
            Achievements Earned
          </div>
          <div className={`block ${isAnimated ? "animate-in" : ''}`}><span style={{ fontSize: " clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--dark-accent-color)" }}>{achievements}</span> <br />
            Days Streak
          </div>
          <div className={`block ${isAnimated ? "animate-in" : ''}`}><span style={{ fontSize: " clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--dark-accent-color)" }}>{3}</span> <br />
            Concept Learned
          </div>
        </div>
      </article>


      <article className="achievements-list">
        <div className="a-list-component">
          <h3>You have completed 5 problems</h3>
        </div>
        <div className="a-list-component">
          <h3>You have completed 5 problems</h3>
        </div>
        <div className="a-list-component">
          <h3>You have completed 5 problems</h3>
        </div>
      </article>

    </section>
  );
};

export default RecentAchievements;