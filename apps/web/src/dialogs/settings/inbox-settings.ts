import { SettingsGroup } from "./types";
import { useStore as useSettingStore } from "../../stores/setting-store";
import { InboxApiKeys } from "./components/inbox-api-keys";

export const InboxSettings: SettingsGroup[] = [
  {
    key: "inbox",
    section: "inbox",
    header: "Inbox",
    settings: [
      {
        key: "toggle-inbox",
        title: "Enable Inbox API",
        description: "Enable/disable Inbox API",
        keywords: ["inbox"],
        onStateChange: (listener) =>
          useSettingStore.subscribe((s) => s.isInboxEnabled, listener),
        components: [
          {
            type: "toggle",
            isToggled: () => useSettingStore.getState().isInboxEnabled,
            toggle: () => useSettingStore.getState().toggleInbox()
          }
        ]
      },
      {
        key: "inbox-api-keys",
        title: "",
        onStateChange: (listener) =>
          useSettingStore.subscribe((s) => s.isInboxEnabled, listener),
        isHidden: () => !useSettingStore.getState().isInboxEnabled,
        components: [
          {
            type: "custom",
            component: InboxApiKeys
          }
        ]
      }
    ]
  }
];
