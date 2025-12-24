// ProblemDetail.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import LilArrow from '../assets/images/lilArrow.svg';
import MathLiveExample from '../components/MathLiveExample';
import Timer from '../components/Timer.jsx';
import ProblemMobileMenu from '../components/ProblemMobileMenu.jsx';
import {
  ReportModal,
  HelpModal,
  ViewSolutionModal,
  SubmissionDetailModal
} from '../components/ProblemModals';
import { FaChevronDown, FaChevronRight, FaChevronLeft, FaLightbulb, FaFileAlt, FaLink, FaCalculator, FaChevronUp, FaFlag, FaQuestionCircle, FaList, FaClock, FaCheckCircle, FaTimesCircle, FaStar, FaRegStar, FaPencilAlt } from 'react-icons/fa';
import { getProblemById, problems as allProblems } from '../data/problems';
import {
  isProblemCompleted,
  isFavorite as checkFavorite,
  toggleFavorite,
  getSubmissions,
  addSubmission,
  markProblemCompleted,
  updateStreak,
  recordProblemStats
} from '../lib/progressStorage';
import { validateAnswer } from '../lib/answerValidation';

const formatDurationLabel = (seconds = 0) => {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  if (minutes <= 0) {
    return `${remainingSeconds}s`;
  }
  return `${minutes}m ${remainingSeconds}s`;
};

const sanitizeLatexAnswer = (latex = '') => latex
  .replace(/\\/g, ' ')
  .replace(/\text\\?\{([^}]*)\}/g, '$1')
  .replace(/[{}]/g, ' ')
  .replace(/\,/g, '')
  .replace(/\times/g, '*')
  .replace(/\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
  .replace(/\sqrt\{([^}]*)\}/g, 'sqrt($1)')
  .replace(/\therefore/g, '')
  .replace(/\text/g, '')
  .replace(/\left|\right/g, '')
  .replace(/\,/g, '')
  .replace(/\ /g, ' ')
  .replace(/\=/g, '=')
  .trim();

const hydrateStoredSubmissions = (records = []) => {
  const chronological = [...records].sort((a, b) => {
    const aTime = new Date(a.timestamp || 0).getTime();
    const bTime = new Date(b.timestamp || 0).getTime();
    return aTime - bTime;
  });

  const hydrated = chronological.map((record, index) => {
    const rawSeconds = record.metadata?.timeSpent || record.timeSpent || 0;
    return {
      ...record,
      id: record.id || `${record.problemId || 'problem'}-${record.timestamp || index}`,
      steps: record.steps || [],
      status: record.status || (record.isCorrect ? 'accepted' : 'wrong'),
      timestamp: record.timestamp || new Date().toISOString(),
      metadata: {
        attempts: record.metadata?.attempts || index + 1,
        hintsUsed: record.metadata?.hintsUsed || 0,
        timeSpent: rawSeconds,
        timeSpentLabel: record.metadata?.timeSpentLabel || formatDurationLabel(rawSeconds)
      }
    };
  });

  return hydrated.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const Problem = () => {
  const { groupId, problemId } = useParams();
  const navigate = useNavigate();
  const numericProblemId = parseInt(problemId, 10);
  // Get real problem data
  const problem = getProblemById(numericProblemId);

  // Find current problem index and get prev/next problems within the same group (circular navigation)
  const currentGroupProblems = problem
    ? allProblems.filter(p => p.groupId === problem.groupId)
    : [];
  const currentIndex = currentGroupProblems.findIndex(p => p.id === numericProblemId);
  const hasGroupProblems = currentGroupProblems.length > 0 && currentIndex !== -1;
  const prevProblem = hasGroupProblems
    ? currentGroupProblems[(currentIndex - 1 + currentGroupProblems.length) % currentGroupProblems.length]
    : null;
  const nextProblem = hasGroupProblems
    ? currentGroupProblems[(currentIndex + 1) % currentGroupProblems.length]
    : null;

  const [openHints, setOpenHints] = useState({});
  const [isFavorite, setIsFavorite] = useState(checkFavorite(numericProblemId));
  const [showDescription, setShowDescription] = useState(true);
  const [showSolutionPopup, setShowSolutionPopup] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [descriptionCollapsed, setDescriptionCollapsed] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showSubmissionDetail, setShowSubmissionDetail] = useState(false);
  const [hintsOpened, setHintsOpened] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [solutionViewed, setSolutionViewed] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState(null);
  const [showDrawingPad, setShowDrawingPad] = useState(false);
  const [drawingColor, setDrawingColor] = useState('black');
  const [strokes, setStrokes] = useState([]);
  const [timerResetSeq, setTimerResetSeq] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const prevProblemIdRef = useRef(numericProblemId);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef([]);
  const sessionStartRef = useRef(Date.now());
  const strokesCacheRef = useRef({});

  const redrawCanvas = useCallback((paths) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const allStrokes = paths || strokes;
    allStrokes.forEach((stroke) => {
      if (!stroke?.points?.length) return;
      ctx.strokeStyle = stroke.color || 'black';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.slice(1).forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });

    // Also draw current stroke if actively drawing
    if (isDrawingRef.current && currentStrokeRef.current.length > 0) {
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(currentStrokeRef.current[0].x, currentStrokeRef.current[0].y);
      currentStrokeRef.current.slice(1).forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }, [strokes, drawingColor]);

  const getCanvasPoint = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX ?? event.touches?.[0]?.clientX;
    const clientY = event.clientY ?? event.touches?.[0]?.clientY;
    if (clientX == null || clientY == null) return null;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  const startDrawing = useCallback((event) => {
    const point = getCanvasPoint(event);
    if (!point) return;

    isDrawingRef.current = true;
    currentStrokeRef.current = [point];
  }, [getCanvasPoint]);

  const drawStroke = useCallback((event) => {
    if (!isDrawingRef.current) return;

    const point = getCanvasPoint(event);
    if (!point) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const lastPoint = currentStrokeRef.current[currentStrokeRef.current.length - 1];

    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    currentStrokeRef.current.push(point);
  }, [drawingColor, getCanvasPoint]);

  const endDrawing = useCallback(() => {
    if (!isDrawingRef.current) return;

    isDrawingRef.current = false;
    // Always save strokes, even single points (for quick clicks/taps)
    if (currentStrokeRef.current.length >= 1) {
      const strokeToSave = { color: drawingColor, points: [...currentStrokeRef.current] };
      setStrokes((prev) => [...prev, strokeToSave]);
    }
    currentStrokeRef.current = [];
  }, [drawingColor]);

  const clearCanvas = useCallback(() => {
    setStrokes([]);
    redrawCanvas([]);
  }, [redrawCanvas]);

  const undoStroke = useCallback(() => {
    setStrokes((prev) => prev.slice(0, -1));
  }, []);

  const isCompleted = problem ? isProblemCompleted(problem.id) : false;
  const [timerRunning, setTimerRunning] = useState(!isCompleted);

  useEffect(() => {
    if (!problem) return;
    const existing = hydrateStoredSubmissions(getSubmissions(problem.id));
    setSubmissions(existing);
  }, [problem, problemId]);

  useEffect(() => {
    setTimerRunning(!isCompleted);
  }, [problemId, isCompleted]);

  useEffect(() => {
    sessionStartRef.current = Date.now();
    setSubmissionFeedback(null);

    // Load cached strokes for this problem if they exist
    if (strokesCacheRef.current[numericProblemId]) {
      setStrokes(strokesCacheRef.current[numericProblemId]);
    } else {
      setStrokes([]);
    }

    // Only reset timer when navigating to a different problem (not on first load/refresh)
    const prevId = prevProblemIdRef.current;
    if (typeof window !== 'undefined' && problem && prevId !== null && prevId !== numericProblemId) {
      const storageKey = `eq:problemTime:${problem.id}`;
      window.localStorage.setItem(storageKey, '0');
      setTimerResetSeq(prev => prev + 1);
    }
    prevProblemIdRef.current = numericProblemId;
  }, [problemId, numericProblemId, problem]);

  // Reset transient UI state when navigating between problems
  useEffect(() => {
    setShowSolution(false);
    setShowSolutionPopup(false);
    setShowDescription(true);
    setShowSubmissions(false);
    setShowTop(false);
    setDescriptionCollapsed(false);
    setOpenHints({});
    setHintsOpened([]);
    setSelectedSubmission(null);
    setShowSubmissionDetail(false);
    setSolutionViewed(false);
    setReportReason('');
    setReportDetails('');
    setShowReportModal(false);
    setShowHelpModal(false);
    setIsFavorite(checkFavorite(numericProblemId));
    setShowDrawingPad(false);
    setDrawingColor('black');
    setShowMobileMenu(false);
    // Strokes are now loaded from cache in the other useEffect
  }, [numericProblemId]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!showMobileMenu) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMobileMenu]);

  useEffect(() => {
    if (!showDrawingPad) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = canvas.offsetWidth || 0;
      canvas.width = width;
      canvas.height = 220;
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [showDrawingPad, redrawCanvas]);

  useEffect(() => {
    if (showDrawingPad) {
      redrawCanvas();
    }
    // Cache strokes for this problem
    if (strokes.length > 0) {
      strokesCacheRef.current[numericProblemId] = strokes;
    }
  }, [strokes, showDrawingPad, redrawCanvas, numericProblemId]);

  // Warn user before refresh/close if drawings exist
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const hasDrawings = Object.keys(strokesCacheRef.current).some(
        key => strokesCacheRef.current[key]?.length > 0
      );

      if (hasDrawings) {
        e.preventDefault();
        e.returnValue = 'You have unsaved sketches. Are you sure you want to leave? Your drawings will be lost.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const toggleHint = (index) => {
    setOpenHints(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    // Track hint usage
    if (!openHints[index] && !hintsOpened.includes(index)) {
      setHintsOpened(prev => [...prev, index]);
    }
  };

  const handleNewSubmission = (steps) => {
    if (!problem) {
      return { success: false, message: 'Problem not found.' };
    }

    const safeSteps = steps || [];
    const lastStep = safeSteps[safeSteps.length - 1];
    const preparedAnswer = sanitizeLatexAnswer(lastStep?.latex || '');
    const finalAnswer = preparedAnswer || (lastStep?.latex || '');

    if (!finalAnswer.trim()) {
      const feedback = 'Add your final answer in the last step before submitting.';
      setSubmissionFeedback({ message: feedback, isCorrect: false });
      return { success: false, message: feedback };
    }

    const validation = validateAnswer(finalAnswer, problem);

    // Get actual time from localStorage (what the Timer component tracks)
    const storageKey = `eq:problemTime:${problem.id}`;
    const storedTime = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null;
    const timeSpentSeconds = storedTime ? Math.max(1, parseInt(storedTime, 10)) : Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 1000));
    const attemptNumber = submissions.length + 1;

    const entry = addSubmission(
      problem.id,
      finalAnswer,
      validation.isCorrect,
      validation.score,
      timeSpentSeconds,
      safeSteps,
      attemptNumber,
      hintsOpened.length,
      { feedback: validation.feedback }
    );
    entry.metadata = {
      ...(entry.metadata || {}),
      attempts: entry.metadata?.attempts || attemptNumber,
      hintsUsed: entry.metadata?.hintsUsed || hintsOpened.length,
      timeSpent: entry.metadata?.timeSpent || timeSpentSeconds,
      timeSpentLabel: entry.metadata?.timeSpentLabel || formatDurationLabel(timeSpentSeconds)
    };

    setSubmissions(prev => [entry, ...prev]);
    setSubmissionFeedback({ message: validation.feedback, isCorrect: validation.isCorrect });
    setShowSubmissions(true);
    setShowDescription(false);
    setShowTop(false);
    if (descriptionCollapsed) {
      setDescriptionCollapsed(false);
    }

    if (validation.isCorrect) {
      setTimerRunning(false);
      setShowSolution(true);
      setShowSolutionPopup(false);
      setSolutionViewed(true);
      markProblemCompleted(problem.id, validation.score, timeSpentSeconds);
    }

    const streakData = updateStreak();
    recordProblemStats(problem, {
      isCorrect: validation.isCorrect,
      timeSpentSeconds,
      timestamp: entry.timestamp,
      attemptNumber,
      streakData,
      hintsUsed: hintsOpened.length
    });

    return {
      success: validation.isCorrect,
      message: validation.feedback
    };
  };

  // Handle problem not found
  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Problem Not Found</h2>
          <Link to="/learn" className="text-[var(--accent-color)] hover:underline">
            Return to Learn Page
          </Link>
        </div>
      </div>
    );
  }

  // Generate similar questions from the same group
  const similarQuestions = allProblems
    .filter(p => p.groupId === problem.groupId && p.id !== problem.id)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      groupId: p.groupId,
      title: p.title,
      difficulty: p.difficulty
    }));

  const examples = Array.isArray(problem.examples) ? problem.examples : [];

  const handleFavoriteToggle = () => {
    toggleFavorite(problem.id);
    setIsFavorite(!isFavorite);
  };

  const handleReport = () => {
    if (!reportReason) {
      alert('Please select a reason for reporting');
      return;
    }
    // Send report to backend
    console.log('Report submitted:', { reason: reportReason, details: reportDetails });
    alert('Thank you for your report! We will review it shortly.');
    setShowReportModal(false);
    setReportReason('');
    setReportDetails('');
  };

  return (
    <>
      <FeedbackBanner />
      <main className="min-h-screen flex flex-col text-[var(--secondary-color)]">
        {/* Navigation Header */}
        <header className="flex items-center justify-between gap-2 md:gap-3 font-[Inter,sans-serif] bg-[var(--main-color)] w-full px-3 md:px-6 py-3 md:py-4 flex-shrink-0">
          {/* Left side - Back button and Navigation */}
          <div className="flex items-center gap-2">
            <Link to="/learn" className="flex items-center gap-1.5 text-xs md:text-sm text-[var(--secondary-color)] font-semibold no-underline transition-all duration-200 px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[var(--french-gray)] hover:text-[var(--main-color)] h-9 md:h-10">
              <img src={LilArrow} alt="arrow" className="w-4 h-4 rotate-180 transition-transform duration-200 hover:translate-x-1" />
              <span className="hidden md:inline">Back to Exercises</span>
              <span className="md:hidden">Back</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => prevProblem && navigate(`/problems/${prevProblem.groupId}/${prevProblem.id}`)}
                className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg transition-all duration-200 bg-transparent border border-[var(--french-gray)] text-[var(--secondary-color)] hover:bg-[var(--french-gray)] cursor-pointer"
                title={prevProblem ? `Previous: ${prevProblem.title}` : ''}
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <button
                onClick={() => nextProblem && navigate(`/problems/${nextProblem.groupId}/${nextProblem.id}`)}
                className="flex items-center justify-center h-9 md:h-10 gap-2 px-3 rounded-lg transition-all duration-200 bg-transparent border border-[var(--french-gray)] text-[var(--secondary-color)] hover:bg-[var(--french-gray)] cursor-pointer"
                title={nextProblem ? `Next: ${nextProblem.title}` : ''}
              >
                <span className="hidden sm:inline text-xs md:text-sm font-medium">Next</span>
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>

          {/* Right side - Timer and Actions */}
          <div className="flex items-center gap-2">
            <Timer key={`${problem?.id}-${timerResetSeq}`} problemId={problem?.id} isRunning={timerRunning} />

            {/* Desktop buttons - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => {
                  setShowDrawingPad((prev) => !prev);
                  setShowDescription(true);
                  setShowSolutionPopup(false);
                  setShowSolution(false);
                  setShowTop(false);
                  setShowSubmissions(false);
                  if (descriptionCollapsed) setDescriptionCollapsed(false);
                }}
                className={`bg-transparent border-1 px-3 md:px-4 rounded-lg cursor-pointer text-xs md:text-sm transition-all duration-200 flex items-center gap-1.5 h-9 md:h-10 ${showDrawingPad ? 'text-[var(--accent-color)] border-[var(--accent-color)] bg-[rgba(217,4,41,0.05)]' : 'text-[var(--french-gray)] border-[var(--french-gray)] hover:text-[var(--accent-color)]'}`}
                title={showDrawingPad ? "Hide sketch pad" : "Show sketch pad"}
              >
                <FaPencilAlt className="text-sm md:text-base" />
                <span className="text-xs sm:text-sm font-medium">Sketch</span>
              </button>
              <button
                onClick={() => setShowHelpModal(true)}
                className="bg-transparent border-1 border-[var(--french-gray)] px-3 md:px-4 rounded-lg cursor-pointer text-xs md:text-sm transition-all duration-200 hover:text-[var(--accent-color)] text-[var(--french-gray)] flex items-center gap-1.5 h-9 md:h-10"
                title="Help & Guide"
              >
                <FaQuestionCircle className="text-sm md:text-base" />
                <span className="text-xs sm:text-sm font-medium">Help</span>
              </button>
              <Link
                to="/feedback"
                className="bg-transparent border-1 border-[var(--french-gray)] px-3 rounded-lg cursor-pointer text-xs md:text-sm transition-all duration-200 hover:!text-[var(--accent-color)] !text-[var(--french-gray)] flex items-center justify-center w-9 h-9 md:w-10 md:h-10"
                title="Report Problem"
              >
                <FaFlag className="text-sm md:text-base" />
              </Link>
              <button
                className={`bg-transparent border-1 text-xs md:text-sm px-3 rounded-lg cursor-pointer transition-all duration-200 hover:text-[var(--accent-color)] flex items-center justify-center w-9 h-9 md:w-10 md:h-10 ${isFavorite ? 'text-[var(--accent-color)] bg-[rgba(217,4,41,0.05)]' : 'text-[var(--french-gray)] border-[var(--french-gray)]'}`}
                onClick={handleFavoriteToggle}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? <FaStar className="text-sm md:text-base" /> : <FaRegStar className="text-sm md:text-base" />}
              </button>
            </div>

            {/* Mobile menu button */}
            <ProblemMobileMenu
              showMobileMenu={showMobileMenu}
              setShowMobileMenu={setShowMobileMenu}
              showDrawingPad={showDrawingPad}
              setShowDrawingPad={setShowDrawingPad}
              setShowDescription={setShowDescription}
              setShowSolutionPopup={setShowSolutionPopup}
              setShowSolution={setShowSolution}
              setShowTop={setShowTop}
              setShowSubmissions={setShowSubmissions}
              descriptionCollapsed={descriptionCollapsed}
              setDescriptionCollapsed={setDescriptionCollapsed}
              setShowHelpModal={setShowHelpModal}
              isFavorite={isFavorite}
              handleFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        </header>

        {/* Modals */}
        <ViewSolutionModal
          isOpen={showSolutionPopup}
          onClose={() => {
            setShowSolutionPopup(false);
            setShowDescription(true);
          }}
          onConfirm={() => {
            setShowSolution(true);
            setShowSolutionPopup(false);
            setSolutionViewed(true);
          }}
        />

        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportReason={reportReason}
          setReportReason={setReportReason}
          reportDetails={reportDetails}
          setReportDetails={setReportDetails}
          onSubmit={handleReport}
        />

        <HelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />

        <SubmissionDetailModal
          isOpen={showSubmissionDetail}
          onClose={() => setShowSubmissionDetail(false)}
          submission={selectedSubmission}
        />

        {/* Main Content */}
        <section className="flex flex-col lg:flex-row flex-1 w-full gap-2 md:gap-3 bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] pt-3 md:pt-5 px-3 md:px-6 lg:px-8 pb-3 md:pb-5 lg:h-[calc(100vh-7.5vh)] lg:overflow-hidden">
          {/* Description Side */}
          <aside className={`flex flex-col w-full rounded-lg bg-[var(--main-color)] p-0 font-[Inter,sans-serif] text-[var(--secondary-color)] overflow-hidden border border-white lg:h-full transition-all duration-300 ${descriptionCollapsed ? 'lg:w-12 lg:min-w-12' : 'lg:w-1/2'}`}>
            <div className={`w-full py-1.5 md:py-2 flex bg-[var(--french-gray)] px-2 rounded-t-lg ${descriptionCollapsed ? 'lg:flex-col lg:h-full lg:py-4 lg:px-1' : 'justify-between'}`}>
              <div className={`flex gap-1 ${descriptionCollapsed ? 'lg:flex-col lg:gap-3 lg:flex-1 lg:justify-center lg:w-full' : ''}`}>
                <button type="button" onClick={() => {
                  setShowDescription(true);
                  setShowSolutionPopup(false);
                  setShowSolution(false);
                  setShowTop(false);
                  setShowSubmissions(false);
                  if (descriptionCollapsed) setDescriptionCollapsed(false);
                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-sm text-xs md:text-sm font-[Inter] flex items-center gap-1.5 font-medium transition-all duration-200 ${showDescription && !showSubmissions ? 'bg-[var(--main-color)]' : ''} ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`} style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Description" : ""}>
                  <span className={descriptionCollapsed ? 'lg:hidden' : ''}>Description</span>
                  {descriptionCollapsed && <span className="hidden lg:inline text-xs font-semibold tracking-wider">Description</span>}
                  <FaFileAlt className={`text-[10px] md:text-xs text-[var(--secondary-color)] ${descriptionCollapsed ? 'lg:hidden' : ''}`} />
                </button>

                <button type="button" onClick={() => {
                  setShowDescription(false);
                  setShowTop(false);
                  setShowSubmissions(false);
                  if (!solutionViewed) {
                    setShowSolutionPopup(true);
                  } else {
                    setShowSolution(true);
                  }
                  if (descriptionCollapsed) setDescriptionCollapsed(false);
                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-sm text-xs md:text-sm font-[Inter] flex items-center gap-1.5 font-medium transition-all duration-200 ${!showDescription && showSolution && !showSubmissions ? 'bg-[var(--main-color)]' : ''} ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`} style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Solution" : ""}>
                  <span className={descriptionCollapsed ? 'lg:hidden' : ''}>Solution</span>
                  {descriptionCollapsed && <span className="hidden lg:inline text-xs font-semibold tracking-wider">Solution</span>}
                  <FaCalculator className={`text-[10px] md:text-xs text-[var(--secondary-color)] ${descriptionCollapsed ? 'lg:hidden' : ''}`} />
                </button>

                <button type="button" onClick={() => {
                  setShowDescription(false);
                  setShowSolution(false);
                  setShowSubmissions(true);
                  setShowTop(false);
                  if (descriptionCollapsed) setDescriptionCollapsed(false);
                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-sm text-xs md:text-sm font-[Inter] flex items-center gap-1.5 font-medium transition-all duration-200 ${showSubmissions && !showDescription ? 'bg-[var(--main-color)]' : ''} ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`} style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Submissions" : ""}>
                  <span className={descriptionCollapsed ? 'lg:hidden' : ''}>Submissions</span>
                  {descriptionCollapsed && <span className="hidden lg:inline text-xs font-semibold tracking-wider">Submissions</span>}
                  <FaList className={`text-[10px] md:text-xs text-[var(--secondary-color)] ${descriptionCollapsed ? 'lg:hidden' : ''}`} />
                </button>
              </div>

              {/* Mobile Only - Toggle Collapse/Expand */}
              <button type="button" onClick={() => {
                setShowTop(!showTop);
              }} className={`lg:hidden cursor-pointer px-3 py-1.5 hover:bg-[var(--main-color)] rounded-sm text-xs md:text-sm font-[Inter] flex items-center gap-2 font-medium transition-colors duration-200`}>
                {showTop ? <FaChevronDown className="text-sm" /> : <FaChevronUp className="text-sm" />}
              </button>

              {/* Desktop Only - Horizontal Collapse Toggle */}
              <button type="button" onClick={() => {
                setDescriptionCollapsed(!descriptionCollapsed);
              }} className={`hidden lg:flex cursor-pointer hover:bg-[var(--main-color)] rounded-sm text-xs md:text-sm font-[Inter] items-center justify-center font-medium transition-all duration-200 ${descriptionCollapsed ? 'order-first px-2 py-2 pb-3' : 'px-3 py-1.5 gap-2'}`} title={descriptionCollapsed ? "Expand" : "Collapse"}>
                <FaChevronRight className={`text-sm transition-transform duration-200 ${descriptionCollapsed ? 'rotate-0' : 'rotate-180'}`} />
              </button>
            </div>

            <article className={`transition-all duration-300 ease-in-out w-full rounded-b-lg bg-[var(--main-color)] flex-col p-0 font-[Inter,sans-serif] text-[var(--secondary-color)] overflow-hidden lg:flex ${showTop ? 'max-h-0 opacity-0' : 'max-h-[60vh] lg:max-h-full opacity-100 flex'} ${descriptionCollapsed ? 'lg:hidden' : ''}`}>

              <div className={`w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 flex flex-col gap-4 md:gap-5 overflow-y-auto flex-1 problem-description-scroll`}>
                {/* Problem Title & Badges */}
                <div>
                  <h1 className="font-[Inter,sans-serif] text-xl sm:text-2xl md:text-3xl text-[var(--secondary-color)] font-bold pb-2 md:pb-3">{problem.title}</h1>
                  <div className="flex gap-1.5 md:gap-2 flex-wrap font-[Inter,sans-serif] items-center">
                    <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium ${problem.difficulty.toLowerCase() === 'easy' ? 'bg-green-500/10 text-green-600' :
                      problem.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-700' :
                        'bg-red-500/10 text-[var(--accent-color)]'
                      }`}>
                      {problem.difficulty}
                    </span>
                    {problem.premium ? (
                      <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium bg-yellow-500/10 text-yellow-700">Premium</span>
                    ) : (
                      <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium bg-[var(--french-gray)]/40 text-gray-600">Free</span>
                    )}
                    {problem.topic && (
                      <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium bg-blue-500/10 text-blue-700 border border-blue-200">{problem.topic}</span>
                    )}
                    {isCompleted && (
                      <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium bg-green-500/10 text-green-600">✓ Solved</span>
                    )}
                  </div>
                </div>

                {submissionFeedback && (
                  <div className={`rounded-lg px-3 py-2 border text-xs md:text-sm font-medium ${submissionFeedback.isCorrect ? 'bg-green-500/10 border-green-500/40 text-green-600' : 'bg-red-500/10 border-red-500/40 text-red-600'}`}>
                    {submissionFeedback.message}
                  </div>
                )}

                {showSolution ? (
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-[var(--secondary-color)] font-[Inter,sans-serif] mb-4">Official Solution</h2>
                    <p className="text-sm md:text-base text-[var(--secondary-color)] font-[Inter,sans-serif] leading-relaxed whitespace-pre-line">
                      {problem.solution || 'Solution will be available soon.'}
                    </p>
                    {(problem.answer || problem.acceptedAnswers?.[0]) && (
                      <div className="mt-4 text-sm md:text-base font-semibold text-[var(--secondary-color)]">
                        Final Answer: <span className="font-normal">{problem.answer || problem.acceptedAnswers?.[0]}</span>
                      </div>
                    )}
                  </div>
                ) : showSubmissions ? (
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-[var(--secondary-color)] font-[Inter,sans-serif] pb-4">Your Submissions</h2>
                    <div className="flex flex-col gap-2">
                      {submissions.map((submission) => (
                        <div
                          key={submission.id}
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowSubmissionDetail(true);
                          }}
                          className={`bg-[var(--french-gray)]/20 px-4 py-2.5 rounded-lg border-l-4 cursor-pointer transition-all duration-200 ${submission.status === 'accepted' ? 'border-green-500 hover:bg-[var(--french-gray)]/30' :
                            submission.status === 'wrong' ? 'border-red-500 hover:bg-[var(--french-gray)]/30' :
                              'border-yellow-500 hover:bg-[var(--french-gray)]/30'
                            }`}
                        >
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {submission.status === 'accepted' && <FaCheckCircle className="text-green-600 text-xs flex-shrink-0" />}
                              {submission.status === 'wrong' && <FaTimesCircle className="text-red-600 text-xs flex-shrink-0" />}
                              <span className={`text-xs font-semibold truncate ${submission.status === 'accepted' ? 'text-green-600' :
                                submission.status === 'wrong' ? 'text-red-600' :
                                  'text-yellow-600'
                                }`}>
                                {submission.status === 'accepted' ? 'Accepted' : submission.status === 'wrong' ? 'Wrong' : 'Pending'}
                              </span>
                              <span className="text-[10px] text-gray-500 hidden sm:inline">•</span>
                              <span className="text-[10px] text-gray-500 hidden sm:inline">{submission.steps.length} steps</span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500 flex-shrink-0">
                              {typeof submission.metadata?.hintsUsed === 'number' && (
                                <span>{submission.metadata.hintsUsed} hints</span>
                              )}
                              {submission.metadata?.timeSpentLabel && (
                                <span>{submission.metadata.timeSpentLabel}</span>
                              )}
                              <div className="flex items-center gap-1">
                                <FaClock className="text-[8px]" />
                                <span>{new Date(submission.timestamp).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {submissions.length === 0 && (
                        <p className="text-center text-sm text-gray-500 py-8">No submissions yet. Start solving to see your history!</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Problem Description */}
                    <div>
                      <p className="text-sm md:text-[0.95rem] leading-relaxed text-[var(--secondary-color)] font-[Inter,sans-serif] m-0">{problem.description}</p>
                    </div>

                    {showDrawingPad && (
                      <div className="rounded-lg border border-[var(--french-gray)] bg-[var(--french-gray)]/20 p-3 md:p-4 flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] md:text-xs font-semibold text-[var(--secondary-color)] uppercase tracking-[0.05em]">Sketch</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setDrawingColor('black')}
                                className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-medium border transition-all duration-200 ${drawingColor === 'black' ? 'bg-[var(--secondary-color)] text-[var(--main-color)] border-[var(--secondary-color)]' : 'text-[var(--secondary-color)] border-[var(--french-gray)] hover:border-[var(--secondary-color)]'}`}
                              >
                                Black
                              </button>
                              <button
                                type="button"
                                onClick={() => setDrawingColor('red')}
                                className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-medium border transition-all duration-200 ${drawingColor === 'red' ? 'bg-[var(--accent-color)] text-[var(--main-color)] border-[var(--accent-color)]' : 'text-[var(--secondary-color)] border-[var(--french-gray)] hover:border-[var(--accent-color)]'}`}
                              >
                                Red
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={undoStroke}
                              disabled={strokes.length === 0}
                              className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-medium border transition-all duration-200 ${strokes.length === 0 ? 'opacity-50 cursor-not-allowed border-[var(--french-gray)] text-[var(--french-gray)]' : 'text-[var(--secondary-color)] border-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--main-color)]'}`}
                            >
                              Undo
                            </button>
                            <button
                              type="button"
                              onClick={clearCanvas}
                              disabled={strokes.length === 0}
                              className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-medium border transition-all duration-200 ${strokes.length === 0 ? 'opacity-50 cursor-not-allowed border-[var(--french-gray)] text-[var(--french-gray)]' : 'text-[var(--accent-color)] border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--main-color)]'}`}
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        <div className="rounded-md border border-[var(--french-gray)] bg-[var(--main-color)] overflow-hidden shadow-sm">
                          <canvas
                            ref={canvasRef}
                            className="w-full h-48 md:h-56 bg-[var(--main-color)] cursor-crosshair"
                            style={{ touchAction: 'none' }}
                            onPointerDown={(e) => { e.preventDefault(); startDrawing(e); }}
                            onPointerMove={(e) => { e.preventDefault(); drawStroke(e); }}
                            onPointerUp={(e) => { e.preventDefault(); endDrawing(); }}
                            onPointerLeave={(e) => { e.preventDefault(); endDrawing(); }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Examples */}
                    {examples.length > 0 && (
                      <div>
                        <h3 className="text-sm md:text-base pb-2 md:pb-3 text-[var(--secondary-color)] font-bold font-[Inter,sans-serif]">Examples</h3>
                        {examples.map((example, index) => (
                          <div key={index} className="p-3 md:p-4 bg-[var(--french-gray)]/40 rounded-lg mb-2 md:mb-3 last:mb-0">
                            <div className="text-[10px] md:text-xs font-bold text-[var(--secondary-color)] pb-1.5 md:pb-2 font-[Inter,sans-serif]">Example {index + 1}:</div>
                            <div className="flex flex-col gap-1.5 md:gap-2">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs md:text-sm font-[Inter,sans-serif]">
                                <span className="font-semibold text-[var(--secondary-color)] sm:min-w-[50px]">Input:</span>
                                <code className="bg-[var(--secondary-color)] text-[var(--main-color)] px-2 py-1 rounded font-[Courier_New,monospace] text-[0.75rem] md:text-[0.85rem] font-semibold break-all">{example.input}</code>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs md:text-sm font-[Inter,sans-serif]">
                                <span className="font-semibold text-[var(--secondary-color)] sm:min-w-[50px]">Output:</span>
                                <code className="bg-[var(--secondary-color)] text-[var(--main-color)] px-2 py-1 rounded font-[Courier_New,monospace] text-[0.75rem] md:text-[0.85rem] font-semibold break-all">{example.output}</code>
                              </div>
                            </div>
                            {example.explanation && (
                              <div className="mt-2 pt-2 border-t border-dashed border-gray-300 text-xs md:text-[0.85rem] text-gray-600 italic leading-relaxed font-[Inter,sans-serif]">
                                {example.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Hints Section - Collapsible like LeetCode */}
                    <div>
                      {problem.hints && problem.hints.length > 0 && (
                        <div className="border-t border-[var(--french-gray)]">

                          <div className="flex flex-col">
                            {problem.hints.map((hint, index) => (
                              <div key={index} className="border-t border-[var(--french-gray)] overflow-hidden">
                                <button
                                  className="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 hover:bg-[var(--french-gray)]/40 cursor-pointer text-left transition-colors duration-200"
                                  onClick={() => toggleHint(index)}
                                >
                                  <span className="font-medium text-xs md:text-sm text-[var(--secondary-color)] font-[Inter] flex items-center gap-2">
                                    <FaLightbulb className="text-[var(--secondary-color)] text-[10px] md:text-xs" />
                                    Hint {index + 1}
                                  </span>
                                  <FaChevronDown className={`text-[var(--secondary-color)] text-[10px] md:text-xs transition-transform duration-300 ${openHints[index] ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`transition-all duration-300 ease-in-out ${openHints[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                  <div className="px-3 md:px-4 py-2 md:py-3 bg-[var(--main-color)] border-t border-[var(--french-gray)]">
                                    <p className="text-xs md:text-sm text-[var(--secondary-color)] leading-relaxed font-[Inter] m-0">
                                      {hint}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Similar Questions Section */}
                      {similarQuestions && similarQuestions.length > 0 && (
                        <div className="">
                          <div className="flex flex-col">
                            <div className="border-t border-[var(--french-gray)] overflow-hidden">
                              <button
                                className="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 hover:bg-[var(--french-gray)]/40 cursor-pointer text-left transition-colors duration-200"
                                onClick={() => toggleHint('similar')}
                              >
                                <span className="font-medium text-xs md:text-sm text-[var(--secondary-color)] font-[Inter] flex items-center gap-2">
                                  <FaLink className="text-[var(--secondary-color)] text-[10px] md:text-xs" />
                                  Similar Questions
                                </span>
                                <FaChevronDown className={`text-[var(--secondary-color)] text-[10px] md:text-xs transition-transform duration-300 ${openHints['similar'] ? 'rotate-180' : ''}`} />
                              </button>
                              <div className={`transition-all duration-300 ease-in-out ${openHints['similar'] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-3 md:px-4 py-2 md:py-3 bg-[var(--main-color)] border-t border-[var(--french-gray)] flex flex-col">
                                  {similarQuestions.map((question, index) => (
                                    <Link
                                      key={index}
                                      to={`/problems/${question.groupId}/${question.id}`}
                                      className="flex items-center justify-between p-2 md:p-3 rounded-lg group"
                                    >
                                      <span className="text-xs md:text-sm text-[var(--secondary-color)] font-[Inter] group-hover:text-[var(--dark-accent-color)]">
                                        {question.title}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] md:text-xs font-medium ${question.difficulty.toLowerCase() === 'easy' ? 'bg-green-500/10 text-green-600' :
                                        question.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-700' :
                                          'bg-red-500/10 text-[var(--accent-color)]'
                                        }`}>
                                        {question.difficulty}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

              </div>
            </article>
          </aside>


          {/* Solution Side - Math Live*/}
          <article className={`flex justify-start items-stretch flex-col w-full min-h-[500px] lg:h-full overflow-hidden rounded-lg transition-all duration-300 ${descriptionCollapsed ? 'lg:w-full' : 'lg:w-1/2'}`}>
            <MathLiveExample
              key={`ml-${problem?.id}-${timerResetSeq}`}
              onSubmit={handleNewSubmission}
              nextProblemPath={nextProblem ? `/problems/${nextProblem.groupId}/${nextProblem.id}` : null}
              isSolved={isCompleted}
            />
          </article>
        </section>
      </main>
    </>
  );
};

export default Problem;
