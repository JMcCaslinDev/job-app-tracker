import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/landingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <header className="header">
        <h1>Job Application Tracker</h1>
        <div className="header-buttons">
          <button className="signup-button" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
          <button className="login-button" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </header>

      {/* Issues Section */}
      <section className="issues-section">
        <div className="issue-card">
          <h3>Time Waster</h3>
          <p>Manually tracking job applications can be a huge time waster.</p>
        </div>
        <div className="issue-card">
          <h3>Potential Scams</h3>
          <p>It's hard to identify potential scams when tracking applications manually.</p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution-section">
        <h2>The Solution</h2>
        <p>Our Job Application Tracker simplifies the process and helps you stay organized.</p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <ul>
          <li>Easily track all your job applications in one place</li>
          <li>Get reminders and notifications for important deadlines</li>
          <li>Identify potential scams and fraudulent job postings</li>
          <li>Analyze your application data with insightful charts and graphs</li>
        </ul>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <h2>Pricing</h2>
        <p>Choose a plan that suits your needs:</p>
        <ul>
          <li>Basic Plan: $9.99/month</li>
          <li>Pro Plan: $19.99/month</li>
          <li>Premium Plan: $29.99/month</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Job Application Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;