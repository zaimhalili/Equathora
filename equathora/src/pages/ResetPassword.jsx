import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyEmail.css';
import '../components/Auth.css';
import BackgroundPolygons from '../components/BackgroundPolygons.jsx';
import Logo from '../assets/logo/EquathoraLogoFull.svg';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValidSession, setIsValidSession] = useState(false);
    const navigate = useNavigate();

    // Check if user accessed via password reset link
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsValidSession(true);
            } else {
                setError('Invalid or expired reset link. Please request a new one.');
            }
        };
        checkSession();
    }, []);

    async function handleResetPassword(e) {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!isValidSession) {
            setError('Invalid session. Please request a new reset link.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) {
                setError(updateError.message || 'Password reset failed');
                setLoading(false);
                return;
            }

            setMessage('Password reset successfully! Redirecting...');
            // Sign out and redirect to login for security
            await supabase.auth.signOut();
            setTimeout(() => {
                navigate('/login');
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
                    </div>

                    <div id='verify-text-container'>
                        <h3>Reset your password</h3>
                        <h6><br />Choose a new password for your account.</h6>
                    </div>

                    <form id='auth' onSubmit={handleResetPassword}>
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

                        {message && (
                            <div style={{
                                backgroundColor: '#efe',
                                border: '1px solid #cfc',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                marginBottom: '16px',
                                color: '#3c3',
                                fontSize: '14px',
                                fontFamily: 'Inter, sans-serif'
                            }}>
                                {message}
                            </div>
                        )}

                        <h5 className='typeOfInput'>NEW PASSWORD</h5>
                        <input
                            type="password"
                            className='inputAuth'
                            placeholder='Enter new password'
                            minLength="6"
                            maxLength="128"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />

                        <h5 className='typeOfInput'>CONFIRM PASSWORD</h5>
                        <input
                            type="password"
                            className='inputAuth'
                            placeholder='Confirm new password'
                            maxLength="128"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <button type="submit" id="verify-btn" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <div id='auth-other-options'>
                            <p className='auth-other-options-text'>
                                Remember your password?{' '}
                                <Link to="/login" className="other-option-link" style={{ textDecoration: 'underline' }}>
                                    Log In
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

export default ResetPassword;
