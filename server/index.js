const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const cheerio = require('cheerio');
const https = require('https');
const http = require('http');
const cors = require('cors');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const app = express();
// Conditional CORS setup
if (process.env.DEVELOPMENT) {
  console.log("\nFound Development Cors variable in .env\n");
  app.use(cors()); // Enable CORS for all domains during development
}

app.use(express.json());

console.log('Mongo URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


  const { Schema, model } = require('mongoose');
  
  const accountSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    first_name: String,
    last_name: String,
    email: { type: String, required: true },
    daily_application_goal: Number,
    created_at: { type: Date, default: Date.now }
  });
  
  const jobApplicationSchema = new Schema({
    account_id: { type: String, required: true },
    company_name: String,
    job_title: String,
    application_status: String,
    date_applied: Date,
    job_description: String,
    notes: String,
    application_method: String,
    pay_amount: Number,
    job_posting_url: String,
    pay_type: String,
    employment_type: String,
    work_location_mode: String,
    location: String,
    experience_level: String,
    pinned: Boolean
  });
  // The (mongodb collection name, schema)
  const Account = model('Account', accountSchema);
  const Job_Application = model('Job_Application', jobApplicationSchema);
  




  function verifyJwtToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const tokenWithoutPrefix = token.startsWith('Bearer ') ? token.slice(7) : token;
    jwt.verify(tokenWithoutPrefix, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.accountId = decoded.accountId; // Ensure this matches the name used in jwt.sign
      next();
    });
  }
  


// User signup
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password, firstName, lastName, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultGoal = 10;
    const newAccount = new Account({
      username,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      email,
      daily_application_goal: defaultGoal
    });
    await newAccount.save();
    const token = jwt.sign({ accountId: newAccount._id.toString() }, process.env.JWT_SECRET); // Convert _id to string
    res.json({ token, success: true });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// User login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login Request Received:", req.body);
  try {
    const user = await Account.findOne({ username: username.trim() });

    if (!user) {
      console.error("No user found for username:", username.trim());
      return res.status(404).json({ error: 'User not found' });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ accountId: user._id.toString() }, process.env.JWT_SECRET); // Convert _id to string
      console.log("Token generated successfully:", token);
      return res.json({ token, success: true });
    } else {
      console.error("Invalid credentials provided for username:", username.trim());
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal server error' });
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
  try {
    const { accountId } = req;
    console.log("\naccountId: ", accountId, "\n");
    const user = await Account.findOne({ _id: accountId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { first_name: firstName, last_name: lastName } = user;
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
    const dateInUTC = moment.tz(date_applied, userTimezone).utc().toDate();

    const job_Application = new Job_Application({
      account_id: req.accountId,
      company_name,
      job_title,
      application_status,
      date_applied: dateInUTC,
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
    });

    await job_Application.save();
    res.status(201).json(job_Application);
  } catch (error) {
    console.error('Error creating job application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all job applications for a user
app.get('/api/user/return-all/job-applications', verifyJwtToken, async (req, res) => {
  try {
    const job_Applications = await Job_Application.find({ account_id: req.accountId });
    res.json(job_Applications);
  } catch (error) {
    console.error('Error retrieving job applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// PUT endpoint for updating a job application

app.put('/api/job-applications/:applicationId', verifyJwtToken, async (req, res) => {
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

    const { applicationId } = req.params;

    // Check if the applicationId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ error: 'Invalid job application ID' });
    }

    // Check if date_applied is provided, then convert it to UTC, otherwise use current UTC date
    const dateInUTC = date_applied ? moment.tz(date_applied, userTimezone).utc().toDate() : new Date();

    const updateData = {
      company_name,
      job_title,
      application_status,
      date_applied: dateInUTC,
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
      updated_at: Date.now(),
    };

    // Remove undefined fields from the update data
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedJobApplication = await Job_Application.findOneAndUpdate(
      { _id: applicationId, account_id: req.accountId },
      updateData,
      { new: true }
    );

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
    const deletedJobApplication = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      account_id: req.accountId,
    });
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
    const user = await Account.findById(req.accountId);
    if (user) {
      res.json({ dailyGoal: user.daily_application_goal });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
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
    const startOfDayLocal = moment.tz(userTimezone).startOf('day').toDate();
    const endOfDayLocal = moment.tz(userTimezone).endOf('day').toDate();

    console.log(`User timezone: ${userTimezone}`);
    console.log(`Start of day in local timezone: ${startOfDayLocal}`);
    console.log(`End of day in local timezone: ${endOfDayLocal}`);

    const user = await Account.findById(accountId);
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const jobApplicationsCount = await Job_Application.countDocuments({
      account_id: accountId,
      date_applied: {
        $gte: startOfDayLocal,
        $lt: endOfDayLocal,
      },
    });

    const applicationsLeft = user.daily_application_goal - jobApplicationsCount;

    console.log(`Applications left for today: ${applicationsLeft}`);

    res.json({ applicationsLeft });
  } catch (error) {
    console.error('Error retrieving applications left:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Auto Add url has been clicked
app.post('/api/scrape-job-posting', async (req, res) => {
  try {
    const { url } = req.body;
    console.log("\nURL: ", url, "\n");

    if (!url || url.trim() === '') {
      return res.status(400).json({ error: 'URL is required' });
    }

    const client = url.startsWith('https') ? require('https') : require('http');

    client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return res.status(500).json({ error: 'Failed to load page, status code: ' + response.statusCode });
      }

      let html = '';

      response.on('data', (chunk) => {
        html += chunk;
      });

      response.on('end', () => {
        const $ = cheerio.load(html);

        const companyName = $('a[data-test-app-aware-link]').first().text().trim();
        const jobTitle = $('h1:contains("Engineer")').first().text().trim(); // assuming job titles contain 'Engineer'
        const jobDescription = $('[data-test-job-description]').text().trim();
        const location = $('span:contains("United States")').first().text().trim(); // assuming location contains 'United States'

        const payRange = $('span:contains("$")').first().text().trim().replace(/\s+/g, ' ');
        const jobType = $('span:contains("Full-time")').first().text().trim(); // assuming job type mentions 'Full-time'

        res.json({
          companyName,
          jobTitle,
          jobDescription,
          location,
          payRange,
          jobType
        });
      });

    }).on('error', (error) => {
      console.error('Error making the request:', error);
      res.status(500).json({ error: 'Failed to scrape job posting' });
    });

  } catch (error) {
    console.error('Error in scrape-job-posting:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



app.post('/api/jobs', (req, res) => {
  const jobData = req.body;
  console.log("\njobData: ", jobData, "\n");
  // Save the jobData to your database
  // ...
  res.status(201).json({ message: 'Job saved successfully' });
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