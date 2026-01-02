
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundPolygons from '../components/BackgroundPolygons.jsx';
import Logo from '../assets/logo/EquathoraLogoFull.svg';
import GoogleAuth from '../components/GoogleAuth.jsx';
import { Link } from 'react-router-dom';
import './Signup.css';
import '../components/Auth.css';
import { supabase } from '../lib/supabaseClient';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  async function handleSignup(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    // Supabase sign up
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (signUpError) {
      setError(signUpError.message || 'Registration failed');
      setLoading(false);
      return;
    }

    // Optionally log to console
    console.log('Registration successful! Check your email for a confirmation link.');
    navigate('/login');
    setLoading(false);
  }

  async function GoogleSignup() {
    setError("");
    setLoading(true);
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (googleError) {
      setError(googleError.message || 'Google signup failed');
      setLoading(false);
    }
  }

  return (
    <main id='body-signup'>
      <section id='signup-container'>
        <div id='signup-logo-name'>
          <img src={Logo} alt="Logo" id='signup-logoIMG' className='w-70' />
        </div>
        <div style={{ width: '100%' }}><GoogleAuth onClick={GoogleSignup} /></div>

        <form id='auth' onSubmit={handleSignup}>
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

          <h5 className='typeOfInput'>USERNAME</h5>
          <input
            type="text"
            className='inputAuth'
            placeholder='Choose a unique username'
            maxLength="20"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

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

          <h5 className='typeOfInput'>PASSWORD CONFIRMATION</h5>
          <input
            type="password"
            className='inputAuth'
            placeholder='Confirm your password'
            maxLength="128"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" id="signup-btn" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
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
              <Link to="/resend" className="other-option-link" style={{ textDecoration: 'underline' }}>
                Resend it.
              </Link>
            </p>
          </div>
        </form>
      </section>

      <aside id="background-container"><BackgroundPolygons /></aside>
    </main>
  );
};

export default Signup;