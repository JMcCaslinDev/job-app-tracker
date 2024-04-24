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

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
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
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Call the createTables function before starting the server
createTables()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error starting server:', error);
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
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
}

// User signup
app.post('/api/signup', async (req, res) => {
  try {
    // const { username, password, firstName, lastName, email } = req.body;
    username = 'user';
    password = 1234;
    firstName = 'joe';
    lastname = 'smith';
    email = 'joesmith@gmail.com'
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO accounts (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, hashedPassword, firstName, lastName, email]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);
    const user = result.rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new job application for a user
app.post('/api/job-applications', verifyJwtToken, async (req, res) => {
  try {
    const { company, position, status, applicationDate, jobDescription, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO job_applications (account_id, company, position, status, application_date, job_description, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.userId, company, position, status, applicationDate, jobDescription, notes]
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
    const result = await pool.query('SELECT * FROM job_applications WHERE account_id = $1', [req.userId]);
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
      [company, position, status, applicationDate, jobDescription, notes, id, req.userId]
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
      req.userId,
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});