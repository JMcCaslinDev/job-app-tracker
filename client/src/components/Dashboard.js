

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
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          navigate('/');
          return;
        }
  
        const response = await axios.get('/api/user/name', {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (response.data && response.data.firstName) {
          setName({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
          });
          console.log("\nresponse.data.firstName: ", response.data.firstName, "\n");
          console.log("\nresponse.data.lastName: ", response.data.lastName, "\n");
        } else {
          // Handle unexpected response structure
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
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
