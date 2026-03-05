import { fuzzy } from "../fuzzy.js";
import { test, expect, describe } from "vitest";

describe("lookup.fuzzy", () => {
  test("should sort items by score", () => {
    const items = [
      {
        id: "1",
        title: "system"
      },
      {
        id: "2",
        title: "hello"
      },
      {
        id: "3",
        title: "items"
      }
    ];
    const query = "ems";
    expect(fuzzy(query, items, (item) => item.id, { title: 1 })).toStrictEqual([
      items[2]
    ]);
  });
  describe("opts.prefix", () => {
    test("should prefix matched field with provided value when given", () => {
      const items = [
        {
          id: "1",
          title: "hello"
        },
        {
          id: "2",
          title: "world"
        }
      ];
      const query = "d";
      expect(
        fuzzy(
          query,
          items,
          (item) => item.id,
          { title: 1 },
          {
            prefix: "prefix-"
          }
        )
      ).toStrictEqual([{ id: "2", title: "worlprefix-d" }]);
    });
  });
  describe("opt.suffix", () => {
    test("should suffix matched field with provided value when given", () => {
      const items = [
        {
          id: "1",
          title: "hello"
        },
        {
          id: "2",
          title: "world"
        }
      ];
      const query = "llo";
      expect(
        fuzzy(
          query,
          items,
          (item) => item.id,
          { title: 1 },
          {
            suffix: "-suffix"
          }
        )
      ).toStrictEqual([{ id: "1", title: "hello-suffix" }]);
    });
  });
});
