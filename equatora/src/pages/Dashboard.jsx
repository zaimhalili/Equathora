import React from 'react';
import './Dashboard.css';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const Dashboard = () => {
  return (
    <>
      <main>
        <header>
          <Navbar />
        </header>
        <nav></nav>
        <section>

        </section>
        <footer>
          <Footer />
        </footer>
      </main>
    </>
  );
};

export default Dashboard;