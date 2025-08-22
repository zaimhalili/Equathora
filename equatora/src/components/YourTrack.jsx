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
                    <div className="prg-bar-arrow">
                        <div id='progressBar-container'>
                            <div id='measure-progressBar' />
                        </div>
                        <Link to="/problems" className="arrowProblems" id='arrowProblems'>
                            <img src={LilArrow} alt="arrow" id='arrowProblemsIMG' />
                        </Link>
                    </div>


                    <div id='noProblemsSolved'>
                        <span id='countProblemsSolved'>25</span>/50 Problems Solved
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