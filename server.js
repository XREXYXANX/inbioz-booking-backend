import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); // Load .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // 👈 needed to parse JSON requests

// Appointment route
app.post("/book-appointment", async (req, res) => {
  console.log("📩 Incoming request body:", req.body);

  const { name, age, gender, phone, email, date, address } = req.body;

  // Validate fields
  if (!name || !age || !gender || !phone || !email || !date || !address) {
    return res.status(400).json({
      error: "Bad Request",
      received: req.body,
      missing: {
        name: !name,
        age: !age,
        gender: !gender,
        phone: !phone,
        email: !email,
        date: !date,
        address: !address
      }
    });
  }

  try {
    // Send email using Brevo API
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "slimshadygameperiod@gmail.com", name: "Appointment Scheduler" },
        to: [{ email: "inbioz.technology@gmail.com" }], // where you want to receive bookings
        subject: "New InbioZ Appointment",
        htmlContent: `
          <h2>New Appointment</h2>
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
          "api-key": process.env.BREVO_API_KEY, // 👈 API key from .env
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Brevo Response:", response.data);
    res.json({ success: true, message: "Appointment booked successfully!" });

  } catch (error) {
    console.error("❌ Error sending email:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send booking email" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
