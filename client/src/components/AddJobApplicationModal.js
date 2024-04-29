import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AddJobApplicationModal.css';
import moment from 'moment-timezone'; // Ensure you import moment-timezone

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

const AddJobApplicationModal = ({ isOpen, onClose, onAddSuccess, initialFormData: initialData, onDelete }) => {
  const [formData, setFormData] = useState(initialData || initialFormData);

  useEffect(() => {
    if (isOpen && initialData) {
      // When editing, convert the UTC date back to local time
      const localTime = moment.utc(initialData.date_applied).local().format('YYYY-MM-DD');
      setFormData({ ...initialData, date_applied: localTime });
    } else {
      setFormData(initialFormData);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userTimezone = moment.tz.guess(); // Guess the user's timezone or obtain it from the browser
      
      // Append 'T00:00:00' to ensure the time part is at midnight
      const datetimeApplied = `${formData.date_applied}T00:00:00`;
      // When saving, convert local time to UTC
      const datetimeInUTC = moment.tz(datetimeApplied, userTimezone).utc().format();

      const payload = {
        ...formData,
        date_applied: datetimeInUTC, // Use the UTC time for date_applied
        userTimezone,
      };

      let response;
      if (initialData) {
        response = await axios.put(`/api/job-applications/${initialData.index}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post('/api/job-applications', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200 || response.status === 201) {
        setFormData(initialFormData); // Reset form data after successful add/edit
        onClose();
        onAddSuccess();
      }
    } catch (error) {
      console.error('Error updating/creating job application:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{initialData ? 'Edit' : 'Add'} Job Application</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Company Name:
            <input type="text" name="company_name" value={formData.company_name || ''} onChange={handleChange} />
          </label>
          <label>
            Job Title:
            <input type="text" name="job_title" value={formData.job_title || ''} onChange={handleChange} />
          </label>
          <label>
            Application Status:
            <input type="text" name="application_status" value={formData.application_status || ''} onChange={handleChange} />
          </label>
          <label>
            Date Applied:
            <input type="date" name="date_applied" value={formData.date_applied || ''} onChange={handleChange} />
          </label>
          <label>
            Job Description:
            <textarea name="job_description" value={formData.job_description || ''} onChange={handleChange}></textarea>
          </label>
          <label>
            Notes:
            <textarea name="notes" value={formData.notes || ''} onChange={handleChange}></textarea>
          </label>
          <label>
            Application Method:
            <input type="text" name="application_method" value={formData.application_method || ''} onChange={handleChange} />
          </label>
          <label>
            Pay Amount:
            <input type="number" name="pay_amount" value={formData.pay_amount || 0} onChange={handleChange} />
          </label>
          <label>
            Job Posting URL:
            <input type="text" name="job_posting_url" value={formData.job_posting_url || ''} onChange={handleChange} />
          </label>
          <label>
            Pay Type:
            <input type="text" name="pay_type" value={formData.pay_type || ''} onChange={handleChange} />
          </label>
          <label>
            Employment Type:
            <input type="text" name="employment_type" value={formData.employment_type || ''} onChange={handleChange} />
          </label>
          <label>
            Work Location Mode:
            <input type="text" name="work_location_mode" value={formData.work_location_mode || ''} onChange={handleChange} />
          </label>
          <label>
            Location:
            <input type="text" name="location" value={formData.location || ''} onChange={handleChange} />
          </label>
          <label>
            Experience Level:
            <input type="text" name="experience_level" value={formData.experience_level || ''} onChange={handleChange} />
          </label>
          <label>
            Pinned:
            <input type="checkbox" name="pinned" checked={formData.pinned || false} onChange={handleChange} />
          </label>
          <button type="submit">Save</button>
          {initialData && (
            <button type="button" onClick={onDelete}>Delete</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddJobApplicationModal;