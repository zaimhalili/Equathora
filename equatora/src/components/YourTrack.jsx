import React from 'react';
import './YourTrack.css';
import QuestionMark from '../assets/images/questionMark.svg';
import LilArrow from '../assets/images/lilArrow.svg';
import { Link } from 'react-router-dom';


const YourTrack = () => {
    return (
        <>
            <article id='your-track-container'>
                <div id='progress-bar-track'>
                    <h3>Your Track</h3>
                    <h4>Problems</h4>
                    <Link to="/problems" id='progressBar-container'>
                        <progress value={50} max={100} id='progressBar'></progress>
                    </Link>
                    <div className="prg-bar-arrow">
                        <Link to="/problems" className="arrowProblems" id='arrowProblems'>
                            <img src={LilArrow} alt="arrow" id='arrowProblemsIMG' />
                        </Link>
                    </div>


                    <div id='noProblemsSolved'>
                        <span id='completed-problems'>25</span>/<span className='problems-count'>50</span> Problems Solved
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