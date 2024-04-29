// components/JobApplicationHistory.js
import React from 'react';
import JobApplicationRow from './JobApplicationRow';
import '../css/JobApplicationHistory.css';

const JobApplicationHistory = ({ dashboardData }) => {
  return (
    <div className="job-application-history">
      <div className="history-section">
        <div className="table-header">
          <div className="header-item">Company</div>
          <div className="header-item">Job Title</div>
          <div className="header-item">Date Applied</div>
          <div className="header-item">Status</div>
          <div className="header-item">Type</div>
          <div className="header-item">Pay</div>
        </div>
        {dashboardData.map((application, index) => (
          // Ensure that you use a unique identifier from application instead of index if available
          <JobApplicationRow key={index} application={application} />
        ))}
      </div>
    </div>
  );
};

export default JobApplicationHistory;
