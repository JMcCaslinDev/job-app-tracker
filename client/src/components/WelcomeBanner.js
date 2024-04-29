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
          const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          console.log(`Fetching applications left for timezone: ${userTimezone}`); // For debugging
          const response = await axios.get('/api/user/applications-left', {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-User-Timezone': userTimezone,
            },
          });
          console.log('Applications left response:', response.data);
          setApplicationsLeft(response.data.applicationsLeft);
        } catch (error) {
          console.error('Error fetching applications left:', error.response ? error.response.data : error);
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
        {applicationsLeft} applications left today!
      </div>
    </div>
  );
};

export default WelcomeBanner;