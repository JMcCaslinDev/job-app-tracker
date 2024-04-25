// Dashboard.js
import React from 'react';
import Navbar from './components/Navbar';
import JobApplicationHistory from './components/JobApplicationHistory';
import './Dashboard.css';

const Dashboard = () => {
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