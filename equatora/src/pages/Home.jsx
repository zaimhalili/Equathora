import React from 'react';
import './Home.css';
import Logo from '../assets/images/logo.png';
import Studying from '../assets/images/studying.png'
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <main id='home-body'>
            <header id='navbar'>
                <div id='logoName'>
                    <img src={Logo} alt="Logo" id='logoIMG' />
                    <h3 id='name'>equatora</h3>
                </div>

                <div id="home-buttons-container">
                    <Link to="/more" className="btnLanding" id='learnMore'>
                        Learn More
                    </Link>
                    <Link to="/problemgroup" className="btnLanding" id='exploreProblems'>
                        Explore Problems
                    </Link>

                    <Link to="/login" className="btnLanding" id='enrollNow'>
                        Enroll Now
                    </Link>
                </div>
            </header>

            <section id='hero'>
                <div id='hero-left'>
                    <h1 id='hero-title'>
                        Master Logic <br />Step By Step,<br /> with <span style={{ color: 'var(--accent-color)'}}>Equatora
                        </span>
                    </h1>
                    <h3 id='hero-description'>
                        Practice logic and math through engaging problems, step-by-step learning, and gamified challenges designed to make steady progress both fun and rewarding.
                    </h3>
                    <div id='features-container'>
                        <h4 className='feature'>
                            <span style={{ color: 'var(--accent-color)', fontSize: '48px', fontWeight:'600' }}>50+ <br /></span>
                            Problems
                        </h4>
                        <h4 className='feature'>
                            <span style={{ color: 'var(--accent-color)', fontSize: '48px', fontWeight: '600' }}>30+ <br /></span>Achievements
                        </h4>
                        <h4 className='feature'>
                            <span style={{ color: 'var(--accent-color)', fontSize: '48px', fontWeight: '600' }}>20+ <br />
                            </span>Topics
                        </h4>
                    </div>
                </div>
                <div id="hero-right"><img src={Studying} alt="studying" id='studyingIMG' /></div>

            </section>
        </main>
    );
};

export default Home;