import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure correct import based on actual library
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
        console.log("\nAttempting to fetch name and dashboard data\n");
        const decodedToken = jwtDecode(token); // Verify the decoding function based on your package
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.log('Token expired. Redirecting to login.');
          localStorage.removeItem('token');
          navigate('/');
          return;
        }

        const nameResponse = await axios.get('/api/user/name', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("\nnameResponse: ", nameResponse, "\n");
        if (nameResponse.data && nameResponse.data.firstName) {
          setName({
            firstName: nameResponse.data.firstName,
            lastName: nameResponse.data.lastName,
          });
          console.log('User name fetched successfully:', nameResponse.data);
        } else {
          console.error('Unexpected response structure:', nameResponse.data);
        }

        // Fetching dashboard data
        const dashboardResponse = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
          console.log('Dashboard data fetched successfully:', dashboardResponse.data);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log('Authentication error. Redirecting to login.');
          localStorage.removeItem('token');
          navigate('/login');
        }
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
          Dashboard Message: {dashboardData.message || 'No specific dashboard data.'}
        </div>
        <JobApplicationActions />
        <JobApplicationHistory />
      </div>
    </div>
  );
};

export default Dashboard;
