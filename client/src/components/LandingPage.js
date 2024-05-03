import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/landingPage.css'; // Ensure this path is correct

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page bg-base-200">
      {/* Header */}
      <header className="header bg-white text-right p-5 shadow">
        <button className="btn btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
        <button className="btn" onClick={() => navigate('/login')}>Login</button>
      </header>

      {/* Hero Section */}
      <section className="hero-section text-center p-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <h1 className="text-5xl font-bold">Simplify Your Job Search</h1>
        <p className="py-6">Track your job applications effortlessly and stay organized.</p>
        <button className="btn btn-primary btn-lg">Get Started</button>
      </section>

      {/* Issues Section */}
      <section className="issues-section p-10 bg-gray-100">
        <h2 className="text-4xl font-bold mb-5">Common Issues</h2>
        <div className="issue-cards flex justify-center gap-4">
          <div className="issue-card bg-white shadow p-5 rounded-lg">
            <h3 className="text-xl font-semibold">Time Waster</h3>
            <p>Manually tracking job applications can be a huge time waster.</p>
          </div>
          <div className="issue-card bg-white shadow p-5 rounded-lg">
            <h3 className="text-xl font-semibold">Potential Scams</h3>
            <p>It's hard to identify potential scams when tracking applications manually.</p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution-section p-10 bg-white text-center shadow">
        <h2 className="text-4xl font-bold mb-5">The Solution</h2>
        <p>Our Job Application Tracker simplifies the process and helps you stay organized.</p>
      </section>

      {/* Features Section */}
      <section className="features-section p-10 bg-gray-100">
        <h2 className="text-4xl font-bold mb-5">Key Features</h2>
        <ul className="features-list list-none">
          <li>Easily track all your job applications in one place</li>
          <li>Get reminders and notifications for important deadlines</li>
          <li>Identify potential scams and fraudulent job postings</li>
          <li>Analyze your application data with insightful charts and graphs</li>
        </ul>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section bg-white p-10 text-center shadow">
        <h2 className="text-4xl font-bold mb-5">Pricing</h2>
        <p className="mb-5">Get full access to our Job Application Tracker with a one-time purchase:</p>
        <p className="text-2xl font-semibold mb-5">Single Purchase: $29</p>
        <p>Speed up your job search with powerful tools for organizing and tracking applications. Enter your job applications manually or simply paste a URL to auto-fill details!</p>
      </section>

      {/* Footer */}
      <footer className="footer p-10 bg-gray-300 text-center">
        <p>&copy; 2024 Job Application Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
