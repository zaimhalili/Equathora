import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './VerifyEmail.css';
import '../components/Auth.css';
import BackgroundPolygons from '../components/BackgroundPolygons.jsx';
import { supabase } from '../lib/supabaseClient';
import { SITE_URL } from '../lib/config';
import Sigma from '../assets/logo/TransparentSymbol.png';
import {
    getResendButtonLabel,
    getResendCooldownSeconds,
    getResendErrorMessage,
    RESEND_COOLDOWN_SECONDS,
} from '../lib/emailVerification';

const VerifyEmail = () => {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [cooldownSeconds, setCooldownSeconds] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // The email is only ever set from what the signup flow passed in —
    // never freely typed here, so this page can't be used to fire
    // confirmation emails at an arbitrary address.
    const email = searchParams.get('email') || location.state?.email || '';

    // No email context means this page was opened directly (lost state,
    // different device, refreshed tab). Send to the self-service resend
    // page rather than making them sign up again.
    useEffect(() => {
        if (!email) {
            navigate('/resend', { replace: true });
        }
    }, [email, navigate]);

    useEffect(() => {
        if (email && location.state?.confirmationJustSent) {
            setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
        }
    }, [email, location.state]);

    useEffect(() => {
        if (cooldownSeconds <= 0) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setCooldownSeconds((seconds) => Math.max(seconds - 1, 0));
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [cooldownSeconds]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/dashboard', { replace: true });
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                navigate('/dashboard', { replace: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    async function handleResend(e) {
        e.preventDefault();
        if (!email) return;

        setError('');
        setMessage('');
        setLoading(true);

        try {
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                    emailRedirectTo: `${SITE_URL}/auth/callback`,
                },
            });

            if (resendError) {
                const nextCooldown = getResendCooldownSeconds(resendError);
                setError(getResendErrorMessage(resendError));
                setCooldownSeconds(nextCooldown);
                setLoading(false);
                return;
            }

            setMessage(`A new confirmation link is on its way to ${email}. Check your inbox and spam folder.`);
            setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
            setLoading(false);
        } catch {
            setError('We could not send another confirmation link. Please try again in a moment.');
            setLoading(false);
        }
    }

    if (!email) {
        return null;
    }

    return (
        <>
            <main id='body-verify'>
                <section id='verify-container'>
                    <div id='signup-logo-name'>
                        <p className='font-[Sansation,Arial] pl-6 text-3xl font-black relative select-none'>
                            <img src={Sigma} alt="Logo" className='w-11 h-11 absolute -left-5 -top-[11px] pointer-events-none' />
                            Equathora
                        </p>
                    </div>

                    <div id='verify-text-container'>
                        <h3>Check your email</h3>
                        <h6><br />Open the confirmation link we sent to finish creating your account.</h6>
                    </div>

                    <form id='auth' onSubmit={handleResend}>
                        {error && (
                            <div style={{
                                backgroundColor: '#fee',
                                border: '1px solid #fcc',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                marginBottom: '16px',
                                color: '#c33',
                                fontSize: '14px',
                                fontFamily: 'Sansation, sans-serif'
                            }}>
                                {error}
                            </div>
                        )}

                        {message && (
                            <div style={{
                                backgroundColor: '#efe',
                                border: '1px solid #cfc',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                marginBottom: '16px',
                                color: '#3c3',
                                fontSize: '14px',
                                fontFamily: 'Sansation, sans-serif'
                            }}>
                                {message}
                            </div>
                        )}

                        <div className='verification-note' role='status'>
                            <strong>No code to copy.</strong>
                            <span>Use the button in the email, then Equathora will take you straight to your dashboard.</span>
                        </div>

                        <h5 className='typeOfInput'>CONFIRMATION EMAIL</h5>
                        <input
                            type="email"
                            className='inputAuth'
                            value={email}
                            readOnly
                            disabled
                        />

                        <button type="submit" id="verify-btn" disabled={loading || cooldownSeconds > 0}>
                            {getResendButtonLabel({ loading, cooldownSeconds })}
                        </button>

                        <div id='auth-other-options'>
                            <p className='auth-other-options-text'>
                                Already verified?{' '}
                                <Link to="/login" className="other-option-link" style={{ textDecoration: 'underline' }}>
                                    Log In
                                </Link>
                            </p>

                            <p className='auth-other-options-text'>
                                Used the wrong email?{' '}
                                <Link to="/signup" className="other-option-link" style={{ textDecoration: 'underline' }}>
                                    Start again.
                                </Link>
                            </p>
                        </div>
                    </form>
                </section >
                <aside id="background-container"><BackgroundPolygons /></aside>
            </main >
        </>
    );
};

export default VerifyEmail;