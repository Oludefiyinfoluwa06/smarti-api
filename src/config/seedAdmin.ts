import { Admin } from "../models/admin.model";
import { hashPassword } from "../utils/hash";

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const existing = await Admin.findOne({ email }).lean();
  if (existing) {
    return;
  }

  const hashed = await hashPassword(`${password}`);

  const admin = new Admin({
    email,
    password: hashed,
  });

  await admin.save();
}
