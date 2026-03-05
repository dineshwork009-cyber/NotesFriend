import { SettingsGroup } from "./types";
import { useStore as useSettingStore } from "../../stores/setting-store";
import { useStore as useThemeStore } from "../../stores/theme-store";
import { ThemesSelector } from "./components/themes-selector";
import { strings } from "@notesfriend/intl";

export const AppearanceSettings: SettingsGroup[] = [
  {
    key: "theme",
    section: "appearance",
    header: strings.general(),
    isHidden: () => !IS_DESKTOP_APP,
    settings: [
      {
        key: "zoom-factor",
        title: strings.zoomFactor(),
        description: strings.zoomFactorDescription(),
        isHidden: () => !IS_DESKTOP_APP,
        onStateChange: (listener) =>
          useThemeStore.subscribe(
            (s) => [s.colorScheme, s.followSystemTheme],
            listener
          ),
        components: [
          {
            type: "input",
            inputType: "number",
            min: 0.5,
            max: 3.0,
            step: 0.1,
            defaultValue: () => useSettingStore.getState().zoomFactor,
            onChange: (value) => useSettingStore.getState().setZoomFactor(value)
          }
        ]
      }
    ]
  },
  {
    key: "theme",
    section: "appearance",
    header: strings.themes(),
    settings: [
      {
        key: "color-scheme",
        title: strings.colorScheme(),
        description: strings.colorSchemeDescription(),
        onStateChange: (listener) =>
          useThemeStore.subscribe(
            (s) => [s.colorScheme, s.followSystemTheme],
            listener
          ),
        components: [
          {
            type: "dropdown",
            options: [
              { title: strings.light(), value: "light" },
              { title: strings.dark(), value: "dark" },
              { title: strings.auto(), value: "auto" }
            ],
            selectedOption: () =>
              useThemeStore.getState().followSystemTheme
                ? "auto"
                : useThemeStore.getState().colorScheme,
            onSelectionChanged: (value) => {
              useThemeStore.getState().setFollowSystemTheme(value === "auto");
              if (value !== "auto")
                useThemeStore
                  .getState()
                  .setColorScheme(value as "dark" | "light");
            }
          }
        ]
      },
      {
        key: "themes",
        title: strings.selectTheme(),
        components: [{ type: "custom", component: ThemesSelector }]
      }
    ]
  }
];
