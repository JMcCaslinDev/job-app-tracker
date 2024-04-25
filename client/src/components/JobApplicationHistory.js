// components/JobApplicationHistory.js
import React, { useState } from 'react';
import '../css/Dashboard.css'; // Import the CSS if needed

const JobApplicationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Perform search logic based on searchTerm
  };

  const handleAddManual = () => {
    // Handle adding manual job application entry
  };

  return (
    <div className="job-application-history">
      <div className="url-bar">
        <input
          type="text"
          className="search-input"
          placeholder="https://"
          readOnly
        />
        <button className="search-button">Search</button>
        <button className="add-button">Add Manual</button>
      </div>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleAddManual}>Add Manual</button>
      </div>
      <div className="history-section">
        {/* Display job application history */}
      </div>
    </div>
  );
};

export default JobApplicationHistory;
