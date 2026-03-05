import { set } from "../set.ts";
import { test, expect } from "vitest";

test("union", () => {
  expect(set.union([1, 2, 2], [2, 3])).toStrictEqual([1, 2, 3]);
});

test("intersection", () => {
  expect(set.intersection([1, 1, 2], [2, 2, 3])).toStrictEqual([2]);
});

test("difference", () => {
  expect(set.difference([1, 1, 2], [2, 3, 3])).toStrictEqual([1, 3]);
});

test("complement", () => {
  expect(set.complement([2, 2, 4], [2, 2, 3])).toStrictEqual([4]);
});

test("equals", () => {
  expect(set.equals([1, 1, 2], [1, 1, 2])).toBe(true);
});

test("not equals", () => {
  expect(set.equals([1, 1, 2], [1, 5, 2])).toBe(false);
});
