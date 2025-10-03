import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // for Brevo API

dotenv.config(); // Load .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debug route to check server
app.get("/", (req, res) => {
  res.send("API is running!");
});

// POST route for booking
app.post("/book-appointment", async (req, res) => {
  console.log("Request body:", req.body);

  const { name, age, gender, phone, email, date, address } = req.body;

  if (!name || !age || !gender || !phone || !email || !date || !address) {
    console.error("Missing fields in request body");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { email: "Appointmentscheduler<slimshadygameperiod@gmail.com>" },
        to: [{ email: "inbioz.technology@gmail.com" }],
        subject: "New InbioZ Appointment",
        textContent: `
          Name: ${name}
          Age: ${age}
          Gender: ${gender}
          Phone: ${phone}
          Email: ${email}
          Date: ${date}
          Address: ${address}
        `
      })
    });

    const data = await response.json();
    console.log("Brevo response:", data);

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to send booking email", details: data });
    }

    res.status(200).json({ message: "Booking email sent successfully!", brevoResponse: data });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
