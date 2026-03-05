import { authenticator } from "otplib";
import { TestBuilder } from "./utils";

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, ".env.local") });

const USER = {
  login: {
    email: process.env.USER_EMAIL,
    password: process.env.CURRENT_USER_PASSWORD,
    key: process.env.CURRENT_USER_KEY,
    totpSecret: process.env.USER_TOTP_SECRET
  }
};

// async function deleteAccount() {
//   await tapByText("Account Settings");
//   await sleep(2000);
//   await tapByText("Delete account");
//   await elementById("input-value").typeText(USER.password);
//   await tapByText("Delete");
//   await sleep(5000);
// }

// async function signup() {
//   await tapByText("Login to sync your notes.");
//   await sleep(500);
//   await tapByText("Don't have an account? Sign up");
//   await elementById("input.email").typeText(USER.signup.email);
//   await elementById("input.password").typeText(USER.signup.password);
//   await elementById("input.confirmPassword").typeText(USER.signup.password);
//   await elementById("input.confirmPassword").tapReturnKey();
// }

async function login() {
  await TestBuilder.create()
    .waitAndTapByText("Login to encrypt and sync notes")
    .typeTextById("input.email", USER.login.email!)
    .tapReturnKeyById("input.email")
    .wait(3000)
    .typeTextById("input.totp", authenticator.generate(USER.login.totpSecret!))
    .waitAndTapByText("Next")
    .wait(3000)
    .typeTextById("input.password", USER.login.password!)
    .tapReturnKeyById("input.password")
    .run();
}

describe("AUTH", () => {
  it("Login", async () => {
    await TestBuilder.create()
      .prepare()
      .addStep(login)
      .wait(3000)
      .isNotVisibleByText("Notesfriend Plans")
      .run();
  });
});
