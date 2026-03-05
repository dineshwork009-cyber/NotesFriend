import { SettingsGroup } from "./types";
import { useStore as useAppStore } from "../../stores/app-store";
import { useStore as useNotesStore } from "../../stores/note-store";
import Vault from "../../common/vault";
import { showToast } from "../../utils/toast";
import { db } from "../../common/db";
import { strings } from "@notesfriend/intl";

export const VaultSettings: SettingsGroup[] = [
  {
    key: "vault",
    section: "vault",
    header: strings.vault(),
    settings: [
      {
        key: "create-vault",
        title: strings.createVault(),
        isHidden: () => useAppStore.getState().isVaultCreated,
        onStateChange: (listener) =>
          useAppStore.subscribe((s) => s.isVaultCreated, listener),
        components: [
          {
            type: "button",
            title: strings.create(),
            action: () => {
              Vault.createVault().then((res) => {
                useAppStore.getState().setIsVaultCreated(res);
              });
            },
            variant: "secondary"
          }
        ]
      },
      {
        key: "change-vault-password",
        title: strings.changeVaultPassword(),
        description: strings.changeVaultPasswordDesc(),
        isHidden: () => !useAppStore.getState().isVaultCreated,
        onStateChange: (listener) =>
          useAppStore.subscribe((s) => s.isVaultCreated, listener),
        components: [
          {
            type: "button",
            title: strings.change(),
            action: () => Vault.changeVaultPassword(),
            variant: "secondary"
          }
        ]
      },
      {
        key: "clear-vault",
        title: strings.clearVault(),
        description: strings.clearVaultDesc(),
        isHidden: () => !useAppStore.getState().isVaultCreated,
        onStateChange: (listener) =>
          useAppStore.subscribe((s) => s.isVaultCreated, listener),
        components: [
          {
            type: "button",
            title: strings.clear(),
            action: async () => {
              if (await Vault.clearVault()) {
                useNotesStore.getState().refresh();
                showToast("success", strings.vaultCleared());
              }
            },
            variant: "errorSecondary"
          }
        ]
      },
      {
        key: "delete-vault",
        title: strings.deleteVault(),
        description: strings.deleteVaultDesc(),
        isHidden: () => !useAppStore.getState().isVaultCreated,
        onStateChange: (listener) =>
          useAppStore.subscribe((s) => s.isVaultCreated, listener),
        components: [
          {
            type: "button",
            title: strings.delete(),
            action: async () => {
              if ((await Vault.deleteVault()) && !(await db.vault.exists())) {
                useAppStore.getState().setIsVaultCreated(false);
                await useAppStore.getState().refresh();
                showToast("success", strings.vaultDeleted());
              }
            },
            variant: "errorSecondary"
          }
        ]
      }
    ]
  }
];
