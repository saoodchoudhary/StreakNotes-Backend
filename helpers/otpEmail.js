// src/services/emailService.js

const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code for Registration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 10px 0;
            }
            .header h1 {
              margin: 0;
              color: #333333;
            }
            .content {
              padding: 20px;
              text-align: center;
            }
            .content p {
              font-size: 16px;
              color: #555555;
              margin-bottom: 20px;
            }
            .otp {
              display: inline-block;
              font-size: 24px;
              color: #ffffff;
              background-color: #007bff;
              padding: 10px 20px;
              border-radius: 4px;
              letter-spacing: 2px;
            }
            .footer {
              text-align: center;
              padding: 10px 0;
              font-size: 12px;
              color: #aaaaaa;
            }
            @media (max-width: 600px) {
              .container {
                width: 100%;
                padding: 10px;
              }
              .content p {
                font-size: 14px;
              }
              .otp {
                font-size: 20px;
                padding: 8px 16px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>OTP Verification</h1>
            </div>
            <div class="content">
              <p>Your OTP for registration is:</p>
              <div class="otp">${otp}</div>
            </div>
            <div class="footer">
              <p>If you did not request this, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendOtpEmail };