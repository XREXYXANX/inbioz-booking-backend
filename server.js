import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch"; // npm install node-fetch@2
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/book-appointment", async (req, res) => {
  const { name, age, gender, phone, email, date, address } = req.body;

  if (!name || !age || !gender || !phone || !email || !date || !address) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const data = {
    sender: { email: process.env.BREVO_EMAIL },
    to: [{ email: "inbioz.technology@gmail.com" }],
    subject: "New InbioZ Appointment",
    textContent: `Name: ${name}\nAge: ${age}\nGender: ${gender}\nPhone: ${phone}\nEmail: ${email}\nDate: ${date}\nAddress: ${address}`
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Brevo API error:", result);
      return res.status(response.status).json(result);
    }

    res.status(200).json({ message: "Booking email sent successfully!", result });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send booking email", details: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
