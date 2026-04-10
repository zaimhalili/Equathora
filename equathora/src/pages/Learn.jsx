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
import { getProblems } from '../lib/problemService';
import { StatusOptions, SortOptions } from '../enum/DropdownEnums';
import { formatTopicLabel } from '../lib/utils';

const FilterDropdown = ({ label, value, options, onChange, placeholder = "All", multiSelect = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);

  const selectedValues = value ? value.split(',') : [];

  let displayText;
  if (selectedValues.length === 0) {
    displayText = placeholder;
  } else if (selectedValues.length === 1) {
    const opt = options.find(o => o.value === selectedValues[0]);
    displayText = opt ? opt.label : placeholder;
  } else {
    displayText = `${selectedValues.length} selected`;
  }

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

  const handleOptionClick = (e, optionValue) => {
    e.preventDefault();
    if (multiSelect) {
      let newValues;
      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter(v => v !== optionValue);
      } else {
        newValues = [...selectedValues, optionValue];
      }
      onChange(newValues.join(','));
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

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
            onMouseDown={(e) => {
              e.preventDefault();
              onChange('');
              if (!multiSelect) setIsOpen(false);
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {multiSelect && <span style={{ width: '12px', display: 'inline-block' }}></span>}
              {placeholder}
            </span>
          </button>
          {options.map(option => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                className={`filter-dropdown-option ${isSelected ? 'selected' : ''}`}
                onMouseDown={(e) => handleOptionClick(e, option.value)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {multiSelect && (
                    <span style={{ width: '12px', display: 'inline-block', fontWeight: 'bold' }}>
                      {isSelected ? '✓' : ''}
                    </span>
                  )}
                  {option.label}
                </span>
                {option.count !== undefined && (
                  <span className="option-count" style={isSelected ? { color: 'rgba(255,255,255,0.8)' } : {}}>
                    ({option.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};

const Learn = () => {
  const difficultyOrder = {
    beginner: 1,
    easy: 2,
    standard: 3,
    intermediate: 4,
    medium: 5,
    challenging: 6,
    hard: 7,
    advanced: 8,
    expert: 9,
  };

  const pageSize = 50; // Default page size
  const [searchParams, setSearchParams] = useSearchParams();
  const [problems, setProblems] = useState({ count: 0, data: [] });
  const [facets, setFacets] = useState({ difficulties: [], topics: [], grade: [], progress: [] });
  const [difficultyFacetBase, setDifficultyFacetBase] = useState({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const hasLoadedOnceRef = useRef(false);

  // Read filters from URL query params
  const searchQuery = searchParams.get('q') || '';
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const gradeFilter = searchParams.get('grade') || '';
  const difficultyFilter = searchParams.get('difficulty') || '';
  const statusFilter = searchParams.get('status') || '';
  const topicFilter = searchParams.get('topic') || '';
  const sortBy = searchParams.get('sort') || 'default';

  const formatGradeLabel = useCallback((gradeValue) => {
    const grade = String(gradeValue || '').trim();
    if (!grade) return 'Grade';
    return /^\d+$/.test(grade) ? `Grade ${grade}` : grade;
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 900); // 900ms debounce
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

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

  useEffect(() => {
    const legacyProgress = searchParams.get('progress');
    if (!legacyProgress) return;

    const legacyToStatus = {
      'in-progress': 'in-progress',
      favorite: 'favorite',
      favourite: 'favorite'
    };

    const mappedStatuses = legacyProgress
      .split(',')
      .map((item) => legacyToStatus[item])
      .filter(Boolean);

    const existingStatuses = (searchParams.get('status') || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const mergedStatus = Array.from(new Set([...existingStatuses, ...mappedStatuses])).join(',');
    updateFilters({
      status: mergedStatus,
      progress: ''
    });
  }, [searchParams, updateFilters]);

  // Extract unique topics from problems
  const availableTopics = useMemo(() => {
    if (!facets.topic || typeof facets.topic !== 'object') return [];
    return Object.entries(facets.topic)
      .map(([topic, count]) => ({ value: topic, label: formatTopicLabel(topic), count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [facets]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (gradeFilter) count += gradeFilter.split(',').length;
    if (difficultyFilter) count += difficultyFilter.split(',').length;
    if (statusFilter) count += statusFilter.split(',').length;
    if (topicFilter) count += topicFilter.split(',').length;
    if (sortBy !== 'default') count++;
    return count;
  }, [gradeFilter, difficultyFilter, statusFilter, topicFilter, sortBy]);

  const removeFilterValue = (key, currentValues, valueToRemove) => {
    const newValues = currentValues.split(',').filter(v => v !== valueToRemove).join(',');
    updateFilters({ [key]: newValues });
  };

  const clearAllFilters = () => {
    setSearchParams({}, { replace: true });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [gradeFilter, difficultyFilter, topicFilter, statusFilter, debouncedSearchQuery, sortBy]);

  useEffect(() => {
    const fetchPagedProblems = async () => {
      try {
        if (currentPage === 1) {
          if (hasLoadedOnceRef.current) {
            setIsRefreshing(true);
          } else {
            setLoading(true);
          }
        } else {
          setLoadingMore(true);
        }

        const problemId = null;
        const slug = null;
        const difficulties = difficultyFilter ? difficultyFilter.split(',') : null;
        const topics = topicFilter ? topicFilter.split(',') : null;
        const searchTerm = debouncedSearchQuery || null;
        const sort = sortBy === 'default' ? null : sortBy;
        const status = statusFilter ? statusFilter.split(',') : null;
        const grades = gradeFilter ? gradeFilter.split(',') : null;

        const response = await getProblems(
          currentPage,
          pageSize,
          problemId,
          slug,
          difficulties,
          topics,
          grades,
          searchTerm,
          sort,
          null,
          status
        );

        const pageData = response?.data || [];

        setFacets({
          grade: response?.facets?.grade || {},
          topic: response?.facets?.topic || {},
          progress: response?.facets?.progress || {},
          difficulty: response?.facets?.difficulty || {}
        });

        // Keep a stable source of difficulty options so multi-select does not collapse
        // to only the currently selected value(s) after filtering.
        if (!difficultyFilter) {
          setDifficultyFacetBase(response?.facets?.difficulty || {});
        }

        setTotalCount(response?.count || 0);

        setProblems((prev) => {
          if (currentPage === 1) {
            hasLoadedOnceRef.current = true;
            return { count: response?.count || 0, data: pageData };
          }
          return {
            count: response?.count || 0,
            data: [...prev.data, ...pageData]
          };
        });
      } catch (error) {
        console.error('Failed to fetch problems:', error);
        if (currentPage === 1) {
          setProblems({ count: 0, data: [] });
          setTotalCount(0);
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
        setLoadingMore(false);
      }
    };

    fetchPagedProblems();
  }, [currentPage, gradeFilter, difficultyFilter, topicFilter, statusFilter, debouncedSearchQuery, sortBy]);

  const hasMore = problems?.data?.length < totalCount;
  const remainingCount = Math.max(0, totalCount - (problems?.data?.length || 0));
  const handleShowMore = () => {
    if (!loadingMore && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const gradeOptions = useMemo(() => {
    if (!facets.grade || typeof facets.grade !== 'object') return [];
    return Object.entries(facets.grade)
      .map(([value, count]) => ({
        value,
        label: formatGradeLabel(value),
        count
      }))
      .sort((a, b) => {
        const aNumeric = /^\d+$/.test(a.value) ? Number(a.value) : Number.NaN;
        const bNumeric = /^\d+$/.test(b.value) ? Number(b.value) : Number.NaN;

        if (Number.isFinite(aNumeric) && Number.isFinite(bNumeric)) {
          return aNumeric - bNumeric;
        }

        if (Number.isFinite(aNumeric)) return -1;
        if (Number.isFinite(bNumeric)) return 1;
        return a.label.localeCompare(b.label);
      });
  }, [facets.grade, formatGradeLabel]);

  const difficultyOptions = useMemo(() => {
    const currentDifficultyFacet = (facets.difficulty && typeof facets.difficulty === 'object')
      ? facets.difficulty
      : {};
    const baseFacet = (difficultyFacetBase && typeof difficultyFacetBase === 'object')
      ? difficultyFacetBase
      : {};

    const selectedValues = difficultyFilter
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    const mergedKeys = Array.from(new Set([
      ...Object.keys(baseFacet),
      ...Object.keys(currentDifficultyFacet),
      ...selectedValues
    ]));

    return mergedKeys
      .map((value) => ({
        value,
        label: value,
        count: currentDifficultyFacet[value] ?? baseFacet[value] ?? 0
      }))
      .sort((a, b) => {
        const aRank = difficultyOrder[String(a.value).toLowerCase()] ?? 99;
        const bRank = difficultyOrder[String(b.value).toLowerCase()] ?? 99;
        if (aRank !== bRank) return aRank - bRank;
        return a.label.localeCompare(b.label);
      });
  }, [facets.difficulty, difficultyFacetBase, difficultyFilter]);

  const completedCount = facets.progress["completed"] !== undefined ? facets.progress["completed"] : 0;
  const inProgressCount = facets.progress["inProgress"] !== undefined
    ? facets.progress["inProgress"]
    : (facets.progress["in-progress"] !== undefined ? facets.progress["in-progress"] : 0);
  const totalProblems = problems?.count || 0;
  const notStartedCount = Math.max(totalProblems - completedCount - inProgressCount, 0);

  const statusCountMap = {
    'in-progress': inProgressCount,
    completed: completedCount,
    notstarted: notStartedCount,
    favorite: undefined
  };

  const statusOptions = StatusOptions.map((option) => ({
    ...option,
    count: statusCountMap[option.value]
  }));

  const sortOptions = SortOptions;

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
            <figure><img src={Idea} alt="idea image" fetchPriority="high" loading="eager" decoding="async" width="200" height="200" /></figure>
            <div id="learn-explore">
              <h1>Explore the Math <br />exercises on <span className="text-transparent bg-clip-text bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color)65%)] relative inline-block">
                Equathora
                <motion.svg
                  className="absolute -bottom-0 left-0 w-full"
                  viewBox="0 0 200 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <motion.path
                    d="M0 4 Q50 0 100 4 Q150 8 200 4"
                    fill="none"
                    stroke="var(--accent-color)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </motion.svg>
              </span></h1>
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
            <div className="search-row ">
              <div id="searchbar-and-icon">
                <FaSearch
                  id='search-icon'
                  onClick={() => document.getElementById('problem-searchbar').focus()}
                />
                <input
                  type="search"
                  name="problem-searchbar"
                  className="py-3"
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
                multiSelect={true}
              />

              <FilterDropdown
                label="Difficulty"
                value={difficultyFilter}
                options={difficultyOptions}
                onChange={(val) => updateFilters({ difficulty: val })}
                placeholder="All Difficulties"
                multiSelect={true}
              />

              <FilterDropdown
                label="Status"
                value={statusFilter}
                options={statusOptions}
                onChange={(val) => updateFilters({ status: val })}
                placeholder="All Status"
                multiSelect={true}
              />

              <FilterDropdown
                label="Topics"
                value={topicFilter}
                options={availableTopics}
                onChange={(val) => updateFilters({ topic: val })}
                placeholder="All Topics"
                multiSelect={true}
              />
            </div>

            {/* Active Filters Pills */}
            {activeFilterCount > 0 && (
              <div className="active-filters-row">
                <span className="active-filters-label">
                  <FaFilter /> Active filters:
                </span>
                <div className="active-filters-pills">
                  {gradeFilter && gradeFilter.split(',').map(grade => (
                    <span key={`grade-${grade}`} className="active-filter-pill">
                      {formatGradeLabel(grade)}
                      <button onClick={() => removeFilterValue('grade', gradeFilter, grade)}><FaTimes /></button>
                    </span>
                  ))}
                  {difficultyFilter && difficultyFilter.split(',').map(diff => (
                    <span key={`diff-${diff}`} className={`active-filter-pill ${diff}`}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      <button onClick={() => removeFilterValue('difficulty', difficultyFilter, diff)}><FaTimes /></button>
                    </span>
                  ))}
                  {statusFilter && statusFilter.split(',').map(status => (
                    <span key={`status-${status}`} className="active-filter-pill">
                      {status === 'completed'
                        ? 'Completed'
                        : status === 'in-progress'
                          ? 'In Progress'
                          : status === 'favorite'
                            ? 'Favourite'
                            : 'Not Started'}
                      <button onClick={() => removeFilterValue('status', statusFilter, status)}><FaTimes /></button>
                    </span>
                  ))}
                  {topicFilter && topicFilter.split(',').map(topic => (
                    <span key={`topic-${topic}`} className="active-filter-pill topic">
                      {formatTopicLabel(topic)}
                      <button onClick={() => removeFilterValue('topic', topicFilter, topic)}><FaTimes /></button>
                    </span>
                  ))}
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
              Showing <strong>{problems?.data?.length}</strong> of <strong>{totalCount}</strong> exercises
            </span>
            {isRefreshing && <span className="results-refreshing">Updating problems…</span>}
          </div>
          <motion.article
            id='problems-container'
            className={isRefreshing ? 'problems-refreshing' : ''}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {problems?.count === 0 ? (
              <div className="no-results">
                <h3>No exercises found</h3>
                <p>Try adjusting your filters or search query</p>
                <button onClick={clearAllFilters} className="reset-filters-btn">
                  Reset all filters
                </button>
              </div>
            ) : (
              problems?.data?.map((problem) => (
                <motion.div key={problem.id}>
                  <ProblemCard problem={problem} />
                </motion.div>
              ))
            )}
          </motion.article>

          {!loading && problems?.count > 0 && hasMore && (
            <div className="show-more-row">
              <button
                type="button"
                className="show-more-btn"
                onClick={handleShowMore}
                disabled={loadingMore || isRefreshing}
              >
                {loadingMore ? 'Loading…' : `Show more (${Math.min(pageSize, remainingCount)} more)`}
              </button>
            </div>
          )}
        </section>

        <footer>
          <Footer />
        </footer>
      </main>

    </>
  );
};

export default Learn;