import React from 'react';
import './YourTrack.css';
import QuestionMark from '../assets/images/questionMark.svg';
import LilArrow from '../assets/images/lilArrow.svg';
import { Link } from 'react-router-dom';

const YourTrack = () => {
    const solved = 25;
    const total = 50;
    const percentage = (solved / total) * 100;

    return (
        <>
            <article id='your-track-container'>
                <div id='progress-bar-track'>
                    <h3>Your Track</h3>
                    <h4>Problems</h4>
                    <div className="prg-bar-arrow">
                        <Link to="/problems" id='progressBar-container'>
                            <div
                                id='measure-progressBar'
                                style={{ width: `${percentage}%` }} // ✅ Dynamic width
                            />
                        </Link>
                        <Link to="/problems" className="arrowProblems" id='arrowProblems'>
                            <img src={LilArrow} alt="arrow" id='arrowProblemsIMG' />
                        </Link>
                    </div>

                    <div id='noProblemsSolved'>
                        <span id='completed-problems'>{solved}</span>/
                        <span className='problems-count'>{total}</span> Problems Solved
                    </div>
                </div>
                <figure>
                    <img src={QuestionMark} alt="question mark" />
                </figure>
            </article>
        </>
    );
};

export default YourTrack;