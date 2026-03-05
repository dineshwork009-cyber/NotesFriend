import { hashNavigate } from ".";
import { defineHashRoutes } from "./types";
import {
  AddNotebookDialog,
  EditNotebookDialog
} from "../dialogs/add-notebook-dialog";
import { EmailVerificationDialog } from "../dialogs/email-verification-dialog";
import { SettingsDialog } from "../dialogs/settings";
import { BuyDialog } from "../dialogs/buy-dialog";
import {
  AddReminderDialog,
  EditReminderDialog
} from "../dialogs/add-reminder-dialog";
import { FeatureDialog } from "../dialogs/feature-dialog";
import { CreateTagDialog } from "../dialogs/item-dialog";
import { OnboardingDialog } from "../dialogs/onboarding-dialog";
import { isSectionKey, SectionKeys } from "../dialogs/settings/types";

const hashroutes = defineHashRoutes({
  "/": () => {},
  "/email/verify": () => {
    EmailVerificationDialog.show({}).then(afterAction);
  },
  "/notebooks/create": () => {
    AddNotebookDialog.show({}).then(afterAction);
  },
  "/notebooks/:notebookId/edit": ({ notebookId }) => {
    EditNotebookDialog.show({ notebookId })?.then(afterAction);
  },
  "/reminders/create": () => {
    AddReminderDialog.show({}).then(afterAction);
  },
  "/reminders/:reminderId/edit": ({ reminderId }) => {
    EditReminderDialog.show({ reminderId }).then(afterAction);
  },
  "/tags/create": () => {
    CreateTagDialog.show().then(afterAction);
  },
  "/buy": () => {
    BuyDialog.show({}).then(afterAction);
  },
  "/buy/:code": ({ code }: { code: string }) => {
    BuyDialog.show({ couponCode: code }).then(afterAction);
  },
  "/welcome": () => {
    OnboardingDialog.show({})?.then(afterAction);
  },
  "/confirmed": () => {
    FeatureDialog.show({ featureName: "confirmed" }).then(afterAction);
  },
  "/settings": () => {
    SettingsDialog.show({}).then(afterAction);
  },
  "/settings/:section": ({ section }) => {
    SettingsDialog.show(
      isSectionKey(section) ? { activeSection: section as SectionKeys } : {}
    ).then(afterAction);
  }
});

export default hashroutes;
export type HashRoute = keyof typeof hashroutes;

function afterAction() {
  hashNavigate("/", { replace: true, notify: false });
  if (!history.state.replace) history.back();
}
