import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Note: In a real production app, you'd use real credentials in .env
      // For this demo, we'll check if credentials exist, otherwise we'll simulate success
      // to avoid crashing the app while still providing the structure.
      
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_PASS;

      if (user && pass) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass }
        });

        await transporter.sendMail({
          from: `"${name}" <${email}>`,
          to: "quinzjoshua@gmail.com",
          subject: `New Contact Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });
      } else {
        console.log("Email credentials not found. Simulating success for:", { name, email, message });
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
