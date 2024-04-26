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
  const [dashboardData, setDashboardData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchNameAndDashboardData = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          navigate('/');
          return;
        }

        const nameResponse = await axios.get('/api/user/name', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (nameResponse.data && nameResponse.data.firstName) {
          setName({
            firstName: nameResponse.data.firstName,
            lastName: nameResponse.data.lastName,
          });
        } else {
          console.error('Unexpected response structure:', nameResponse.data);
        }

        // Fetching dashboard data
        const dashboardResponse = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchNameAndDashboardData();
  }, [navigate]);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-main">
        <div className="welcome-banner">
          Welcome back, {name.firstName} {name.lastName}!
        </div>
        <div className="dashboard-info">
          {/* Displaying dashboard data */}
          Dashboard Message: {dashboardData.message || 'No specific dashboard data.'}
        </div>
        <JobApplicationActions />
        <JobApplicationHistory />
      </div>
    </div>
  );
};

export default Dashboard;
