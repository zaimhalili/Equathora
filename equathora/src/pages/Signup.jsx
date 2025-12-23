import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundPolygons from '../components/BackgroundPolygons.jsx';
import Logo from '../assets/images/logo.png';
import GoogleAuth from '../components/GoogleAuth.jsx';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    try {
      const res = await fetch('http://localhost:5203/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      alert(`Registration successful! Verification code: ${data.code}\n(Check your email in production)`);
      navigate('/login');
    } catch (err) {
      setError('Connection error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  }

  function GoogleSignup() {
    alert('Google OAuth coming soon!');
  }

  return (
    <main id='body-signup'>
      <section id='signup-container'>
        <div id='signup-logo-name'>
          <img src={Logo} alt="Logo" id='signup-logoIMG' />
          <h3 id='signup-name'>equathora</h3>
        </div>
        <div style={{ width: '100%' }}><GoogleAuth onClick={GoogleSignup} /></div>

        <form id='auth' onSubmit={handleSignup}>
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
          
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