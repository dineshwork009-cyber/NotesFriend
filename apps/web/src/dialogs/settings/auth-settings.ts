import { SettingsGroup } from "./types";
import { useStore as useUserStore } from "../../stores/user-store";
import { createBackup, verifyAccount } from "../../common";
import { showPasswordDialog } from "../../dialogs/password-dialog";
import { db } from "../../common/db";
import { showToast } from "../../utils/toast";
import { RecoveryCodesDialog } from "../mfa/recovery-code-dialog";
import { MultifactorDialog } from "../mfa/multi-factor-dialog";
import { RecoveryKeyDialog } from "../recovery-key-dialog";
import { strings } from "@notesfriend/intl";
import { ConfirmDialog } from "../confirm";

export const AuthenticationSettings: SettingsGroup[] = [
  {
    header: strings.password(),
    key: "password",
    section: "auth",
    settings: [
      {
        key: "change-password",
        title: strings.changePassword(),
        description: strings.changePassword(),
        keywords: [strings.changePassword(), strings.newPassword()],
        components: [
          {
            type: "button",
            title: strings.changePassword(),
            variant: "secondary",
            action: async () => {
              ConfirmDialog.show({
                title: "Password changing has been disabled temporarily",
                message:
                  "Password changing has been disabled temporarily to address some issues faced by users. It will be enabled again once the issues have resolved.",
                positiveButtonText: "Ok"
              });
              return;
              // const result = await showPasswordDialog({
              //   title: strings.changePassword(),
              //   message: strings.changePasswordDesc(),
              //   inputs: {
              //     oldPassword: {
              //       label: strings.oldPassword(),
              //       autoComplete: "current-password"
              //     },
              //     newPassword: {
              //       label: strings.newPassword(),
              //       autoComplete: "new-password"
              //     }
              //   },
              //   validate: async ({ oldPassword, newPassword }) => {
              //     if (!(await createBackup())) return false;
              //     await db.user.clearSessions();
              //     return (
              //       (await db.user.changePassword(oldPassword, newPassword)) ||
              //       false
              //     );
              //   }
              // });
              // if (result) {
              //   showToast("success", strings.passwordChangedSuccessfully());
              //   await RecoveryKeyDialog.show({});
              // }
            }
          }
        ]
      }
    ]
  },
  {
    header: strings.twoFactorAuth(),
    key: "2fa",
    section: "auth",
    settings: [
      {
        key: "2fa-enabled",
        title: strings.twoFactorAuthEnabled(),
        description: strings.accountIsSecure(),
        keywords: [],
        components: []
      },
      {
        key: "primary-2fa-method",
        title: strings.change2faMethod(),
        keywords: ["primary 2fa method"],
        description: strings.twoFactorAuthDesc(),
        onStateChange: (listener) =>
          useUserStore.subscribe((s) => s.user?.mfa.primaryMethod, listener),
        components: [
          {
            type: "button",
            title: strings.change(),
            action: async () => {
              if (await verifyAccount()) {
                await MultifactorDialog.show({});
                await useUserStore.getState().refreshUser();
              }
            },
            variant: "secondary"
          }
        ]
      },
      {
        key: "fallback-2fa-method",
        title: strings.addFallback2faMethod(),
        description: strings.addFallback2faMethodDesc(),
        keywords: ["backup 2fa methods"],
        onStateChange: (listener) =>
          useUserStore.subscribe((s) => s.user?.mfa.secondaryMethod, listener),
        components: () => [
          {
            type: "button",
            title: useUserStore.getState().user?.mfa.secondaryMethod
              ? strings.change2faFallbackMethod()
              : strings.addFallback2faMethod(),
            variant: "secondary",
            action: async () => {
              if (await verifyAccount()) {
                await MultifactorDialog.show({
                  primaryMethod:
                    useUserStore.getState().user?.mfa.primaryMethod || "email"
                });
                await useUserStore.getState().refreshUser();
              }
            }
          }
        ]
      },
      {
        key: "recovery-codes",
        title: strings.viewRecoveryCodes(),
        description: strings.viewRecoveryCodesDesc(),
        keywords: ["recovery codes"],
        components: [
          {
            type: "button",
            title: strings.viewRecoveryCodes(),
            variant: "secondary",
            action: async () => {
              if (await verifyAccount()) {
                await RecoveryCodesDialog.show({
                  primaryMethod:
                    useUserStore.getState().user?.mfa.primaryMethod || "email"
                });
                await useUserStore.getState().refreshUser();
              }
            }
          }
        ]
      }
    ]
  }
];
