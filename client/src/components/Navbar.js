// components/Navbar.js
import React from 'react';
import NavbarButton from './NavbarButton';
import '../css/Navbar.css';

const Navbar = () => {
  const handleLogout = () => {
    // Logout logic here
  };

  return (
    <nav className="navbar">
      <div className="navbar-buttons">
        <NavbarButton text="Dashboard" className="dashboard" />
        <NavbarButton text="Settings" className="settings" />
      </div>
      <div className="navbar-spacer"></div>
      <NavbarButton text="Logout" className="logout" onClick={handleLogout} />
    </nav>
  );
};

export default Navbar;