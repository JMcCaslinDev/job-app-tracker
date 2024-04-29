import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AddJobApplicationModal.css';

const initialFormData = {
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
};

const AddJobApplicationModal = ({ isOpen, onClose, onAddSuccess }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/job-applications', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If the request is successful, reset the form data, close the modal and trigger the refresh.
      if (response.status === 201) {
        setFormData(initialFormData);
        onClose();
        onAddSuccess(); // Trigger refresh after successful addition
      }
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
          <label>
            Company Name:
            <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} />
          </label>
          <label>
            Job Title:
            <input type="text" name="job_title" value={formData.job_title} onChange={handleChange} />
          </label>
          <label>
            Application Status:
            <input type="text" name="application_status" value={formData.application_status} onChange={handleChange} />
          </label>
          <label>
            Date Applied:
            <input type="date" name="date_applied" value={formData.date_applied} onChange={handleChange} />
          </label>
          <label>
            Job Description:
            <textarea name="job_description" value={formData.job_description} onChange={handleChange}></textarea>
          </label>
          <label>
            Notes:
            <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
          </label>
          <label>
            Application Method:
            <input type="text" name="application_method" value={formData.application_method} onChange={handleChange} />
          </label>
          <label>
            Pay Amount:
            <input type="number" name="pay_amount" value={formData.pay_amount} onChange={handleChange} />
          </label>
          <label>
            Job Posting URL:
            <input type="text" name="job_posting_url" value={formData.job_posting_url} onChange={handleChange} />
          </label>
          <label>
            Pay Type:
            <input type="text" name="pay_type" value={formData.pay_type} onChange={handleChange} />
          </label>
          <label>
            Employment Type:
            <input type="text" name="employment_type" value={formData.employment_type} onChange={handleChange} />
          </label>
          <label>
            Work Location Mode:
            <input type="text" name="work_location_mode" value={formData.work_location_mode} onChange={handleChange} />
          </label>
          <label>
            Location:
            <input type="text" name="location" value={formData.location} onChange={handleChange} />
          </label>
          <label>
            Experience Level:
            <input type="text" name="experience_level" value={formData.experience_level} onChange={handleChange} />
          </label>
          <label>
            Pinned:
            <input type="checkbox" name="pinned" checked={formData.pinned} onChange={handleChange} />
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddJobApplicationModal;