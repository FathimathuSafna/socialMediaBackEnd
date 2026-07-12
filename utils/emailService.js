import nodemailer from 'nodemailer';

// Create SMTP transporter using Gmail app credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an OTP email to the user using Nodemailer.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The one-time password to send.
 */
export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: to,
    subject: 'Your OTP for Appmosphere Verification',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome to Appmosphere!</h2>
        <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your account:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #007bff;">${otp}</p>
        <p>This OTP is valid for 10 minutes.</p>
        <br>
        <p>Best regards,</p>
        <p>The Appmosphere Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Nodemailer email sent successfully to:', to, info.messageId);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending Nodemailer email:', error);
    // Throw an error so the controller can catch it
    throw new Error('Failed to send verification email.');
  }
};