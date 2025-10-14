// ProblemDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import './Problem.css';
import LilArrow from '../assets/images/lilArrow.svg';
import MathLiveExample from '../components/MathLiveExample';
import Timer from '../components/Timer.jsx';
import fakeImg from '../assets/images/oldteacher.png'

// Example: Import problem images (uncomment when you have actual images)
// import SequenceDiagram from '../assets/images/sequence-diagram.png';
// import ExampleVisualization from '../assets/images/example-viz.png';

const Problem = () => {
  const { groupId, problemId } = useParams();
  const [showHint, setShowHint] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const problem = {
    id: parseInt(problemId),
    groupId: parseInt(groupId),
    title: "Find the 44th element of the sequence",
    difficulty: "Easy",
    description: "Given a sequence: 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, ... Find the 44th element of the sequence.",

    // ══════════════════════════════════════════════════════════
    // 📸 IMAGE SUPPORT - How to add images to your problems:
    // ══════════════════════════════════════════════════════════

    // 1️⃣ MAIN DESCRIPTION IMAGE:
    // Shows a diagram/illustration below the problem description
    descriptionImage: null, // Example: SequenceDiagram (import at top)
    imageCaption: null,     // Example: "Visual representation of the sequence"

    // 2️⃣ EXAMPLE IMAGES:
    // Each example can have its own visualization
    examples: [
      {
        input: "n = 44",
        output: "9",
        explanation: "The pattern shows each number n appearing n times",
        image: fakeImg  // Example: ExampleVisualization (import at top)
      }
      // Add more examples with or without images
    ],

    // ══════════════════════════════════════════════════════════
    // 💡 USAGE EXAMPLES:
    // ══════════════════════════════════════════════════════════
    //
    // For geometry problems:
    //   descriptionImage: GeometryDiagram
    //   imageCaption: "Triangle ABC with given measurements"
    //
    // For graph problems:
    //   descriptionImage: GraphDiagram
    //   imageCaption: "Example graph with 5 nodes and 7 edges"
    //
    // For visual examples:
    //   examples: [
    //     { 
    //       input: "grid = [[1,2],[3,4]]",
    //       output: "10",
    //       explanation: "Sum of all elements",
    //       image: GridVisualization
    //     }
    //   ]
    // ══════════════════════════════════════════════════════════

    constraints: "1 ≤ n ≤ 10^6",
    hints: [
      "Notice the pattern: number 1 appears 1 time, number 2 appears 2 times, etc.",
      "Can you find a mathematical formula for the position where number n first appears?",
      "Think about triangular numbers!"
    ],
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
              <div className="description-section">
                <h2>Problem Description</h2>
                <p>{problem.description}</p>

                {/* Display image if provided */}
                {problem.descriptionImage && (
                  <div className="problem-image-container">
                    <img
                      src={problem.descriptionImage}
                      alt={problem.imageCaption || "Problem diagram"}
                      className="problem-image"
                    />
                    {problem.imageCaption && (
                      <p className="image-caption">{problem.imageCaption}</p>
                    )}
                  </div>
                )}
              </div>

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

                    {/* Display example image if provided */}
                    {example.image && (
                      <div className="example-image-container">
                        <img
                          src={example.image}
                          alt={`Example ${index + 1} visualization`}
                          className="example-image"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="description-section">
                <h2>Constraints</h2>
                <p className="constraints">{problem.constraints}</p>
              </div>

              <div className="description-section hints-section">
                <button
                  className="hint-toggle"
                  onClick={() => setShowHint(!showHint)}
                >
                  💡 {showHint ? 'Hide Hints' : 'Show Hints'}
                </button>
                {showHint && (
                  <div className="hints-container">
                    {problem.hints.map((hint, index) => (
                      <div key={index} className="hint-item">
                        <span className="hint-number">Hint {index + 1}:</span>
                        <p>{hint}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
