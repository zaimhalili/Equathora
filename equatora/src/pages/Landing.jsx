import React from 'react';
import './Landing.css';
import Logo from '../assets/images/logo.png';
import Studying from '../assets/images/studying.svg'
import { Link } from 'react-router-dom';

const Landing = () => {
    [...document.querySelectorAll('*')].forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
            console.log('Overflowing:', el, rect);
        }
    });
    return (
        <main id='home-body'>
            <header id='navbar'>
                <div id='logoName'>
                    <img src={Logo} alt="Logo" id='logoIMG' loading='lazy'/>
                    <h3 id='name'>equatora</h3>
                </div>

                <div id="home-buttons-container">
                    <Link to="/more" className="btnLanding" id='learnMore'>
                        Learn More
                    </Link>
                    <Link to="/dashboard" className="btnLanding" id='exploreProblems'>
                        Start Solving Now
                    </Link>

                    <Link to="/signup" className="btnLanding" id='enrollNow'>
                        Join Today
                    </Link>
                </div>
            </header>

            <section id='hero'>
                <div id='hero-left'>
                    <h1 id='hero-title'>
                        Turn Logic into Your 
                        <span style={{ color: 'var(--accent-color)' }}>
                            Superpower
                        </span>
                    </h1>
                    <h3 id='hero-description'>
                        Solve step-by-step problems with built-in guidance, unlock achievements, and watch your logic skills grow
                    </h3>
                    <div id='features-container'>
                        <h4 className='feature'>
                            <span style={{ color: 'var(--accent-color)', fontSize: '48px', fontWeight: '700' }}>50+ <br /></span>
                            Brain-teasing <br />problems to <br />solve
                        </h4>
                        <h4 className='feature'>
                            <span style={{ color: 'var(--accent-color)', fontSize: '48px', fontWeight: '700' }}>30+ <br /></span>Achievements <br />to keep you <br /> motivated.
                        </h4>
                        <h4 className='feature'>
                            <span style={{ color: 'var(--accent-color)', fontSize: '48px', fontWeight: '700' }}>20+ <br />
                            </span>Topics to <br />master <br />step by step
                        </h4>
                    </div>
                </div>
                <div id="hero-right"><img src={Studying} alt="studying" id='studyingIMG' loading='lazy'/></div>

            </section>
        </main>
    );
};

export default Landing;