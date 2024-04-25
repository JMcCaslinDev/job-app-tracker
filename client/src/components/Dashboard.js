import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwt_decode as jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';
import JobApplicationHistory from './JobApplicationHistory';
import '../css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Redirect to login if no token found
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Decode the token and check for expiration
      const decodedToken = jwtDecode(token);
      
      // Check if the token has expired
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        navigate('/login');
      }

      // You might want to dispatch the decoded token to a global state
      // or continue with additional checks if needed

    } catch (error) {
      // If token is invalid or can't be decoded, navigate to login
      console.error('Token is invalid: ', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <JobApplicationHistory />
      </div>
    </div>
  );
};

export default Dashboard;
