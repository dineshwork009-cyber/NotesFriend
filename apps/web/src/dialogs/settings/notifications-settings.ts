import { SettingsGroup } from "./types";
import { useStore as useSettingStore } from "../../stores/setting-store";
import { strings } from "@notesfriend/intl";

export const NotificationsSettings: SettingsGroup[] = [
  {
    key: "reminders",
    section: "notifications",
    header: strings.notifications(),
    settings: [
      {
        key: "reminders",
        title: strings.reminderNotification(),
        description: strings.reminderNotificationDesc(),
        onStateChange: (listener) =>
          useSettingStore.subscribe(
            (s) => s.notificationsSettings.reminder,
            listener
          ),
        components: [
          {
            type: "toggle",
            isToggled: () =>
              !!useSettingStore.getState().notificationsSettings.reminder,
            toggle: () =>
              useSettingStore.getState().setNotificationSettings({
                reminder:
                  !useSettingStore.getState().notificationsSettings.reminder
              })
          }
        ]
      }
    ]
  }
];
