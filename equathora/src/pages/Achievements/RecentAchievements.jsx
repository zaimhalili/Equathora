import React from 'react';
import './AchievementsLayout.css';

const RecentAchievements = () => {
  const achievements = 120;
  return (
    <section className='rec-achievements'>
      <article className="a-top">
        <h2>Your Achievements</h2>
        <p>You have come a long way</p>
        <div className="block-container">
          <div className="block"><span style={{ fontSize: "clamp(3rem, 4vw, 4rem)", fontFamily: "'DynaPuff', serif", color: "white" }}>{51}</span> <br />
            Achievements Earned
          </div>
          <div className="block"><span style={{ fontSize: "clamp(3rem, 4vw, 4rem)", fontFamily: "'DynaPuff', serif", color: "white" }}>{achievements}</span> <br />
            Days Streak
          </div>
          <div className="block"><span style={{ fontSize: "clamp(3rem, 4vw, 4rem)", fontFamily: "'DynaPuff', serif", color: "white" }}>{3}</span> <br />
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