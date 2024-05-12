const express = require('express');
const router = express.Router();
const { Account } = require('./models'); // Assuming this is the location of your Mongoose models

// Function to check if the token is valid
async function checkToken(email, token) {
    const user = await Account.findOne({ email, loginToken: token, tokenExpiry: { $gt: Date.now() } });
    return user !== null;
}

router.get('/login', async (req, res) => {
    const { token, email } = req.query;

    try {
        const isValid = await checkToken(email, token);
        if (isValid) {
            // Log the user in, set up session, etc.
            res.redirect('/dashboard'); // Assuming there's a dashboard route that handles logged-in users
        } else {
            res.status(401).send('Invalid or expired login link.');
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
