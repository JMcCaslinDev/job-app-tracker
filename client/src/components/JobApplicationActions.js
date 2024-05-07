// components/JobApplicationActions.js
import React from 'react';
import '../css/JobApplicationActions.css';

const JobApplicationActions = ({ openModal }) => {
 
 

  const handleManualAdd = () => {
    openModal();
  };

  return (
    <div className="job-application-actions">
      <button onClick={handleManualAdd}>Manual Add</button>
    </div>
  );
};

export default JobApplicationActions;