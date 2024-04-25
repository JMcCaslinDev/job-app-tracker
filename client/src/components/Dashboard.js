import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt from 'jsonwebtoken'; 
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
      // Decode the token and check for expiration using jsonwebtoken
      const decodedToken = jwt.decode(token); // Use jwt.decode here

      // Check if the token has expired
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        navigate('/login');
      }

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
