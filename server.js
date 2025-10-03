import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";

dotenv.config(); // Load .env

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Brevo HTTP API setup
const client = new SibApiV3Sdk.TransactionalEmailsApi();
client.apiClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

// Root route for health check
app.get("/", (req, res) => res.send("API is running!"));

// Booking endpoint
app.post("/book-appointment", async (req, res) => {
  const { name, age, gender, phone, email, date, address } = req.body;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    sender: { email: process.env.BREVO_EMAIL },
    to: [{ email: "inbioz.technology@gmail.com" }],
    subject: "New InbioZ Appointment",
    textContent: `
Name: ${name}
Age: ${age}
Gender: ${gender}
Phone: ${phone}
Email: ${email}
Date: ${date}
Address: ${address}`
  });

  try {
    await client.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ message: "Booking email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
