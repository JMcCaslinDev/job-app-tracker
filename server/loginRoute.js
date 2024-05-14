const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { sendLoginEmail } = require('./mailgunService');
const { Account } = require('./models');

// Use environment variable for the client URL
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

router.post('/request-login-link', async (req, res) => {
  const email = req.body.email.toLowerCase();
  const token = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + 900000; // Token expires in 15 minutes

  try {
    const account = await Account.findOne({ email });
    if (!account) {
      return res.send({ message: 'If an account exists with this email, a login link has been sent.' });
    }

    account.loginToken = token;
    account.tokenExpiry = expires;
    await account.save();

    const link = `${CLIENT_URL}/login?token=${token}&email=${encodeURIComponent(email)}`;
    await sendLoginEmail(email, link);

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending login link.');
  }
});

module.exports = router;
