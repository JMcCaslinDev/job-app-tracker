import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/landingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
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

      {/* Hero Section */}
      <section className="hero-section">
        <h2>Simplify Your Job Search</h2>
        <p>Track your job applications effortlessly and stay organized.</p>
      </section>

      {/* Issues Section */}
      <section className="issues-section">
        <h2>Common Issues</h2>
        <div className="issue-cards">
          <div className="issue-card">
            <h3>Time Waster</h3>
            <p>Manually tracking job applications can be a huge time waster.</p>
          </div>
          <div className="issue-card">
            <h3>Potential Scams</h3>
            <p>It's hard to identify potential scams when tracking applications manually.</p>
          </div>
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
        <ul className="features-list">
          <li>Easily track all your job applications in one place</li>
          <li>Get reminders and notifications for important deadlines</li>
          <li>Identify potential scams and fraudulent job postings</li>
          <li>Analyze your application data with insightful charts and graphs</li>
        </ul>
      </section>

      <section className="pricing-section">
        <h2>Pricing</h2>
        <p>Get full access to our Job Application Tracker with a one-time purchase:</p>
        <ul className="pricing-list">
          <li>Single Purchase: $29</li>
        </ul>
        <p>Speed up your job search with powerful tools for organizing and tracking applications. Enter your job applications manually or simply paste a URL to auto-fill details!</p>
      </section>


      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Job Application Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;