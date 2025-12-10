import React, { useState, useEffect } from 'react';
import './SpecialEvents.css';

const SpecialEvents = () => {
  const events = [
    {
      id: 1,
      title: "Pi Day Celebration",
      date: "14/03/2026",
      description: "Celebrate Pi Day with fun activities and competitions.",
    }
  ];


  const [registrationStatus, setRegistrationStatus] = useState({});

  const registerToEvent = (eventId) => {
    // Add registration logic here

    setRegistrationStatus((prevStatus) => ({
      ...prevStatus,
      [eventId]: `You've registered for the "${events.find(event => event.id === eventId).title}" event.`
    }));
  };

  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <section className="special-events">

      <header>
        <h2>Upcoming Special Events</h2>
        <p>Don't miss out on these exciting opportunities to learn and compete!</p>
      </header>

      <ul className="events-list">
        {events.map((event, index) => (
          <li key={index} className={`event-item ${ isAnimated ? 'animate-in' : ''}`}>
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