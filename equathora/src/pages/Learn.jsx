import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import './Learn.css';
import Idea from '../assets/images/idea.svg';
import { FaSearch, FaTimes, FaChevronDown, FaFilter } from 'react-icons/fa';
import ProblemCard from '../components/ProblemCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllProblems } from '../lib/problemService';
import { getCompletedProblems, getFavoriteProblems } from '../lib/databaseService';
import { getInProgressProblems } from '../lib/progressStorage';

// Custom Dropdown Component with Portal
const FilterDropdown = ({ label, value, options, onChange, placeholder = "All" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      updatePosition();
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  return (
    <div className="filter-dropdown">
      <label className="filter-dropdown-label">{label}</label>
      <button
        ref={triggerRef}
        type="button"
        className={`filter-dropdown-trigger ${isOpen ? 'open' : ''} ${value ? 'has-value' : ''}`}
        onClick={handleOpen}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        <span className="filter-dropdown-text">{displayText}</span>
        <FaChevronDown className={`filter-dropdown-icon ${isOpen ? 'rotated' : ''}`} />
      </button>
      {isOpen && createPortal(
        <div
          className="filter-dropdown-menu filter-dropdown-portal"
          style={{
            position: 'absolute',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            width: `${menuPosition.width}px`
          }}
        >
          <button
            type="button"
            className={`filter-dropdown-option ${!value ? 'selected' : ''}`}
            onMouseDown={(e) => { e.preventDefault(); onChange(''); setIsOpen(false); }}
          >
            {placeholder}
          </button>
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              className={`filter-dropdown-option ${value === option.value ? 'selected' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); onChange(option.value); setIsOpen(false); }}
            >
              {option.label}
              {option.count !== undefined && (
                <span className="option-count">({option.count})</span>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

const Learn = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read filters from URL query params
  const searchQuery = searchParams.get('q') || '';
  const gradeFilter = searchParams.get('grade') || '';
  const difficultyFilter = searchParams.get('difficulty') || '';
  const statusFilter = searchParams.get('status') || '';
  const progressFilter = searchParams.get('progress') || '';
  const topicFilter = searchParams.get('topic') || '';
  const sortBy = searchParams.get('sort') || 'default';

  // Grade to group mapping
  const gradeGroups = {
    '8': [1],
    '9': [2, 3],
    '10': [4, 5],
    '11': [6, 7],
    '12': [8, 9, 10]
  };

  // Update URL params helper
  const updateFilters = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Extract unique topics from problems
  const availableTopics = useMemo(() => {
    const topicCounts = {};
    problems.forEach(p => {
      if (p.topic) {
        topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
      }
    });
    return Object.entries(topicCounts)
      .map(([topic, count]) => ({ value: topic, label: topic, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [problems]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (gradeFilter) count++;
    if (difficultyFilter) count++;
    if (statusFilter) count++;
    if (progressFilter) count++;
    if (topicFilter) count++;
    if (sortBy !== 'default') count++;
    return count;
  }, [gradeFilter, difficultyFilter, statusFilter, progressFilter, topicFilter, sortBy]);

  const clearAllFilters = () => {
    setSearchParams({}, { replace: true });
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

    // Apply grade filter
    if (gradeFilter) {
      const allowedGroups = gradeGroups[gradeFilter] || [];
      filtered = filtered.filter(p => allowedGroups.includes(p.group_id ?? p.groupId));
    }

    // Apply difficulty filter
    if (difficultyFilter) {
      filtered = filtered.filter(p =>
        p.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    // Apply topic filter
    if (topicFilter) {
      filtered = filtered.filter(p => p.topic === topicFilter);
    }

    // Apply status filter (completed/not started)
    if (statusFilter === 'completed') {
      filtered = filtered.filter(p => p.completed);
    } else if (statusFilter === 'not-started') {
      filtered = filtered.filter(p => !p.completed && !p.inProgress);
    }

    // Apply progress filter
    if (progressFilter === 'in-progress') {
      filtered = filtered.filter(p => p.inProgress);
    } else if (progressFilter === 'favourite') {
      filtered = filtered.filter(p => p.favourite);
    } else if (progressFilter === 'premium') {
      filtered = filtered.filter(p => p.premium || p.is_premium);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.topic?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'title-asc':
        filtered = [...filtered].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'title-desc':
        filtered = [...filtered].sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'difficulty-asc':
        filtered = [...filtered].sort((a, b) => {
          const order = { 'easy': 1, 'medium': 2, 'hard': 3 };
          return (order[a.difficulty?.toLowerCase()] || 0) - (order[b.difficulty?.toLowerCase()] || 0);
        });
        break;
      case 'difficulty-desc':
        filtered = [...filtered].sort((a, b) => {
          const order = { 'easy': 1, 'medium': 2, 'hard': 3 };
          return (order[b.difficulty?.toLowerCase()] || 0) - (order[a.difficulty?.toLowerCase()] || 0);
        });
        break;
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      default:
        // Keep original order (by group_id and display_order)
        break;
    }

    return filtered;
  }, [gradeFilter, difficultyFilter, topicFilter, statusFilter, progressFilter, searchQuery, sortBy, problems, gradeGroups]);

  // Dropdown options
  const gradeOptions = [
    { value: '8', label: 'Grade 8' },
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' }
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', count: problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length },
    { value: 'medium', label: 'Medium', count: problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length },
    { value: 'hard', label: 'Hard', count: problems.filter(p => p.difficulty?.toLowerCase() === 'hard').length }
  ];

  const statusOptions = [
    { value: 'completed', label: 'Completed', count: problems.filter(p => p.completed).length },
    { value: 'not-started', label: 'Not Started', count: problems.filter(p => !p.completed && !p.inProgress).length }
  ];

  const progressOptions = [
    { value: 'in-progress', label: 'In Progress', count: problems.filter(p => p.inProgress).length },
    { value: 'favourite', label: 'Favourite', count: problems.filter(p => p.favourite).length },
    { value: 'premium', label: 'Premium', count: problems.filter(p => p.premium || p.is_premium).length }
  ];

  const sortOptions = [
    { value: 'default', label: 'Default Order' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'difficulty-asc', label: 'Difficulty (Easy First)' },
    { value: 'difficulty-desc', label: 'Difficulty (Hard First)' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' }
  ];

  if (loading) {
    return <LoadingSpinner message="Loading exercises..." />;
  }

  return (
    <>
      <main id='body-learn'>
        <header>
          <Navbar />
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
                  onChange={(e) => updateFilters({ q: e.target.value })}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => updateFilters({ q: '' })}
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
                  <FaTimes /> Clear all ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="filter-dropdowns-container">
              <FilterDropdown
                label="Sort By"
                value={sortBy === 'default' ? '' : sortBy}
                options={sortOptions.filter(o => o.value !== 'default')}
                onChange={(val) => updateFilters({ sort: val || 'default' })}
                placeholder="Default Order"
              />

              <FilterDropdown
                label="Grade"
                value={gradeFilter}
                options={gradeOptions}
                onChange={(val) => updateFilters({ grade: val })}
                placeholder="All Grades"
              />

              <FilterDropdown
                label="Difficulty"
                value={difficultyFilter}
                options={difficultyOptions}
                onChange={(val) => updateFilters({ difficulty: val })}
                placeholder="All Difficulties"
              />

              <FilterDropdown
                label="Status"
                value={statusFilter}
                options={statusOptions}
                onChange={(val) => updateFilters({ status: val })}
                placeholder="All Status"
              />

              <FilterDropdown
                label="Progress"
                value={progressFilter}
                options={progressOptions}
                onChange={(val) => updateFilters({ progress: val })}
                placeholder="All Progress"
              />

              {availableTopics.length > 0 && (
                <FilterDropdown
                  label="Tags"
                  value={topicFilter}
                  options={availableTopics}
                  onChange={(val) => updateFilters({ topic: val })}
                  placeholder="All Topics"
                />
              )}
            </div>

            {/* Active Filters Pills */}
            {activeFilterCount > 0 && (
              <div className="active-filters-row">
                <span className="active-filters-label">
                  <FaFilter /> Active filters:
                </span>
                <div className="active-filters-pills">
                  {gradeFilter && (
                    <span className="active-filter-pill">
                      Grade {gradeFilter}
                      <button onClick={() => updateFilters({ grade: '' })}><FaTimes /></button>
                    </span>
                  )}
                  {difficultyFilter && (
                    <span className={`active-filter-pill ${difficultyFilter}`}>
                      {difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1)}
                      <button onClick={() => updateFilters({ difficulty: '' })}><FaTimes /></button>
                    </span>
                  )}
                  {statusFilter && (
                    <span className="active-filter-pill">
                      {statusFilter === 'completed' ? 'Completed' : 'Not Started'}
                      <button onClick={() => updateFilters({ status: '' })}><FaTimes /></button>
                    </span>
                  )}
                  {progressFilter && (
                    <span className="active-filter-pill">
                      {progressFilter === 'in-progress' ? 'In Progress' :
                        progressFilter === 'favourite' ? 'Favourite' : 'Premium'}
                      <button onClick={() => updateFilters({ progress: '' })}><FaTimes /></button>
                    </span>
                  )}
                  {topicFilter && (
                    <span className="active-filter-pill topic">
                      {topicFilter}
                      <button onClick={() => updateFilters({ topic: '' })}><FaTimes /></button>
                    </span>
                  )}
                  {sortBy !== 'default' && (
                    <span className="active-filter-pill sort">
                      {sortOptions.find(o => o.value === sortBy)?.label}
                      <button onClick={() => updateFilters({ sort: '' })}><FaTimes /></button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.article>

          {/* Results Summary */}
          <div className="results-summary">
            <span>
              Showing <strong>{filteredProblems.length}</strong> of <strong>{problems.length}</strong> exercises
            </span>
          </div>

          <motion.article
            id='problems-container'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredProblems.length === 0 ? (
              <div className="no-results">
                <h3>No exercises found</h3>
                <p>Try adjusting your filters or search query</p>
                <button onClick={clearAllFilters} className="reset-filters-btn">
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredProblems.map((problem) => (
                <motion.div key={problem.id}>
                  <ProblemCard problem={problem} />
                </motion.div>
              ))
            )}
          </motion.article>
        </section>

        <footer>
          <Footer />
        </footer>
      </main>
    </>
  );
};

export default Learn;