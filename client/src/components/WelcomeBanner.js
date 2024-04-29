// components/WelcomeBanner.js
import React from 'react';
import '../css/WelcomeBanner.css';

const WelcomeBanner = ({ name, dailyGoal, applicationsLeft }) => {
  return (
    <div className="welcome-banner">
      <div className="welcome-text">
        Welcome back, {name.firstName} {name.lastName}!
      </div>
      <div className="daily-goal">
        {applicationsLeft}/{dailyGoal} applications tracked!
      </div>
    </div>
  );
};

export default WelcomeBanner;
