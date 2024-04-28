// components/JobApplicationHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobApplicationRow from './JobApplicationRow';
import '../css/JobApplicationHistory.css';

const JobApplicationHistory = () => {
  const [jobApplications, setJobApplications] = useState([]);

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/return-all/job-applications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobApplications(response.data);
      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    };

    fetchJobApplications();
  }, []);


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
        {jobApplications.map((application) => (
          <JobApplicationRow key={application.index} application={application} />
        ))}
      </div>
    </div>
  );
};

export default JobApplicationHistory;