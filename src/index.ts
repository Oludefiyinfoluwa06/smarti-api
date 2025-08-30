import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/connectDB";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;
