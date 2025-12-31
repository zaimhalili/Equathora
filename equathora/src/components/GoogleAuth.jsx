// src/components/GoogleAuth.jsx
import React from 'react';
import './GoogleAuth.css';

const GoogleAuth = ({ onClick }) => { // 👈 Accept onClick as prop
    return (
        <>
            <div className="google-auth-container">
                <button id="google-btn" onClick={onClick}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                        alt="Google logo"
                        id="google-icon"
                    />
                    <p id='google-btn-text'>Log in with Google</p>
                </button>
            </div>

            <div className="google-auth-divider">
                <hr className='bg-black' />
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700', color: 'var(--secondary-color)', textAlign: 'center', padding: '0 10px' }}>
                    OR
                </p>
                <hr className='bg-black' />
            </div>
        </>

    );
};

export default GoogleAuth;