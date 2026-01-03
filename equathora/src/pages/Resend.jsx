import React, { useState } from 'react';
import './Resend.css';
import BackgroundPolygons from '../components/BackgroundPolygons';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo/EquathoraLogoFull.svg';
import { supabase } from '../lib/supabaseClient';

const Resend = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResend(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (resendError) {
      setError(resendError.message || 'Failed to resend confirmation email');
      setLoading(false);
      return;
    }

    setMessage('Confirmation email sent! Check your inbox.');
    setLoading(false);
  }

  return (
    <main id='body-resend'>
      <section id='resend-container'>
        <article id='resend-logo-name'>
          <img src={Logo} alt="Logo" className='w-70' />
        </article>
        <article id='resend-text-container'>
          <h3>Resend confirmation instructions</h3>
          <h6><br />Not received a confirmation email? Use the form below and we'll send you another.</h6>
        </article>

        <article style={{ width: '100%', height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column', marginTop: '30px' }}>
          <form onSubmit={handleResend} style={{ width: '100%' }}>
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
              {loading ? 'Sending...' : 'Resend Email'}
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

export default Resend;  // Changed export name to match component name