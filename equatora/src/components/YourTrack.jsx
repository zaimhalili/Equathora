import React from 'react';
import './YourTrack.css';
import QuestionMark from '../assets/images/questionMark.svg';
import LilArrow from '../assets/images/lilArrow.svg';


const YourTrack = () => {
    return (
        <>
            <article id='your-track-container'>
                <h3>Your Track</h3>
                <div id='progress-bar-track'>
                    <h4>Math</h4>
                    <div id='progressBar-container'>
                        <div id='measure-progressBar'></div>
                    </div>
                    <img src={LilArrow} alt="arrow" />
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