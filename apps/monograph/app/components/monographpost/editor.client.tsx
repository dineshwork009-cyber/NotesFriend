import "@notesfriend/editor/styles/katex.min.css";
import "@notesfriend/editor/styles/katex-fonts.css";
import "@notesfriend/editor/styles/fonts.css";
import "mac-scrollbar/dist/mac-scrollbar.css";
import {
  ThemeFactory,
  useThemeColors,
  useThemeEngineStore
} from "@notesfriend/theme";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Flex } from "@theme-ui/components";
import TipTap, { type TipTapProps } from "./tiptap";
import { ScopedThemeProvider } from "../theme-provider";
import { setI18nGlobal, Messages } from "@notesfriend/intl";
import { i18n } from "@lingui/core";

const locale = import.meta.env.DEV
  ? import("@notesfriend/intl/locales/$pseudo-LOCALE.json")
  : import("@notesfriend/intl/locales/$en.json");
locale.then(({ default: locale }) => {
  i18n.load({
    en: locale.messages as unknown as Messages
  });
  i18n.activate("en");
});
setI18nGlobal(i18n);

export type EditorType = typeof Editor;

export function Editor(props: Omit<TipTapProps, "editorContainer" | "theme">) {
  const editorContainerRef = useRef<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeEngineStore();
  const { colors, isDark } = useThemeColors("editor");

  useLayoutEffect(() => {
    if (
      !containerRef.current ||
      !editorContainerRef.current ||
      editorContainerRef.current.parentElement === containerRef.current
    )
      return;
    containerRef.current.appendChild(editorContainerRef.current);
  }, []);

  const editorTheme = useMemo(() => {
    const editorTheme = ThemeFactory.construct({
      colorScheme: isDark ? "dark" : "light",
      scope: colors
    });
    editorTheme.space = [0, 8, 12, 20, 25, 30, 35];
    editorTheme.fontSizes.body = "1rem";
    editorTheme.fontSizes.code = "1rem";
    editorTheme.fontSizes.subBody = "0.8rem";
    editorTheme.colors.background = isDark ? "#0d0d0d" : "#ffffff";
    editorTheme.colors.backdrop = "#00000022";
    return editorTheme;
  }, [colors, isDark]);

  return (
    <ScopedThemeProvider scope="editor" injectCssVars theme={editorTheme}>
      <Flex
        ref={containerRef}
        sx={{
          flex: 1,
          flexDirection: "column",
          fontFamily: "body",
          pre: {
            maxWidth: "100% !important"
          }
        }}
      >
        <TipTap
          {...props}
          editorContainer={() => {
            if (editorContainerRef.current) return editorContainerRef.current;
            const editorContainer = document.createElement("div");
            editorContainer.classList.add("selectable", "editor-container");
            editorContainer.style.flex = "1";
            editorContainer.style.cursor = "text";
            editorContainer.style.color =
              theme.scopes.editor?.primary?.paragraph ||
              theme.scopes.base.primary.paragraph;
            editorContainerRef.current = editorContainer;
            if (containerRef.current)
              containerRef.current.appendChild(editorContainerRef.current);
            return editorContainer;
          }}
        />
      </Flex>
    </ScopedThemeProvider>
  );
}

// export const EmotionEditorTheme = (props: PropsWithChildren<unknown>) => {
// const { colors, isDark } = useThemeColors("editor");
// const theme = useMemo(() => {
//   const editorTheme = ThemeFactory.construct({
//     colorScheme: isDark ? "dark" : "light",
//     scope: colors
//   });
//   editorTheme.space = [0, 8, 12, 20, 25, 30, 35];
//   editorTheme.fontSizes.body = "1rem";
//   editorTheme.fontSizes.code = "1rem";
//   editorTheme.fontSizes.subBody = "0.8rem";
//   editorTheme.colors.background = isDark ? "#0d0d0d" : "#ffffff";
//   editorTheme.colors.backdrop = "#00000022";
//   return editorTheme;
// }, [colors, isDark]);
//   return (
//     <EmotionThemeProvider scope="editor" theme={theme} injectCssVars>
//       {props.children}
//     </EmotionThemeProvider>
//   );
// };
