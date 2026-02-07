import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './VerifyEmail.css';
import '../components/Auth.css';
import BackgroundPolygons from '../components/BackgroundPolygons.jsx';
import Logo from '../assets/logo/EquathoraLogoFull.svg';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { notifyWelcome } from '../lib/notificationService';

const VerifyEmail = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Pre-fill email if passed as query parameter
    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    async function handleVerification(e) {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email: email,
                token: token,
                type: 'email'
            });

            if (verifyError) {
                setError(verifyError.message || 'Verification failed. Please check your code and try again.');
                setLoading(false);
                return;
            }

            // Send welcome notification after successful verification
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const username = session.user.user_metadata?.username || 
                                   session.user.user_metadata?.full_name ||
                                   session.user.email?.split('@')[0] || 
                                   'there';
                    await notifyWelcome(username);
                }
            } catch (err) {
                console.error('Failed to send welcome notification:', err);
            }

            setMessage('Email verified successfully! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    }

    return (
        <>
            <main id='body-verify'>
                <section id='verify-container'>
                    <div id='verify-logo-name'>
                        <img src={Logo} alt="Logo" id='verify-logoIMG' className='w-70' />
                    </div >

                    <div id='verify-text-container'>
                        <h3>Verify your email</h3>
                        <h6><br />Enter the 6-digit verification code sent to your email address.</h6>
                    </div>

                    <form id='auth' onSubmit={handleVerification}>
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

                        <h5 className='typeOfInput'>VERIFICATION CODE</h5>
                        <input
                            type="text"
                            className='inputAuth'
                            placeholder='Enter 6-digit code'
                            maxLength="6"
                            pattern="[0-9]{6}"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />

                        <button type="submit" id="verify-btn" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>

                        <div id='auth-other-options'>
                            <p className='auth-other-options-text'>
                                Didn't receive your code?{' '}
                                <Link to="/resend" className="other-option-link" style={{ textDecoration: 'underline' }}>
                                    Resend it.
                                </Link>
                            </p>

                            <p className='auth-other-options-text'>
                                Already verified?{' '}
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
                    </form>
                </section >
                <aside id="background-container"><BackgroundPolygons /></aside>
            </main >
        </>
    );
};

export default VerifyEmail;
