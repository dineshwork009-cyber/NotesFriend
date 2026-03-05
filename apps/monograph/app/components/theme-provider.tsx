import {
  EmotionThemeProvider,
  ThemeDark,
  ThemeLight,
  ThemeScopes,
  useThemeEngineStore
} from "@notesfriend/theme";
import { PropsWithChildren, useEffect } from "react";
import { BoxProps } from "@theme-ui/components";

export function BaseThemeProvider(
  props: PropsWithChildren<
    {
      injectCssVars?: boolean;
      scope?: keyof ThemeScopes;
      onRender?: () => void;
      colorScheme: "dark" | "light";
    } & Omit<BoxProps, "variant">
  >
) {
  const {
    children,
    scope = "base",
    onRender,
    colorScheme,
    ...restProps
  } = props;

  const theme = colorScheme === "dark" ? ThemeDark : ThemeLight;
  useThemeEngineStore.getState().setTheme(theme);

  // useEffect(() => {
  //   useThemeEngineStore.getState().setTheme(theme);

  //   const themeColorElement = document.head.querySelector(
  //     "meta[name='theme-color']"
  //   );
  //   if (themeColorElement) {
  //     themeColorElement.setAttribute(
  //       "content",
  //       theme.scopes.base.primary.background
  //     );
  //   }

  //   const css = themeToCSS(theme);
  //   const stylesheet = document.getElementById("theme-colors");
  //   if (stylesheet) stylesheet.innerHTML = css;
  // }, [theme]);

  useEffect(() => {
    onRender?.();
  }, [onRender]);

  return (
    <>
      <EmotionThemeProvider
        {...restProps}
        theme={{
          fontSizes: {
            heading: "24px",
            subheading: "20px",
            input: "12px",
            title: "16px",
            subtitle: "14px",
            body: "14px",
            subBody: "12px",
            menu: "12px",
            code: "14px"
          }
        }}
        scope={scope}
      >
        {children}
      </EmotionThemeProvider>
    </>
  );
}

export { EmotionThemeProvider as ScopedThemeProvider };
