import { strings } from "@notesfriend/intl";
import { db } from "../../common/database";
import { validateAppLockPassword } from "../../common/database/encryption";
import { presentDialog } from "../../components/dialog/functions";
import BiometricService from "../../services/biometrics";
import { ToastManager } from "../../services/event-manager";
import SettingsService from "../../services/settings";
import { useUserStore } from "../../stores/use-user-store";
import { sleep } from "../../utils/time";

export async function verifyUser(
  context,
  onsuccess,
  disableBackdropClosing,
  onclose,
  closeText
) {
  presentDialog({
    context: context,
    title: strings.verifyItsYou(),
    input: true,
    inputPlaceholder: strings.enterPassword(),
    paragraph: strings.enterPasswordDesc(),
    positiveText: strings.verify(),
    secureTextEntry: true,
    disableBackdropClosing: disableBackdropClosing,
    onClose: onclose,
    negativeText: closeText || strings.cancel(),
    positivePress: async (value) => {
      try {
        const user = await db.user.getUser();
        let verified = !user ? true : await db.user.verifyPassword(value);
        if (verified) {
          sleep(300).then(async () => {
            await onsuccess();
          });
        } else {
          ToastManager.show({
            heading: strings.passwordIncorrect(),
            type: "error",
            context: "global"
          });
          return false;
        }
      } catch (e) {
        ToastManager.show({
          heading: strings.verifyFailed(),
          message: e.message,
          type: "error",
          context: "global"
        });
        return false;
      }
    }
  });
}

export async function verifyUserWithApplock() {
  const keyboardType = SettingsService.getProperty("applockKeyboardType");
  return new Promise((resolve) => {
    if (SettingsService.getProperty("appLockHasPasswordSecurity")) {
      presentDialog({
        title: strings.verifyItsYou(),
        input: true,
        inputPlaceholder:
          keyboardType == "numeric"
            ? strings.enterApplockPin()
            : strings.enterApplockPassword(),
        paragraph:
          keyboardType == "numeric"
            ? strings.enterApplockPinDesc()
            : strings.enterApplockPasswordDesc(),
        positiveText: strings.verify(),
        secureTextEntry: true,
        negativeText: strings.cancel(),
        keyboardType: keyboardType,
        positivePress: async (value) => {
          try {
            const verified = await validateAppLockPassword(value);
            if (!verified) {
              ToastManager.show({
                heading: strings.invalid(
                  keyboardType === "numeric" ? "pin" : "password"
                ),
                type: "error",
                context: "local"
              });
              return false;
            }
            resolve(verified);
          } catch (e) {
            resolve(false);
            return false;
          }
          return true;
        }
      });
    } else {
      BiometricService.isBiometryAvailable().then((available) => {
        if (available) {
          BiometricService.validateUser(strings.verifyItsYou()).then(
            (verified) => {
              resolve(verified);
            }
          );
        } else if (useUserStore.getState().user) {
          let verified = false;
          verifyUser(
            null,
            () => {
              resolve(true);
            },
            false,
            () => {
              resolve(verified);
            }
          );
        } else {
          resolve(true);
        }
      });
    }
  });
}
