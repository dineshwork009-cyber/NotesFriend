import { authenticator } from "otplib";
import { databaseTest } from "../__tests__/utils/index.ts";
import { login, USER } from "./utils.js";
import { test, expect } from "vitest";

// test("signup user and check for token", async () => {
//   const db = new DB(StorageInterface);
//   const usermanager = new UserManager(db);

//   await expect(
//     usermanager.signup(user.email, user.password)
//   ).resolves.not.toThrow();

//   await expect(usermanager.tokenManager.getToken()).resolves.toBeDefined();
// }, 30000);

test(
  "login user and check for token",
  () =>
    databaseTest().then(async (db) => {
      await expect(login(db)).resolves.not.toThrow();

      await expect(db.tokenManager.getToken()).resolves.toBeDefined();
    }),
  30000
);

test(
  "login user and get user data",
  () =>
    databaseTest().then(async (db) => {
      await login(db);

      const userData = await db.user.getUser();
      expect(userData.email).toBe(USER.email);
      expect(userData.subscription).toBeDefined();
    }),
  30000
);

test(
  "login user after entering invalid mfa once",
  () =>
    databaseTest().then(async (db) => {
      await db.user.authenticateEmail(USER.email);

      await expect(
        db.user.authenticateMultiFactorCode(201022, "app")
      ).rejects.toThrowError(
        /Please provide a valid multi-factor authentication/
      );

      const token = authenticator.generate(USER.totpSecret);
      await db.user.authenticateMultiFactorCode(token, "app");

      await expect(
        db.user.authenticatePassword(USER.email, USER.password, USER.hashed)
      ).resolves.toBeFalsy();

      await expect(db.user.tokenManager.getToken()).resolves.toBeDefined();
    }),
  30000
);

test(
  "login user after entering incorrect password once",
  () =>
    databaseTest().then(async (db) => {
      await db.user.authenticateEmail(USER.email);

      const token = authenticator.generate(USER.totpSecret);
      await db.user.authenticateMultiFactorCode(token, "app");

      await expect(
        db.user.authenticatePassword(USER.email, "wrong_password")
      ).rejects.toThrowError(/Password is incorrect./);

      await db.user.authenticatePassword(
        USER.email,
        USER.password,
        USER.hashed
      );

      await expect(db.user.tokenManager.getToken()).resolves.toBeDefined();
    }),
  30000
);

test(
  "login user and logout user",
  () =>
    databaseTest().then(async (db) => {
      await login(db);

      await expect(db.user.logout()).resolves.not.toThrow();
    }),
  30000
);

// test("login user and delete user", async () => {
//   const db = new DB(StorageInterface);
//   const usermanager = new UserManager(db);

//   await usermanager.login(user.email, user.password, user.hashed);

//   await expect(usermanager.deleteUser(user.password)).resolves.toBe(true);
// }, 30000);

// test("login user and get user sessions", async () => {
//   const db = new DB(StorageInterface);
//   const usermanager = new UserManager(db);

//   await usermanager.login(user.email, user.password);

//   await usermanager.getSessions();
// }, 30000);
