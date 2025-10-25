import React from 'react';
import './YourTrack.css';
import QuestionMark from '../assets/images/questionMark.svg';
import LilArrow from '../assets/images/lilArrow.svg';
import Mentor from '../assets/images/mentoring.svg';
import { Link } from 'react-router-dom';

const YourTrack = () => {
    const solved = 10;
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
                            <progress
                                id='measure-progressBar'
                                style={{
                                    width: `${percentage}%`, opacity: `${percentage}`
                                }}
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
                {/* <figure>
                    <img src={QuestionMark} alt="question mark" />
                </figure> */}
                <div className='try-your-hand'>
                    <div className='try-mentoring'>
                        <img src={Mentor} alt="Mentoring icon" />
                        <p>Become a mentor</p>
                        <p>Mentoring is a great way to reinforce your own learning, and help students learn and discover the things they don't know.</p>
                        <div className='flex'>
                            <Link to='/applymentor'>Try mentoring now</Link>
                            <Link to='/applymentor'>Learn more</Link>
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
};

export default YourTrack;