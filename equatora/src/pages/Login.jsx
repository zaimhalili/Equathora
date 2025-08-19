import React from 'react';
import './Login.css';
import BackgroundPolygons from '../components/BackgroundPolygons.jsx';
import Logo from '../assets/images/logo.png';
import GoogleAuth from '../components/GoogleAuth.jsx';

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

          <GoogleAuth />
          
          <div id="or-container">
            <div className='straightLine' id='strLine1'></div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700', color: 'var(--secondary-color)' }}>OR</p>
            <div className='straightLine' id='strLine1'></div>
          </div>


          <h5 className='typeOfInput'>Email</h5>
          <textarea name="email" id="emailInput" placeholder='Enter your email address'></textarea>

          <h5 className='typeOfInput'>Password</h5>
          <textarea name="password" id="passwordInput" placeholder='Enter your password'></textarea>
        </section>
        <aside id="background-container"><BackgroundPolygons /></aside>

      </main>

    </>
  );
};

export default Login;