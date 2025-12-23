import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import BackgroundPolygons from '../components/BackgroundPolygons.jsx';
import Logo from '../assets/images/logo.png';
import GoogleAuth from '../components/GoogleAuth.jsx';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5203/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setError('Connection error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  }

  function GoogleLogin() {
    alert('Google OAuth coming soon!');
  }

  return (
    <>
      <main id='body-login'>
        <section id='login-container'>
          <div id='login-logo-name'>
            <img src={Logo} alt="Logo" id='login-logoIMG' />
            <h3 id='login-name'>equathora</h3>
          </div>
          <div style={{ width: '100%' }}><GoogleAuth onClick={GoogleLogin} /></div>

          <form id='auth' onSubmit={handleLogin}>
            {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
            
            <h5 className='typeOfInput'>EMAIL</h5>
            <input 
              type="email" 
              className='inputAuth' 
              placeholder='Enter your email address' 
              maxLength="254"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />

            <h5 className='typeOfInput'>PASSWORD</h5>
            <input 
              type="password" 
              className='inputAuth' 
              placeholder='Enter your password' 
              minLength="6" 
              maxLength="128"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />

            <Link to="/forgotPassword" className="btnForgotPass" id='forgotPass'>
              Forgot your password?
            </Link>

            <button type="submit" id="login-btn" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
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
          </form>
        </section>
        <aside id="background-container"><BackgroundPolygons /></aside>
      </main>
    </>
  );
};

export default Login;