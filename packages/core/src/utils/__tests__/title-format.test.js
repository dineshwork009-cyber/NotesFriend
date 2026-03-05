import { formatTitle } from "../title-format.ts";
import MockDate from "mockdate";
import { test, expect, describe, beforeAll, afterAll } from "vitest";

const templates = {
  $time$: "11:25",
  $date$: "DD-MM-YYYY",
  $day$: "Wed",
  $timestamp$: "DDMMYYYY1125",
  $count$: "1",
  $headline$: "HEADLINE"
};

const cases = [
  ...Object.entries(templates).map(([key, value]) => {
    return [`Note ${key}`, `Note ${value}`];
  })
];

beforeAll(() => {
  MockDate.set("2000-11-22 11:25");
});

afterAll(() => {
  MockDate.reset();
});

describe("pairs should be equal", () => {
  test.each(cases)("%s", (one, two) => {
    expect(
      formatTitle(one, "[DD-MM-YYYY]", "[hh:mm]", "short", "HEADLINE", 0)
    ).toBe(two);
  });
});

describe("day format", () => {
  test("$day$ with long format", () => {
    expect(
      formatTitle(
        "Note $day$",
        "[DD-MM-YYYY]",
        "[hh:mm]",
        "long",
        "HEADLINE",
        0
      )
    ).toBe("Note Wednesday");
  });
  test("$day$ with short format", () => {
    expect(
      formatTitle(
        "Note $day$",
        "[DD-MM-YYYY]",
        "[hh:mm]",
        "short",
        "HEADLINE",
        0
      )
    ).toBe("Note Wed");
  });
});
