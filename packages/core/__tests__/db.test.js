import Constants from "../src/utils/constants.ts";
import { test, expect } from "vitest";
import { databaseTest } from "./utils/index.ts";

test("db.host should change HOST", () =>
  databaseTest().then((db) => {
    db.host({ API_HOST: "hello world" });
    expect(Constants.API_HOST).toBe("hello world");
  }));
