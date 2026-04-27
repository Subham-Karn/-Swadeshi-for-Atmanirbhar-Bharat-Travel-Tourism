import nodemailer from 'nodemailer';

// Configure the Transporter (Using Resend or Brevo)
export const transporter = nodemailer.createTransport({
  host: "smtp.resend.com", // Or smtp-relay.brevo.com
  port: 465,
  secure: true,
  auth: {
    user: "resend", 
    pass: process.env.RESEND_API_KEY, // Get this from resend.com
  },
});

