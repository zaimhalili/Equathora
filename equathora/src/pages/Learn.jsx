import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
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
    { id: 3, title: "Reverse String", groupId: 1, difficulty: "Hard", description: "lorem lorem loremlorem loremlorem lorem lorem lorem lorem", completed: false, premium: false, inProgress: false, favourite: false },
    { id: 4, title: "Reverse String", groupId: 1, difficulty: "Medium", description: "lorem lorem loremlorem loremlorem lorem lorem lorem lorem", completed: true, premium: false, inProgress: false, favourite: true },
    { id: 5, title: "Reverse String", groupId: 1, difficulty: "Easy", description: "lorem lorem loremlorem loremlorem lorem lorem lorem lorem", completed: false, premium: false, inProgress: false, favourite: true },
  ];
  const location = useLocation();
  const [filter, setFilter] = useState(location.state?.filter || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProblems = useMemo(() => {
    let filtered = problems;

    // Apply filter
    switch (filter) {
      case 'completed':
        filtered = filtered.filter(p => p.completed);
        break;
      case 'incomplete':
        filtered = filtered.filter(p => !p.completed);
        break;
      case 'premium':
        filtered = filtered.filter(p => p.premium);
        break;
      case 'in-progress':
        filtered = filtered.filter(p => p.inProgress);
        break;
      case 'favourite':
        filtered = filtered.filter(p => p.favourite);
        break;
      default:
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [filter, searchQuery, problems]);

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
              <h1>Explore the Math <br />exercises on <span style={{ color: 'var(--dark-accent-color)' }}>Equathora</span></h1>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>


            <div id="filters-container">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`filtering ${filter === 'all' ? 'active' : ''}`}
              >
                All Exercises ({problems.length})
              </button>

              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`filtering ${filter === 'completed' ? 'active' : ''}`}
              >
                Completed ({problems.filter(p => p.completed).length})
              </button>

              <button
                type="button"
                onClick={() => setFilter('in-progress')}
                className={`filtering ${filter === 'in-progress' ? 'active' : ''}`}
              >
                In Progress ({problems.filter(p => p.inProgress).length})
              </button>

              {/* Premium filter hidden for MVP */}
              {/* <button
                type="button"
                onClick={() => setFilter('premium')}
                className={`filtering ${filter === 'premium' ? 'active' : ''}`}
              >
                Premium ({problems.filter(p => p.premium).length})
              </button> */}
              <button
                type="button"
                onClick={() => setFilter('favourite')}
                className={`filtering ${filter === 'favourite' ? 'active' : ''}`}
              >
                Favourite ({problems.filter(p => p.favourite).length})
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