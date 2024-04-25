// components/JobApplicationActions.js
import React from 'react';

const JobApplicationActions = () => {
  const handleAutoAdd = () => {
    // Logic to automatically add job application based on URL
  };

  const handleManualAdd = () => {
    // Logic for manual addition of job applications
  };

  return (
    <div className="job-application-actions">
      <div className="url-input-section">
        <input
          type="text"
          className="url-input"
          placeholder="https://"
          readOnly // Assuming it's read-only, if not, remove this
        />
        <button onClick={handleAutoAdd}>Auto Add</button>
      </div>
      <button onClick={handleManualAdd}>Add Manual</button>
    </div>
  );
};

export default JobApplicationActions;
