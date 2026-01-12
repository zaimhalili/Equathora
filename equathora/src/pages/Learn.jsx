import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { getAllProblems } from '../lib/problemService';
import { getCompletedProblems, getFavoriteProblems } from '../lib/databaseService';


const Learn = () => {
  const { groupId } = useParams();
  const location = useLocation();
  const [filter, setFilter] = useState(location.state?.filter || 'all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Grade to group mapping
  const gradeGroups = {
    '8': [1],
    '9': [2, 3],
    '10': [4, 5],
    '11': [6, 7],
    '12': [8, 9, 10]
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const [allProblems, completedIds, favoriteIds] = await Promise.all([
          getAllProblems(),
          getCompletedProblems(),
          getFavoriteProblems()
        ]);

        const problemsWithStatus = allProblems.map(problem => ({
          ...problem,
          completed: completedIds.includes(String(problem.id)),
          favourite: favoriteIds.includes(String(problem.id)),
          inProgress: false
        }));

        setProblems(problemsWithStatus);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();

    // Refresh on window focus (when returning from Problem page)
    const handleFocus = () => fetchProblems();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const filteredProblems = useMemo(() => {
    let filtered = problems;

    // Apply grade filter first
    if (gradeFilter !== 'all') {
      const allowedGroups = gradeGroups[gradeFilter] || [];
      filtered = filtered.filter(p => allowedGroups.includes(p.groupId));
    }

    // Apply status filter
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
  }, [filter, gradeFilter, searchQuery, problems, gradeGroups]);

  return (
    <>
      <main id='body-learn'>
        <header>
          <Navbar></Navbar>
        </header>
        <section id='hero-learn'>
          <motion.article
            id='welcome-learn'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <figure><img src={Idea} alt="idea image" /></figure>
            <div id="learn-explore">
              <h1>Explore the Math <br />exercises on <span style={{ color: 'var(--dark-accent-color)' }}>Equathora</span></h1>
              <h4>Unlock more exercises as you progress. They're great practise and fun to do!</h4>
            </div>
          </motion.article>

          <motion.article
            id='search-filtering'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >

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


            {/* Grade Filter Buttons */}
            <div id="grade-filters-container" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setGradeFilter('all')}
                className={`filtering ${gradeFilter === 'all' ? 'active' : ''}`}
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
              >
                All Grades
              </button>
              {['8', '9', '10', '11', '12'].map(grade => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setGradeFilter(grade)}
                  className={`filtering ${gradeFilter === grade ? 'active' : ''}`}
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  Grade {grade}
                </button>
              ))}
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

          </motion.article>
          <motion.article
            id='problems-container'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
              >
                <ProblemCard problem={problem} />
              </motion.div>
            ))}
          </motion.article>
        </section>

        <footer>
          <Footer></Footer>
        </footer>
      </main>
    </>
  );
};

export default Learn;