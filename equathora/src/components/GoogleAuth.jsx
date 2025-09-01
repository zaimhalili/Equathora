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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <hr className='or-line' />
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700', color: 'var(--secondary-color)', textAlign: 'center', padding: '0 10px' }}>
                    OR
                </p>
                <hr className='or-line' />
            </div>
        </>

    );
};

export default GoogleAuth;