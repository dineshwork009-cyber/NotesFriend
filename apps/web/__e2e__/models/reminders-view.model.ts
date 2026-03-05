import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";
import { BaseViewModel } from "./base-view.model";
import { ReminderItemModel } from "./reminder-item.model";
import { Reminder } from "@notesfriend/core";
import { fillReminderDialog } from "./utils";

export class RemindersViewModel extends BaseViewModel {
  private readonly createButton: Locator;

  constructor(page: Page) {
    super(page, "reminders", "reminders");
    this.createButton = page
      .locator(getTestId("create-reminder-button"))
      .first();
  }

  async createReminder(reminder: Partial<Reminder>) {
    await this.createButton.click();

    await fillReminderDialog(this.page, reminder);
  }

  async createReminderAndWait(reminder: Partial<Reminder>) {
    await this.createReminder(reminder);

    if (reminder.title) await this.waitForItem(reminder.title);
    return await this.findReminder(reminder);
  }

  async findReminder(reminder: Partial<Reminder>) {
    for await (const item of this.iterateItems()) {
      const reminderModel = new ReminderItemModel(item);
      if ((await reminderModel.getTitle()) === reminder.title)
        return reminderModel;
    }
    return undefined;
  }
}
