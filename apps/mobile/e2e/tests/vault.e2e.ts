import { expect } from "detox";
import { notesfriend } from "../test.ids";
import { TestBuilder, Tests } from "./utils";

async function lockNote() {
  await TestBuilder.create()
    .waitAndTapById(notesfriend.listitem.menu)
    .wait()
    .waitAndTapById("icon-lock-unlock")
    .wait()
    .isVisibleByText("Lock")
    .typeTextById(notesfriend.ids.dialogs.vault.pwd, "1234")
    .typeTextById(notesfriend.ids.dialogs.vault.pwdAlt, "1234")
    .waitAndTapByText("Lock")
    .isVisibleById("note-locked-icon")
    .run();
}

async function removeFromVault() {
  await TestBuilder.create()
    .waitAndTapById(notesfriend.listitem.menu)
    .wait()
    .waitAndTapById("icon-lock-unlock")
    .wait()
    .typeTextById(notesfriend.ids.dialogs.vault.pwd, "1234")
    .waitAndTapByText("Unlock")
    .isNotVisibleById("note-locked-icon")
    .run();
}

async function openLockedNote(pwd = "1234") {
  await TestBuilder.create()
    .waitAndTapById(notesfriend.ids.note.get(0))
    .wait()
    .addStep(async () => {
      await web().element(by.web.name("password")).typeText(pwd, false);
      await web().element(by.web.className("unlock-note")).tap();
      await Tests.sleep(500);
      await expect(
        web().element(by.web.className("unlock-note"))
      ).not.toExist();
    })
    .run();
}

async function goToPrivacySecuritySettings() {
  await TestBuilder.create()
    .openSideMenu()
    .waitAndTapById("sidemenu-settings-icon")
    .wait()
    .waitAndTapByText("Settings")
    .waitAndTapByText("Vault")
    .run();
}

describe("VAULT", () => {
  it("Create vault from settings", async () => {
    await TestBuilder.create()
      .prepare()
      .addStep(goToPrivacySecuritySettings)
      .waitAndTapByText("Create vault")
      .typeTextById(notesfriend.ids.dialogs.vault.pwd, "1234")
      .typeTextById(notesfriend.ids.dialogs.vault.pwdAlt, "1234")
      .waitAndTapByText("Create")
      .isVisibleByText("Clear vault")
      .run();
  });

  it("Change vault password", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .addStep(lockNote)
      .addStep(goToPrivacySecuritySettings)
      .waitAndTapByText("Change vault password")
      .typeTextById(notesfriend.ids.dialogs.vault.pwd, "1234")
      .typeTextById(notesfriend.ids.dialogs.vault.changePwd, "2362")
      .waitAndTapByText("Change")
      .pressBack(3)
      .addStep(async () => await openLockedNote("2362"))
      .run();
  });

  it("Delete vault", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .addStep(lockNote)
      .addStep(goToPrivacySecuritySettings)
      .waitAndTapByText("Delete vault")
      .typeTextById(notesfriend.ids.dialogs.vault.pwd, "1234")
      .waitAndTapByText("Delete")
      .isVisibleByText("Create vault")
      .pressBack(3)
      .isVisibleById(notesfriend.listitem.menu)
      .run();
  });

  it("Delete vault with locked notes", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .addStep(lockNote)
      .addStep(goToPrivacySecuritySettings)
      .waitAndTapByText("Delete vault")
      .typeTextById(notesfriend.ids.dialogs.vault.pwd, "1234")
      .waitAndTapByText("Delete notes in this vault")
      .waitAndTapByText("Delete")
      .isVisibleByText("Create vault")
      .pressBack(3)
      .isNotVisibleById(notesfriend.listitem.menu)
      .run();
  });

  it("Add a note to vault", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .addStep(lockNote)
      .addStep(openLockedNote)
      .run();
  });

  it("Remove note from vault", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .addStep(lockNote)
      .addStep(removeFromVault)
      .run();
  });
});
