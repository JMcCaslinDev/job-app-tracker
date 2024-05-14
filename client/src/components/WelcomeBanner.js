// components/WelcomeBanner.js
import React from 'react';
import '../css/WelcomeBanner.css';

const WelcomeBanner = ({ name, dailyGoal, applicationsLeft }) => {
  return (
    <div className="welcome-banner">
      <div className="welcome-text">
        Welcome back!
      </div>
      <div className="daily-goal">
        <strong>{applicationsLeft}</strong> applications to go!
      </div>
    </div>
  );
};

export default WelcomeBanner;
