import React from 'react';
import './SpecialEvents.css';

const SpecialEvents = () => {
  const events = [
    {
      title: "Math Marathon",
      date: "2023-11-15",
      description: "Join us for a day-long math challenge and win exciting prizes!",
    },
    {
      title: "Pi Day Celebration",
      date: "2023-03-14",
      description: "Celebrate Pi Day with fun activities and competitions.",
    },
    {
      title: "Algebra Workshop",
      date: "2023-12-05",
      description: "Enhance your algebra skills with our expert-led workshop.",
    },
  ];

  return (
    <section className="special-events">
      <header>
        <h2>Upcoming Special Events</h2>
        <p>Don't miss out on these exciting opportunities to learn and compete!</p>
      </header>
      <ul className="events-list">
        {events.map((event, index) => (
          <li key={index} className="event-item">
            <h3>{event.title}</h3>
            <time dateTime={event.date}>{event.date}</time>
            <p>{event.description}</p>
            <button className="register-button">Register Now</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SpecialEvents;