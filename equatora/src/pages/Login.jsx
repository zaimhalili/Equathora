import React from 'react';
import './Login.css';
import BackgroundPolygons from '../components/BackgroundPolygons.jsx';
import Logo from '../assets/images/logo.png';
import GoogleAuth from '../components/GoogleAuth.jsx';
import { Link } from 'react-router-dom';

const Login = () => {
  function googleLogin() {
    alert("yeah buddy like this is gonna work")
  }
  return (
    <>
      <main id='body-login'>
        <section id='login-container'>
          <div id='login-logo-name'>
            <img src={Logo} alt="Logo" id='login-logoIMG' />
            <h3 id='login-name'>equatora</h3>
          </div>
          <div style={{ width: '100%' }}><GoogleAuth onClick={googleLogin} /></div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <hr className='or-line' />
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700', color: 'var(--secondary-color)', textAlign: 'center', padding: '0 10px' }}>
              OR
            </p>
            <hr className='or-line' />
          </div>

          <div id='auth'>
            <h5 className='typeOfInput'>Email</h5>
            <input type="email" className='inputAuth' id="emailInput" placeholder='Enter your email address' maxLength="254" required></input>

            <h5 className='typeOfInput'>Password</h5>
            <input type="password" className='inputAuth' id="passwordInput" placeholder='Enter your password' minLength="6" maxLength="128" required></input>

            <Link to="/password" className="btnForgotPass" id='forgotPass'>
              Forgot your password?
            </Link>

            <button type="submit" id="login-btn">
              Log In
            </button>
            <div id='auth-other-options'>
              <p className='auth-other-options-text'>
                Don't have an account yet?{' '}
                <Link to="/signup" className="other-option-link" style={{ textDecoration: 'underline' }}>
                  Sign up for free.
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

    </>
  );
};

export default Login;