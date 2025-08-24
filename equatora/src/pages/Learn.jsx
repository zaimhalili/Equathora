import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import './Learn.css';
import Idea from '../assets/images/idea.svg';
import { FaSearch } from 'react-icons/fa';

const Learn = (problems) => {

  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Memoize filtered results
  const filteredProblems = useMemo(() => {
    if (!searchTerm.trim() || !problems) return problems || [];

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
          <article id='welcome-learn'>
            <figure><img src={Idea} alt="idea image" /></figure>
            <div id="learn-explore">
              <h1>Explore the Math exercises on Equatora</h1>
              <h4>Unlock more exercises as you progress. They're great practise and fun to do!</h4>
            </div>
          </article>

          <article id='search-filtering'>
            <div id="searchbar-and-icon">
              <FaSearch id='search-icon' onClick={() => {alert("works")}} />
              <input
                type="search"
                name="problem-searchbar"
                id="problem-searchbar"
                placeholder='Search by title'
                aria-label='searchbar'
              />
            </div>

            <div id="filters-container">
              <button type="button" onClick={() => { alert("works") }}  className='filtering'>All Exercises <span id='problems-count'>50</span></button>
              <button type="button" onClick={() => { alert("works") }}  className='filtering'>Completed <span className='completed-problems'>0</span></button>
              <button type="button" onClick={() => { alert("works") }}  className='filtering'>In Progress <span className='inprogress-problems'>0</span></button>
              <button type="button" onClick={() => { alert("works") }}  className='filtering'>Premium <span className='premium-problems'>0</span></button>
            </div>
          </article>
          <article id='problems-container'>

          </article>
        </section>

        <footer>
          <Footer></Footer>
        </footer>
      </main>
    </>
  );
};

export default Learn;