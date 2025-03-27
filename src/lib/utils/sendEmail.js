import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export async function sendWithSendGrid(email, token) {
    const sendGridApiKey = process.env.SENDGRID_API_KEY;

    if (!sendGridApiKey) {
        console.error("SENDGRID_API_KEY is missing in environment variables!");
        throw new Error("SENDGRID_API_KEY is missing");
    }

    sgMail.setApiKey(sendGridApiKey);

    const verificationLink = `http://localhost:5001/auth/verify/${token}`;

    const msg = {
        to: email,
        from: 'anca.sab@outlook.com', 
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

    try {
        const response = await sgMail.send(msg);

        if (response[0]?.statusCode === 202) {
            console.log(`Email sent successfully to ${email}`);
        } else {
            console.warn("Unexpected status code:", response[0]?.statusCode);
        }
    } catch (error) {
        if (error.response) {
            console.error("SendGrid Error Response:", error.response.body);
        } else {
            console.error("Error sending email:", error);
        }
        throw new Error("Error sending email");
    }
}


