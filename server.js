// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); // Load .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test endpoint to check server
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Appointment endpoint
app.post("/book-appointment", async (req, res) => {
  console.log("Incoming request body:", req.body);

  const { name, age, gender, phone, email, date, address } = req.body;

  // Validate required fields
  if (!name || !age || !gender || !phone || !email || !date || !address) {
    console.log("Missing fields in request!");
    return res.status(400).json({ error: "Missing fields in request body" });
  }

  try {
    // Send email via Brevo API
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "slimshadygameperiod@gmail.com", name: "Appointment Scheduler" },
        to: [{ email: "inbioz.technology@gmail.com" }],
        subject: "New Appointment",
        htmlContent: `
          <p><b>Name:</b> ${name}</p>
          <p><b>Age:</b> ${age}</p>
          <p><b>Gender:</b> ${gender}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Date:</b> ${date}</p>
          <p><b>Address:</b> ${address}</p>
        `
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY, // Your Brevo API key in .env
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Brevo response:", response.data);
    res.status(200).json({ success: true, brevoResponse: response.data });

  } catch (err) {
    console.error("Brevo API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Brevo API error", details: err.response?.data || err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
