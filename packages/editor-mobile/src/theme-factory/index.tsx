import { PropsWithChildren, useMemo } from "react";
import { Theme, ThemeFactory, useThemeColors } from "@notesfriend/theme";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";

const modifyToolbarTheme = (toolbarTheme: Theme) => {
  toolbarTheme.space = [0, 10, 12, 18];
  toolbarTheme.space.small = "10px";

  toolbarTheme.buttons.menuitem = {
    ...toolbarTheme.buttons.menuitem,
    height: "50px",
    paddingX: "20px",
    borderBottomWidth: 0
  };
  const fontScale = settingsController.previous?.fontScale
    ? settingsController.previous?.fontScale
    : 1;
  toolbarTheme.iconSizes = {
    big: 20 * fontScale,
    medium: 18 * fontScale,
    small: 18 * fontScale
  };
  toolbarTheme.fontSizes = {
    ...toolbarTheme.fontSizes,
    subBody: "0.8rem",
    body: "0.9rem"
  };

  toolbarTheme.radii = {
    ...toolbarTheme.radii,
    small: 5
  };

  toolbarTheme.buttons.menuitem = {
    ...toolbarTheme.buttons.menuitem,
    px: 5,
    height: "45px"
  };
};

export const EmotionEditorToolbarTheme = (props: PropsWithChildren<any>) => {
  const { colors, isDark } = useThemeColors("editorToolbar");
  const theme = useMemo(
    () =>
      ThemeFactory.construct({
        colorScheme: isDark ? "dark" : "light",
        scope: colors
      }),
    [colors, isDark]
  );
  modifyToolbarTheme(theme);
  return (
    <EmotionThemeProvider theme={theme}>{props.children}</EmotionThemeProvider>
  );
};

export const EmotionEditorTheme = (props: PropsWithChildren<any>) => {
  const { colors, isDark } = useThemeColors("editor");
  const theme = useMemo(
    () =>
      ThemeFactory.construct({
        colorScheme: isDark ? "dark" : "light",
        scope: colors
      }),
    [colors, isDark]
  );
  theme.space = [0, 10, 12, 20];
  return (
    <EmotionThemeProvider theme={theme}>{props.children}</EmotionThemeProvider>
  );
};
