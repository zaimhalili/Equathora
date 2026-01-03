
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import '../components/Auth.css';
import BackgroundPolygons from '../components/BackgroundPolygons.jsx';
import Logo from '../assets/logo/EquathoraLogoFull.svg';
import GoogleAuth from '../components/GoogleAuth.jsx';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(signInError.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Navigate immediately for better UX
      navigate('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  }

  async function GoogleLogin() {
    setError("");
    setLoading(true);
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
    if (googleError) {
      setError(googleError.message || 'Google login failed');
      setLoading(false);
    }
  }

  return (
    <>
      <main id='body-login'>
        <section id='login-container'>
          <div id='login-logo-name'>
            <img src={Logo} alt="Logo" id='login-logoIMG' className='w-70' />
          </div>
          <div style={{ width: '100%' }}><GoogleAuth onClick={GoogleLogin} /></div>

          <form id='auth' onSubmit={handleLogin}>
            {error && (
              <div style={{
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px',
                color: '#c33',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
              }}>
                {error}
              </div>
            )}

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