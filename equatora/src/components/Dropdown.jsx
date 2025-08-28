import React from 'react';
import './Dropdown.css';
import { Link } from 'react-router-dom';
import Books from '../assets/images/learningBooks.svg'

const Dropdown = ({ label, items }) => {
    return (
        <div className='dropdown'>
            <button className='dropbtn'>{label}</button>
            <div className="dropdown-content">
                {items.map((item, i) => (
                    <Link key={i} to={item.to} className='dropdown-link'>
                        <img
                            src={item.image}
                            alt={item.image} className='dropdown-image'
                        />
                        <div className="dropdown-text">
                            <h4>{item.text}</h4>
                            <h6>{item.description}</h6>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dropdown;