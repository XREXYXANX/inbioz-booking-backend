import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// POST /book-appointment
app.post("/book-appointment", async (req, res) => {
  const { name, age, gender, phone, email, date, address } = req.body;

  // Simple validation
  if (!name || !age || !gender || !phone || !email || !date || !address) {
    return res.status(400).json({ error: "Missing fields", received: req.body });
  }

  try {
    // Send email via Brevo HTTP API
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "slimshadygameperiod@gmail.com", name: "Appointment Scheduler" },
        to: [{ email: "inbioz.technology@gmail.com" }],
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
        headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json" }
      }
    );

    console.log("Brevo response:", response.data);
    res.json({ success: true, message: "Appointment booked successfully!" });
  } catch (error) {
    console.error("Error sending email:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send booking email", details: error.response?.data });
  }
});

// Optional: test endpoint
app.get("/", (req, res) => res.send("API is running!"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
