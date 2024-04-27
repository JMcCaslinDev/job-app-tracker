// components/JobApplicationActions.js
import React from 'react';

const JobApplicationActions = ({ openModal }) => {
  const handleAutoAdd = () => {
    // Logic to automatically add job application based on URL
  };

  const handleManualAdd = () => {
    openModal();
  };

  return (
    <div className="job-application-actions">
      <div className="url-input-section">
        <input type="text" className="url-input" placeholder="https://" readOnly />
        <button onClick={handleAutoAdd}>Auto Add</button>
      </div>
      <button onClick={handleManualAdd}>Add Manual</button>
    </div>
  );
};

export default JobApplicationActions;