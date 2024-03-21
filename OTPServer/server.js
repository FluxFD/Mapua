const express = require('express');
const { db } = require('./services/Firebase'); // Assuming db is exported from Firebase initialization file
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Enable CORS for all routes
app.use(cors());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email service (e.g., 'Gmail', 'SendGrid', etc.)
    auth: {
        user: process.env.EMAIL_ADDRESS, // Use environment variable for email address
        pass: process.env.EMAIL_PASSWORD // Use environment variable for email password
    }
});

// Generate OTP route
app.post('/generate', async (req, res) => {
    const { userId, email } = req.body;
    
    if (!userId || !email) {
        return res.status(400).json({ error: 'userId and email are required' });
    }

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    try {
        // Save the OTP in Firestore
        await db.collection('OTP').doc(userId).set({ otp, email });

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS, // Use environment variable for sender address
            to: email,
            subject: 'Password Change',
            text: `Your OTP is: ${otp}`
        });

        res.json({ message: 'OTP sent successfully via email' });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ error: 'Failed to generate OTP' });
    }
});

// Verify OTP route
app.post('/verify', async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ error: 'userId and otp are required' });
    }

    try {
        // Retrieve the OTP from Firestore
        const otpDoc = await db.collection('OTP').doc(userId).get();

        if (!otpDoc.exists) {
            return res.status(404).json({ error: 'No OTP found for this user' });
        }

        const storedOTP = otpDoc.data().otp;

        if (otp === storedOTP) {
            // OTP is correct
            // Delete OTP document from Firestore
            await db.collection('OTP').doc(userId).delete();
            res.json({ message: 'OTP verified successfully' });
        } else {
            // OTP is incorrect
            res.status(400).json({ error: 'Incorrect OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
