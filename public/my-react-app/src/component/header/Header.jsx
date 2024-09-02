import React from 'react';
import './header.css';

const Header = ({ header }) => {
    return (
        <div className="header-container">
            <h1>{header}</h1>
        </div>
    );
};

export default Header;
