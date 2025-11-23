// ProblemDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import LilArrow from '../assets/images/lilArrow.svg';
import MathLiveExample from '../components/MathLiveExample';
import Timer from '../components/Timer.jsx';

const Problem = () => {
  const { groupId, problemId } = useParams();
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const problem = {
    id: parseInt(problemId),
    groupId: parseInt(groupId),
    title: "Find the 44th element of the sequence",
    difficulty: "Easy",
    description: "Given a sequence: 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, ... Find the 44th element of the sequence.",
    examples: [
      {
        input: "n = 44",
        output: "9",
        explanation: "The pattern shows each number n appearing n times"
      }
    ],
    constraints: "1 ≤ n ≤ 10^6",
    hints: [
      "Notice the pattern: number 1 appears 1 time, number 2 appears 2 times, etc.",
      "Can you find a mathematical formula for the position where number n first appears?",
      "Think about triangular numbers!"
    ],
    correctAnswer: "The answer is 9. The sequence follows the pattern where each number n appears n times. By using the formula for triangular numbers T(n) = n(n+1)/2, we can find that the 44th position falls within the range where 9 appears (positions 37-45).",
    completed: false,
    premium: false
  };

  const [solution, setSolution] = useState('');

  const handleSubmit = () => {
    alert('Solution submitted!');
  };

  return (
    <>
      <main className="h-screen flex flex-col text-[var(--secondary-color)] overflow-hidden">
        {/* Navigation Header */}
        <header className="flex items-center justify-between font-[Public_Sans,sans-serif] bg-[var(--main-color)] w-full px-8 py-4 flex-shrink-0">
          <Link to="/learn" className="flex items-center gap-2 text-md text-[var(--secondary-color)] font-semibold no-underline transition-all duration-200 px-4 py-2 rounded-lg hover:bg-[var(--french-gray)] hover:text-[var(--main-color)]">
            <img src={LilArrow} alt="arrow" className="w-5 h-5 rotate-180 transition-transform duration-200 hover:translate-x-1" />
            <span>Back to Exercises</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Timer />
            <button
              className={`bg-transparent border-2 border-[var(--french-gray)] px-4 py-2 rounded-lg cursor-pointer text-md transition-all duration-200 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:scale-105 ${isFavorite ? 'text-[var(--accent-color)] border-[var(--accent-color)] bg-[rgba(217,4,41,0.05)]' : 'text-[var(--french-gray)]'}`}
              onClick={() => setIsFavorite(!isFavorite)}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <section className="flex flex-1 w-full gap-3 bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] pt-5 px-8 pb-5 overflow-hidden">
          {/* Description Side */}
          <article className="w-1/2 rounded-lg flex bg-[var(--main-color)] flex-col p-0 font-[Inter,sans-serif] text-[var(--secondary-color)] overflow-hidden border border-white">
            
            <div className='w-full py-2 flex gap-1 bg-[var(--french-gray)] px-2'>
              <button type="button" className='cursor-pointer px-2 py-1 hover:bg-gray-200 rounded-sm text-md font-[Inter]'>Description</button>
              <button type="button" className='cursor-pointer px-2 py-1 hover:bg-gray-200 rounded-sm text-md font-[Inter]'>Solution</button>
            </div>

            <div className="w-full px-6 py-6 flex flex-col gap-5 overflow-y-auto flex-1">
              {/* Problem Title & Badges */}
              <div>
                <h1 className="font-[Public_Sans,sans-serif] text-2xl md:text-3xl text-[var(--secondary-color)] font-bold mb-3">{problem.title}</h1>
                <div className="flex gap-2 flex-wrap font-[Inter,sans-serif] items-center">
                  <span className={`px-3 py-1 rounded-md text-xs font-medium ${problem.difficulty.toLowerCase() === 'easy' ? 'bg-green-500/10 text-green-600' :
                    problem.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-700' :
                      'bg-red-500/10 text-red-600'
                    }`}>
                    {problem.difficulty}
                  </span>
                  {problem.premium ? (
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-yellow-500/10 text-yellow-700">Premium</span>
                  ) : (
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-gray-500/10 text-gray-600">Free</span>
                  )}
                  {problem.completed && (
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-600">✓ Solved</span>
                  )}
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <p className="text-[0.95rem] leading-relaxed text-[var(--secondary-color)] font-[Inter,sans-serif] m-0">{problem.description}</p>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-base mb-3 text-[var(--secondary-color)] font-bold font-[Public_Sans,sans-serif]">Examples</h3>
                {problem.examples.map((example, index) => (
                  <div key={index} className="p-4 bg-[var(--french-gray)]/30 rounded-lg mb-3 last:mb-0">
                    <div className="text-xs font-bold text-[var(--secondary-color)] mb-2 font-[Public_Sans,sans-serif]">Example {index + 1}:</div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm font-[Inter,sans-serif]">
                        <span className="font-semibold text-[var(--secondary-color)] min-w-[50px]">Input:</span>
                        <code className="bg-[var(--secondary-color)] text-[var(--main-color)] px-2 py-1 rounded font-[Courier_New,monospace] text-[0.85rem] font-semibold">{example.input}</code>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-[Inter,sans-serif]">
                        <span className="font-semibold text-[var(--secondary-color)] min-w-[50px]">Output:</span>
                        <code className="bg-[var(--secondary-color)] text-[var(--main-color)] px-2 py-1 rounded font-[Courier_New,monospace] text-[0.85rem] font-semibold">{example.output}</code>
                      </div>
                    </div>
                    {example.explanation && (
                      <div className="mt-2 pt-2 border-t border-dashed border-gray-300 text-[0.85rem] text-gray-600 italic leading-relaxed font-[Inter,sans-serif]">
                        {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div>
                <h3 className="text-base mb-3 text-[var(--secondary-color)] font-bold font-[Public_Sans,sans-serif]">Constraints</h3>
                <code className="block font-[Courier_New,monospace] bg-[var(--french-gray)]/30 text-[var(--secondary-color)] px-4 py-3 rounded-lg text-[0.85rem]">{problem.constraints}</code>
              </div>

              {/* Help Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <button
                  className="flex items-center justify-center gap-2 bg-[var(--secondary-color)] text-[var(--main-color)]  border-[var(--secondary-color)] px-6 py-4 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 font-[Inter,sans-serif] no-underline text-center hover:-translate-y-1 hover:shadow-lg hover:bg-[var(--french-gray)] hover:border-[var(--french-gray)]"
                  onClick={() => {
                    setShowHint(!showHint);
                    if (showAnswer) setShowAnswer(false);
                  }}
                >
                  💡 {showHint ? 'Hide Hints' : 'Show Hints'}
                </button>
                <button
                  className="flex items-center justify-center gap-2 bg-[var(--secondary-color)] text-[var(--main-color)] border-2 border-[var(--secondary-color)] px-6 py-4 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 font-[Inter,sans-serif] no-underline text-center hover:-translate-y-1 hover:shadow-lg hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)]"
                  onClick={() => {
                    setShowAnswer(!showAnswer);
                    if (showHint) setShowHint(false);
                  }}
                >
                  ✓ {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
                <Link to="/more/apply-mentor" className="flex items-center justify-center gap-2 bg-[var(--secondary-color)] text-[var(--main-color)] border-2 border-[var(--secondary-color)] px-6 py-4 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 font-[Inter,sans-serif] no-underline text-center hover:-translate-y-1 hover:shadow-lg hover:bg-[var(--mid-main-secondary)] hover:border-[var(--mid-main-secondary)]">
                  💬 Ask a Mentor
                </Link>
              </div>

              {/* Hints Content */}
              {showHint && (
                <div className="mt-6 p-7 rounded-xl border-2 border-[var(--french-gray)] bg-white animate-[slideDown_0.4s_ease]">
                  <h3 className="text-xl font-bold mb-6 text-[var(--secondary-color)] font-[Public_Sans,sans-serif] border-l-4 border-[var(--accent-color)] pl-4">💡 Hints</h3>
                  <div className="flex flex-col gap-4">
                    {problem.hints.map((hint, index) => (
                      <div key={index} className="bg-[var(--mid-main-secondary)] p-5 rounded-lg border-l-4 border-[var(--french-gray)] transition-all duration-300 hover:border-l-[var(--accent-color)] hover:translate-x-1">
                        <span className="font-bold text-[var(--main-color)] block mb-3 text-sm uppercase tracking-wide">Hint {index + 1}</span>
                        <p className="m-0 text-[var(--main-color)] text-base leading-7 font-[Inter,sans-serif]">{hint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Content */}
              {showAnswer && (
                <div className="mt-6 p-7 rounded-xl border-2 border-[var(--french-gray)] bg-white animate-[slideDown_0.4s_ease]">
                  <h3 className="text-xl font-bold mb-6 text-[var(--secondary-color)] font-[Public_Sans,sans-serif] border-l-4 border-[var(--accent-color)] pl-4">✓ Correct Answer</h3>
                  <div className="bg-[var(--mid-main-secondary)] p-6 rounded-lg border-l-4 border-[var(--accent-color)]">
                    <p className="text-[1.05rem] leading-7 text-[var(--main-color)] m-0 font-[Inter,sans-serif]">{problem.correctAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Solution Side - Math Live*/}
          <article className="flex justify-start items-stretch flex-col w-1/2 h-full overflow-hidden rounded-lg">
            <MathLiveExample />
          </article>
        </section>
      </main>
    </>
  );
};

export default Problem;
