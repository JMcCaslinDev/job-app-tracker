// components/Navbar.js
import React from 'react';
import NavbarButton from './NavbarButton';
import '../css/Navbar.css'; // Update the path to your Navbar CSS if different

const Navbar = () => {
  // Add your navigation logic or handlers here

  const handleLogout = () => {
    // Logout logic here
  };

  return (
    <nav className="navbar">
      <NavbarButton text="Dashboard" className="dashboard" />
      {/* Add more buttons here */}
      <NavbarButton text="Settings" className="settings" />
      {/* More buttons can be added here as you create new pages */}
      <NavbarButton text="Logout" className="logout" onClick={handleLogout} />
    </nav>
  );
};

export default Navbar;
