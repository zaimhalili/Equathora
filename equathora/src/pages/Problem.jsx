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
      <main className="bg-[var(--main-color)] min-h-screen text-[var(--secondary-color)]">
        {/* Navigation Header */}
        <header className="flex items-center justify-between font-[Public_Sans,sans-serif] bg-[var(--main-color)] w-full border-b-2 border-[var(--french-gray)] px-8 py-4">
          <Link to="/learn" className="flex items-center gap-2 text-base text-[var(--secondary-color)] font-semibold no-underline transition-all duration-200 px-4 py-2 rounded-lg hover:bg-[var(--mid-main-secondary)] hover:text-[var(--main-color)]">
            <img src={LilArrow} alt="arrow" className="w-5 h-5 rotate-180 transition-transform duration-200 hover:translate-x-1" />
            <span>Back to Exercises</span>
          </Link>
          <div className="flex gap-2">
            <button
              className={`bg-transparent border-2 border-[var(--french-gray)] px-4 py-2 rounded-lg cursor-pointer text-2xl transition-all duration-200 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:scale-105 ${isFavorite ? 'text-[var(--accent-color)] border-[var(--accent-color)] bg-[rgba(217,4,41,0.05)]' : 'text-[var(--french-gray)]'}`}
              onClick={() => setIsFavorite(!isFavorite)}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
        </header>

        {/* Problem Header */}
        <article className="w-full flex flex-col bg-[var(--secondary-color)] items-center px-8 py-6 gap-4">
          <h1 className="font-[Public_Sans,sans-serif] text-2xl md:text-3xl text-[var(--main-color)] font-bold text-center">{problem.title}</h1>
          <div className="flex gap-3 flex-wrap font-[Inter,sans-serif] justify-center">
            <span className={`px-4 py-2 rounded-full font-semibold uppercase text-xs tracking-wider ${problem.difficulty.toLowerCase() === 'easy' ? 'bg-[var(--main-color)] text-green-500 border-2 border-green-500' :
              problem.difficulty.toLowerCase() === 'medium' ? 'bg-[var(--main-color)] text-yellow-500 border-2 border-yellow-500' :
                'bg-[var(--main-color)] text-[var(--accent-color)] border-2 border-[var(--accent-color)]'
              }`}>
              {problem.difficulty}
            </span>
            {problem.premium ? (
              <span className="px-4 py-2 rounded-full font-semibold uppercase text-xs tracking-wider bg-[var(--accent-color)] text-[var(--main-color)]">Premium</span>
            ) : (
              <span className="px-4 py-2 rounded-full font-semibold uppercase text-xs tracking-wider bg-[var(--mid-main-secondary)] text-[var(--main-color)]">Free</span>
            )}
            {problem.completed ? (
              <span className="px-4 py-2 rounded-full font-semibold uppercase text-xs tracking-wider bg-green-500 text-[var(--main-color)]">✓ Completed</span>
            ) : (
              <span className="px-4 py-2 rounded-full font-semibold uppercase text-xs tracking-wider bg-[var(--french-gray)] text-[var(--secondary-color)]">Incomplete</span>
            )}
          </div>
        </article>

        {/* Main Content */}
        <section className="flex w-full h-[calc(100vh-180px)]">
          {/* Description Side */}
          <article className="w-1/2 flex bg-[var(--main-color)] flex-col p-0 font-[Inter,sans-serif] border-r-[3px] border-[var(--secondary-color)] text-[var(--secondary-color)] h-full overflow-hidden">
            <div className="flex w-full justify-end px-8 py-4 bg-[var(--mid-main-secondary)]">
              <Timer />
            </div>

            <div className="w-full px-8 py-8 flex flex-col gap-6 overflow-y-auto flex-1">
              {/* Problem Description */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:border-[var(--secondary-color)] hover:shadow-md">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-[var(--french-gray)]">
                  <span className="text-lg">📝</span>
                  <h3 className="text-base m-0 text-[var(--secondary-color)] font-bold font-[Public_Sans,sans-serif]">Description</h3>
                </div>
                <p className="text-[0.95rem] leading-relaxed text-[var(--secondary-color)] font-[Inter,sans-serif] m-0">{problem.description}</p>
              </div>

              {/* Examples */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:border-[var(--secondary-color)] hover:shadow-md">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-[var(--french-gray)]">
                  <span className="text-lg">💡</span>
                  <h3 className="text-base m-0 text-[var(--secondary-color)] font-bold font-[Public_Sans,sans-serif]">Examples</h3>
                </div>
                {problem.examples.map((example, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md mb-3 last:mb-0 border-l-[3px] border-[var(--accent-color)]">
                    <div className="text-xs font-bold text-[var(--mid-main-secondary)] mb-2 uppercase tracking-wide font-[Public_Sans,sans-serif]">Example {index + 1}</div>
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
              <div className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:border-[var(--secondary-color)] hover:shadow-md">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-[var(--french-gray)]">
                  <span className="text-lg">⚙️</span>
                  <h3 className="text-base m-0 text-[var(--secondary-color)] font-bold font-[Public_Sans,sans-serif]">Constraints</h3>
                </div>
                <code className="block font-[Courier_New,monospace] bg-[var(--secondary-color)] text-yellow-400 px-3 py-3 rounded-md text-[0.9rem] font-semibold">{problem.constraints}</code>
              </div>

              {/* Help Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <button
                  className="flex items-center justify-center gap-2 bg-[var(--secondary-color)] text-[var(--main-color)] border-2 border-[var(--secondary-color)] px-6 py-4 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 font-[Inter,sans-serif] no-underline text-center hover:-translate-y-1 hover:shadow-lg hover:bg-[var(--french-gray)] hover:border-[var(--french-gray)]"
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

          {/* Solution Side */}
          <article className="flex justify-start items-stretch flex-col w-1/2 h-full overflow-hidden">
            <MathLiveExample />
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Problem;
