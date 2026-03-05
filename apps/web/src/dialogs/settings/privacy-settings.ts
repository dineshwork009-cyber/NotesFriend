import { SettingsGroup } from "./types";
import { useStore as useSettingStore } from "../../stores/setting-store";
import { useStore as useUserStore } from "../../stores/user-store";
import { getPlatform } from "../../utils/platform";
import { db } from "../../common/db";
import Config from "../../utils/config";
import { showToast } from "../../utils/toast";
import { PromptDialog } from "../prompt";
import { strings } from "@notesfriend/intl";

export const PrivacySettings: SettingsGroup[] = [
  {
    key: "general",
    section: "privacy",
    header: strings.general(),
    settings: [
      {
        key: "marketing",
        title: strings.marketingEmails(),
        description: strings.marketingEmailsDesc(),
        onStateChange: (listener) =>
          useUserStore.subscribe((s) => s.user?.marketingConsent, listener),
        isHidden: () => !useUserStore.getState().isLoggedIn,
        components: [
          {
            type: "toggle",
            isToggled: () => !!useUserStore.getState().user?.marketingConsent,
            toggle: async () => {
              await db.user.changeMarketingConsent(
                !useUserStore.getState().user?.marketingConsent
              );
              await useUserStore.getState().refreshUser();
            }
          }
        ]
      },
      {
        key: "hide-note-title",
        title: strings.hideNoteTitle(),
        description: strings.hideNoteTitleDescription(),
        onStateChange: (listener) =>
          useSettingStore.subscribe((s) => s.hideNoteTitle, listener),
        components: [
          {
            type: "toggle",
            isToggled: () => useSettingStore.getState().hideNoteTitle,
            toggle: () => useSettingStore.getState().toggleHideTitle()
          }
        ]
      },
      {
        key: "privacy-mode",
        title: strings.privacyMode(),
        description: strings.privacyModeDesc(),
        onStateChange: (listener) =>
          useSettingStore.subscribe((s) => s.privacyMode, listener),
        isHidden: () => !IS_DESKTOP_APP || getPlatform() === "linux",
        components: [
          {
            type: "toggle",
            isToggled: () => useSettingStore.getState().privacyMode,
            toggle: () => useSettingStore.getState().togglePrivacyMode()
          }
        ]
      }
    ]
  },
  {
    key: "advanced",
    section: "privacy",
    header: strings.advanced(),
    settings: [
      {
        key: "custom-dns",
        title: strings.useCustomDns(),
        description: strings.customDnsDescription(),
        onStateChange: (listener) =>
          useSettingStore.subscribe((s) => s.customDns, listener),
        isHidden: () => !IS_DESKTOP_APP,
        components: [
          {
            type: "toggle",
            isToggled: () => useSettingStore.getState().customDns,
            toggle: () => useSettingStore.getState().toggleCustomDns()
          }
        ]
      },
      {
        key: "custom-cors",
        title: strings.corsBypass(),
        description: strings.corsBypassDesc(),
        components: [
          {
            type: "button",
            title: strings.changeProxy(),
            action: async () => {
              const result = await PromptDialog.show({
                title: strings.corsBypass(),
                description: strings.corsBypassDesc(),
                defaultValue: Config.get(
                  "corsProxy",
                  "https://cors.notesfriend.com"
                )
              });
              if (!result) return;
              try {
                const url = new URL(result);
                Config.set("corsProxy", `${url.protocol}//${url.hostname}`);
              } catch (e) {
                console.error(e);
                showToast("error", strings.invalidCors());
              }
            },
            variant: "secondary"
          }
        ]
      },
      {
        key: "proxy-config",
        title: strings.proxy(),
        description: strings.proxyDescription(),
        onStateChange: (listener) =>
          useSettingStore.subscribe((c) => c.proxyRules, listener),
        components: [
          {
            type: "input",
            inputType: "text",
            defaultValue: () => useSettingStore.getState().proxyRules || "",
            onChange: (value) => {
              useSettingStore.getState().setProxyRules(value);
            }
          }
        ]
      }
    ]
  }
];
