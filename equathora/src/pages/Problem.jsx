// ProblemDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import './Problem.css';
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
      <main id="body-problem">
        <header className="problem-nav-header">
          <Link to="/learn" className="back-link">
            <img src={LilArrow} alt="arrow" className='arrow-icon' />
            <span>Back to Exercises</span>
          </Link>
          <div className="problem-actions">
            <button
              className={`action-btn favorite ${isFavorite ? 'active' : ''}`}
              onClick={() => setIsFavorite(!isFavorite)}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
        </header>

        <article className="problem-header">
          <h1>{problem.title}</h1>
          <div className="problem-tags">
            <span className={`tag difficulty ${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
            {problem.premium && <span className="tag premium">Premium</span>}
            {!problem.premium && <span className="tag basic">Free</span>}
            {problem.completed && <span className="tag completed">✓ Completed</span>}
            {!problem.completed && <span className="tag incomplete">Incomplete</span>}
          </div>
        </article>

        <section className="description-yourSolution">
          <article className="problem-description-timer">
            <div id="timer-container">
              <Timer />
            </div>

            <div className='problem-description'>
              {/* Problem Description */}
              <div className="description-section">
                <h2>Problem Description</h2>
                <p>{problem.description}</p>
              </div>

              {/* Examples */}
              <div className="description-section">
                <h2>Examples</h2>
                {problem.examples.map((example, index) => (
                  <div key={index} className="example-box">
                    <div className="example-item">
                      <strong>Input:</strong> <code>{example.input}</code>
                    </div>
                    <div className="example-item">
                      <strong>Output:</strong> <code>{example.output}</code>
                    </div>
                    {example.explanation && (
                      <div className="example-item explanation">
                        <strong>Explanation:</strong> {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="description-section">
                <h2>Constraints</h2>
                <p className="constraints">{problem.constraints}</p>
              </div>

              {/* Help Actions */}
              <div className="help-actions">
                <button
                  className="help-btn hints-btn"
                  onClick={() => {
                    setShowHint(!showHint);
                    if (showAnswer) setShowAnswer(false);
                  }}
                >
                  💡 {showHint ? 'Hide Hints' : 'Show Hints'}
                </button>
                <button
                  className="help-btn answer-btn"
                  onClick={() => {
                    setShowAnswer(!showAnswer);
                    if (showHint) setShowHint(false);
                  }}
                >
                  ✓ {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
                <Link to="/more/apply-mentor" className="help-btn mentor-btn">
                  💬 Ask a Mentor
                </Link>
              </div>

              {/* Hints Content */}
              {showHint && (
                <div className="help-content hints-content">
                  <h3>💡 Hints</h3>
                  <div className="hints-list">
                    {problem.hints.map((hint, index) => (
                      <div key={index} className="hint-item">
                        <span className="hint-number">Hint {index + 1}</span>
                        <p>{hint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Content */}
              {showAnswer && (
                <div className="help-content answer-content">
                  <h3>✓ Correct Answer</h3>
                  <div className="answer-box">
                    <p>{problem.correctAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          </article>

          <article className="solution-section">
            <MathLiveExample />
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Problem;
