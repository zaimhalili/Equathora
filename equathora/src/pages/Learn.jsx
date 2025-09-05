import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import './Learn.css';
import Idea from '../assets/images/idea.svg';
import { FaSearch } from 'react-icons/fa';
import ProblemCard from '../components/ProblemCard.jsx';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const Learn = () => {
  const { groupId } = useParams();

  // Mock data
  const problems = [
    { id: 1, title: "Two Sum", groupId: 1, difficulty: "Easy", description: "lorem lorem loremlorem loremlorem lorem lorem lorem lorem", completed: true, premium: false, inProgress: false, favourite: false },
    { id: 2, title: "Reverse String", groupId: 1, difficulty: "Easy", description: "lorem lorem loremlorem loremlorem lorem lorem lorem lorem", completed: false, premium: false, inProgress: false, favourite: false },
    { id: 3, title: "Reverse String", groupId: 1, difficulty: "Easy", description: "lorem lorem loremlorem loremlorem lorem lorem lorem lorem", completed: false, premium: false, inProgress: false, favourite: false },
    { id: 4, title: "Reverse String", groupId: 1, difficulty: "Easy", description: "lorem lorem loremlorem loremlorem lorem lorem lorem lorem", completed: true, premium: false, inProgress: false, favourite: true },
    { id: 5, title: "Reverse String", groupId: 1, difficulty: "Easy", description: "lorem lorem loremlorem loremlorem lorem lorem lorem lorem", completed: false, premium: false, inProgress: false, favourite: true },
  ];
  const location = useLocation();
  const [filter, setFilter] = useState(location.state?.filter || 'all');

  const filteredProblems = useMemo(() => {
    switch (filter) {
      case 'completed':
        return problems.filter(p => p.completed);
      case 'incomplete':
        return problems.filter(p => !p.completed);
      case 'premium':
        return problems.filter(p => p.premium);
      case 'in-progress':
        return problems.filter(p => p.inProgress);
      case 'favourite':
        return problems.filter(p => p.favourite);
      
      default:
        return problems;
    }
  }, [filter, problems]);

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
              <h1>Explore the Math exercises on equathora</h1>
              <h4>Unlock more exercises as you progress. They're great practise and fun to do!</h4>
            </div>
          </article>

          <article id='search-filtering'> 

            <div id="searchbar-and-icon">
              <FaSearch
                id='search-icon'
                onClick={() => document.getElementById('problem-searchbar').focus()}
              />
              <input
                type="search"
                name="problem-searchbar"
                id="problem-searchbar"
                placeholder='Search by title'
                aria-label='searchbar'
              />
            </div>

            
            <div id="filters-container">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`filtering ${filter === 'all' ? 'active' : ''}`}
              >
                All Exercises <span id='problems-count'>{problems.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`filtering ${filter === 'completed' ? 'active' : ''}`}
              >
                Completed <span className='completed-problems'>
                  {problems.filter(p => p.completed).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('in-progress')}
                className={`filtering ${filter === 'in-progress' ? 'active' : ''}`}
              >
                In Progress <span className='inprogress-problems'>
                  {problems.filter(p => p.inProgress).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('premium')}
                className={`filtering ${filter === 'premium' ? 'active' : ''}`}
              >
                Premium <span className='premium-problems'>
                  {problems.filter(p => p.premium).length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFilter('favourite')}
                className={`filtering ${filter === 'favourite' ? 'active' : ''}`}
              >
                Favourite <span className='favourite-problems'>
                  {problems.filter(p => p.favourite).length}
                </span>
              </button>
            </div>

          </article>
          <article id='problems-container'>
            {filteredProblems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
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