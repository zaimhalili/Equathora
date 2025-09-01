import React from 'react';
import './Resend.css';
import BackgroundPolygons from '../components/BackgroundPolygons';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo.png';

const Resend = () => {
  return (
    <main id='body-resend'>
      <section id='resend-container'>
        <article id='resend-logo-name'>  =
          <img src={Logo} alt="Logo" />
          <h3 id='login-name'>equathora</h3>
        </article>
        <article id='resend-text-container'>
          <h3>Resend confirmation instructions</h3>

          <h6><br />Not received a confirmation email? Use the form below and we'll send you another.</h6>
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

export default Resend;  // Changed export name to match component name