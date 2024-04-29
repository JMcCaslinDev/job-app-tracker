const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const moment = require('moment-timezone');


const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});



function verifyJwtToken(req, res, next) {
  console.log("Entered verifyJwtToken function middleware");
  const token = req.headers.authorization;
  console.log("Token:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: 'No token provided' });
  }

  // Remove the "Bearer " prefix from the token
  const tokenWithoutPrefix = token.replace('Bearer ', '');

  jwt.verify(tokenWithoutPrefix, process.env.JWT_SECRET, (err, decoded) => {
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
      console.log("/api/login route TOKEN: ", token, "\n");
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
  // res.json({});
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



// POST endpoint for creating a new job application
app.post('/api/job-applications', verifyJwtToken, async (req, res) => {
  try {
    const {
      company_name,
      job_title,
      application_status,
      date_applied,
      job_description,
      notes,
      application_method,
      pay_amount,
      job_posting_url,
      pay_type,
      employment_type,
      work_location_mode,
      location,
      experience_level,
      pinned,
      userTimezone,
    } = req.body;

    // Convert the local date to UTC
    const dateInUTC = moment.tz(date_applied, userTimezone).utc().format('YYYY-MM-DD HH:mm:ss');

    const result = await pool.query(
      `INSERT INTO job_applications (
        account_id,
        company_name,
        job_title,
        application_status,
        date_applied,
        job_description,
        notes,
        application_method,
        pay_amount,
        job_posting_url,
        pay_type,
        employment_type,
        work_location_mode,
        location,
        experience_level,
        pinned
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        req.accountId,
        company_name,
        job_title,
        application_status,
        dateInUTC, // Use the converted UTC date here
        job_description,
        notes,
        application_method,
        pay_amount,
        job_posting_url,
        pay_type,
        employment_type,
        work_location_mode,
        location,
        experience_level,
        pinned,
      ]
    );

    const jobApplication = result.rows[0];
    res.status(201).json(jobApplication);
  } catch (error) {
    console.error('Error creating job application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all job applications for a user
app.get('/api/user/return-all/job-applications', verifyJwtToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_applications WHERE account_id = $1', [req.accountId]);
    const jobApplications = result.rows;
    res.json(jobApplications);
  } catch (error) {
    console.error('Error retrieving job applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// PUT endpoint for updating a job application
app.put('/api/job-applications/:id', verifyJwtToken, async (req, res) => {
  try {
    const {
      company_name,
      job_title,
      application_status,
      date_applied,
      job_description,
      notes,
      application_method,
      pay_amount,
      job_posting_url,
      pay_type,
      employment_type,
      work_location_mode,
      location,
      experience_level,
      pinned,
      userTimezone,
    } = req.body;

    // Convert the local date to UTC
    const dateInUTC = moment.tz(date_applied, userTimezone).utc().format('YYYY-MM-DD HH:mm:ss');

    const result = await pool.query(
      `UPDATE job_applications
      SET company_name = $1,
        job_title = $2,
        application_status = $3,
        date_applied = $4, // Use the converted UTC date here
        job_description = $5,
        notes = $6,
        application_method = $7,
        pay_amount = $8,
        job_posting_url = $9,
        pay_type = $10,
        employment_type = $11,
        work_location_mode = $12,
        location = $13,
        experience_level = $14,
        pinned = $15,
        updated_at = CURRENT_TIMESTAMP
      WHERE index = $16 AND account_id = $17
      RETURNING *`,
      [
        company_name,
        job_title,
        application_status,
        dateInUTC, // Use the converted UTC date here
        job_description,
        notes,
        application_method,
        pay_amount,
        job_posting_url,
        pay_type,
        employment_type,
        work_location_mode,
        location,
        experience_level,
        pinned,
        req.params.id,
        req.accountId,
      ]
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
    const result = await pool.query('DELETE FROM job_applications WHERE index = $1 AND account_id = $2 RETURNING *', [
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


// Endpoint to get user's daily application goal
app.get('/api/user/daily-goal', verifyJwtToken, async (req, res) => {
  try {
    const { accountId } = req;
    const result = await pool.query('SELECT daily_application_goal FROM accounts WHERE account_id = $1', [accountId]);
    const dailyGoal = result.rows[0].daily_application_goal;
    res.json({ dailyGoal });
  } catch (error) {
    console.error('Error retrieving daily goal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get the number of applications left for today
app.get('/api/user/applications-left', verifyJwtToken, async (req, res) => {
  try {
    const { accountId } = req;
    const userTimezone = req.headers['x-user-timezone'];

    if (!userTimezone) {
      console.error('User timezone header is missing');
      return res.status(400).json({ error: 'User timezone not provided' });
    }

    // Calculate the start and end of the user's current day in their timezone
    const startOfDayLocal = moment.tz(userTimezone).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfDayLocal = moment.tz(userTimezone).endOf('day').format('YYYY-MM-DD HH:mm:ss');

    console.log(`User timezone: ${userTimezone}`);
    console.log(`Start of day in local timezone: ${startOfDayLocal}`);
    console.log(`End of day in local timezone: ${endOfDayLocal}`);

    // Convert local start and end of day to UTC to match against the stored times in UTC
    const startOfDayUTC = moment.tz(startOfDayLocal, userTimezone).utc().format('YYYY-MM-DD HH:mm:ss');
    const endOfDayUTC = moment.tz(endOfDayLocal, userTimezone).utc().format('YYYY-MM-DD HH:mm:ss');

    console.log(`Start of day in UTC: ${startOfDayUTC}`);
    console.log(`End of day in UTC: ${endOfDayUTC}`);

    const result = await pool.query(`
      SELECT 
        COALESCE(a.daily_application_goal - COUNT(j.index), a.daily_application_goal) AS applications_left
      FROM accounts a
      LEFT JOIN job_applications j ON a.account_id = j.account_id 
        AND j.date_applied >= $1 
        AND j.date_applied < $2 
      WHERE a.account_id = $3
      GROUP BY a.daily_application_goal, a.account_id
    `, [startOfDayUTC, endOfDayUTC, accountId]);

    console.log('Query result:', result.rows);

    if (result.rows.length > 0) {
      const applicationsLeft = result.rows[0].applications_left;
      res.json({ applicationsLeft });
    } else {
      console.error('No result returned from query');
      res.status(404).json({ error: 'Daily application goal not set for user' });
    }
  } catch (error) {
    console.error('Error retrieving applications left:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});






// ALL API Routes Above Here


// Serve the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}


const PORT = process.env.PORT || 5000 || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});