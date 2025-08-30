import { Admin } from "../models/admin.model";
import { comparePassword } from "../utils/hash";
import { signJwt } from "../utils/jwt";

export async function loginAdmin(email: string, password: string) {
  const admin = await Admin.findOne({
    email: email.toLowerCase(),
  });

  if (!admin) {
    return null;
  }

  const ok = await comparePassword(password, admin.password);
  if (!ok) {
    return null;
  }

  const token = signJwt({
    sub: admin._id,
  });

  return {
    token,
    admin: {
      id: admin._id,
      email: admin.email,
    },
  };
}
