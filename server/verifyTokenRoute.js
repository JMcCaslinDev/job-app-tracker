const express = require('express');
const router = express.Router();
const { Account } = require('./models');
const jwt = require('jsonwebtoken');

// /api/verify-token
router.post('/verify-token', async (req, res) => {
  const { token, email } = req.body;

  try {
    const account = await Account.findOne({ email, loginToken: token, tokenExpiry: { $gt: Date.now() } });
    if (!account) {
      return res.status(401).send('Invalid or expired login link.');
    }

    // Issue new JWT for the user
    const jwtToken = jwt.sign(
      { accountId: account._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Clear loginToken and tokenExpiry fields in the database for security
    await Account.updateOne({ email }, {
      $set: {
        loginToken: null,
        tokenExpiry: null
      }
    });
    console.log("\nCleared used token data from DB\n");

    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Error verifying token or updating account:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
