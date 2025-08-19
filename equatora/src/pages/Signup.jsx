import React from 'react';
import GoogleAuth from '../components/GoogleAuth';
import './Signup.css';

const Signup = () => {
  return (
    <main id='body-signup'>
      <section id='login-container'>
        <div id='login-logo-name'>
          <img src={Logo} alt="Logo" id='login-logoIMG' />
          <h3 id='login-name'>equatora</h3>
        </div>
        <div style={{ width: '100%' }}><GoogleAuth onClick={googleLogin} /></div>

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
              Already got an account?{' '}
              <Link to="/signup" className="other-option-link" style={{ textDecoration: 'underline' }}>
                Log in.
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
    </main>
  );
};

export default Signup;