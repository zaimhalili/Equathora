import React, { useState } from 'react';
import './SpecialEvents.css';

const SpecialEvents = () => {
  const events = [
    {
      id: 1,
      title: "Math Marathon",
      date: "2025-11-15",
      description: "Join us for a day-long math challenge and win exciting prizes!",
    },
    {
      id: 2,
      title: "Pi Day Celebration",
      date: "2026-03-14",
      description: "Celebrate Pi Day with fun activities and competitions.",
    },
    {
      id: 3,
      title: "Algebra Workshop",
      date: "2026-12-05",
      description: "Enhance your algebra skills with our expert-led workshop.",
    },
  ];


  const [registrationStatus, setRegistrationStatus] = useState({});

  const registerToEvent = (eventId) => {
    // Add registration logic here

    setRegistrationStatus((prevStatus) => ({
      ...prevStatus,
      [eventId]: `You've registered for the "${events.find(event => event.id === eventId).title}" event.`
    }));
  };

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
            <button className="register-button" onClick={() => registerToEvent(event.id)}>Register Now</button>
            {registrationStatus[event.id] && (
              <p id='registration-status' style={{ color: "green", fontWeight: 700, paddingTop: '1rem' }}>
                {registrationStatus[event.id]}
              </p>
            )}

          </li>
        ))}
      </ul>
    </section>
  );
};

export default SpecialEvents;