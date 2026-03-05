import { notesfriend } from "../test.ids";
import { TestBuilder } from "./utils";

describe("Tags", () => {
  it("Create a tag", async () => {
    await TestBuilder.create()
      .prepare()
      .openSideMenu()
      .waitAndTapById("tab-tags")
      .isVisibleByText("No tags")
      .waitAndTapById("sidebar-add-button")
      .typeTextById("input-value", "testtag")
      .waitAndTapByText("Add")
      .isVisibleByText("testtag")
      .run();
  });

  it("Tag a note", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .saveResult()
      .waitAndTapById(notesfriend.listitem.menu)
      .wait(500)
      .waitAndTapByText("Add tag")
      .typeTextById("tag-input", "testtag")
      .waitAndTapByText('Add "#testtag"')
      .isVisibleByText("#testtag")
      .pressBack(2)
      .openSideMenu()
      .waitAndTapById("tab-tags")
      .waitAndTapByText("#testtag")
      .processResult(async (note) => {
        await TestBuilder.create().isVisibleByText(note.body).run();
      })
      .run();
  });

  it("Untag a note", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .waitAndTapById(notesfriend.listitem.menu)
      .wait(500)
      .waitAndTapByText("Add tag")
      .typeTextById("tag-input", "testtag")
      .waitAndTapByText('Add "#testtag"')
      .isVisibleByText("#testtag")
      .waitAndTapByText("#testtag")
      .pressBack(2)
      .isNotVisibleByText("#testtag")
      .run();
  });

  it("Create shortcut of a tag", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .waitAndTapById(notesfriend.listitem.menu)
      .wait(500)
      .waitAndTapByText("Add tag")
      .typeTextById("tag-input", "testtag")
      .waitAndTapByText('Add "#testtag"')
      .isVisibleByText("#testtag")
      .pressBack(2)
      .openSideMenu()
      .waitAndTapById("tab-tags")
      .longPressByText("testtag")
      .wait(500)
      .waitAndTapByText("Add shortcut")
      .waitAndTapById("tab-home")
      .isVisibleByText("testtag")
      .run();
  });

  it("Rename a tag", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .waitAndTapById(notesfriend.listitem.menu)
      .wait(500)
      .waitAndTapByText("Add tag")
      .typeTextById("tag-input", "testtag")
      .waitAndTapByText('Add "#testtag"')
      .isVisibleByText("#testtag")
      .pressBack(2)
      .openSideMenu()
      .waitAndTapById("tab-tags")
      .longPressByText("testtag")
      .wait(500)
      .waitAndTapByText("Rename")
      .wait(100)
      .clearTextById("input-value")
      .typeTextById("input-value", "testtag_edited")
      .waitAndTapByText("Save")
      .isVisibleByText("testtag_edited")
      .run();
  });
});
