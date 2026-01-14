import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import './Learn.css';
import Idea from '../assets/images/idea.svg';
import { FaSearch, FaTimes, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ProblemCard from '../components/ProblemCard.jsx';
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
            {/* Search Bar Row */}
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
              
              {/* Advanced Filters Toggle */}
              <button
                type="button"
                className={`advanced-filters-toggle ${showAdvancedFilters ? 'active' : ''} ${activeFilterCount > 0 ? 'has-filters' : ''}`}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <FaFilter />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="filter-count-badge">{activeFilterCount}</span>
                )}
                {showAdvancedFilters ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  className="advanced-filters-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Grade Filter */}
                  <div className="filter-group">
                    <p className="filter-label">Grade Level</p>
                    <div className="filter-pills">
                      <button
                        type="button"
                        onClick={() => setGradeFilter('all')}
                        className={`filter-pill ${gradeFilter === 'all' ? 'active' : ''}`}
                      >
                        All Grades
                      </button>
                      {['8', '9', '10', '11', '12'].map(grade => (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => setGradeFilter(grade)}
                          className={`filter-pill ${gradeFilter === grade ? 'active' : ''}`}
                        >
                          Grade {grade}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div className="filter-group">
                    <p className="filter-label">Difficulty</p>
                    <div className="filter-pills">
                      <button
                        type="button"
                        onClick={() => setDifficultyFilter('all')}
                        className={`filter-pill ${difficultyFilter === 'all' ? 'active' : ''}`}
                      >
                        All Levels
                      </button>
                      <button
                        type="button"
                        onClick={() => setDifficultyFilter('easy')}
                        className={`filter-pill difficulty-easy ${difficultyFilter === 'easy' ? 'active' : ''}`}
                      >
                        🟢 Easy ({problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setDifficultyFilter('medium')}
                        className={`filter-pill difficulty-medium ${difficultyFilter === 'medium' ? 'active' : ''}`}
                      >
                        🟡 Medium ({problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setDifficultyFilter('hard')}
                        className={`filter-pill difficulty-hard ${difficultyFilter === 'hard' ? 'active' : ''}`}
                      >
                        🔴 Hard ({problems.filter(p => p.difficulty?.toLowerCase() === 'hard').length})
                      </button>
                    </div>
                  </div>

                  {/* Topic Filter */}
                  {availableTopics.length > 0 && (
                    <div className="filter-group">
                      <p className="filter-label">Topic</p>
                      <div className="filter-pills topics-grid">
                        <button
                          type="button"
                          onClick={() => setTopicFilter('all')}
                          className={`filter-pill ${topicFilter === 'all' ? 'active' : ''}`}
                        >
                          All Topics
                        </button>
                        {availableTopics.map(topic => (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => setTopicFilter(topic)}
                            className={`filter-pill topic-pill ${topicFilter === topic ? 'active' : ''}`}
                          >
                            {topic} ({problems.filter(p => p.topic === topic).length})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clear All Filters */}
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      className="clear-all-filters-btn"
                      onClick={clearAllFilters}
                    >
                      <FaTimes /> Clear All Filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Filters */}
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

              <button
                type="button"
                onClick={() => setFilter('favourite')}
                className={`filtering ${filter === 'favourite' ? 'active' : ''}`}
              >
                Favourite ({problems.filter(p => p.favourite).length})
              </button>
            </div>

            {/* Active Filters Summary */}
            {(activeFilterCount > 0 || searchQuery) && (
              <div className="active-filters-summary">
                <span className="summary-label">Active filters:</span>
                {searchQuery && (
                  <span className="active-filter-tag">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}><FaTimes /></button>
                  </span>
                )}
                {gradeFilter !== 'all' && (
                  <span className="active-filter-tag">
                    Grade {gradeFilter}
                    <button onClick={() => setGradeFilter('all')}><FaTimes /></button>
                  </span>
                )}
                {difficultyFilter !== 'all' && (
                  <span className="active-filter-tag">
                    {difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1)}
                    <button onClick={() => setDifficultyFilter('all')}><FaTimes /></button>
                  </span>
                )}
                {topicFilter !== 'all' && (
                  <span className="active-filter-tag">
                    {topicFilter}
                    <button onClick={() => setTopicFilter('all')}><FaTimes /></button>
                  </span>
                )}
              </div>
            )}

          </motion.article>

          {/* Results Count */}
          <div className="results-count">
            <p>
              Showing <strong>{filteredProblems.length}</strong> of <strong>{problems.length}</strong> exercises
              {filteredProblems.length === 0 && problems.length > 0 && (
                <button 
                  type="button" 
                  className="reset-filters-link"
                  onClick={clearAllFilters}
                >
                  Reset filters
                </button>
              )}
            </p>
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