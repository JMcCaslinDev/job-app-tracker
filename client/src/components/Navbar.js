// components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarButton from './NavbarButton';
import '../css/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    // Navigate to the landing page
    navigate('/');
  };

  const handleDashboardNavButtonClicked = () => {
    //  Route dashboard nav button to the dashboard page reloads data
    navigate('/dashboard');
  }

  return (
    <nav className="navbar">
      <NavbarButton text="Dashboard" className="dashboard"  onClick={handleDashboardNavButtonClicked} />
      {/* <NavbarButton text="Settings" className="settings" /> */}
      <div className="navbar-spacer"></div>
      <NavbarButton text="Logout" className="logout" onClick={handleLogout} />
    </nav>
  );
};

export default Navbar;