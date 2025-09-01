import React from 'react';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import './ProblemGroup.css';
 
const ProblemGroup = () => {
  return (
    <>
      <main id='body-problems'>
        <header>
          <Navbar></Navbar>
        </header>
      </main>
    </>
  );
};

export default ProblemGroup;