// ProblemDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import './Problem.css';
import LilArrow from '../assets/images/lilArrow.svg';

const Problem = () => {
  const { groupId, problemId } = useParams();

  const problem = {
    id: parseInt(problemId),
    groupId: parseInt(groupId),
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
      "Input: nums = [3,2,4], target = 6\nOutput: [1,2]"
    ],
    constraints: "2 <= nums.length <= 10^4",
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
        <header>
          <Link to="/learn" id="backToExercises-link"><img src={LilArrow} alt="arrow" id='arrowProblemsIMG' /><h5>Back to Exercises</h5>
          </Link>
        </header>
        <article className="problem-header">
          <h1>{problem.title}</h1>
          <div className="problem-tags">
            <span className={`tag difficulty ${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
            {problem.premium && <span className="tag premium">Premium</span>}
            {problem.completed && <span className="tag completed">Completed</span>}
          </div>
        </article>

        <article className="problem-description">
          <h2>Problem Description</h2>
          <p>{problem.description}</p>

          <h3>Examples</h3>
          {problem.examples.map((example, index) => (
            <pre key={index} className="example-code">
              {example}
            </pre>
          ))}

          <h3>Constraints</h3>
          <p>{problem.constraints}</p>
        </article>

        <article className="solution-section">
          <h2>Your Solution</h2>
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Write your solution here..."
            className="solution-textarea"
          />
          <button onClick={handleSubmit} className="submit-button">
            Submit Solution
          </button>
        </article>
      </main>

      <Footer />
    </>
  );
};

export default Problem;