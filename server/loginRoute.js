const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { sendLoginEmail } = require('./mailgunService');

router.post('/request-login-link', async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + 900000; // Token expires in 15 minutes

  // Here, you would save the token and its expiration time to your database linked to the user's email
  // Example pseudo-code: await saveToken(email, token, expires);

  const link = `http://${req.headers.host}/login?token=${token}&email=${encodeURIComponent(email)}`;
  try {
    await sendLoginEmail(email, link);
    res.send({ message: 'Login link has been sent to your email.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending login link.');
  }
});

module.exports = router;
