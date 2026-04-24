import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  createRef,
} from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TopicNode from '@/components/TopicNode';
import mathPathTopics from '@/data/mathPathData';
import { FaRoute, FaCheckCircle, FaLock, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';
import { getAllProblems } from '@/lib/problemService';
import { getTopicFrequency, incrementTopicFrequency } from '@/lib/databaseService';

/* ================================================================
   TOPIC MAPPING — maps mathPathData topic IDs to DB topic values.
   Each key lists the DB `topic` strings that belong to it.
   Falls back to case-insensitive title matching too.
   ================================================================ */
const TOPIC_DB_MAP = {
  'arithmetic': ['Arithmetic'],
  'fractions': ['Fractions'],
  'decimals': ['Decimals'],
  'ratios': ['Ratio & Proportion', 'Grade 10 - Ratio & Proportion', 'Ratios'],
  'variables': ['Variables'],
  'expressions': ['Algebraic Expressions', 'Expressions'],
  'linear-equations': ['Linear Equations'],
  'inequalities': ['Inequalities'],
  'systems-of-equations': ['Systems of Equations'],
  'functions': ['Functions'],
  'graphs': ['Graphs', 'Geometry'],
  'polynomials': ['Polynomials'],
  'factoring': ['Factoring'],
  'quadratics': ['Quadratic Equations', 'Grade 10 - Quadratic Equations', 'Quadratics'],
  'exponents-logarithms': ['Exponents', 'Logarithms', 'Exponents & Logs'],
  'sequences-series': ['Sequences & Series', 'Grade 11 - Sequences & Series', 'Arithmetic series'],
  'logical-reasoning': ['Logical Reasoning', 'Logic'],
  'proof-techniques': ['Proof Techniques', 'Proofs'],
  'combinatorics': ['Combinatorics', 'Counting and probability', 'Grade 12 - Binomial Theorem'],
  'number-theory': ['Number Theory'],
};

/** Match a DB problem topic string to a mathPathData topic id */
function matchProblemToTopic(dbTopic) {
  if (!dbTopic) return null;
  const lower = dbTopic.toLowerCase();
  for (const [topicId, aliases] of Object.entries(TOPIC_DB_MAP)) {
    for (const alias of aliases) {
      if (alias.toLowerCase() === lower || lower.includes(alias.toLowerCase())) {
        return topicId;
      }
    }
  }
  // Fallback: try matching against topic titles
  for (const t of mathPathTopics) {
    if (lower.includes(t.title.toLowerCase()) || t.title.toLowerCase().includes(lower)) {
      return t.id;
    }
  }
  return null;
}

/* ================================================================
   HELPER — derive statuses from the completed set
   ================================================================ */
function deriveStatuses(topics, completedIds) {
  const statusMap = {};
  topics.forEach((t) => {
    if (completedIds.has(t.id)) {
      statusMap[t.id] = 'completed';
    } else if (
      t.prerequisites.length === 0 ||
      t.prerequisites.every((p) => completedIds.has(p))
    ) {
      statusMap[t.id] = 'available';
    } else {
      statusMap[t.id] = 'locked';
    }
  });
  return statusMap;
}

/* ================================================================
   HELPER — group flat topic list into grid rows
   Each row holds 1-3 topics that share the same prerequisite set
   within a category.
   ================================================================ */
function buildRows(topics) {
  const rows = [];
  let currentRow = [];
  let prevCategory = null;

  topics.forEach((t, i) => {
    if (t.category !== prevCategory && currentRow.length > 0) {
      rows.push({ category: prevCategory, topics: currentRow });
      currentRow = [];
    }

    currentRow.push(t);
    prevCategory = t.category;

    const next = topics[i + 1];
    const nextPrereqs =
      next && next.category === t.category
        ? next.prerequisites.join(',')
        : null;
    const curPrereqs = t.prerequisites.join(',');

    if (
      !next ||
      next.category !== t.category ||
      (nextPrereqs !== curPrereqs && currentRow.length >= 1)
    ) {
      rows.push({ category: t.category, topics: currentRow });
      currentRow = [];
    }
  });

  if (currentRow.length > 0) {
    rows.push({ category: prevCategory, topics: currentRow });
  }

  return rows;
}

/* ================================================================
   HELPER — generate cubic-bezier SVG path between two points
   ================================================================ */
function curvedPath(x1, y1, x2, y2) {
  const dy = y2 - y1;
  const strength = 0.5;
  const c1x = x1;
  const c1y = y1 + dy * strength;
  const c2x = x2;
  const c2y = y2 - dy * strength;
  return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
}

/* ================================================================
   SUB-COMPONENT — Category Label
   ================================================================ */
const CategoryLabel = ({ label, index, completedCount, totalCount }) => (
  <motion.div
    className="col-span-1 md:col-span-3 flex items-center justify-center gap-3 py-3 md:py-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
  >
    <span className="h-px flex-1 max-w-16 md:max-w-24 bg-gradient-to-r from-transparent to-[var(--french-gray)]/60" />
    <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-[var(--mid-main-secondary)]/20">
      <span className="text-xs md:text-sm font-bold tracking-wide uppercase text-[var(--secondary-color)] font-[Sansation,sans-serif]">
        {label}
      </span>
      {totalCount > 0 && (
        <span className="text-[10px] font-medium text-[var(--mid-main-secondary)] bg-[var(--french-gray)]/20 rounded-full px-2 py-0.5">
          {completedCount}/{totalCount}
        </span>
      )}
    </div>
    <span className="h-px flex-1 max-w-16 md:max-w-24 bg-gradient-to-l from-transparent to-[var(--french-gray)]/60" />
  </motion.div>
);

/* ================================================================
   SUB-COMPONENT — SVG Connector Layer (absolute overlay)
   Reads node refs + container ref, computes curved bezier paths.
   ================================================================ */
const SVGConnectorLayer = ({ topics, statusMap, nodeRefs, containerRef }) => {
  const [paths, setPaths] = useState([]);

  const computePaths = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newPaths = [];

    topics.forEach((topic) => {
      topic.prerequisites.forEach((prereqId) => {
        const parentEl = nodeRefs.current[prereqId]?.current;
        const childEl = nodeRefs.current[topic.id]?.current;
        if (!parentEl || !childEl) return;

        const parentRect = parentEl.getBoundingClientRect();
        const childRect = childEl.getBoundingClientRect();

        const parentX =
          parentRect.left + parentRect.width / 2 - containerRect.left;
        const parentY = parentRect.bottom - containerRect.top;
        const childX =
          childRect.left + childRect.width / 2 - containerRect.left;
        const childY = childRect.top - containerRect.top;

        // Determine visual style from statuses
        const parentStatus = statusMap[prereqId] || 'locked';
        const childStatus = statusMap[topic.id] || 'locked';
        const isActive =
          parentStatus === 'completed' && childStatus !== 'locked';
        const isCompleted =
          parentStatus === 'completed' && childStatus === 'completed';

        newPaths.push({
          key: `${prereqId}->${topic.id}`,
          d: curvedPath(parentX, parentY, childX, childY),
          isActive,
          isCompleted,
        });
      });
    });

    setPaths(newPaths);
  }, [topics, statusMap, nodeRefs, containerRef]);

  useEffect(() => {
    // Calculate after first paint
    const frame = requestAnimationFrame(computePaths);
    return () => cancelAnimationFrame(frame);
  }, [computePaths]);

  // Recalculate on resize via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(computePaths);
    });
    ro.observe(container);

    window.addEventListener('resize', computePaths);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computePaths);
    };
  }, [computePaths, containerRef]);

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="connectorActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--mid-main-secondary)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--mid-main-secondary)" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="connectorCompleted" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {paths.map((p) => (
        <path
          key={p.key}
          d={p.d}
          fill="none"
          stroke={
            p.isCompleted
              ? 'url(#connectorCompleted)'
              : p.isActive
                ? 'url(#connectorActive)'
                : 'var(--french-gray)'
          }
          strokeWidth={p.isCompleted ? 2.5 : 2}
          strokeLinecap="round"
          strokeDasharray={p.isCompleted ? 'none' : p.isActive ? '8 4' : '4 6'}
          opacity={p.isCompleted ? 1 : p.isActive ? 0.7 : 0.25}
        />
      ))}
    </svg>
  );
};

/* ================================================================
   PAGE — Discover (Math Learning Path)
   ================================================================ */
const Discover = () => {
  const navigate = useNavigate();

  /* ── Database-driven state ───────────────────────────── */
  const [completedIds, setCompletedIds] = useState(new Set());
  const [problemsByTopic, setProblemsByTopic] = useState({}); // { [topicId]: [{id,title,slug},...] }
  const [loading, setLoading] = useState(true);

  // Fetch problems & user progress from Supabase
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        // Parallel: all problems + user topic frequency
        const [allProblems, topicFreq] = await Promise.all([
          getAllProblems(),
          getTopicFrequency().catch(() => []), // graceful fallback if not logged in
        ]);

        if (cancelled) return;

        // Group problems by mathPathData topic id
        const grouped = {};
        (allProblems || []).forEach((p) => {
          const topicId = matchProblemToTopic(p.topic);
          if (topicId) {
            if (!grouped[topicId]) grouped[topicId] = [];
            grouped[topicId].push({
              id: p.id,
              title: p.title,
              slug: p.slug || p.id,
            });
          }
        });
        setProblemsByTopic(grouped);

        // Derive completed topics: topics where user has frequency count > 0
        const completedSet = new Set();
        (topicFreq || []).forEach((tf) => {
          const topicId = matchProblemToTopic(tf.topic);
          if (topicId && tf.count > 0) {
            completedSet.add(topicId);
          }
        });
        setCompletedIds(completedSet);
      } catch (err) {
        console.error('Discover: failed to load data', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const statusMap = useMemo(
    () => deriveStatuses(mathPathTopics, completedIds),
    [completedIds],
  );

  // Build a stable map of refs: { [topicId]: React.createRef() }
  const nodeRefs = useRef({});
  useMemo(() => {
    mathPathTopics.forEach((t) => {
      if (!nodeRefs.current[t.id]) {
        nodeRefs.current[t.id] = createRef();
      }
    });
  }, []);

  // Container ref for SVG overlay coordinate math
  const containerRef = useRef(null);

  // Topic rows for grid layout
  const rows = useMemo(() => buildRows(mathPathTopics), []);

  // Per-category stats
  const categoryStats = useMemo(() => {
    const stats = {};
    mathPathTopics.forEach((t) => {
      if (!stats[t.category]) stats[t.category] = { total: 0, completed: 0 };
      stats[t.category].total++;
      if (completedIds.has(t.id)) stats[t.category].completed++;
    });
    return stats;
  }, [completedIds]);

  // Stats
  const totalTopics = mathPathTopics.length;
  const completedCount = completedIds.size;
  const availableCount = Object.values(statusMap).filter(
    (s) => s === 'available',
  ).length;
  const lockedCount = totalTopics - completedCount - availableCount;
  const progressPct =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // When user clicks a topic: push to DB + navigate to learn page
  const handleTopicClick = useCallback(async (topic) => {
    // Push concept open to database (fire-and-forget)
    incrementTopicFrequency(topic.title).catch((err) =>
      console.warn('Failed to track topic open:', err),
    );

    // Navigate to the learn page filtered by this topic
    navigate(`/learn?topic=${encodeURIComponent(topic.title)}`);
  }, [navigate]);

  useEffect(() => {
    document.title = 'Discover — Equathora';
  }, []);

  /* ── Render grid rows ── */
  let globalIndex = 0;
  let lastCategory = null;
  let catIndex = 0;
  const gridItems = [];

  rows.forEach((row, rowIdx) => {
    const showCategoryLabel = row.category !== lastCategory;
    if (showCategoryLabel) {
      lastCategory = row.category;
      catIndex += 1;
      const stats = categoryStats[row.category] || { total: 0, completed: 0 };
      gridItems.push(
        <CategoryLabel
          key={`cat-${row.category}`}
          label={row.category}
          index={catIndex}
          completedCount={stats.completed}
          totalCount={stats.total}
        />,
      );
    }

    // For each topic in this row, place it in its designated column
    const byCol = { left: [], center: [], right: [] };
    row.topics.forEach((t) => {
      byCol[t.column || 'center'].push(t);
    });

    // Left cell
    gridItems.push(
      <div
        key={`left-${rowIdx}`}
        className="hidden md:flex justify-center items-start"
      >
        {byCol.left.map((t) => (
          <TopicNode
            key={t.id}
            ref={nodeRefs.current[t.id]}
            topic={t}
            status={statusMap[t.id]}
            index={globalIndex++}
            onClick={() => handleTopicClick(t)}
            allTopics={mathPathTopics}
            problemCount={(problemsByTopic[t.id] || []).length}
            problems={problemsByTopic[t.id] || []}
          />
        ))}
      </div>,
    );

    // Center cell
    gridItems.push(
      <div key={`center-${rowIdx}`} className="hidden md:flex justify-center items-start">
        {byCol.center.map((t) => (
          <TopicNode
            key={t.id}
            ref={nodeRefs.current[t.id]}
            topic={t}
            status={statusMap[t.id]}
            index={globalIndex++}
            onClick={() => handleTopicClick(t)}
            allTopics={mathPathTopics}
            problemCount={(problemsByTopic[t.id] || []).length}
            problems={problemsByTopic[t.id] || []}
          />
        ))}
      </div>,
    );

    // Right cell
    gridItems.push(
      <div
        key={`right-${rowIdx}`}
        className="hidden md:flex justify-center items-start"
      >
        {byCol.right.map((t) => (
          <TopicNode
            key={t.id}
            ref={nodeRefs.current[t.id]}
            topic={t}
            status={statusMap[t.id]}
            index={globalIndex++}
            onClick={() => handleTopicClick(t)}
            allTopics={mathPathTopics}
            problemCount={(problemsByTopic[t.id] || []).length}
            problems={problemsByTopic[t.id] || []}
          />
        ))}
      </div>,
    );

    // Mobile: single-column, all topics in order
    const mobileTopics = [...byCol.left, ...byCol.center, ...byCol.right];
    mobileTopics.forEach((t) => {
      gridItems.push(
        <div
          key={`mobile-${t.id}`}
          className="flex md:hidden justify-center items-start"
        >
          <TopicNode
            ref={nodeRefs.current[t.id]}
            topic={t}
            status={statusMap[t.id]}
            index={globalIndex++}
            onClick={() => handleTopicClick(t)}
            allTopics={mathPathTopics}
            problemCount={(problemsByTopic[t.id] || []).length}
            problems={problemsByTopic[t.id] || []}
          />
        </div>,
      );
    });
  });

  return (
    <>
      <Navbar />
      <div className="bg-[linear-gradient(180deg,var(--mid-main-secondary)_45%,var(--main-color))] bg-fixed min-h-screen pt-24 pb-20 font-[Sansation,sans-serif]">
        {/* ── Centered container matching Dashboard max-width ── */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw]">

            {/* ── Hero Header ───────────────────────────────── */}
            <div className="pb-12 flex justify-center">
              <motion.div
                className="text-center flex items-center flex-col gap-4 max-w-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="flex items-center justify-center h-14 w-14 rounded-2xl bg-white/90 shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <FaRoute className="text-[var(--accent-color)] text-2xl" />
                </motion.div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--secondary-color)] leading-tight">
                  Your Journey Through Mathematics
                </h1>
                <p className="text-[var(--secondary-color)] text-base md:text-lg leading-relaxed max-w-xl opacity-90">
                  Master mathematical thinking step by step. Unlock topics as you
                  progress from foundations to advanced problem solving.
                </p>

                {/* Progress stats strip — dashboard-style cards */}
                <motion.div
                  className="flex flex-wrap justify-center gap-2 md:gap-3 pt-4 w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {[
                    { icon: <FaCheckCircle className="text-green-500" />, label: 'Completed', value: completedCount, color: 'green' },
                    { icon: <FaMapMarkerAlt className="text-[var(--accent-color)]" />, label: 'Available', value: availableCount, color: 'accent' },
                    { icon: <FaLock className="text-[var(--mid-main-secondary)]" />, label: 'Locked', value: lockedCount, color: 'gray' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 shadow-sm transition-all duration-150 ease-out hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] hover:scale-105 active:scale-100 cursor-default"
                    >
                      <div className="flex-shrink-0 text-base">{stat.icon}</div>
                      <div className="text-left">
                        <p className="text-[10px] text-[var(--mid-main-secondary)] font-medium leading-none">
                          {stat.label}
                        </p>
                        <p className="text-lg font-bold text-[var(--secondary-color)] leading-tight">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Progress bar */}
                <motion.div
                  className="w-full max-w-md pt-2"
                  initial={{ opacity: 0, scaleX: 0.6 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between pb-1.5">
                    <span className="text-xs text-[var(--mid-main-secondary)] font-medium">
                      Overall Progress
                    </span>
                    <span className="text-xs font-bold text-[var(--secondary-color)]">
                      {completedCount} of {totalTopics} · {progressPct}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/60 overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--light-accent-color)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                  className="flex flex-col items-center gap-1 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-[11px] text-[var(--mid-main-secondary)] italic">
                    Click any topic to explore its problems. Hover for details.
                  </p>
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  >
                    <FaChevronDown className="text-[var(--mid-main-secondary)] text-xs opacity-50" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* ── Path Section (relative container for SVG overlay) ── */}
            <div
              ref={containerRef}
              className="relative mx-auto"
            >
              {/* SVG Connector Layer — absolute overlay */}
              <SVGConnectorLayer
                topics={mathPathTopics}
                statusMap={statusMap}
                nodeRefs={nodeRefs}
                containerRef={containerRef}
              />

              {/* Desktop 3-column grid */}
              <div
                className="hidden md:grid items-start justify-items-center"
                style={{
                  gridTemplateColumns: '1fr auto 1fr',
                  rowGap: '2.5rem',
                  columnGap: '2rem',
                }}
              >
                {gridItems.filter(
                  (item) => !item.key?.startsWith('mobile-'),
                )}
              </div>

              {/* Mobile single-column */}
              <div className="flex md:hidden flex-col items-center gap-5">
                {gridItems.filter(
                  (item) =>
                    item.key?.startsWith('mobile-') ||
                    item.key?.startsWith('cat-'),
                )}
              </div>
            </div>

            {/* Bottom spacing before footer */}
            <div className="h-12" />

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Discover;