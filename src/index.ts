import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/connectDB";
import authRouter from "./routes/auth.route";
import orderRouter from "./routes/orders.route";
import newsLetterRouter from "./routes/newsletter.route";
import newsLetterSubscriptionRouter from "./routes/newsletter-subscription.route";
import coursesRouter from "./routes/courses.route";
import uploadsRouter from "./routes/uploads.route";
import paymentsRouter from "./routes/payments.route";
import enrollmentsRouter from "./routes/enrollments.route";

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
app.use('/api/courses', coursesRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/enrollments', enrollmentsRouter);

export default app;
