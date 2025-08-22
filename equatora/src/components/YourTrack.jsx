import React from 'react';
import './YourTrack.css';


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
            </article>
        </>
    );
};

export default YourTrack;