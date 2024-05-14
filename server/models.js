// models.js
const { Schema, model } = require('mongoose');

const accountSchema = new Schema({
  email: { type: String, required: true },
  loginToken: String,
  tokenExpiry: Date,
  created_at: { type: Date, default: Date.now },
  daily_application_goal: { type: Number, default: 1 },
});

const jobApplicationSchema = new Schema({
    account_id: { type: String, required: true },
    job_title: String,
    company_name: String,
    employment_type: String,
    work_location_mode: String,
    date_applied: Date,
    application_method: String,
    pay_amount: Number,
    pay_amount_max: Number,
    pay_type: String,
    experience_level: String,
    location: String,
    application_status: String,
    job_posting_url: String,
    job_description: String,
    notes: String,
    pinned: Boolean
  });

const Account = model('Account', accountSchema);
const Job_Application = model('Job_Application', jobApplicationSchema);

module.exports = {
  Account,
  Job_Application
};