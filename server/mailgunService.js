const formData = require('form-data');
const Mailgun = require('mailgun.js');
const path = require('path');

// Ensuring the environment variables are loaded
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const DOMAIN = process.env.MAILGUN_DOMAIN;
const API_KEY = process.env.MAILGUN_API_KEY;

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: 'api', key: API_KEY });

function sendLoginEmail(email, link) {
  const data = {
    from: 'Excited User <mailgun@sandboxa3304eba5eb247c1aeb544cf3cdf3765.mailgun.org>',
    to: email,
    subject: 'Login to Your Account',
    html: `Click <a href="${link}">here</a> to log in. This link will expire in 15 minutes.`
  };

  return new Promise((resolve, reject) => {
    client.messages.create(DOMAIN, data)
      .then(body => {
        resolve(body);
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = { sendLoginEmail };
