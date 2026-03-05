import { db } from "./db";
import { showPasswordDialog } from "../dialogs/password-dialog";
import { showToast } from "../utils/toast";
import { VAULT_ERRORS } from "@notesfriend/core";
import { strings } from "@notesfriend/intl";

class Vault {
  static async createVault() {
    if (await db.vault.exists()) return false;
    return showPasswordDialog({
      title: strings.createVault(),
      subtitle: strings.createVaultDesc(),
      inputs: {
        password: { label: strings.password(), autoComplete: "new-password" }
      },
      validate: async ({ password }) => {
        await db.vault.create(password);
        showToast("success", strings.vaultCreated());
        return true;
      }
    });
  }

  static async clearVault() {
    if (!(await db.vault.exists())) return false;

    return showPasswordDialog({
      title: strings.clearVault(),
      subtitle: strings.clearVaultDesc(),
      inputs: {
        password: {
          label: strings.password(),
          autoComplete: "current-password"
        }
      },
      validate: async ({ password }) => {
        await db.vault.clear(password);
        return true;
      }
    });
  }

  static async deleteVault() {
    if (!(await db.vault.exists())) return false;
    const result = await showPasswordDialog({
      title: strings.deleteVault(),
      subtitle: strings.deleteVaultDesc(),
      inputs: {
        password: {
          label: strings.accountPassword(),
          autoComplete: "current-password"
        }
      },
      checks: {
        deleteAllLockedNotes: {
          text: strings.deleteAllNotes(),
          default: false
        }
      },
      validate: ({ password }) => {
        return db.user.verifyPassword(password);
      }
    });
    if (result) {
      await db.vault.delete(result.deleteAllLockedNotes);
      return true;
    }
    return false;
  }

  static unlockVault() {
    return showPasswordDialog({
      title: strings.unlockVault(),
      subtitle: strings.unlockVaultDesc(),
      inputs: {
        password: {
          label: strings.password(),
          autoComplete: "current-password"
        }
      },
      validate: ({ password }) => {
        return db.vault.unlock(password).catch(() => false);
      }
    });
  }

  static changeVaultPassword() {
    return showPasswordDialog({
      title: strings.changeVaultPassword(),
      subtitle: strings.changeVaultPasswordDesc(),
      inputs: {
        oldPassword: {
          label: strings.oldPassword(),
          autoComplete: "current-password"
        },
        newPassword: {
          label: strings.newPassword(),
          autoComplete: "new-password"
        }
      },
      validate: async ({ oldPassword, newPassword }) => {
        await db.vault.changePassword(oldPassword, newPassword);
        showToast("success", strings.passwordChangedSuccessfully());
        return true;
      }
    });
  }

  static unlockNote(id: string) {
    return showPasswordDialog({
      title: strings.unlockNote(),
      subtitle: strings.unlockNoteDesc(),
      inputs: {
        password: {
          label: strings.password(),
          autoComplete: "current-password"
        }
      },
      validate: async ({ password }) => {
        return db.vault
          .remove(id, password)
          .then(() => true)
          .catch((e) => {
            console.error(e);
            return false;
          });
      }
    });
  }

  static lockNote(id: string): Promise<boolean> {
    return db.vault
      .add(id)
      .then(() => true)
      .catch(({ message }) => {
        switch (message) {
          case VAULT_ERRORS.noVault:
            return Vault.createVault().then((result) =>
              result ? Vault.lockNote(id) : false
            );
          case VAULT_ERRORS.vaultLocked:
            return Vault.unlockVault().then((result) =>
              result ? Vault.lockNote(id) : false
            );
          default:
            showToast("error", message);
            console.error(message);
            return false;
        }
      });
  }

  static askPassword(action: (password: string) => Promise<boolean>) {
    return showPasswordDialog({
      title: strings.unlockVault(),
      subtitle: strings.unlockVaultDesc(),
      inputs: {
        password: {
          label: strings.password(),
          autoComplete: "current-password"
        }
      },
      validate: async ({ password }) => {
        return action(password);
      }
    });
  }

  static async lockVault() {
    await db.vault.lock();
    showToast("success", strings.vaultLocked());
  }
}
export default Vault;
