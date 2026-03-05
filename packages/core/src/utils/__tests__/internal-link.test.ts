import { describe, expect, it } from "vitest";
import { parseInternalLink } from "../internal-link";

describe("parseInternalLink", () => {
  const invalidInternalLinks = [
    "",
    "invalid-url",
    "http://google.com",
    "https://google.com"
  ];
  invalidInternalLinks.forEach((url) => {
    it(`should return undefined when not internal link: ${url}`, () => {
      expect(parseInternalLink(url)).toBeUndefined();
    });
  });
  const validInternalLinks = [
    {
      url: "nn://note/123",
      expected: { type: "note", id: "123", params: {} }
    },
    {
      url: "nn://note/123?blockId=456",
      expected: { type: "note", id: "123", params: { blockId: "456" } }
    }
  ];
  validInternalLinks.forEach(({ url, expected }) => {
    it(`should parse internal link: ${url}`, () => {
      expect(parseInternalLink(url)).toEqual(expected);
    });
  });
});
