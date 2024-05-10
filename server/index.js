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
  console.log("Development mode: Enabling CORS for all domains");
  app.use(cors()); // Enable CORS for all domains during development
} else {
  console.log("Production mode: Enabling CORS with specific restrictions");
  const corsOptions = {
    origin: function (origin, callback) {
      console.log("Received origin:", origin); // Log the origin for debugging
      const allowedOrigins = [
        'chrome-extension://olpnpnbilgblmjhddofgedonaiekiilm',
        'https://job-app-tracker-website-b2cef22d84a2.herokuapp.com',
        'https://www.indeed.com'
      ];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-timezone']
  };
  app.use(cors(corsOptions));
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
  // The (mongodb collection name, schema)
  const Account = model('Account', accountSchema);
  const Job_Application = model('Job_Application', jobApplicationSchema);
  

  // account_id: req.accountId,
  // job_title,
  // company_name,
  // employment_type,
  // work_location_mode,
  // date_applied: dateInUTC,
  // application_method,
  // pay_amount,
  // pay_type,
  // experience_level,
  // location,
  // application_status,
  // job_posting_url,
  // job_description,
  // notes,
  // pinned,


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
    const token = jwt.sign(
      { accountId: newAccount._id.toString() },  // Convert _id to string
      process.env.JWT_SECRET,
      { expiresIn: '12h' }  // Token now expires in 12 hours
    );
   
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
      const token = jwt.sign(
        { accountId: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }  // Token now expires in 12 hours
      );
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
      job_title,
      company_name,
      employment_type,
      work_location_mode,
      date_applied,
      application_method,
      pay_amount,
      pay_type,
      experience_level,
      location,
      application_status,
      job_posting_url,
      job_description,
      notes,
      pinned,
      userTimezone,
    } = req.body;

    // Convert the local date to UTC
    const dateInUTC = moment.tz(date_applied, userTimezone).utc().toDate();

    const job_Application = new Job_Application({
      account_id: req.accountId,
      job_title,
      company_name,
      employment_type,
      work_location_mode,
      date_applied: dateInUTC,
      application_method,
      pay_amount,
      pay_type,
      experience_level,
      location,
      application_status,
      job_posting_url,
      job_description,
      notes,
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
      job_title,
      company_name,
      employment_type,
      work_location_mode,
      date_applied,
      application_method,
      pay_amount,
      pay_amount_max,
      pay_type,
      experience_level,
      location,
      application_status,
      job_posting_url,
      job_description,
      notes,
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
      job_title,
      company_name,
      employment_type,
      work_location_mode,
      date_applied: dateInUTC,
      application_method,
      pay_amount,
      pay_amount_max,
      pay_type,
      experience_level,
      location,
      application_status,
      job_description,
      notes,
      job_posting_url,
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

// const dateInUTC = moment.tz(date_applied, userTimezone).utc().toDate();  //gets utc from local time zone date

app.post('/api/jobs', async (req, res) => {
  try {
    const jobData = req.body;
    console.log("\njobData: ", jobData, "\n");

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const tokenWithoutPrefix = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(tokenWithoutPrefix, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const accountId = decoded.accountId;
      console.log("\naccountId: ", accountId, "\n");

      const base_pay = jobData.base_pay ? parseFloat(jobData.base_pay) : 0.0;
      const max_pay = jobData.max_pay ? parseFloat(jobData.max_pay) : 0.0;
      const pinned = jobData.pinned || false;
      const date_applied = jobData.date_applied ? new Date(jobData.date_applied) : new Date();

      const formattedJobData = {
        account_id: accountId,
        job_title: jobData.job_title || '',
        company_name: jobData.company_name || '',
        employment_type: jobData.employment_type || '',
        work_location_mode: jobData.work_location_mode || '',
        date_applied: date_applied,
        application_method: jobData.application_method || '',
        pay_amount: base_pay,
        pay_amount_max: max_pay,
        pay_type: jobData.pay_type || '',
        experience_level: jobData.experience_level || '',
        location: jobData.location || '',
        application_status: jobData.application_status || '',
        job_posting_url: jobData.job_posting_url || '',
        job_description: jobData.job_description || '',
        notes: jobData.notes || '',
        pinned: pinned
      };

      try {
        const newJobApplication = new Job_Application(formattedJobData);
        console.log('Formatted Job Data:', formattedJobData);
        await newJobApplication.save();
        res.status(201).json({ message: 'Job saved successfully', data: newJobApplication });
      } catch (error) {
        console.error('MongoDB Error:', error);
        if (error.name === 'MongoServerError' && error.code === 121) {
          console.log('Validation Error Details:', error);
          const validationErrors = error.errInfo?.details?.schemaRulesNotSatisfied || [];
          res.status(400).json({
            error: 'Validation failed',
            message: error.message,
            validationErrors: validationErrors.map(v => ({
              field: v.operatorName,
              issues: v.propertiesNotSatisfied.map(property => ({
                property: property.propertyName,
                reason: property.reason
              }))
            }))
          });
        } else {
          res.status(500).json({
            error: 'Internal server error',
            message: error.message
          });
        }
      }
    });
  } catch (error) {
    console.error('Unexpected Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
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