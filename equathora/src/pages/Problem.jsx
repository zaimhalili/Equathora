// ProblemDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import LilArrow from '../assets/images/lilArrow.svg';
import MathLiveExample from '../components/MathLiveExample';
import Timer from '../components/Timer.jsx';
import {
  ReportModal,
  HelpModal,
  ViewSolutionModal,
  SubmissionDetailModal
} from '../components/ProblemModals';
import { FaChevronDown, FaChevronRight, FaLightbulb, FaFileAlt, FaLink, FaCalculator, FaChevronUp, FaFlag, FaQuestionCircle, FaList, FaClock, FaCheckCircle, FaTimesCircle, FaStar, FaRegStar } from 'react-icons/fa';
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
  const numericProblemId = parseInt(problemId, 10);
  // Get real problem data
  const problem = getProblemById(numericProblemId);

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
  const sessionStartRef = useRef(Date.now());

  const isCompleted = problem ? isProblemCompleted(problem.id) : false;

  useEffect(() => {
    if (!problem) return;
    const existing = hydrateStoredSubmissions(getSubmissions(problem.id));
    setSubmissions(existing);
  }, [problem, problemId]);

  useEffect(() => {
    sessionStartRef.current = Date.now();
    setSubmissionFeedback(null);
  }, [problemId]);

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
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 1000));
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
        <header className="flex items-center justify-between font-[Inter,sans-serif] bg-[var(--main-color)] w-full px-3 sm:px-6 md:px-8 py-3 md:py-4 flex-shrink-0">
          <Link to="/learn" className="flex items-center gap-1 md:gap-2 text-sm md:text-md text-[var(--secondary-color)] font-semibold no-underline transition-all duration-200 px-2 md:px-4 py-2 rounded-lg hover:bg-[var(--french-gray)] hover:text-[var(--main-color)]">
            <img src={LilArrow} alt="arrow" className="w-4 h-4 md:w-5 md:h-5 rotate-180 transition-transform duration-200 hover:translate-x-1" />
            <span className="hidden sm:inline">Back to Exercises</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex gap-2 md:gap-4 items-center">
            <Timer />
            <button
              onClick={() => setShowHelpModal(true)}
              className="bg-transparent border-2 border-[var(--french-gray)] px-3 md:px-4 py-1.5 md:py-2 rounded-lg cursor-pointer text-sm md:text-md transition-all duration-200 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] text-[var(--french-gray)] flex items-center gap-1.5 h-[38px] md:h-[42px]"
              title="Help & Guide"
            >
              <FaQuestionCircle className="text-sm md:text-base" />
              <span className="hidden sm:inline text-sm font-medium">Help</span>
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-transparent border-2 border-[var(--french-gray)] px-3 py-1.5 md:py-2 rounded-lg cursor-pointer text-sm md:text-md transition-all duration-200 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] text-[var(--french-gray)] flex items-center justify-center h-[38px] md:h-[42px]"
              title="Report Problem"
            >
              <FaFlag className="text-sm md:text-base" />
            </button>
            <button
              className={`bg-transparent border-2 text-sm px-3 py-1.5 md:py-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] flex items-center justify-center h-[38px] md:h-[42px] ${isFavorite ? 'text-[var(--accent-color)] border-[var(--accent-color)] bg-[rgba(217,4,41,0.05)]' : 'text-[var(--french-gray)] border-[var(--french-gray)]'}`}
              onClick={handleFavoriteToggle}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? <FaStar className="text-sm md:text-base" /> : <FaRegStar className="text-sm md:text-base" />}
            </button>
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
                {descriptionCollapsed ? <FaChevronRight className="text-sm" /> : <FaChevronDown className="text-sm rotate-[-90deg]" />}
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
            <MathLiveExample onSubmit={handleNewSubmission} />
          </article>
        </section>
      </main >
    </>
  );
};

export default Problem;
