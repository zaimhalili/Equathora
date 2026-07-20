import React, { useEffect, useState } from 'react';
import './Resend.css';
import BackgroundPolygons from '../components/BackgroundPolygons';
import { Link, useSearchParams } from 'react-router-dom';
import Sigma from '../assets/logo/TransparentSymbol.png';
import { supabase } from '../lib/supabaseClient';
import { SITE_URL } from '../lib/config';
import {
  getResendButtonLabel,
  getResendCooldownSeconds,
  getResendErrorMessage,
  RESEND_COOLDOWN_SECONDS,
} from '../lib/emailVerification';
import SupportContact from '../components/SupportContact.jsx';

const Resend = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCooldownSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

  async function handleResend(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${SITE_URL}/auth/callback`,
        },
      });

      if (resendError) {
        setError(getResendErrorMessage(resendError));
        setCooldownSeconds(getResendCooldownSeconds(resendError));
        setLoading(false);
        return;
      }

      setMessage('Confirmation link sent. Check your inbox and spam folder.');
      setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
      setLoading(false);
    } catch {
      setError('We could not send another confirmation link. Please try again in a moment.');
      setLoading(false);
    }
  }

  return (
    <main id='body-resend'>
      <section id='resend-container'>
        <article id='resend-logo-name'>
          <p className='font-[Sansation,Arial] pl-6 text-3xl font-black relative select-none'>
            <img src={Sigma} alt="Logo" className='w-11 h-11 absolute -left-5 -top-[11px] pointer-events-none' />
            Equathora
          </p>
        </article>
        <article id='resend-text-container'>
          <h3>Resend your confirmation link</h3>
          <h6><br />Enter the signup email and we'll send a fresh link. You won't need to copy a code.</h6>
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

            <button type="submit" className="resend-btn" disabled={loading || cooldownSeconds > 0}>
              {getResendButtonLabel({ loading, cooldownSeconds })}
            </button>
          </form>

          <div id='auth-other-options'>
            <p className='auth-other-options-text text-black dark:text-white'>
              Already have an account?{' '}
              <Link to="/login" className="other-option-link" style={{ textDecoration: 'underline' }}>
                Log In
              </Link>
            </p>

            <p className='auth-other-options-text text-black dark:text-white'>
              Don't have an account yet?{' '}
              <Link to="/signup" className="other-option-link" style={{ textDecoration: 'underline' }}>
                Sign up for free.
              </Link>
            </p>
          </div>
          <SupportContact />
        </article>

      </section>

      <aside id="background-container"><BackgroundPolygons /></aside>
    </main>
  );
};

export default Resend;