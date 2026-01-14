import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import './Learn.css';
import Idea from '../assets/images/idea.svg';
import { FaSearch, FaTimes } from 'react-icons/fa';
import ProblemCard from '../components/ProblemCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getAllProblems } from '../lib/problemService';
import { getCompletedProblems, getFavoriteProblems } from '../lib/databaseService';
import { getInProgressProblems } from '../lib/progressStorage';


const Learn = () => {
  const { groupId } = useParams();
  const location = useLocation();
  const [filter, setFilter] = useState(location.state?.filter || 'all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
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

  // Extract unique topics from problems
  const availableTopics = useMemo(() => {
    const topics = problems
      .map(p => p.topic)
      .filter(Boolean)
      .filter((topic, index, self) => self.indexOf(topic) === index)
      .sort();
    return topics;
  }, [problems]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (gradeFilter !== 'all') count++;
    if (difficultyFilter !== 'all') count++;
    if (topicFilter !== 'all') count++;
    return count;
  }, [gradeFilter, difficultyFilter, topicFilter]);

  const clearAllFilters = () => {
    setFilter('all');
    setGradeFilter('all');
    setDifficultyFilter('all');
    setTopicFilter('all');
    setSearchQuery('');
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const [allProblems, completedIds, favoriteIds] = await Promise.all([
          getAllProblems(),
          getCompletedProblems(),
          getFavoriteProblems()
        ]);

        // Get in-progress problems from local storage
        const inProgressIds = getInProgressProblems();

        const problemsWithStatus = allProblems.map(problem => {
          const problemIdStr = String(problem.id);
          const isCompleted = completedIds.includes(problemIdStr);
          return {
            ...problem,
            completed: isCompleted,
            favourite: favoriteIds.includes(problemIdStr),
            // A problem is in progress if it's been started but not completed
            inProgress: !isCompleted && inProgressIds.includes(problemIdStr)
          };
        });

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
      // Handle both Supabase (group_id) and local (groupId) field naming
      filtered = filtered.filter(p => allowedGroups.includes(p.group_id ?? p.groupId));
    }

    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(p =>
        p.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    // Apply topic filter
    if (topicFilter !== 'all') {
      filtered = filtered.filter(p => p.topic === topicFilter);
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

    // Apply search - enhanced to search title, description, and topic
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.topic?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [filter, gradeFilter, difficultyFilter, topicFilter, searchQuery, problems, gradeGroups]);

  if (loading) {
    return <LoadingSpinner message="Loading exercises..." />;
  }

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
            {/* Search Bar */}
            <div className="search-row">
              <div id="searchbar-and-icon">
                <FaSearch
                  id='search-icon'
                  onClick={() => document.getElementById('problem-searchbar').focus()}
                />
                <input
                  type="search"
                  name="problem-searchbar"
                  id="problem-searchbar"
                  placeholder='Search by title, topic, or description...'
                  aria-label='searchbar'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className="clear-all-btn"
                  onClick={clearAllFilters}
                >
                  <FaTimes /> Clear filters
                </button>
              )}
            </div>

            {/* Filter Rows - Horizontal Scrollable */}
            <div className="filter-rows-container">
              {/* Grade Filter */}
              <div className="filter-row">
                <span className="filter-row-label">Grade</span>
                <div className="filter-pills-scroll">
                  <button
                    type="button"
                    onClick={() => setGradeFilter('all')}
                    className={`filter-chip ${gradeFilter === 'all' ? 'active' : ''}`}
                  >
                    All
                  </button>
                  {['8', '9', '10', '11', '12'].map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setGradeFilter(grade)}
                      className={`filter-chip ${gradeFilter === grade ? 'active' : ''}`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="filter-row">
                <span className="filter-row-label">Difficulty</span>
                <div className="filter-pills-scroll">
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('all')}
                    className={`filter-chip ${difficultyFilter === 'all' ? 'active' : ''}`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('easy')}
                    className={`filter-chip easy ${difficultyFilter === 'easy' ? 'active' : ''}`}
                  >
                    Easy
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('medium')}
                    className={`filter-chip medium ${difficultyFilter === 'medium' ? 'active' : ''}`}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('hard')}
                    className={`filter-chip hard ${difficultyFilter === 'hard' ? 'active' : ''}`}
                  >
                    Hard
                  </button>
                </div>
              </div>

              {/* Topic Filter */}
              {availableTopics.length > 0 && (
                <div className="filter-row">
                  <span className="filter-row-label">Topic</span>
                  <div className="filter-pills-scroll">
                    <button
                      type="button"
                      onClick={() => setTopicFilter('all')}
                      className={`filter-chip ${topicFilter === 'all' ? 'active' : ''}`}
                    >
                      All
                    </button>
                    {availableTopics.map(topic => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setTopicFilter(topic)}
                        className={`filter-chip topic ${topicFilter === topic ? 'active' : ''}`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Filters */}
            <div id="filters-container">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`filtering ${filter === 'all' ? 'active' : ''}`}
              >
                All ({problems.length})
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
              <button
                type="button"
                onClick={() => setFilter('favourite')}
                className={`filtering ${filter === 'favourite' ? 'active' : ''}`}
              >
                Favourite ({problems.filter(p => p.favourite).length})
              </button>
            </div>
          </motion.article>

          {/* Results Summary */}
          <div className="results-summary">
            Showing <strong>{filteredProblems.length}</strong> of <strong>{problems.length}</strong> exercises
          </div>

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