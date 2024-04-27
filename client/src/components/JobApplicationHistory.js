// components/JobApplicationHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobApplicationRow from './JobApplicationRow';
import '../css/Dashboard.css';

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
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Job Title</th>
              <th>Date Applied</th>
              <th>Status</th>
              <th>Type</th>
              <th>Pay</th>
            </tr>
          </thead>
          <tbody>
            {jobApplications.map((application) => (
              <JobApplicationRow key={application.index} application={application} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobApplicationHistory;
