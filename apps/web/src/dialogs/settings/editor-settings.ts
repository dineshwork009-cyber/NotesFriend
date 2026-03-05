import { SettingsGroup } from "./types";
import {
  editorConfig,
  onEditorConfigChange,
  useEditorManager
} from "../../components/editor/manager";
import { useStore as useSettingStore } from "../../stores/setting-store";
import { getFonts } from "@notesfriend/editor";
import { useSpellChecker } from "../../hooks/use-spell-checker";
import { SpellCheckerLanguages } from "./components/spell-checker-languages";
import { CustomizeToolbar } from "./components/customize-toolbar";
import { DictionaryWords } from "./components/dictionary-words";
import { strings } from "@notesfriend/intl";
import { isMac } from "../../utils/platform";
import { EDITOR_LINE_HEIGHT } from "../../components/editor/common";

export const EditorSettings: SettingsGroup[] = [
  {
    key: "editor",
    section: "editor",
    header: strings.editor(),
    settings: [
      {
        key: "default-title",
        title: strings.titleFormat(),
        description: strings.titleFormatDesc(),
        onStateChange: (listener) =>
          useSettingStore.subscribe((c) => c.titleFormat, listener),
        components: [
          {
            type: "input",
            inputType: "text",
            defaultValue: () => useSettingStore.getState().titleFormat || "",
            onChange: (value) =>
              useSettingStore.getState().setTitleFormat(value)
          }
        ]
      },
      {
        key: "default-font",
        title: strings.defaultFontFamily(),
        onStateChange: (listener) =>
          onEditorConfigChange((c) => c.fontFamily, listener),
        components: [
          {
            type: "dropdown",
            options: getFonts().map((font) => ({
              value: font.id,
              title: font.title
            })),
            selectedOption: () => editorConfig().fontFamily,
            onSelectionChanged: (value) => {
              useEditorManager
                .getState()
                .setEditorConfig({ fontFamily: value });
            }
          }
        ]
      },
      {
        key: "default-font-size",
        title: strings.defaultFontSize(),
        description: strings.defaultFontSizeDesc(),
        onStateChange: (listener) =>
          onEditorConfigChange((c) => c.fontSize, listener),
        components: [
          {
            type: "input",
            inputType: "number",
            max: 120,
            min: 8,
            defaultValue: () => editorConfig().fontSize,
            onChange: (value) =>
              useEditorManager.getState().setEditorConfig({ fontSize: value })
          }
        ]
      },
      {
        key: "line-height",
        title: strings.lineHeight(),
        description: strings.lineHeightDesc(),
        onStateChange: (listener) =>
          onEditorConfigChange((c) => c.lineHeight, listener),
        components: [
          {
            type: "input",
            inputType: "number",
            max: EDITOR_LINE_HEIGHT.MAX,
            min: EDITOR_LINE_HEIGHT.MIN,
            defaultValue: () => editorConfig().lineHeight,
            onChange: (value) =>
              useEditorManager.getState().setEditorConfig({ lineHeight: value })
          }
        ]
      },
      {
        key: "double-spacing",
        title: strings.doubleSpacedLines(),
        description: strings.doubleSpacedLinesDesc(),
        onStateChange: (listener) =>
          useSettingStore.subscribe((c) => c.doubleSpacedParagraphs, listener),
        components: [
          {
            type: "toggle",
            isToggled: () => useSettingStore.getState().doubleSpacedParagraphs,
            toggle: () =>
              useSettingStore.getState().toggleDoubleSpacedParagraphs()
          }
        ]
      },
      {
        key: "markdown-shortcuts",
        title: strings.mardownShortcuts(),
        description: strings.mardownShortcutsDesc(),
        onStateChange: (listener) =>
          useSettingStore.subscribe((c) => c.markdownShortcuts, listener),
        featureId: "markdownShortcuts",
        components: [
          {
            type: "toggle",
            isToggled: () => useSettingStore.getState().markdownShortcuts,
            toggle: () => useSettingStore.getState().toggleMarkdownShortcuts()
          }
        ]
      },
      {
        key: "font-ligatures",
        title: strings.fontLigatures(),
        description: strings.fontLigaturesDesc(),
        onStateChange: (listener) =>
          useSettingStore.subscribe((c) => c.fontLigatures, listener),
        featureId: "fontLigatures",
        components: [
          {
            type: "toggle",
            isToggled: () => useSettingStore.getState().fontLigatures,
            toggle: () => useSettingStore.getState().toggleFontLigatures()
          }
        ]
      }
    ]
  },
  {
    key: "spell-check",
    section: "editor",
    header: strings.spellCheck(),
    isHidden: () => !IS_DESKTOP_APP,
    onRender: () => {
      useSpellChecker.getState().refresh();
    },
    settings: [
      {
        key: "enable-spellchecker",
        title: strings.enableSpellChecker(),
        onStateChange: (listener) =>
          useSpellChecker.subscribe((c) => c.enabled, listener),
        components: [
          {
            type: "toggle",
            isToggled: () => useSpellChecker.getState().enabled,
            toggle: () => useSpellChecker.getState().toggleSpellChecker()
          }
        ]
      },
      {
        key: "spell-checker-languages",
        title: strings.languages(),
        description: strings.spellCheckerLanguagesDescription(),
        isHidden: () => !useSpellChecker.getState().enabled || isMac(),
        onStateChange: (listener) =>
          useSpellChecker.subscribe((c) => c.enabled, listener),
        components: [
          {
            type: "custom",
            component: SpellCheckerLanguages
          }
        ]
      },
      {
        key: "custom-dictionay-words",
        title: strings.customDictionaryWords(),
        components: [
          {
            type: "custom",
            component: DictionaryWords
          }
        ]
      }
    ]
  },
  {
    key: "toolbar",
    section: "editor",
    header: strings.toolbar(),
    settings: [
      {
        key: "customize-toolbar",
        title: strings.customizeToolbar(),
        components: [
          {
            type: "custom",
            component: CustomizeToolbar
          }
        ]
      }
    ]
  }
];
