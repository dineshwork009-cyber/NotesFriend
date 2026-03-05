import { TestBuilder } from "./utils";

describe("APP LAUNCH AND NAVIGATION", () => {
  it("App should launch successfully & hide welcome screen", async () => {
    await TestBuilder.create().prepare().run();
  });

  it("Basic navigation should work", async () => {
    await TestBuilder.create()
      .prepare()
      .navigate("Favorites")
      .navigate("Reminders")
      .navigate("Monographs")
      .navigate("Trash")
      .openSideMenu()
      .waitAndTapById("sidemenu-settings-icon")
      .wait(500)
      .waitAndTapByText("Settings")
      .isVisibleByText("Settings")
      .pressBack(1)
      .tapById("tab-notebooks")
      .isVisibleByText("No notebooks")
      .tapById("tab-tags")
      .isVisibleByText("No tags")
      .tapById("tab-home")
      .tapByText("Notes")
      .isVisibleByText("Search in Notes")
      .run();
  });
});
