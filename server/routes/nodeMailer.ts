// nodemailer route
import express from "express";

import { emailSender, transporter } from "../common/transporter";

// Props: html template (from react-html-email), to (email address of admins),
interface EmailRequest {
  to: string;
  html: string;
}

const emailRouter = express.Router();
emailRouter.use(express.json());

// POST /nodemailer/send
emailRouter.post("/send", async (req, res) => {
  try {
    // Get the email
    const { to, html } = req.body as EmailRequest;
    // send the email to the admins
    await transporter.sendMail({
      from: emailSender,
      to: to,
      subject: "New Account Created: User is Waiting for Approval",
      html: html,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default emailRouter;
