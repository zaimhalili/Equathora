import React from 'react';
import BackgroundPolygons from '../components/BackgroundPolygons.jsx';
import Logo from '../assets/images/logo.png';
import GoogleAuth from '../components/GoogleAuth.jsx';
import Auth from '../components/Auth.jsx';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  function GoogleSignup() {
    
  }

  return (
    <main id='body-signup'>
      <section id='signup-container'>
        <div id='signup-logo-name'>
          <img src={Logo} alt="Logo" id='signup-logoIMG' />
          <h3 id='signup-name'>equatora</h3>
        </div>
        <div style={{ width: '100%' }}><GoogleAuth onClick={GoogleSignup} /></div>

        <div id='auth'>
          <h5 className='typeOfInput'>Username</h5>
          <input type="text" className='inputAuth' id="usernameInput" placeholder='Choose a unique username' maxLength="20" required></input>
          <Auth />
          <h5 className='typeOfInput'>Password Confirmation</h5>
          <input type="text" className='inputAuth' id="passwordConfirmInput" placeholder='Confirm your password' maxLength="128" required></input>

          <button type="submit" id="signup-btn">
            Sign Up
          </button>
          <div id='auth-other-options'>
            <p className='auth-other-options-text'>
              Already have an account?{' '}
              <Link to="/login" className="other-option-link" style={{ textDecoration: 'underline' }}>
                Log In
              </Link>
            </p>

            <p className='auth-other-options-text'>
              Didn't receive your confirmation email?{' '}
              <Link to="/password" className="other-option-link" style={{ textDecoration: 'underline' }}>
                Resend it.
              </Link>
            </p>

          </div>
        </div>
      </section>

      <aside id="background-container"><BackgroundPolygons /></aside>
    </main>
  );
};

export default Signup;