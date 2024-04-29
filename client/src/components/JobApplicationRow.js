import React from 'react';
import '../css/JobApplicationRow.css';

const JobApplicationRow = ({ application, onEdit }) => {
  const { company_name, job_title, date_applied, application_status, employment_type, work_location_mode, pay_amount, pay_type } = application;
  const formattedPayAmount = pay_type === 'Salary' ? `$${pay_amount.toLocaleString()}` : `$${pay_amount}/hr`;

  const handleEdit = () => {
    onEdit(application);
  };

  return (
    <div className="job-application-row" onClick={handleEdit}>
      <div className="row-item">{company_name}</div>
      <div className="row-item">{job_title}</div>
      <div className="row-item">{new Date(date_applied).toLocaleDateString()}</div>
      <div className="row-item">{application_status}</div>
      <div className="row-item">{employment_type} - {work_location_mode}</div>
      <div className="row-item">{formattedPayAmount}</div>
    </div>
  );
};

export default JobApplicationRow;