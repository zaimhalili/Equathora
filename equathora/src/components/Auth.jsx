import React from 'react';
import './Auth.css';

const Auth = () => {
  return (
      <>
          <h5 className='typeOfInput'>EMAIL</h5>
          <input type="email" className='inputAuth' id="emailInput" placeholder='Enter your email address' maxLength="254" required></input>

          <h5 className='typeOfInput'>PASSWORD</h5>
          <input type="password" className='inputAuth' id="passwordInput" placeholder='Enter your password' minLength="6" maxLength="128" required></input>
    </>
  );
};

export default Auth;