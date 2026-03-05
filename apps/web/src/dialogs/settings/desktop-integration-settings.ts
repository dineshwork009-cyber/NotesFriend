import { strings } from "@notesfriend/intl";
import { desktop } from "../../common/desktop-bridge";
import { useStore as useSettingStore } from "../../stores/setting-store";
import { showToast } from "../../utils/toast";
import { SettingsGroup } from "./types";

export const DesktopIntegrationSettings: SettingsGroup[] = [
  {
    key: "desktop-integration",
    section: "desktop",
    header: strings.desktopIntegration(),
    settings: [
      {
        key: "auto-start",
        title: strings.autoStartOnSystemStartup(),
        description: strings.autoStartDescription(),
        onStateChange: (listener) =>
          useSettingStore.subscribe(
            (s) => s.desktopIntegrationSettings,
            listener
          ),
        components: [
          {
            type: "toggle",
            isToggled: () =>
              !!useSettingStore.getState().desktopIntegrationSettings
                ?.autoStart,
            toggle: () => {
              const { setDesktopIntegration, desktopIntegrationSettings } =
                useSettingStore.getState();
              setDesktopIntegration({
                autoStart: !desktopIntegrationSettings?.autoStart
              });
            }
          }
        ]
      },
      {
        key: "start-minimized",
        title: strings.startMinimized(),
        description: strings.startMinimizedDescription(),
        onStateChange: (listener) =>
          useSettingStore.subscribe(
            (s) => s.desktopIntegrationSettings,
            listener
          ),
        isHidden: () =>
          !useSettingStore.getState().desktopIntegrationSettings?.autoStart,
        components: [
          {
            type: "toggle",
            isToggled: () =>
              !!useSettingStore.getState().desktopIntegrationSettings
                ?.startMinimized,
            toggle: () =>
              useSettingStore.getState().setDesktopIntegration({
                startMinimized:
                  !useSettingStore.getState().desktopIntegrationSettings
                    ?.startMinimized
              })
          }
        ]
      },
      {
        key: "minimize-to-tray",
        title: strings.minimizeToSystemTray(),
        description: strings.minimizeToSystemTrayDescription(),
        onStateChange: (listener) =>
          useSettingStore.subscribe(
            (s) => s.desktopIntegrationSettings,
            listener
          ),
        components: [
          {
            type: "toggle",
            isToggled: () =>
              !!useSettingStore.getState().desktopIntegrationSettings
                ?.minimizeToSystemTray,
            toggle: () =>
              useSettingStore.getState().setDesktopIntegration({
                minimizeToSystemTray:
                  !useSettingStore.getState().desktopIntegrationSettings
                    ?.minimizeToSystemTray
              })
          }
        ]
      },
      {
        key: "close-to-tray",
        title: strings.closeToSystemTray(),
        description: strings.closeToSystemTrayDescription(),
        onStateChange: (listener) =>
          useSettingStore.subscribe(
            (s) => s.desktopIntegrationSettings,
            listener
          ),
        components: [
          {
            type: "toggle",
            isToggled: () =>
              !!useSettingStore.getState().desktopIntegrationSettings
                ?.closeToSystemTray,
            toggle: () =>
              useSettingStore.getState().setDesktopIntegration({
                closeToSystemTray:
                  !useSettingStore.getState().desktopIntegrationSettings
                    ?.closeToSystemTray
              })
          }
        ]
      },
      {
        key: "use-native-titlebar",
        title: strings.useNativeTitlebar(),
        description: strings.useNativeTitlebarDescription(),
        onStateChange: (listener) =>
          useSettingStore.subscribe(
            (s) => s.desktopIntegrationSettings,
            listener
          ),
        components: [
          {
            type: "toggle",
            isToggled: () =>
              !!useSettingStore.getState().desktopIntegrationSettings
                ?.nativeTitlebar,
            toggle: () => {
              useSettingStore.getState().setDesktopIntegration({
                nativeTitlebar:
                  !useSettingStore.getState().desktopIntegrationSettings
                    ?.nativeTitlebar
              });
              showToast("success", strings.restartAppToTakeEffect(), [
                {
                  text: strings.restartNow(),
                  onClick: () => desktop?.integration.restart.query()
                }
              ]);
            }
          }
        ]
      }
    ]
  }
];
