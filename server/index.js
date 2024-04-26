const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});



// Serve the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// Middleware to verify JWT token
function verifyJwtToken(req, res, next) {
  console.log("Entered verifyJwtToken function middleware");
  const token = req.headers.authorization;
  console.log("Token:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.log("Decoded token:", decoded);
    req.accountId = decoded.accountId;
    next();
  });
}


// User signup
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password, firstName, lastName, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO accounts (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING account_id',
      [username, hashedPassword, firstName, lastName, email]
    );
    const accountId = result.rows[0].account_id;
    const token = jwt.sign({ accountId }, process.env.JWT_SECRET);
    res.json({ token, success: true });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// User login
app.post('/api/login', async (req, res) => {
  try {
    console.log("\nEntered /api/login\n");
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);
    const user = result.rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ accountId: user.account_id }, process.env.JWT_SECRET);
      res.json({ token, success: true });
      console.log("\nSuccess token put into res.json\n");
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Protected dashboard route
app.get('/api/dashboard', verifyJwtToken, (req, res) => {
  console.log("\nEntered /api/dashboard route\n");
  // If the user is authenticated, send the dashboard data
  console.log('\n\nWelcome to the dashboard account_id: ', req.account_id, "\n\n")
  res.json({ message: 'Welcome to the dashboard', account_id: req.account_id });
});



// Endpoint to get user's first and last name by account_id
app.get('/api/user/name', verifyJwtToken, async (req, res) => {
  console.log("\nEntered /api/user/name route\n");
  try {
    console.log("Entered /api/user/name route inside try block");
    const { accountId } = req; // accountId is set in verifyJwtToken middleware
    console.log("\naccountId:", accountId, "\n");

    const queryResult = await pool.query(
      'SELECT first_name, last_name FROM accounts WHERE account_id = $1',
      [accountId]
    );
    console.log("queryResult:", queryResult);

    if (queryResult.rows.length === 0) {
      console.log("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    const { first_name: firstName, last_name: lastName } = queryResult.rows[0];
    console.log("firstName:", firstName);
    console.log("lastName:", lastName);

    res.json({ firstName, lastName });
  } catch (error) {
    console.error('Error retrieving user name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Create a new job application for a user
app.post('/api/job-applications', verifyJwtToken, async (req, res) => {
  try {
    const { company, position, status, applicationDate, jobDescription, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO job_applications (account_id, company, position, status, application_date, job_description, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.accountId, company, position, status, applicationDate, jobDescription, notes]
    );
    const jobApplication = result.rows[0];
    res.status(201).json(jobApplication);
  } catch (error) {
    console.error('Error creating job application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all job applications for a user
app.get('/api/job-applications', verifyJwtToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_applications WHERE account_id = $1', [req.accountId]);
    const jobApplications = result.rows;
    res.json(jobApplications);
  } catch (error) {
    console.error('Error retrieving job applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a job application by ID
app.put('/api/job-applications/:id', verifyJwtToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position, status, applicationDate, jobDescription, notes } = req.body;
    const result = await pool.query(
      'UPDATE job_applications SET company = $1, position = $2, status = $3, application_date = $4, job_description = $5, notes = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 AND account_id = $8 RETURNING *',
      [company, position, status, applicationDate, jobDescription, notes, id, req.accountId]
    );
    const updatedJobApplication = result.rows[0];
    if (updatedJobApplication) {
      res.json(updatedJobApplication);
    } else {
      res.status(404).json({ error: 'Job application not found' });
    }
  } catch (error) {
    console.error('Error updating job application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a job application by ID
app.delete('/api/job-applications/:id', verifyJwtToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM job_applications WHERE id = $1 AND account_id = $2 RETURNING *', [
      id,
      req.accountId,
    ]);
    const deletedJobApplication = result.rows[0];
    if (deletedJobApplication) {
      res.json(deletedJobApplication);
    } else {
      res.status(404).json({ error: 'Job application not found' });
    }
  } catch (error) {
    console.error('Error deleting job application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000 || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});