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

  // Log the incoming request for debugging
  console.log("Received appointment request:", req.body);

  // Validation
  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!age) missingFields.push("age");
  if (!gender) missingFields.push("gender");
  if (!phone) missingFields.push("phone");
  if (!email) missingFields.push("email");
  if (!date) missingFields.push("date");
  if (!address) missingFields.push("address");

  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: "Missing fields", 
      missing: missingFields,
      received: req.body
    });
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
    res.status(200).json({ success: true, message: "Appointment booked successfully!", brevo: response.data });
  } catch (error) {
    console.error("Error sending email:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to send booking email", 
      details: error.response?.data || error.message
    });
  }
});

// Optional: test endpoint
app.get("/", (req, res) => res.send("API is running!"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
