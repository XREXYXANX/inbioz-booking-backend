import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Brevo client
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

app.post("/book-appointment", async (req, res) => {
  const { name, age, gender, phone, email, date, address } = req.body;

  try {
    const sendSmtpEmail = {
      sender: { email: process.env.BREVO_EMAIL }, // ✅ must be verified in Brevo
      to: [{ email: "inbioz.technology@gmail.com" }], // ✅ array of objects
      subject: "New InbioZ Appointment",
      textContent: `
        Name: ${name}
        Age: ${age}
        Gender: ${gender}
        Phone: ${phone}
        Email: ${email}
        Date: ${date}
        Address: ${address}
      `,
    };

    await tranEmailApi.sendTransacEmail(sendSmtpEmail);

    res.status(200).json({ message: "Booking email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error.response?.text || error);
    res.status(500).json({ error: "Failed to send booking email" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
