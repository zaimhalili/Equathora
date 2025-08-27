import React from 'react';
import './Dropdown.css';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/learningBooks.svg'

const Dropdown = ({label, items}) => {
    return (
        <div className='dropdown'>
            <button className='dropbtn'>{label}</button>
            <div className="dropdown-content">
                {items.map((item, i) => (
                    <Link key={i} to={item.to} className='dropdown-link'>{item.text}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dropdown;