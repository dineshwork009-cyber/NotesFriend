import { authenticator } from "otplib";

export const USER = {
  email: process.env.USER_EMAIL,
  password: process.env.USER_PASSWORD,
  hashed: process.env.USER_HASHED_PASSWORD,
  totpSecret: process.env.USER_TOTP_SECRET
};

export async function login(db, user = USER) {
  await db.user.authenticateEmail(user.email);

  const token = authenticator.generate(user.totpSecret);
  await db.user.authenticateMultiFactorCode(token, "app");

  await db.user.authenticatePassword(user.email, user.password, user.hashed);
}

export async function logout(db) {
  await db.user.logout(true);
}
