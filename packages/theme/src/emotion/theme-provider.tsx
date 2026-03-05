import { ThemeProvider } from "@theme-ui/core";
import React, { ForwardedRef, PropsWithChildren, useMemo } from "react";
import { Box, BoxProps } from "@theme-ui/components";
import { useTheme } from "@emotion/react";
import { ThemeScopes } from "../theme-engine/types.js";
import { Theme, ThemeFactory } from "../theme/index.js";
import {
  ScopedThemeProvider,
  useThemeColors,
  useThemeEngineStore
} from "../theme-engine/index.js";

export type EmotionThemeProviderProps = {
  scope?: keyof ThemeScopes;
  injectCssVars?: boolean;
  theme?: Partial<Theme>;
} & Omit<BoxProps, "variant" | "ref">;

function _EmotionThemeProvider(
  props: PropsWithChildren<EmotionThemeProviderProps>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  const {
    children,
    scope = "base",
    injectCssVars = true,
    className,
    theme: partialTheme,
    ...restProps
  } = props;
  const emotionTheme = useTheme() as Theme;
  const theme = useThemeEngineStore((store) => store.theme);
  const themeScope = useThemeColors(scope);
  const { colors } = themeScope;

  const themeProperties = useMemo(
    () =>
      ThemeFactory.construct({
        scope: colors,
        colorScheme: theme.colorScheme
      }),
    [colors, theme.colorScheme]
  );

  return (
    <ThemeProvider
      theme={{
        ...(emotionTheme && "space" in emotionTheme
          ? emotionTheme
          : themeProperties),
        ...partialTheme,
        colors: themeProperties.colors
      }}
    >
      <ScopedThemeProvider value={scope}>
        {injectCssVars ? (
          <Box
            {...restProps}
            ref={forwardedRef}
            className={`${
              className ? className + " " : ""
            }theme-scope-${scope}`}
          >
            {children}
          </Box>
        ) : (
          children
        )}
      </ScopedThemeProvider>
    </ThemeProvider>
  );
}

export const EmotionThemeProvider = React.forwardRef<
  HTMLDivElement,
  EmotionThemeProviderProps
>(_EmotionThemeProvider);
