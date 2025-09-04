import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import { connectDB } from "./config/connectDB";
import authRouter from "./routes/auth.route";
import orderRouter from "./routes/orders.route";
import newsLetterRouter from "./routes/newsletter.route";
import newsLetterSubscriptionRouter from "./routes/newsletter-subscription.route";

const PORT = process.env.PORT;

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);
app.use('/api/newsletter', newsLetterRouter);
app.use('/api/newsletter/subscription', newsLetterSubscriptionRouter);

export default serverless(app);
