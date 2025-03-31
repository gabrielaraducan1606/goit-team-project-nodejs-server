import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

function configureSendGrid() {
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  if (!sendGridApiKey) {
    console.error("SENDGRID_API_KEY is missing in environment variables!");
    throw new Error("SENDGRID_API_KEY is missing");
  }
  sgMail.setApiKey(sendGridApiKey);
}

export async function sendVerificationEmail(to, token) {
  try {
    configureSendGrid();
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'anca.sab@outlook.com';
    const verificationLink = `http://localhost:5001/auth/verify/${token}`;

    const msg = {
      to: to,
      from: fromEmail,
      subject: 'Verify your email',
      text: `Click the link to verify your email: ${verificationLink}`,
      html: `
          <p>Hello from <strong>TasksProApp</strong>!</p>
          <p>Click the link below to verify your account:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>Or copy and paste this URL into your browser:</p>
          <p>${verificationLink}</p>
      `,
    };

    const response = await sgMail.send(msg);

    if (response[0]?.statusCode === 202) {
      console.log(`Verification email sent successfully to ${to}`);
    } else {
      console.warn("Unexpected status code:", response[0]?.statusCode);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

export async function sendNeedHelpEmail(to, from, subject, text, html) {
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'your-email@example.com';

  if (!sendGridApiKey) {
    console.error("SENDGRID_API_KEY is missing in environment variables!");
    throw new Error("SENDGRID_API_KEY is missing");
  }

  sgMail.setApiKey(sendGridApiKey);

  const msg = {
    to: to, // (taskpro.project@gmail.com)
    from: fromEmail, //  (user email)
    subject: subject,
    text: text, 
    html: html, 
  };

  try {
    const response = await sgMail.send(msg);

    if (response[0]?.statusCode === 202) {
      console.log(`"Need Help" email sent successfully to ${to}`);
      return response[0];
    } else {
      console.warn("Unexpected status code:", response[0]?.statusCode);
      throw new Error("Unexpected response from SendGrid");
    }
  } catch (error) {
    console.error("Error sending \"Need Help\" email:", error);
    throw new Error("Error sending \"Need Help\" email");
  }
}
