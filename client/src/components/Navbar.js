// components/Navbar.js
import React from 'react';
import NavbarButton from './NavbarButton';
import '../css/Navbar.css';

const Navbar = () => {
  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    // Navigate to the landing page
    navigate('/');
  };

  return (
    <nav className="navbar">
      <NavbarButton text="Dashboard" className="dashboard" />
      <NavbarButton text="Settings" className="settings" />
      <div className="navbar-spacer"></div>
      <NavbarButton text="Logout" className="logout" onClick={handleLogout} />
    </nav>
  );
};

export default Navbar;