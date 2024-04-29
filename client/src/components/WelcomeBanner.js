// components/WelcomeBanner.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/WelcomeBanner.css';

const WelcomeBanner = ({ name }) => {
  const [dailyGoal, setDailyGoal] = useState(0);
  const [applicationsLeft, setApplicationsLeft] = useState(0);

  useEffect(() => {
    const fetchDailyGoal = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/daily-goal', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDailyGoal(response.data.dailyGoal);
      } catch (error) {
        console.error('Error fetching daily goal:', error);
      }
    };

    const fetchApplicationsLeft = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/applications-left', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicationsLeft(response.data.applicationsLeft);
      } catch (error) {
        console.error('Error fetching applications left:', error);
      }
    };

    fetchDailyGoal();
    fetchApplicationsLeft();
  }, []);

  return (
    <div className="welcome-banner">
      <div className="welcome-text">
        Welcome back, {name.firstName} {name.lastName}!
      </div>
      <div className="daily-goal">
        {applicationsLeft} applications left today (Daily Goal: {dailyGoal})
      </div>
    </div>
  );
};

export default WelcomeBanner;