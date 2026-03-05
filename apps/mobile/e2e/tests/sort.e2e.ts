import { notesfriend } from "../test.ids";
import { TestBuilder } from "./utils";

describe("Sort & filter", () => {
  it.only("Sort by date-edited/date-created", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote("Note 1", "Note 1")
      .createNote("Note 2", "Note 2")
      .waitAndTapByText("Note 1")
      .addStep(async () => {
        const webview = web();
        await webview.element(by.web.className("ProseMirror")).tap();
        await webview
          .element(by.web.className("ProseMirror"))
          .typeText("Edited ", true);
      })
      .pressBack(1)
      .waitAndTapById("icon-sort")
      .wait(500)
      .waitAndTapByText("Date created")
      .pressBack()
      .waitAndTapById(notesfriend.listitem.menu)
      .pressBack()
      .waitAndTapById("icon-sort")
      .wait(500)
      .waitAndTapByText("Date edited")
      .pressBack()
      .waitAndTapById(notesfriend.listitem.menu)
      .run();
  });

  it("Disable grouping", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote("Note 1", "Note 1")
      .waitAndTapById("icon-sort")
      .wait(500)
      .waitAndTapByText("None")
      .pressBack()
      .isVisibleByText("ALL")
      .run();
  });

  it("Group by Abc", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote("Note 1", "Note 1")
      .waitAndTapById("icon-sort")
      .wait(500)
      .waitAndTapByText("Abc")
      .pressBack()
      .isVisibleByText("N")
      .run();
  });

  it("Group by Year", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote("Note 1", "Note 1")
      .waitAndTapById("icon-sort")
      .wait(500)
      .waitAndTapByText("Year")
      .run();
  });

  it("Group by Week", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote("Note 1", "Note 1")
      .waitAndTapById("icon-sort")
      .wait(500)
      .waitAndTapByText("Week")
      .run();
  });

  it("Group by Month", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote("Note 1", "Note 1")
      .waitAndTapById("icon-sort")
      .wait(500)
      .waitAndTapByText("Month")
      .run();
  });

  it("Compact mode", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote("Note 1", "Note 1")
      .waitAndTapById("icon-compact-mode")
      .isNotVisibleByText("Note 1")
      .waitAndTapById("icon-compact-mode")
      .isVisibleByText("Note 1")
      .run();
  });
});
