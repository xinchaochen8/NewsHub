import React from 'react';

const NavItem = ({ title, href }) => {
    return (
        <h2>
            <a href={href}>{title}</a>
        </h2>
    );
};

export default NavItem;
