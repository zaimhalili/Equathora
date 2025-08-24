import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import './Learn.css';
import Idea from '../assets/images/idea.svg';

const Learn = (problems) => {

  const [searchTerm, setSearchTerm] = useState('');

  // Filter problems in real-time
  const filteredProblems = useMemo(() => {
    if (!searchTerm.trim()) return problems;

    return problems.filter(problem =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [searchTerm, problems]);

  return (
    <>
      <main id='body-learn'>
        <header>
          <Navbar></Navbar>
        </header>
        <section id='hero-learn'>
            <figure><img src={Idea} alt="idea image" /></figure>
            <div id="learn-explore">
              <h1>Explore the Math exercises on Equatora</h1>
              <h4>Unlock more exercises as you progress. They're great practise and fun to do!</h4>
            </div>
          <article id='search-filtering'>
            <div id="searchbar-container">
              <input type="search" name="problem-searchbar" id="problem-searchbar" placeholder='Search by title' value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} aria-label='searchbar' />
            </div>

            <div className="filters-container">
              <button type="button" className='filtering'>All Exercises <span id='problems-count'>50</span></button>
              <button type="button" className='filtering'>Completed <span className='completed-problems'>0</span></button>
              <button type="button" className='filtering'>In Progress <span className='inprogress-problems'>0</span></button>
              <button type="button" className='filtering'>Premium <span className='premium-problems'>0</span></button>
            </div>
          </article>
          <article id='problems-container'>

          </article>
        </section>
      </main>
    </>
  );
};

export default Learn;