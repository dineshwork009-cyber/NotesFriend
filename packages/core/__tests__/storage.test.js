import { NodeStorageInterface } from "../__mocks__/node-storage.mock.ts";
import { test, expect } from "vitest";

test("add a value", async () => {
  const storage = new NodeStorageInterface();
  await storage.write("hello", "world");

  let value = await storage.read("hello");

  expect(value).toBe("world");
});

test("remove", async () => {
  const storage = new NodeStorageInterface();
  await storage.write("hello", "world");
  await storage.remove("hello");

  let value = await storage.read("hello");

  expect(value).toBeUndefined();
});

test("clear", async () => {
  const storage = new NodeStorageInterface();
  await storage.write("hello", "world");
  storage.clear();

  let value = await storage.read("hello");

  expect(value).toBeUndefined();
});
