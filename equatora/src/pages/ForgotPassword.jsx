import React from 'react';
import './Resend.css';
import BackgroundPolygons from '../components/BackgroundPolygons';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo.png';

const ForgotPassword = () => {
  return (
    <main id='body-resend'>
      <section id='resend-container'>
        <article id='resend-logo-name'>  =
          <img src={Logo} alt="Logo" />
          <h3 id='login-name'>equatora</h3>
        </article>
        <article id='resend-text-container'>
          <h3>Forgot your password?</h3>

          <h6><br />If you've forgotten your password, use the form below to request a link to change it. Many people who think they've forgotten their password originally signed in using Google so you may like to try that too.</h6>
        </article>
        <article style={{ width: '100%', height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column', marginTop: '30px' }}>
          <h5 className='typeOfInput resend'>EMAIL</h5>
          <input
            type="email"
            className='inputAuth'
            id="emailInput"
            placeholder='Enter your email address'
            maxLength="254"
            required
          />

          <button type="submit" className="resend-btn">
            Resend Email
          </button>

          <div id='auth-other-options'>
            <p className='auth-other-options-text'>
              Already have an account?{' '}
              <Link to="/login" className="other-option-link" style={{ textDecoration: 'underline' }}>
                Log In
              </Link>
            </p>

            <p className='auth-other-options-text'>
              Don't have an account yet?{' '}
              <Link to="/signup" className="other-option-link" style={{ textDecoration: 'underline' }}>
                Sign up for free.
              </Link>
            </p>
          </div>
        </article>

      </section>

      <aside id="background-container"><BackgroundPolygons /></aside>
    </main>
  );
};

export default ForgotPassword; 