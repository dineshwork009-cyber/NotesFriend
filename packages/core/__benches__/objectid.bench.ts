import { bench, describe } from "vitest";
import { createObjectId } from "../src/utils/object-id.js";
import boid from "bson-objectid";
import { nanoid } from "nanoid";

describe("objectid", async () => {
  bench("custom", () => {
    createObjectId();
  });

  bench("bson-objectid", () => {
    boid().toHexString();
  });

  bench("nanoid", () => {
    nanoid(24);
  });
});
