import sgMail from '@sendgrid/mail';

// Set the API key for the SendGrid mail service
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an OTP email to the user using SendGrid.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The one-time password to send.
 */
export const sendOTPEmail = async (to, otp) => {
  const msg = {
    to: to, // Recipient
    from :process.env.SENDGRID_VERIFIED_SENDER,
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
    await sgMail.send(msg);
    console.log('SendGrid email sent successfully to:', to);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending SendGrid email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    // Throw an error so the controller can catch it
    throw new Error('Failed to send verification email.');
  }
};