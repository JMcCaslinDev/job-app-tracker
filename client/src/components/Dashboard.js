

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Navbar from './Navbar';
import JobApplicationActions from './JobApplicationActions';
import JobApplicationHistory from './JobApplicationHistory';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [name, setName] = useState({ firstName: '', lastName: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchName = async () => {
      try {
        // Decode the token and check for expiration
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        // Fetch the user's first and last name using the token
        const response = await axios.get('/api/user/name', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setName({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        });

      } catch (error) {
        // If token is invalid, expired or if there is an error fetching the name, navigate to login
        console.error('Error: ', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchName();
  }, [navigate]);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-main">
        <div className="welcome-banner">
          Welcome back, {name.firstName} {name.lastName}!
        </div>
        <JobApplicationActions />
        <JobApplicationHistory />
      </div>
    </div>
  );
};

export default Dashboard;
