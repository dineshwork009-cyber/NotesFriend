import {
  EmotionThemeProvider,
  ThemeScopes,
  themeToCSS,
  useThemeEngineStore
} from "@notesfriend/theme";
import { PropsWithChildren, useEffect } from "react";
import { BoxProps } from "@theme-ui/components";
import { useStore as useThemeStore } from "../../stores/theme-store";
import { useSystemTheme } from "../../hooks/use-system-theme";

export function BaseThemeProvider(
  props: PropsWithChildren<
    {
      injectCssVars?: boolean;
      scope?: keyof ThemeScopes;
      onRender?: () => void;
    } & Omit<BoxProps, "variant">
  >
) {
  const { children, scope = "base", onRender, ...restProps } = props;

  const colorScheme = useThemeStore((store) => store.colorScheme);
  const theme = useThemeStore((store) =>
    colorScheme === "dark" ? store.darkTheme : store.lightTheme
  );
  // const cssTheme = useMemo(() => themeToCSS(theme), [theme]);
  const isSystemThemeDark = useSystemTheme();
  const setColorScheme = useThemeStore((store) => store.setColorScheme);
  const followSystemTheme = useThemeStore((store) => store.followSystemTheme);

  useEffect(() => {
    if (!followSystemTheme) return;
    setColorScheme(isSystemThemeDark ? "dark" : "light");
  }, [isSystemThemeDark, followSystemTheme, setColorScheme]);

  useEffect(() => {
    if (IS_THEME_BUILDER) return;
    (async () => {
      await useThemeStore.getState().init();
    })();
  }, []);

  useEffect(() => {
    useThemeEngineStore.getState().setTheme(theme);

    const themeColorElement = document.head.querySelector(
      "meta[name='theme-color']"
    );
    if (themeColorElement) {
      themeColorElement.setAttribute(
        "content",
        theme.scopes.base.primary.background
      );
    }

    const css = themeToCSS(theme);
    const stylesheet = document.getElementById("theme-colors");
    if (stylesheet) stylesheet.innerHTML = css;

    const root = document.querySelector("html");
    if (root) root.setAttribute("data-theme", theme.colorScheme);
  }, [theme]);

  useEffect(() => {
    onRender?.();
  }, [onRender]);

  return (
    <>
      <EmotionThemeProvider {...restProps} scope={scope}>
        {children}
      </EmotionThemeProvider>
    </>
  );
}

export { EmotionThemeProvider as ScopedThemeProvider };
