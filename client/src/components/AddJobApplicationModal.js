import React, { useState } from 'react';
import axios from 'axios';
import '../css/AddJobApplicationModal.css';

const AddJobApplicationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    application_status: '',
    date_applied: '',
    job_description: '',
    notes: '',
    application_method: '',
    pay_amount: 0,
    job_posting_url: '',
    pay_type: '',
    employment_type: '',
    work_location_mode: '',
    location: '',
    experience_level: '',
    pinned: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/job-applications', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose();
    } catch (error) {
      console.error('Error creating job application:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Job Application</h2>
        <form onSubmit={handleSubmit}>
          {/* Add form fields for all the columns in the job_applications table */}
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddJobApplicationModal;