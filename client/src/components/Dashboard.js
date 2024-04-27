import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Navbar from './Navbar';
import JobApplicationActions from './JobApplicationActions';
import JobApplicationHistory from './JobApplicationHistory';
import AddJobApplicationModal from './AddJobApplicationModal';
import '../css/Dashboard.css';

const Dashboard = () => {
  console.log("\nEntered Dashboard.js file\n");
  const [name, setName] = useState({ firstName: '', lastName: '' });
  const [dashboardData, setDashboardData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  console.log("\n1\n");

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("\nTOKEN: ", token, "\n");

    if (!token) {
      console.log("\nNo token found, navigating to / route now!\n");
      navigate('/');
      return;
    }

    console.log("\n2\n");

    const fetchNameAndDashboardData = async () => {
      try {
        console.log("\nAttempting to fetch name and dashboard data\n");
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          console.log('Token expired. Redirecting to login.');
          localStorage.removeItem('token');
          navigate('/');
          return;
        }

        console.log("\n3\n");

        const nameResponse = await axios.get('/api/user/name', {
          headers: { Authorization: `Bearer ${token}` },
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

        console.log("\n4\n");

        const dashboardResponse = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("\n5\n");

        if (dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
          console.log('Dashboard data fetched successfully:', dashboardResponse.data);
        }

        console.log("\n6\n");
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log('Authentication error. Redirecting to login.');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    console.log("\n7\n");
    fetchNameAndDashboardData();
  }, [navigate]);

  console.log("\n8\n");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-main">
        <div className="welcome-banner">
          Welcome back, {name.firstName} {name.lastName}!
        </div>
        <JobApplicationActions openModal={openModal} />
        <JobApplicationHistory />
      </div>
      <AddJobApplicationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Dashboard;