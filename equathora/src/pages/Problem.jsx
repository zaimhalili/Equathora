// ProblemDetail.jsx
import React, { useState } from 'react';
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

const Problem = () => {
  const { groupId, problemId } = useParams();
  const [openHints, setOpenHints] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [showSolutionPopup, setShowSolutionPopup] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState('');
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

  // Initialize with mock submissions - In production, this would come from backend/localStorage
  React.useEffect(() => {
    const mockSubmissions = [
      {
        id: 1,
        status: 'accepted',
        timestamp: '2 days ago',
        date: 'Dec 1, 2025 at 3:42 PM',
        steps: [
          { latex: 'T(n) = \\frac{n(n+1)}{2}' },
          { latex: 'T(8) = \\frac{8 \\times 9}{2} = 36' },
          { latex: 'T(9) = \\frac{9 \\times 10}{2} = 45' },
          { latex: '36 < 44 \\leq 45' },
          { latex: '\\therefore \\text{The answer is } 9' }
        ],
        metadata: {
          timeSpent: '12m 34s',
          attempts: 3,
          hintsUsed: 1
        }
      },
      {
        id: 2,
        status: 'wrong',
        timestamp: '3 days ago',
        date: 'Nov 30, 2025 at 10:15 AM',
        steps: [
          { latex: 'n = 44' },
          { latex: '\\sqrt{44} \\approx 6.63' },
          { latex: '\\therefore \\text{The answer is } 7' }
        ],
        metadata: {
          timeSpent: '5m 12s',
          attempts: 2,
          hintsUsed: 0
        }
      },
      {
        id: 3,
        status: 'wrong',
        timestamp: '3 days ago',
        date: 'Nov 30, 2025 at 9:58 AM',
        steps: [
          { latex: '44 \\div 5 = 8.8' },
          { latex: '\\text{Round up to } 9' }
        ],
        metadata: {
          timeSpent: '3m 45s',
          attempts: 1,
          hintsUsed: 0
        }
      }
    ];
    setSubmissions(mockSubmissions);
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
    const newSubmission = {
      id: Date.now(),
      status: 'pending',
      timestamp: 'Just now',
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
      steps: steps,
      metadata: {
        timeSpent: '0m 0s', // Will be calculated by Timer
        attempts: submissions.length + 1,
        hintsUsed: hintsOpened.length
      }
    };
    setSubmissions(prev => [newSubmission, ...prev]);
    return newSubmission;
  };

  const problem = {
    id: parseInt(problemId),
    groupId: parseInt(groupId),
    title: "Find the 44th element of the sequence",
    difficulty: "Easy",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    examples: [
      {
        input: "n = 44",
        output: "9",
        explanation: "The pattern shows each number n appearing n times"
      }
    ],
    hints: [
      "Notice the pattern: number 1 appears 1 time, number 2 appears 2 times, etc.",
      "Can you find a mathematical formula for the position where number n first appears?",
      "Think about triangular numbers!"
    ],
    similarQuestions: [
      { id: 1, groupId: 1, title: "Fibonacci Sequence Pattern", difficulty: "Easy" },
      { id: 3, groupId: 1, title: "Arithmetic Progression Sum", difficulty: "Medium" },
      { id: 7, groupId: 2, title: "Geometric Series Analysis", difficulty: "Hard" }
    ],
    correctAnswer: "The answer is 9. The sequence follows the pattern where each number n appears n times. By using the formula for triangular numbers T(n) = n(n+1)/2, we can find that the 44th position falls within the range where 9 appears (positions 37-45).",
    completed: false,
    premium: false
  };


  const handleSubmit = () => {
    alert('Solution submitted!');
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
              onClick={() => setIsFavorite(!isFavorite)}
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
                  setShowDescription(true); setShowSolutionPopup(false); setShowSolution(false); setShowTop(false);
                  if (descriptionCollapsed) setDescriptionCollapsed(false);
                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-sm text-xs md:text-sm font-[Inter] flex items-center gap-1.5 font-medium transition-all duration-200 ${showDescription ? 'bg-[var(--main-color)]' : ''} ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`} style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Description" : ""}>
                  <span className={descriptionCollapsed ? 'lg:hidden' : ''}>Description</span>
                  {descriptionCollapsed && <span className="hidden lg:inline text-xs font-semibold tracking-wider">Description</span>}
                  <FaFileAlt className={`text-[10px] md:text-xs text-[var(--secondary-color)] ${descriptionCollapsed ? 'lg:hidden' : ''}`} />
                </button>

                <button type="button" onClick={() => {
                  setShowDescription(false);
                  setShowTop(false);
                  setShowSubmissions(false);
                  showSolution ? '' : setShowSolutionPopup(true);
                  if (descriptionCollapsed) setDescriptionCollapsed(false);
                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-sm text-xs md:text-sm font-[Inter] flex items-center gap-1.5 font-medium transition-all duration-200 ${!showDescription && !showSubmissions ? 'bg-[var(--main-color)]' : ''} ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`} style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Solution" : ""}>
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
                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-sm text-xs md:text-sm font-[Inter] flex items-center gap-1.5 font-medium transition-all duration-200 ${showSubmissions ? 'bg-[var(--main-color)]' : ''} ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`} style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Submissions" : ""}>
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
                    {problem.completed && (
                      <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium bg-green-500/10 text-green-600">✓ Solved</span>
                    )}
                  </div>
                </div>

                {showSolution ? (
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-[var(--secondary-color)] font-[Inter,sans-serif] mb-4">Official Solution</h2>
                    <p className="text-sm md:text-base text-[var(--secondary-color)] font-[Inter,sans-serif] leading-relaxed">{problem.correctAnswer}</p>
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
                              {submission.metadata.hintsUsed !== undefined && <span>{submission.metadata.hintsUsed} hints</span>}
                              <div className="flex items-center gap-1">
                                <FaClock className="text-[8px]" />
                                <span>{submission.timestamp}</span>
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
                    <div>
                      <h3 className="text-sm md:text-base pb-2 md:pb-3 text-[var(--secondary-color)] font-bold font-[Inter,sans-serif]">Examples</h3>
                      {problem.examples.map((example, index) => (
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
                      {problem.similarQuestions && problem.similarQuestions.length > 0 && (
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
                                  {problem.similarQuestions.map((question, index) => (
                                    <Link
                                      key={index}
                                      to={`/learn/${question.groupId}/${question.id}`}
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
