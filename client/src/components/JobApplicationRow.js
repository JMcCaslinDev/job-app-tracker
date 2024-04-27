// components/JobApplicationRow.js
import React from 'react';

const JobApplicationRow = ({ application }) => {
  const { company_name, job_title, date_applied, application_status, employment_type, work_location_mode, pay_amount, pay_type } = application;

  const formattedPayAmount = pay_type === 'Salary' ? `$${pay_amount.toLocaleString()}` : `$${pay_amount}/hr`;

  return (
    <tr>
      <td>{company_name}</td>
      <td>{job_title}</td>
      <td>{new Date(date_applied).toLocaleDateString()}</td>
      <td>{application_status}</td>
      <td>{employment_type} - {work_location_mode}</td>
      <td>{formattedPayAmount}</td>
    </tr>
  );
};

export default JobApplicationRow;