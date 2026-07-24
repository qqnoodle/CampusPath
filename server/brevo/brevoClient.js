require("dotenv").config();
const { BrevoClient } = require("@getbrevo/brevo");

const brevoClient = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

module.exports = { brevoClient };
