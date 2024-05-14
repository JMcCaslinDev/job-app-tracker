const formData = require('form-data');
const Mailgun = require('mailgun.js');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const DOMAIN = process.env.MAILGUN_DOMAIN;
const API_KEY = process.env.MAILGUN_API_KEY;

if (!API_KEY) {
    console.error("API key is not set in the environment variables.");
    process.exit(1); // Exits the node process if no API key found
}

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: 'api', key: API_KEY });

function sendTestEmail() {
    const data = {
        from: 'Excited User <mailgun@sandboxa3304eba5eb247c1aeb544cf3cdf3765.mailgun.org>',
        to: 'jonathanmccaslin42@gmail.com',
        subject: 'Hello',
        text: 'Testing some Mailgun awesomeness!'
    };

    client.messages.create(DOMAIN, data)
        .then(body => {
            console.log("Email sent successfully:", body);
        })
        .catch(error => {
            console.error("Failed to send email:", error);
        });
}

sendTestEmail();
