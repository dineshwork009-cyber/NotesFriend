import { HealthCheck, check } from "../healthcheck.js";
import { describe } from "vitest";

describe.concurrent("Health check", (test) => {
  test("Auth", async (t) => {
    const result = await HealthCheck.auth();
    t.expect(result).toBe(true);
  });

  test("Healthy host", async (t) => {
    const host = "https://api.notesfriend.com";
    const result = await check(host);
    t.expect(result).toBe(true);
  });

  test("Unhealthy host", async (t) => {
    const host = "https://example.com";
    // Simulate an error by passing an invalid host
    const result = await check(host);
    t.expect(result).toBe(false);
  });
});
