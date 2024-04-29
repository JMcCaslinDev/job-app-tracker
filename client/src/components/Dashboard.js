import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Navbar from './Navbar';
import JobApplicationActions from './JobApplicationActions';
import JobApplicationHistory from './JobApplicationHistory';
import AddJobApplicationModal from './AddJobApplicationModal';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [name, setName] = useState({ firstName: '', lastName: '' });
  const [dashboardData, setDashboardData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchName = useCallback(async (token) => {
    try {
      const nameResponse = await axios.get('/api/user/name', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (nameResponse.data && nameResponse.data.firstName) {
        setName({
          firstName: nameResponse.data.firstName,
          lastName: nameResponse.data.lastName,
        });
      } else {
        throw new Error('Unexpected response structure:', nameResponse.data);
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  }, []);

  const fetchDashboardData = useCallback(async (token) => {
    try {
      const dashboardResponse = await axios.get('/api/user/return-all/job-applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (dashboardResponse.data) {
        setDashboardData(dashboardResponse.data);
        console.log('Dashboard data fetched successfully:', dashboardResponse.data);
      } else {
        console.error('Unexpected response or no data:', dashboardResponse);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token');
      navigate('/');
      return;
    }

    await fetchName(token);
    await fetchDashboardData(token);
  }, [navigate, fetchName, fetchDashboardData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, location.key]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-main">
        <div className="welcome-banner">
          Welcome back, {name.firstName} {name.lastName}!
        </div>
        <JobApplicationActions openModal={openModal} />
        <JobApplicationHistory dashboardData={dashboardData} />
      </div>
      <AddJobApplicationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Dashboard;
