import { strings } from "@notesfriend/intl";
import { db } from "../common/database";
import { presentDialog } from "../components/dialog/functions";
import BiometricService from "../services/biometrics";
import { ToastManager } from "../services/event-manager";
import { useSettingStore } from "../stores/use-setting-store";

let unlockPromise: Promise<any> | undefined = undefined;
export async function unlockVault({
  context,
  title,
  paragraph,
  requirePassword
}: {
  context?: string;
  title: string;
  paragraph: string;
  requirePassword?: boolean;
}) {
  if (unlockPromise) {
    return unlockPromise;
  }
  unlockPromise = new Promise(async (resolve) => {
    const result = await (async () => {
      if (db.vault.unlocked && !requirePassword) return true;
      const biometry = await BiometricService.isBiometryAvailable();
      const fingerprint = await BiometricService.hasInternetCredentials();
      if (biometry && fingerprint) {
        const credentials = await BiometricService.getCredentials(
          title,
          paragraph
        );
        if (credentials) {
          return db.vault.unlock(credentials.password);
        }
      }
      useSettingStore.getState().setSheetKeyboardHandler(false);
      return new Promise((resolve) => {
        setImmediate(() => {
          presentDialog({
            context: context,
            input: true,
            secureTextEntry: true,
            positiveText: strings.unlock(),
            title: title,
            paragraph: paragraph,
            inputPlaceholder: strings.enterPassword(),
            positivePress: async (value) => {
              const unlocked = await db.vault.unlock(value);
              if (!unlocked) {
                ToastManager.show({
                  heading: strings.passwordIncorrect(),
                  type: "error",
                  context: "local"
                });
                return false;
              }
              resolve(unlocked);
              useSettingStore.getState().setSheetKeyboardHandler(true);
              return true;
            },
            onClose: () => {
              resolve(false);
              useSettingStore.getState().setSheetKeyboardHandler(true);
            }
          });
        });
      });
    })();
    unlockPromise = undefined;
    resolve(result);
  });
  return unlockPromise;
}
