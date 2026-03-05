import { variants } from "./variants/index.js";
import { FontConfig, getFontConfig } from "./font/index.js";
import { ThemeConfig } from "./types.js";
import { ThemeColor, VariantsWithStaticColors } from "../theme-engine/types.js";
import { Theme as ThemeUITheme } from "@theme-ui/css";

export { createButtonVariant } from "./variants/button.js";
export { getFontConfig } from "./font/index.js";
export type Theme = {
  breakpoints: string[];
  space: (number | string)[] & { small?: number | string };
  sizes: { full: "100%"; half: "50%" };
  radii: {
    none: number;
    default: number;
    dialog: number;
    large: number;
    small: number;
  };
  shadows: { menu: string };
  colors: Record<ThemeColor, string>;
  iconSizes: {
    small: number;
    medium: number;
    big: number;
  };
  config: ThemeUITheme["config"];
} & FontConfig &
  typeof variants;

export class ThemeFactory {
  static construct(config: ThemeConfig): Theme {
    const theme: Theme = {
      breakpoints: ["480px", "1000px", "1000px"],
      space: [0, "6px", 10, 15, 20, 25, 30, 35],
      sizes: { full: "100%", half: "50%" },
      radii: { none: 0, default: 5, large: 7, dialog: 10, small: 2.5 },
      iconSizes: { big: 16, medium: 14, small: 12 },
      colors: flattenVariants(config.scope),
      shadows:
        config.colorScheme === "dark"
          ? {
              menu: "0px 0px 10px 0px #00000078"
            }
          : {
              menu: "0px 0px 10px 0px #00000022"
            },
      config: {
        useCustomProperties: false,
        useRootStyles: false,
        useLocalStorage: false,
        useColorSchemeMediaQuery: false
      },
      ...getFontConfig(),
      ...variants
    };
    theme.space.small = 3;
    return theme;
  }
}

function flattenVariants(variants: VariantsWithStaticColors) {
  const colors: Partial<Record<ThemeColor, string>> = {};
  for (const variantKey in variants) {
    const variant = variants[variantKey as keyof VariantsWithStaticColors];
    if (!variant) continue;

    for (const colorKey in variant) {
      const suffix =
        variantKey === "primary" || variantKey === "static"
          ? ""
          : `-${variantKey}`;
      colors[`${colorKey}${suffix}` as ThemeColor] =
        variant[colorKey as keyof typeof variant];
    }
  }
  return colors as Record<ThemeColor, string>;
}
