import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // for HTTP request to Brevo

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test root route
app.get("/", (req, res) => res.send("API is running!"));

// Book appointment route
app.post("/book-appointment", async (req, res) => {
  const { name, age, gender, phone, email, date, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Brevo HTTP API call
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: "Appointmentscheduler", email: "slimshadygameperiod@gmail.com" },
        to: [{ email: "inbioz.technology@gmail.com" }],
        subject: "New InbioZ Appointment",
        htmlContent: `
          <p>Name: ${name}</p>
          <p>Age: ${age}</p>
          <p>Gender: ${gender}</p>
          <p>Phone: ${phone}</p>
          <p>Email: ${email}</p>
          <p>Date: ${date}</p>
          <p>Address: ${address}</p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json({ message: "Booking email sent successfully!", brevoResponse: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send booking email" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
