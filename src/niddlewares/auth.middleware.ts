import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { verifyJwt } from "../utils/jwt";
import { Admin } from "../models/admin.model";

export interface AuthRequest extends Request {
  auth?: {
    _id: Types.ObjectId;
    email: string;
  };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = verifyJwt<{ sub: string; }>(token);

    const admin = await Admin.findById(payload.sub).select('-password __v');

    if (!admin) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.auth = {
      _id: admin._id as Types.ObjectId,
      email: admin.email,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
