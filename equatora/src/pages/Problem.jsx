// ProblemDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import './Problem.css';
import LilArrow from '../assets/images/lilArrow.svg';
import MathLiveExample from '../components/MathLiveExample';
import Timer from '../components/Timer.jsx';

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
    premium: true
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
            {!problem.premium && <span className="tag basic">Basic</span>}
            {problem.completed && <span className="tag completed">Completed</span>}
            {!problem.completed && <span className="tag completed">Incomplete</span>}
          </div>
        </article>
        <section className="description-yourSolution">
          
          <article className="problem-description-timer">
            <div id="timer-container">
              <Timer></Timer>
            </div>
            <div className='problem-description'>
              <h2>Problem Description:</h2>
              <p>{problem.description}</p>

              <h2>Examples</h2>
              {problem.examples.map((example, index) => (
                <p key={index} className="example-code">
                  {example}
                </p>
              ))}

              <h2>Constraints</h2>
              <p>{problem.constraints}</p>
            </div>
          </article>

          <article className="solution-section">
            <MathLiveExample></MathLiveExample>
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Problem;