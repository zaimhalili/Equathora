import React from 'react';
import './Resend.css';
import BackgroundPolygons from '../components/BackgroundPolygons';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo.png'; // Adjust the path based on your project structure

const Resend = () => {
  return (
    <main id='body-resend'>
      <section id='resend-container'>
        <div id='resend-logo-name'>  {/* Changed to match CSS */}
          <img src={Logo} alt="Logo" id='login-logoIMG' />
          <h3 id='login-name'>equatora</h3>  {/* Changed to match CSS */}
        </div>

        <h5 className='typeOfInput resend'>Email</h5>
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
      </section>

      <aside id="background-container"><BackgroundPolygons /></aside>
    </main>
  );
};

export default Resend;  // Changed export name to match component name