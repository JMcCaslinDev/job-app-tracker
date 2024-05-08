import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AddJobApplicationModal.css';
import moment from 'moment-timezone';

const initialFormData = {
  company_name: '',
  job_title: '',
  application_status: 'Applied', // Default value set
  date_applied: '',
  job_description: '',
  notes: '',
  application_method: 'LinkedIn', // Default value set
  pay_amount: 0,
  pay_amount_max: 0, // New field with default value
  job_posting_url: '',
  pay_type: '',
  employment_type: 'Full-time', // Default value set
  work_location_mode: 'Remote', // Default value set
  location: '',
  experience_level: 'Entry Level', // Default value set
  pinned: false,
};

const AddJobApplicationModal = ({ isOpen, onClose, onAddSuccess, initialFormData: initialData, onDelete }) => {
  const [formData, setFormData] = useState(initialData || initialFormData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const localTime = moment.utc(initialData.date_applied).local().format('YYYY-MM-DD');
        setFormData({ ...initialData, date_applied: localTime });
      } else {
        setFormData({ ...initialFormData, date_applied: moment().format('YYYY-MM-DD') });
      }
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
      const userTimezone = moment.tz.guess();
      const datetimeApplied = `${formData.date_applied}T00:00:00`;
      const datetimeInUTC = moment.tz(datetimeApplied, userTimezone).utc().format();
      const payload = {
        ...formData,
        date_applied: datetimeInUTC,
        userTimezone,
      };
      let response;
      if (initialData) {
        console.log("\nInitialData: ", initialData, "\n");
        console.log("\ninitialData._id: ", initialData._id, "\n");
        response = await axios.put(`/api/job-applications/${initialData._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post('/api/job-applications', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (response.status === 200 || response.status === 201) {
        setFormData(initialFormData);
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
          <label>Job Posting URL:
            <input type="text" name="job_posting_url" value={formData.job_posting_url || ''} onChange={handleChange} />
          </label>
          <label>Job Title:
            <input type="text" name="job_title" value={formData.job_title || ''} onChange={handleChange} />
          </label>
          <label>Company Name:
            <input type="text" name="company_name" value={formData.company_name || ''} onChange={handleChange} />
          </label>
          <label>Base Pay:
            <input type="number" name="pay_amount" value={formData.pay_amount || 0} onChange={handleChange} onFocus={(e) => e.target.select()} />
          </label>
          <label>Max Pay:
            <input type="number" name="pay_amount_max" value={formData.pay_amount_max || 0} onChange={handleChange} onFocus={(e) => e.target.select()} />
          </label>
          <label>Pay Type:
            <select name="pay_type" value={formData.pay_type} onChange={handleChange}>
              <option value="Salary">Salary</option>
              <option value="Hourly">Hourly</option>
              <option value="Contract">Contract</option>
            </select>
          </label>
          <label>Job Description:
            <textarea name="job_description" value={formData.job_description || ''} onChange={handleChange}></textarea>
          </label>
          <label>Notes:
            <textarea name="notes" value={formData.notes || ''} onChange={handleChange}></textarea>
          </label>
          <label>Location:
            <input type="text" name="location" value={formData.location || ''} onChange={handleChange} />
          </label>
          <label>Application Method:
            <select name="application_method" value={formData.application_method} onChange={handleChange}>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Indeed">Indeed</option>
            </select>
          </label>
          <label>Employment Type:
            <select name="employment_type" value={formData.employment_type} onChange={handleChange}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
              <option value="Internship">Internship</option>
            </select>
          </label>
          <label>Work Location Mode:
            <select name="work_location_mode" value={formData.work_location_mode} onChange={handleChange}>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </label>
          <label>Experience Level:
            <select name="experience_level" value={formData.experience_level} onChange={handleChange}>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="No Experience Required">No Experience Required</option>
            </select>
          </label>
          <label>Application Status:
            <select name="application_status" value={formData.application_status} onChange={handleChange}>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Hired">Hired</option>
            </select>
          </label>
          <label>Date Applied:
            <input type="date" name="date_applied" value={formData.date_applied || ''} onChange={handleChange} />
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
