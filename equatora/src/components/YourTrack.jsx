import React from 'react';
import './YourTrack.css';
import QuestionMark from '../assets/images/questionMark.svg';


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
                    <img src="" alt="" />
                    <div id='noProblemsSolved'>
                        <span id='countProblemsSolved'>25</span>/50 Problems Solved
                    </div>
                </div>
                <figure>
                    <img src="" alt="" />
                </figure>
            </article>
        </>
    );
};

export default YourTrack;