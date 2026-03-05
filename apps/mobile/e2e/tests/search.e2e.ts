import { TestBuilder } from "./utils";

describe("Search", () => {
  it("Search for a note", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .waitAndTapById("search-header")
      .typeTextById("search-input", "Test")
      .wait(1000)
      .isVisibleByText("1")
      .waitAndTapById("clear-search")
      .wait(2000)
      .isNotVisibleByText("1")
      .run();
  });
});
