const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Function to execute a query
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Create accounts table
async function createAccountsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await query(sql);
  console.log('Accounts table created');
}

// Create job_applications table
async function createJobApplicationsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS job_applications (
      id SERIAL PRIMARY KEY,
      account_id INTEGER REFERENCES accounts(id),
      company VARCHAR(255),
      position VARCHAR(255),
      status VARCHAR(50),
      application_date DATE,
      job_description TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await query(sql);
  console.log('Job applications table created');
}

// Account CRUD functions

// Create a new account
async function createAccount(data) {
  const { username, password, firstName, lastName, email } = data;
  const result = await query(
    'INSERT INTO accounts (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [username, password, firstName, lastName, email]
  );
  return result.rows[0];
}

// Get all accounts
async function getAllAccounts() {
  const result = await query('SELECT * FROM accounts');
  return result.rows;
}

// Get an account by ID
async function getAccountById(id) {
  const result = await query('SELECT * FROM accounts WHERE id = $1', [id]);
  return result.rows[0];
}

// Update an account by ID
async function updateAccountById(id, data) {
  const { username, password, firstName, lastName, email } = data;
  const result = await query(
    'UPDATE accounts SET username = $1, password = $2, first_name = $3, last_name = $4, email = $5 WHERE id = $6 RETURNING *',
    [username, password, firstName, lastName, email, id]
  );
  return result.rows[0];
}

// Delete an account by ID
async function deleteAccountById(id) {
  const result = await query('DELETE FROM accounts WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

// Job Application CRUD functions

// Create a new job application
async function createJobApplication(data) {
  const { accountId, company, position, status, applicationDate, jobDescription, notes } = data;
  const result = await query(
    'INSERT INTO job_applications (account_id, company, position, status, application_date, job_description, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [accountId, company, position, status, applicationDate, jobDescription, notes]
  );
  return result.rows[0];
}

// Get all job applications
async function getAllJobApplications() {
  const result = await query('SELECT * FROM job_applications');
  return result.rows;
}

// Get all job applications for a specific account
async function getJobApplicationsByAccountId(accountId) {
  const result = await query('SELECT * FROM job_applications WHERE account_id = $1', [accountId]);
  return result.rows;
}

// Get a single job application by ID
async function getJobApplicationById(id) {
  const result = await query('SELECT * FROM job_applications WHERE id = $1', [id]);
  return result.rows[0];
}

// Update a job application by ID
async function updateJobApplicationById(id, data) {
  const { company, position, status, applicationDate, jobDescription, notes } = data;
  const result = await query(
    'UPDATE job_applications SET company = $1, position = $2, status = $3, application_date = $4, job_description = $5, notes = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
    [company, position, status, applicationDate, jobDescription, notes, id]
  );
  return result.rows[0];
}

// Delete a job application by ID
async function deleteJobApplicationById(id) {
  const result = await query('DELETE FROM job_applications WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = {
  createAccountsTable,
  createJobApplicationsTable,
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccountById,
  deleteAccountById,
  createJobApplication,
  getAllJobApplications,
  getJobApplicationsByAccountId,
  getJobApplicationById,
  updateJobApplicationById,
  deleteJobApplicationById,
};
