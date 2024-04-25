// components/NavbarButton.js
import React from 'react';
import '../css/NavbarButton.css'; // Make sure to create and import the appropriate CSS file

const NavbarButton = ({ text, onClick, className }) => {
  return (
    <button className={`navbar-button ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default NavbarButton;
