import { transporter } from "../config/emailConfig.js";
export const sendVerificationEmail = async (userEmail, otp) => {
  const mailOptions = {
    from: "Bharat Darshan <noreply@msstore.in>",
    to: userEmail,
    subject: "Verify your Bharat Darshan Account",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
        <h2 style="color: #00A699; text-align: center;">BHARAT DARSHAN</h2>
        <p style="font-size: 16px; color: #333;">Welcome to the adventure! Use the code below to verify your email address:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h1 style="letter-spacing: 10px; font-size: 40px; margin: 0; color: #111;">${otp}</h1>
        </div>
        <p style="font-size: 12px; color: #888; text-align: center;">This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  try {
    const otp = await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false };
  }
};

export const sendEmail = async (mailOptions) => {
  const { to, subject, html } = mailOptions;
  try {
    await transporter.sendMail({from: "Bharat Darshan <noreply@msstore.in>", to: to, subject: subject, html: html });
    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false };
  }
};
