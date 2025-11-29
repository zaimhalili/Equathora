import React from 'react';
import './Dropdown.css';
import { Link } from 'react-router-dom';

const Dropdown = ({ label, items }) => {
    return (
        <div className='dropdown'>
            <button className='dropbtn'>
                {typeof label === 'string' ? label : React.cloneElement(label, {
                    className: 'dropdown-icon'
                })}
            </button>
            <div className="dropdown-content">
                {items.map((item, i) =>
                    item.isButton ? (
                        <button
                            key={i}
                            onClick={item.onClick}
                            className='dropdown-link'
                            style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                        >
                            <img
                                src={item.image}
                                alt={item.text}
                                className='dropdown-image'
                            />
                            <div className="dropdown-text">
                                <h4>{item.text}</h4>
                                <h6>{item.description}</h6>
                            </div>
                        </button>
                    ) : (
                        <Link key={i} to={item.to} state={item.state} className='dropdown-link'>
                            <img
                                src={item.image}
                                alt={item.text}
                                className='dropdown-image'
                            />
                            <div className="dropdown-text">
                                <h4>{item.text}</h4>
                                <h6>{item.description}</h6>
                            </div>
                            {item.notificationsNo && (
                                <div className="ntfc-no">
                                    <h4 style={{
                                        color: "goldenrod",
                                        display: "flex",
                                        height: "100%",
                                        alignItems: "center"
                                    }}>
                                        {item.notificationsNo}
                                    </h4>
                                </div>
                            )}
                        </Link>
                    )
                )}
            </div>
        </div>
    );
};

export default Dropdown;