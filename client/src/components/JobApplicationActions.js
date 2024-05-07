// components/JobApplicationActions.js
import React from 'react';
import '../css/JobApplicationActions.css';

const JobApplicationActions = ({ openModal }) => {
 
  const handleAutoAdd = async () => {
    const url = document.querySelector('.url-input').value;
    const response = await fetch('/api/scrape-job-posting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const scrapedData = await response.json();
    // Use scrapedData to populate the form fields
    // Example: document.querySelector('#company_name').value = scrapedData.companyName;
    // ... populate other fields similarly
  };

  const handleManualAdd = () => {
    openModal();
  };

  return (
    <div className="job-application-actions">
      <div className="url-input-section">
        <input type="text" className="url-input" placeholder="https://" />
        <button onClick={handleAutoAdd}>Auto Add</button>
      </div>
      <button onClick={handleManualAdd}>Manual Add</button>
    </div>
  );
};

export default JobApplicationActions;