import React from 'react';
import './Login.css';
import BackgroundPolygons from '../components/BackgroundPolygons.jsx';
import Logo from '../assets/images/logo.png';
import GoogleAuth from '../components/GoogleAuth.jsx';
import Auth from '../components/Auth.jsx';
import { Link } from 'react-router-dom';

const Login = () => {
  function GoogleLogin() {
    alert("yeah buddy like this is gonna work");
  }

  return (
    <>
      <main id='body-login'>
        <section id='login-container'>
          <div id='login-logo-name'>
            <img src={Logo} alt="Logo" id='login-logoIMG' />
            <h3 id='login-name'>equatora</h3>
          </div>
          <div style={{ width: '100%' }}><GoogleAuth onClick={GoogleLogin} /></div>

          <div id='auth'>
            <Auth />
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
                <Link to="/resend" className="other-option-link" style={{ textDecoration: 'underline' }}>
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