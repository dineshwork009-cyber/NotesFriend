import { databaseTest } from "../__tests__/utils/index.ts";
import { login } from "./utils.js";
import { test, expect } from "vitest";

test(
  "refresh token concurrently",
  async () =>
    databaseTest().then(async (db) => {
      await expect(login(db)).resolves.not.toThrow();

      const token = await db.tokenManager.getToken();
      expect(token).toBeDefined();

      expect(
        await Promise.all([
          db.tokenManager._refreshToken(true),
          db.tokenManager._refreshToken(true),
          db.tokenManager._refreshToken(true),
          db.tokenManager._refreshToken(true)
        ])
      ).toHaveLength(4);
    }),
  30000
);

test(
  "refresh token using the same refresh_token multiple time",
  async () =>
    databaseTest().then(async (db) => {
      await expect(login(db)).resolves.not.toThrow();

      const token = await db.tokenManager.getToken();
      expect(token).toBeDefined();
      for (let i = 0; i <= 5; ++i) {
        await db.tokenManager._refreshToken(true);
        await db.tokenManager.saveToken(token);
      }
    }),
  30000
);
