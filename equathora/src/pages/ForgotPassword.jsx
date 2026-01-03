import React, { useState } from 'react';
import './Resend.css';
import BackgroundPolygons from '../components/BackgroundPolygons';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo/EquathoraLogoFull.svg';
import { supabase } from '../lib/supabaseClient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message || 'Failed to send reset email');
        setLoading(false);
        return;
      }

      setMessage('Password reset link sent! Check your email inbox and spam folder. Click the link to reset your password.');
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  }

  return (
    <main id='body-resend'>
      <section id='resend-container'>
        <article id='resend-logo-name'>
          <img src={Logo} alt="Logo" className='w-70' />
        </article>
        <article id='resend-text-container'>
          <h3>Forgot your password?</h3>
          <h6><br />If you've forgotten your password, use the form below to request a reset code. Many people who think they've forgotten their password originally signed in using Google so you may like to try that too.</h6>
        </article>

        <article style={{ width: '100%', height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column', marginTop: '30px' }}>
          <form onSubmit={handleForgotPassword} style={{ width: '100%' }}>
            {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
            {message && <p style={{ color: 'green', fontSize: '14px', marginBottom: '10px' }}>{message}</p>}

            <h5 className='typeOfInput resend'>EMAIL</h5>
            <input
              type="email"
              className='inputAuth'
              placeholder='Enter your email address'
              maxLength="254"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="resend-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

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
        </article>

      </section>

      <aside id="background-container"><BackgroundPolygons /></aside>
    </main>
  );
};

export default ForgotPassword; 