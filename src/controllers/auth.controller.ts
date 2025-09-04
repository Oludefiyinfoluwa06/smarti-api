import { Request, Response } from "express";
import { loginAdmin } from "../services/auth.service";

export async function adminLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const result = await loginAdmin(email, password);

  if (!result) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.status(200).json(result);
}
