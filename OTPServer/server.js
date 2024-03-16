const express = require('express');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email service (e.g., 'Gmail', 'SendGrid', etc.)
    auth: {
        user: process.env.EMAIL_ADDRESS, // Use environment variable for email address
        pass: process.env.EMAIL_PASSWORD // Use environment variable for email password
    }
});

// In-memory storage for generated OTPs (replace this with a proper database in production)
const otpStorage = {};

// Generate OTP route
app.post('/generate', (req, res) => {
    const { userId, email } = req.body;

    if (!userId || !email) {
        return res.status(400).json({ error: 'userId and email are required' });
    }

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    // Save the OTP in storage
    otpStorage[userId] = otp;

    // Send OTP via email
    transporter.sendMail({
        from: process.env.EMAIL_ADDRESS, // Use environment variable for sender address
        to: email,
        subject: 'Password Change',
        text: `Your OTP is: ${otp}`
    }, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).json({ error: 'Failed to send OTP via email' });
        }
        console.log('Email sent:', info.response);
        res.json({ message: 'OTP sent successfully via email' });
    });
});

// Verify OTP route
app.post('/verify', (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ error: 'userId and otp are required' });
    }

    // Retrieve the OTP from storage
    const storedOTP = otpStorage[userId];

    if (!storedOTP) {
        return res.status(404).json({ error: 'No OTP found for this user' });
    }

    if (otp === storedOTP) {
        // OTP is correct
        // Mark user as verified
        delete otpStorage[userId];
        res.json({ message: 'OTP verified successfully' });
    } else {
        // OTP is incorrect
        res.status(400).json({ error: 'Incorrect OTP' });
    }
});

// Protected route (example)
app.get('/protected', (req, res) => {
    const { userId } = req.query;

    if (!userId || !verifiedUsers[userId]) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({ message: 'Welcome to the protected resource!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
