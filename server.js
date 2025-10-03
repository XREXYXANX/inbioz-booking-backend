import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/book-appointment", async (req, res) => {
  console.log("Incoming request body:", req.body);

  const { name, age, gender, phone, email, date, address } = req.body;

  // Validate all fields
  const missing = [];
  if (!name) missing.push("name");
  if (!age) missing.push("age");
  if (!gender) missing.push("gender");
  if (!phone) missing.push("phone");
  if (!email) missing.push("email");
  if (!date) missing.push("date");
  if (!address) missing.push("address");

  if (missing.length > 0) {
    console.log("Missing fields:", missing);
    return res.status(400).json({ error: "Missing fields", missing });
  }

  try {
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
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Brevo response:", response.data);
    res.status(200).json({ success: true, brevoResponse: response.data });
  } catch (err) {
    console.error("Brevo error:", err.response?.data || err.message);
    res.status(500).json({ error: "Brevo API error", details: err.response?.data || err.message });
  }
});

app.get("/", (req, res) => res.send("API is running!"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
