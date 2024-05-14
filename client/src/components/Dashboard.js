// Dashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Navbar from './Navbar';
import JobApplicationActions from './JobApplicationActions';
import JobApplicationHistory from './JobApplicationHistory';
import AddJobApplicationModal from './AddJobApplicationModal';
import WelcomeBanner from './WelcomeBanner';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [applicationsLeft, setApplicationsLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();



  const fetchDashboardData = useCallback(async (token) => {
    try {
      const dashboardResponse = await axios.get('/api/user/return-all/job-applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(dashboardResponse.data);

      const goalResponse = await axios.get('/api/user/daily-goal', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDailyGoal(goalResponse.data.dailyGoal);

      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const applicationsResponse = await axios.get('/api/user/applications-left', {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-Timezone': userTimezone,
        },
      });
      setApplicationsLeft(applicationsResponse.data.applicationsLeft);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          navigate('/');
          return;
        }
      
        await fetchDashboardData(token);
      } else {
        navigate('/');
      }
    };

    fetchData();
  }, [navigate, fetchDashboardData, location.key]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    fetchDashboardData(localStorage.getItem('token')); // refresh the dashboard data
  };

  const openEditModal = (application) => {
    setSelectedApplication(application);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedApplication(null);
    setIsEditModalOpen(false);
    fetchDashboardData(localStorage.getItem('token')); // refresh the dashboard data
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/job-applications/${selectedApplication.index}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        closeEditModal();
      } catch (error) {
        console.error('Error deleting job application:', error);
      }
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-main">
        <WelcomeBanner dailyGoal={dailyGoal} applicationsLeft={applicationsLeft} />
        <JobApplicationActions openModal={openModal} />
        <JobApplicationHistory dashboardData={dashboardData} onEdit={openEditModal} />
      </div>
      <AddJobApplicationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddSuccess={() => {}} // The closeModal already calls fetchDashboardData so we don't need this here
      />
      {selectedApplication && (
        <AddJobApplicationModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onAddSuccess={() => {}} // The closeEditModal already calls fetchDashboardData so we don't need this here
          initialFormData={selectedApplication}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Dashboard;
