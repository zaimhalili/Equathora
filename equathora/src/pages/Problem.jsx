// ProblemDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import LilArrow from '../assets/images/lilArrow.svg';
import MathLiveExample from '../components/MathLiveExample';
import Timer from '../components/Timer.jsx';
import { FaChevronDown, FaChevronRight, FaLightbulb, FaFileAlt, FaLink, FaCalculator, FaChevronUp, FaFlag, FaQuestionCircle, FaTimes } from 'react-icons/fa';

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
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const toggleHint = (index) => {
    setOpenHints(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
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
        <header className="flex items-center justify-between font-[Public_Sans,sans-serif] bg-[var(--main-color)] w-full px-3 sm:px-6 md:px-8 py-3 md:py-4 flex-shrink-0">
          <Link to="/learn" className="flex items-center gap-1 md:gap-2 text-sm md:text-md text-[var(--secondary-color)] font-semibold no-underline transition-all duration-200 px-2 md:px-4 py-2 rounded-lg hover:bg-[var(--french-gray)] hover:text-[var(--main-color)]">
            <img src={LilArrow} alt="arrow" className="w-4 h-4 md:w-5 md:h-5 rotate-180 transition-transform duration-200 hover:translate-x-1" />
            <span className="hidden sm:inline">Back to Exercises</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex gap-2 md:gap-4 items-center">
            <Timer />
            <button
              onClick={() => setShowHelpModal(true)}
              className="bg-transparent border-2 border-[var(--french-gray)] px-3 md:px-4 py-1.5 md:py-2 rounded-lg cursor-pointer text-sm md:text-md transition-all duration-200 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:scale-105 text-[var(--french-gray)] flex items-center gap-1.5"
              title="Help & Guide"
            >
              <FaQuestionCircle className="text-sm md:text-base" />
              <span className="hidden sm:inline text-sm font-medium">Help</span>
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-transparent border-2 border-[var(--french-gray)] px-3 md:px-4 py-1.5 md:py-2 rounded-lg cursor-pointer text-sm md:text-md transition-all duration-200 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:scale-105 text-[var(--french-gray)] flex items-center gap-1.5"
              title="Report Problem"
            >
              <FaFlag className="text-sm md:text-base" />
              <span className="hidden sm:inline text-sm font-medium">Report</span>
            </button>
            <button
              className={`bg-transparent border-2 border-[var(--french-gray)] px-3 md:px-4 py-1.5 md:py-2 rounded-lg cursor-pointer text-sm md:text-md transition-all duration-200 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:scale-105 ${isFavorite ? 'text-[var(--accent-color)] border-[var(--accent-color)] bg-[rgba(217,4,41,0.05)]' : 'text-[var(--french-gray)]'}`}
              onClick={() => setIsFavorite(!isFavorite)}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
        </header>

        {/* Show Solution Popup */}
        {showSolutionPopup && (
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/30' onClick={() => { setShowDescription(true); setShowSolutionPopup(false); }}>
            <div className='bg-white w-11/12 max-w-md min-h-40 rounded-2xl px-6 py-7 flex flex-col shadow-2xl' onClick={(e) => e.stopPropagation()}>
              <div className='flex flex-col gap-3'>
                <h2 className='font-[Public_Sans] text-left font-bold text-2xl md:text-3xl text-[var(--secondary-color)] leading-tight'>View Solution?</h2>
                <p className='font-[Inter] text-[var(--secondary-color)] text-sm md:text-base leading-relaxed opacity-80'>Viewing the solution before solving will award 0 points, but the problem will be marked as completed.</p>
              </div>

              <div className='flex w-full justify-between gap-3 pt-7'>
                <button type="button" onClick={() => { setShowSolutionPopup(false); setShowDescription(true); }} className='px-4 cursor-pointer py-2.5 font-semibold text-center border-2 border-[var(--french-gray)] rounded-lg bg-white text-[var(--secondary-color)] hover:bg-[var(--french-gray)] shadow-md hover:shadow-lg -translate-y-1 hover:translate-y-0 transition-all duration-300 flex-1 text-sm md:text-base'>Cancel</button>

                <button type="button" className='px-4 cursor-pointer py-2.5 font-bold text-center border-2 border-[var(--accent-color)] rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg -translate-y-1 hover:translate-y-0 transition-all duration-300 flex-1 text-sm md:text-base' onClick={() => { setShowSolution(true); setShowSolutionPopup(false) }}>View Solution</button>
              </div>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && (
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm' onClick={() => setShowReportModal(false)}>
            <div className='bg-white w-11/12 max-w-lg rounded-2xl px-6 py-7 flex flex-col shadow-2xl' onClick={(e) => e.stopPropagation()}>
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h2 className='font-[Public_Sans] font-bold text-2xl md:text-3xl text-[var(--secondary-color)] leading-tight'>Report Problem</h2>
                  <p className='font-[Inter] text-[var(--secondary-color)] text-sm opacity-70 mt-2'>Help us improve by reporting any issues</p>
                </div>
                <button onClick={() => setShowReportModal(false)} className='text-gray-400 hover:text-gray-600 transition-colors'>
                  <FaTimes className='text-xl' />
                </button>
              </div>

              <div className='flex flex-col gap-4 mt-4'>
                <div>
                  <label className='font-[Inter] text-sm font-semibold text-[var(--secondary-color)] mb-2 block'>Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className='w-full p-3 border-2 border-[var(--french-gray)] rounded-lg font-[Inter] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors'
                  >
                    <option value="">Select a reason</option>
                    <option value="incorrect-answer">Incorrect Answer</option>
                    <option value="typo">Typo or Grammar Error</option>
                    <option value="unclear">Unclear Problem Statement</option>
                    <option value="broken">Broken Feature</option>
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className='font-[Inter] text-sm font-semibold text-[var(--secondary-color)] mb-2 block'>Additional Details (Optional)</label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder='Provide more information about the issue...'
                    rows={4}
                    className='w-full p-3 border-2 border-[var(--french-gray)] rounded-lg font-[Inter] text-sm resize-none focus:border-[var(--accent-color)] focus:outline-none transition-colors'
                  />
                </div>
              </div>

              <div className='flex w-full justify-between gap-3 mt-6'>
                <button type="button" onClick={() => setShowReportModal(false)} className='px-4 cursor-pointer py-2.5 font-semibold text-center border-2 border-[var(--french-gray)] rounded-lg bg-white text-[var(--secondary-color)] hover:bg-[var(--french-gray)] shadow-md hover:shadow-lg transition-all duration-300 flex-1 text-sm md:text-base'>Cancel</button>
                <button type="button" onClick={handleReport} className='px-4 cursor-pointer py-2.5 font-bold text-center border-2 border-[var(--accent-color)] rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg transition-all duration-300 flex-1 text-sm md:text-base'>Submit Report</button>
              </div>
            </div>
          </div>
        )}

        {/* Help Modal */}
        {showHelpModal && (
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm' onClick={() => setShowHelpModal(false)}>
            <div className='bg-white w-11/12 max-w-2xl rounded-2xl px-6 py-7 flex flex-col shadow-2xl max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h2 className='font-[Public_Sans] font-bold text-2xl md:text-3xl text-[var(--secondary-color)] leading-tight'>How to Use This Page</h2>
                  <p className='font-[Inter] text-[var(--secondary-color)] text-sm opacity-70 mt-2'>Quick guide to solving problems</p>
                </div>
                <button onClick={() => setShowHelpModal(false)} className='text-gray-400 hover:text-gray-600 transition-colors'>
                  <FaTimes className='text-xl' />
                </button>
              </div>

              <div className='flex flex-col gap-5 mt-4'>
                <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                  <h3 className='font-[Public_Sans] font-bold text-lg text-[var(--secondary-color)] mb-2 flex items-center gap-2'>
                    <FaFileAlt className='text-[var(--accent-color)]' /> Reading the Problem
                  </h3>
                  <p className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed'>Start by carefully reading the problem description and examples. Make sure you understand what's being asked before attempting to solve.</p>
                </div>

                <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                  <h3 className='font-[Public_Sans] font-bold text-lg text-[var(--secondary-color)] mb-2 flex items-center gap-2'>
                    <FaCalculator className='text-[var(--accent-color)]' /> Entering Your Solution
                  </h3>
                  <ul className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed list-disc list-inside space-y-2'>
                    <li>Use the math editor on the right to write your solution step-by-step</li>
                    <li>Click "+ Add Step" to add more steps to your solution</li>
                    <li>Use the math toolbar to insert equations, symbols, and expressions</li>
                    <li>Delete unwanted steps using the × button next to each step</li>
                  </ul>
                </div>

                <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                  <h3 className='font-[Public_Sans] font-bold text-lg text-[var(--secondary-color)] mb-2 flex items-center gap-2'>
                    <FaLightbulb className='text-[var(--accent-color)]' /> Using Hints
                  </h3>
                  <p className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed'>Stuck? Scroll down to find hints that can guide you without giving away the answer. Hints are revealed one at a time to help you learn.</p>
                </div>

                <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                  <h3 className='font-[Public_Sans] font-bold text-lg text-[var(--secondary-color)] mb-2 flex items-center gap-2'>
                    <FaChevronRight className='text-[var(--accent-color)]' /> Desktop Features
                  </h3>
                  <p className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed'>On desktop, you can collapse the problem description panel to get more space for your solution. Just click the arrow button in the top-right corner of the description panel.</p>
                </div>

                <div className='bg-green-50 border-2 border-green-200 p-4 rounded-xl'>
                  <h3 className='font-[Public_Sans] font-bold text-lg text-green-800 mb-2'>💡 Pro Tip</h3>
                  <p className='font-[Inter] text-sm text-green-700 leading-relaxed'>Try to solve the problem on your own before viewing hints or the solution. Learning happens best when you struggle through the challenge!</p>
                </div>
              </div>

              <button type="button" onClick={() => setShowHelpModal(false)} className='mt-6 px-6 py-3 font-bold text-center border-2 border-[var(--accent-color)] rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base'>Got It!</button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <section className="flex flex-col lg:flex-row flex-1 w-full gap-2 md:gap-3 bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] pt-3 md:pt-5 px-3 md:px-6 lg:px-8 pb-3 md:pb-5 lg:h-[calc(100vh-7.5vh)] lg:overflow-hidden">
          {/* Description Side */}
          <aside className={`flex flex-col w-full rounded-lg bg-[var(--main-color)] p-0 font-[Inter,sans-serif] text-[var(--secondary-color)] overflow-hidden border border-white lg:h-full transition-all duration-300 ${descriptionCollapsed ? 'lg:w-12 lg:min-w-12' : 'lg:w-1/2'}`}>
            <div className={`w-full py-1.5 md:py-2 flex bg-[var(--french-gray)] px-2 justify-between rounded-t-lg ${descriptionCollapsed ? 'lg:flex-col lg:h-full lg:justify-between lg:py-4 lg:px-1' : ''}`}>
              <div className={`flex gap-1 ${descriptionCollapsed ? 'lg:flex-col lg:gap-3 lg:flex-1 lg:justify-center lg:w-full' : ''}`}>
                <button type="button" onClick={() => {
                  setShowDescription(true); setShowSolutionPopup(false); setShowSolution(false); setShowTop(false);
                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-sm text-xs md:text-sm font-[Inter] flex items-center gap-1.5 font-medium transition-all duration-200 ${showDescription ? 'bg-[var(--main-color)]' : ''} ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`} style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Description" : ""}>
                  <span className={descriptionCollapsed ? 'lg:hidden' : ''}>Description</span>
                  {descriptionCollapsed && <span className="hidden lg:inline text-xs font-semibold tracking-wider">Description</span>}
                  <FaFileAlt className={`text-[10px] md:text-xs text-[var(--secondary-color)] ${descriptionCollapsed ? 'lg:hidden' : ''}`} />
                </button>

                <button type="button" onClick={() => { setShowDescription(false); setShowTop(false); showSolution ? '' : setShowSolutionPopup(true); }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-sm text-xs md:text-sm font-[Inter] flex items-center gap-1.5 font-medium transition-all duration-200 ${!showDescription ? 'bg-[var(--main-color)]' : ''} ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`} style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Solution" : ""}>
                  <span className={descriptionCollapsed ? 'lg:hidden' : ''}>Solution</span>
                  {descriptionCollapsed && <span className="hidden lg:inline text-xs font-semibold tracking-wider">Solution</span>}
                  <FaCalculator className={`text-[10px] md:text-xs text-[var(--secondary-color)] ${descriptionCollapsed ? 'lg:hidden' : ''}`} />
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
              }} className={`hidden lg:flex cursor-pointer hover:bg-[var(--main-color)] rounded-sm text-xs md:text-sm font-[Inter] items-center justify-center font-medium transition-all duration-200 ${descriptionCollapsed ? 'px-2 py-2 mt-auto' : 'px-3 py-1.5 gap-2'}`} title={descriptionCollapsed ? "Expand" : "Collapse"}>
                {descriptionCollapsed ? <FaChevronRight className="text-sm" /> : <FaChevronDown className="text-sm rotate-[-90deg]" />}
              </button>
            </div>

            <article className={`transition-all duration-300 ease-in-out w-full rounded-b-lg bg-[var(--main-color)] flex-col p-0 font-[Inter,sans-serif] text-[var(--secondary-color)] overflow-hidden lg:flex ${showTop ? 'max-h-0 opacity-0' : 'max-h-[60vh] lg:max-h-full opacity-100 flex'} ${descriptionCollapsed ? 'lg:hidden' : ''}`}>

              <div className={`w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 flex flex-col gap-4 md:gap-5 overflow-y-auto flex-1 problem-description-scroll`}>
                {/* Problem Title & Badges */}
                <div>
                  <h1 className="font-[Public_Sans,sans-serif] text-xl sm:text-2xl md:text-3xl text-[var(--secondary-color)] font-bold pb-2 md:pb-3">{problem.title}</h1>
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
                    <p className="text-sm md:text-base text-[var(--secondary-color)] font-[Inter,sans-serif]">Solution content will be displayed here...</p>
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
                          <div className="text-[10px] md:text-xs font-bold text-[var(--secondary-color)] pb-1.5 md:pb-2 font-[Public_Sans,sans-serif]">Example {index + 1}:</div>
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
            <MathLiveExample />
          </article>
        </section>
      </main >
    </>
  );
};

export default Problem;
