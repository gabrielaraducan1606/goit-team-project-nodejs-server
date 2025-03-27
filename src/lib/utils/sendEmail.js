import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export async function sendWithSendGrid(email, token) {
    const sendGridApiKey = process.env.SENDGRID_API_KEY;

    // Verifică dacă cheia API există
    if (!sendGridApiKey) {
        console.error("SENDGRID_API_KEY is missing in environment variables!");
        throw new Error("SENDGRID_API_KEY is missing");
    }

    sgMail.setApiKey(sendGridApiKey);

    // Generarea linkului de verificare
    const verificationLink = `http://localhost:5001/auth/verify/${token}`;

    const msg = {
        to: email,
        // Folosește o adresă de email asociată aplicației tale pentru a evita problemele de spam
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
        // Trimite email-ul cu SendGrid
        const response = await sgMail.send(msg);

        // Verifică răspunsul pentru a confirma trimiterea cu succes
        if (response[0]?.statusCode === 202) {
            console.log(`Email sent successfully to ${email}`);
        } else {
            // Loghează avertisment în cazul unui cod de stare neașteptat
            console.warn("Unexpected status code:", response[0]?.statusCode);
        }
    } catch (error) {
        // Tratează și loghează erorile într-un mod detaliat
        if (error.response) {
            console.error("SendGrid Error Response:", error.response.body);
        } else {
            console.error("Error sending email:", error);
        }
        throw new Error("Error sending email");
    }
}


